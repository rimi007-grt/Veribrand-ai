"""Audit contract models defining the shared schema for VeriBrand AI.

Pydantic v2 implementation matching the authoritative TypeScript interface.
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Literal, Optional, Union
import uuid

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AuditPillar(str, Enum):
    """Compliance pillars governed by VeriBrand AI."""
    CLAIM = "claim"
    VISUAL = "visual"
    TERMINOLOGY = "terminology"
    TONE = "tone"
    ACCESSIBILITY = "accessibility"


class FindingSeverity(str, Enum):
    """Severity tier determining publication gating."""
    ERROR = "error"
    WARNING = "warning"
    ADVISORY = "advisory"


class OverallStatus(str, Enum):
    """Aggregate audit determination."""
    PASSED = "passed"
    FLAGGED = "flagged"
    FAILED = "failed"


PillarLiteral = Literal["claim", "visual", "terminology", "tone", "accessibility"]
SeverityLiteral = Literal["error", "warning", "advisory"]
StatusLiteral = Literal["passed", "flagged", "failed"]


class AuditFinding(BaseModel):
    """Single compliance or brand guideline finding identified during verification."""

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "id": "find-a1b2c3d4",
                "pillar": "claim",
                "severity": "error",
                "flagged_text": "guarantees 100% foolproof uptime",
                "start_idx": 182,
                "end_idx": 213,
                "explanation": "Claim exceeds maximum approved boundary of 99.95% API uptime SLA and contains prohibited absolutist puffery.",
                "rule_citation": "Master Spec 2026, Section 2.1 & ASCI Code Chapter I, Clause 1.2",
                "suggested_correction": "provides an enterprise-grade 99.95% API uptime SLA under Master Spec 2026, Section 2.1",
                "confidence": 0.98,
            }
        },
    )

    id: str = Field(
        default_factory=lambda: f"find-{uuid.uuid4().hex[:8]}",
        description="Unique identifier for the audit finding.",
    )
    pillar: PillarLiteral = Field(
        ...,
        description="Compliance pillar ('claim' | 'visual' | 'terminology' | 'tone' | 'accessibility').",
    )
    severity: SeverityLiteral = Field(
        ...,
        description="Severity classification ('error' | 'warning' | 'advisory').",
    )
    flagged_text: str = Field(
        ...,
        description="Exact substring or token sequence flagged in the submitted copy or asset.",
    )
    start_idx: int = Field(
        default=0,
        ge=0,
        description="Zero-based character start index of the flagged text in the source content.",
    )
    end_idx: int = Field(
        default=0,
        ge=0,
        description="Zero-based character end index (exclusive) of the flagged text in the source content.",
    )
    explanation: str = Field(
        ...,
        min_length=3,
        description="Detailed legal or brand rationale explaining why this snippet is non-compliant.",
    )
    rule_citation: str = Field(
        ...,
        description="Authoritative standard citation (e.g., ASCI Clause, WCAG Criterion, or Brand Kit rule).",
    )
    suggested_correction: str = Field(
        ...,
        description="Direct drop-in replacement or actionable guidance to achieve compliance.",
    )
    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Model or engine confidence score bounded between 0.0 and 1.0.",
    )

    @field_validator("end_idx")
    @classmethod
    def validate_indices(cls, v: int, info) -> int:
        start = info.data.get("start_idx")
        if start is not None and v < start:
            raise ValueError(f"end_idx ({v}) cannot be less than start_idx ({start})")
        return v


class AuditMetrics(BaseModel):
    """Aggregate quantitative compliance metrics calculated across visual, linguistic, and regulatory checks."""

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "contrast_ratio": 4.56,
                "wcag_passed": True,
                "reading_grade": "11.2",
                "total_findings": 0,
                "error_count": 0,
                "warning_count": 0,
                "advisory_count": 0,
                "compliance_score": 100.0,
                "foreground_hex": "#0F172A",
                "background_hex": "#FFFFFF",
            }
        },
    )

    contrast_ratio: Optional[float] = Field(
        default=None,
        ge=1.0,
        le=21.0,
        description="Calculated visual luminance contrast ratio between foreground and background (range 1.0 - 21.0).",
    )
    wcag_passed: bool = Field(
        default=True,
        description="Indicates whether all evaluated visual elements satisfy WCAG 2.1 Level AA thresholds.",
    )
    reading_grade: Union[float, str] = Field(
        default="8.0",
        description="Automated readability metric (e.g., Flesch-Kincaid Grade Level).",
    )
    total_findings: int = Field(
        default=0,
        ge=0,
        description="Total number of findings discovered across all pillars.",
    )
    error_count: int = Field(
        default=0,
        ge=0,
        description="Count of blocking errors requiring remediation before publication.",
    )
    warning_count: int = Field(
        default=0,
        ge=0,
        description="Count of non-blocking regulatory or brand warnings.",
    )
    advisory_count: int = Field(
        default=0,
        ge=0,
        description="Count of stylistic or low-consequence suggestions.",
    )
    compliance_score: float = Field(
        default=100.0,
        ge=0.0,
        le=100.0,
        description="Overall percentage compliance score (100 = flawless, 0 = complete failure).",
    )
    foreground_hex: Optional[str] = Field(
        default=None,
        description="Dominant or evaluated foreground color hex.",
    )
    background_hex: Optional[str] = Field(
        default=None,
        description="Dominant or evaluated background color hex.",
    )


class AuditResponse(BaseModel):
    """Master response object returned by VeriBrand AI verification pipeline."""

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "audit_id": "audit-2026-9f8a3c2e",
                "overall_status": "flagged",
                "findings": [],
                "metrics": {
                    "contrast_ratio": 1.95,
                    "wcag_passed": False,
                    "reading_grade": "10.4",
                    "total_findings": 2,
                    "error_count": 2,
                    "warning_count": 0,
                    "advisory_count": 0,
                    "compliance_score": 40.0,
                },
                "asset_title": "Q1 Launch Post",
                "timestamp": "2026-10-29T06:55:00Z",
            }
        },
    )

    audit_id: str = Field(
        default_factory=lambda: f"audit-{uuid.uuid4().hex[:12]}",
        description="Unique trace identifier for this verification audit session.",
    )
    overall_status: StatusLiteral = Field(
        ...,
        description="Publication readiness verdict: 'passed' (clean), 'flagged' (has warnings/advisories), or 'failed' (has blocking errors).",
    )
    findings: List[AuditFinding] = Field(
        default_factory=list,
        description="Array of identified compliance findings and actionable remediation recommendations.",
    )
    metrics: AuditMetrics = Field(
        ...,
        description="Quantitative metrics including contrast ratio, WCAG status, and reading complexity.",
    )
    asset_title: Optional[str] = Field(
        default=None,
        description="Optional title or descriptor of the audited creative asset.",
    )
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="ISO 8601 UTC timestamp of when the audit was generated.",
    )


class AuditTextRequest(BaseModel):
    """Payload for text copy pre-flight audit."""
    model_config = ConfigDict(populate_by_name=True)

    text: str = Field(..., min_length=1, description="Marketing draft copy to audit.")
    asset_title: Optional[str] = Field(default="Draft Asset", description="Optional campaign or asset title.")
    channel: Optional[str] = Field(default="social", description="Distribution channel (e.g. social, website).")


class ClaimVerdict(BaseModel):
    """Structured verdict from Gemini LLM brand truth auditor."""
    status: Literal["supported", "contradicted", "unsupported"]
    reason: str
    citation: str
    suggested_rewrite: str
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)


# Backward compatibility alias
AuditRequest = AuditTextRequest
