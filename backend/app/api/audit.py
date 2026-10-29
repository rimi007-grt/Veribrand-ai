"""Audit API router implementing text and visual verification endpoints for VeriBrand AI.

Exposes:
- POST /api/v1/audit/text: Marketing copy audit (Terminology, Puffery, Claims)
- POST /api/v1/audit/visual: Computer vision graphic contrast audit
- GET  /api/v1/presets: Benchmark test samples for rapid demo
"""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any, Dict, List, Optional
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.config import get_settings
from app.engines.claim_verifier import ClaimVerifier
from app.engines.terminology import TerminologyEngine
from app.engines.vision_wcag import VisionWCAGEngine
from app.models.audit import (
    AuditFinding,
    AuditMetrics,
    AuditResponse,
    AuditTextRequest,
    OverallStatus,
)

router = APIRouter(prefix="/audit", tags=["Verification Pipeline"])

settings = get_settings()
terminology_engine = TerminologyEngine()
claim_verifier = ClaimVerifier()
vision_engine = VisionWCAGEngine()


def calculate_flesch_kincaid_grade(text: str) -> float:
    """Calculate approximate Flesch-Kincaid Grade Level."""
    words = [w for w in text.split() if w]
    if not words:
        return 0.0
    sentences = [s for s in text.split(".") if s.strip()] or [text]
    num_words = len(words)
    num_sentences = max(len(sentences), 1)

    syllables = 0
    for word in words:
        w = word.lower().strip(".:;!?")
        count = len([c for c in w if c in "aeiouy"])
        syllables += max(count, 1)

    grade = 0.39 * (num_words / num_sentences) + 11.8 * (syllables / num_words) - 15.59
    return max(round(grade, 1), 1.0)


@router.post("/text", response_model=AuditResponse)
async def audit_text_endpoint(payload: AuditTextRequest) -> AuditResponse:
    """Audit marketing copy for ASCI puffery, mandatory brand trademarks, and numerical claims."""
    findings: List[AuditFinding] = []

    # 1. Deterministic Terminology & ASCI Chapter I Matcher
    term_findings = terminology_engine.scan(payload.text)
    findings.extend(term_findings)

    # 2. RAG & Semantic Claim Verifier (with Gemini 1.5 Flash + Deterministic Fallback)
    claim_findings, is_semantic_online = claim_verifier.audit_text_claims(payload.text)
    findings.extend(claim_findings)

    # If Gemini/semantic engine was offline, attach an advisory finding
    if not is_semantic_online:
        findings.append(
            AuditFinding(
                id=f"find-adv-{uuid.uuid4().hex[:6]}",
                pillar="claim",
                severity="advisory",
                flagged_text="Semantic Verification Engine",
                start_idx=0,
                end_idx=0,
                explanation="Semantic engine temporarily offline. Deterministic claim verification applied.",
                rule_citation="System: Fallback Engine",
                suggested_correction="Verify with live Gemini API key when connectivity is restored.",
                confidence=1.0,
            )
        )

    # Deduplicate findings
    unique_findings: List[AuditFinding] = []
    seen = set()
    for f in findings:
        key = (f.pillar, f.flagged_text, f.start_idx, f.end_idx)
        if key not in seen:
            seen.add(key)
            unique_findings.append(f)

    # Sort findings by start index
    unique_findings.sort(key=lambda x: x.start_idx)

    # Compute metric counts
    error_count = sum(1 for f in unique_findings if f.severity == "error")
    warning_count = sum(1 for f in unique_findings if f.severity == "warning")
    advisory_count = sum(1 for f in unique_findings if f.severity == "advisory")
    total_findings = len(unique_findings)

    if error_count > 0:
        overall_status: OverallStatus = "failed"
    elif warning_count > 0:
        overall_status = "flagged"
    else:
        overall_status = "passed"

    score = max(0.0, 100.0 - (error_count * 15.0) - (warning_count * 5.0) - (advisory_count * 1.0))
    reading_grade = calculate_flesch_kincaid_grade(payload.text)

    metrics = AuditMetrics(
        contrast_ratio=None,
        wcag_passed=True,
        reading_grade=str(reading_grade),
        total_findings=total_findings,
        error_count=error_count,
        warning_count=warning_count,
        advisory_count=advisory_count,
        compliance_score=round(score, 1),
    )

    return AuditResponse(
        audit_id=f"audit-{uuid.uuid4().hex[:10]}",
        overall_status=overall_status,
        findings=unique_findings,
        metrics=metrics,
        asset_title=payload.asset_title or "Text Copy Audit",
        timestamp=datetime.now(timezone.utc),
    )


@router.post("/visual", response_model=AuditResponse)
async def audit_visual_endpoint(
    file: UploadFile = File(...),
    font_size_pt: float = Form(16.0),
    is_bold: bool = Form(False),
    asset_title: Optional[str] = Form("Creative Graphic Banner"),
) -> AuditResponse:
    """Analyze uploaded graphic banner (PNG/JPEG) for WCAG 2.1 AA luminance contrast and brand color rules."""
    # Verify content type
    if file.content_type not in ["image/png", "image/jpeg", "image/jpg", "image/webp"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported media type '{file.content_type}'. Must be PNG, JPEG, or WebP."
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        ratio, wcag_passed, fg_hex, bg_hex, findings = vision_engine.evaluate_image(
            image_bytes=image_bytes,
            font_size_pt=font_size_pt,
            is_bold=is_bold,
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Computer vision evaluation failed: {err}")

    error_count = sum(1 for f in findings if f.severity == "error")
    warning_count = sum(1 for f in findings if f.severity == "warning")
    advisory_count = sum(1 for f in findings if f.severity == "advisory")

    overall_status: OverallStatus = "failed" if (error_count > 0 or not wcag_passed) else "passed"
    score = 100.0 if wcag_passed and error_count == 0 else max(0.0, 100.0 - (error_count * 25.0))

    metrics = AuditMetrics(
        contrast_ratio=ratio,
        wcag_passed=wcag_passed,
        reading_grade="N/A",
        total_findings=len(findings),
        error_count=error_count,
        warning_count=warning_count,
        advisory_count=advisory_count,
        compliance_score=round(score, 1),
        foreground_hex=fg_hex,
        background_hex=bg_hex,
    )

    return AuditResponse(
        audit_id=f"audit-vis-{uuid.uuid4().hex[:10]}",
        overall_status=overall_status,
        findings=findings,
        metrics=metrics,
        asset_title=asset_title or file.filename or "Graphic Banner",
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/presets")
async def get_benchmark_presets() -> Dict[str, Any]:
    """Retrieve authoritative benchmark test presets (sample_flawed_01 & sample_clean_02)."""
    data_dir = settings.SHARED_DATA_DIR
    if not data_dir.exists():
        fallback = Path(__file__).resolve().parent.parent.parent.parent / "shared_data"
        data_dir = fallback if fallback.exists() else Path("shared_data").resolve()

    presets_path = data_dir / "test_samples" / "benchmark_samples.json"
    if not presets_path.exists():
        raise HTTPException(status_code=404, detail="Benchmark test samples file not found.")

    with open(presets_path, "r", encoding="utf-8") as f:
        return json.load(f)


# Backward compatible route for legacy POST /api/audit
@router.post("", response_model=AuditResponse)
async def run_audit_legacy(payload: AuditTextRequest) -> AuditResponse:
    """Legacy alias routing to /audit/text."""
    return await audit_text_endpoint(payload)
