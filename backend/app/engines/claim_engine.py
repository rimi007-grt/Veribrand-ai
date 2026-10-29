"""Claim substantiation engine enforcing approved enterprise specifications and numerical boundaries."""

import json
from pathlib import Path
import re
from typing import Any, Dict, List
import uuid

from app.core.config import get_settings
from app.models.audit import AuditFinding


class ClaimEngine:
    """Verifies marketing claims against legally approved specifications and numerical boundaries."""

    def __init__(self, shared_data_dir: Path | None = None):
        self.settings = get_settings()
        self.data_dir = shared_data_dir or self.settings.SHARED_DATA_DIR
        if not self.data_dir.exists():
            fallback = Path("shared_data").resolve()
            if fallback.exists():
                self.data_dir = fallback
        self.claims_db = self._load_json(self.data_dir / "brand_kits" / "approved_claims.json")

    def _load_json(self, path: Path) -> Dict[str, Any]:
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def audit_claims(self, text: str) -> List[AuditFinding]:
        findings: List[AuditFinding] = []
        approved_claims = self.claims_db.get("approved_claims", [])

        # 1. Prohibited phrasings and boundary violation scans from registered claims
        for claim in approved_claims:
            claim_id = claim.get("claim_id")
            source_citation = claim.get("source_citation", "Brand Kit Approved Claims")
            prohibited = claim.get("prohibited_phrasings", [])
            canonical = claim.get("canonical_claim", "")
            approved_phrasings = claim.get("approved_phrasings", [])
            suggested = approved_phrasings[0] if approved_phrasings else canonical

            for phrase in prohibited:
                pattern = f"\\b{re.escape(phrase)}\\b"
                for match in re.finditer(pattern, text, flags=re.IGNORECASE):
                    findings.append(
                        AuditFinding(
                            id=f"find-claim-{uuid.uuid4().hex[:6]}",
                            pillar="claim",
                            severity="error",
                            flagged_text=match.group(0),
                            start_idx=match.start(),
                            end_idx=match.end(),
                            explanation=(
                                f"Unauthorized claim violates boundaries registered under {claim_id}. "
                                f"Assertions of '{phrase}' exceed authorized specifications."
                            ),
                            rule_citation=source_citation,
                            suggested_correction=suggested,
                            confidence=0.98,
                        )
                    )

        # 2. Heuristic numerical claims checks (e.g. "80% bill cuts", "100% uptime", "zero downtime")
        custom_claim_checks = [
            {
                "pattern": r"\b(?:guarantees?\s+)?100%\s+foolproof\s+uptime\b",
                "explanation": "Guarantees 100% foolproof uptime exceeds approved SLA boundary (99.95% API uptime SLA) and asserts prohibited absolutist puffery.",
                "citation": "Master Spec 2026, Section 2.1 & ASCI Code Chapter I, Clause 1.2",
                "correction": "provides an enterprise-grade 99.95% API uptime SLA under Master Spec 2026, Section 2.1",
            },
            {
                "pattern": r"\b(?:80%|50%|half)\s+(?:bill\s+cuts?|cost\s+reduction|savings?)\b",
                "explanation": "Exaggerated cost reduction claim without empirical substantiation. Maximum approved threshold is 'reduces egress by up to 35% under Clause 8'.",
                "citation": "AeroCloud Master Spec 2026, Clause 8",
                "correction": "reduces egress by up to 35% under Clause 8",
            },
            {
                "pattern": r"\bunbreachable\s+(?:cloud|edge|mesh|system)\b",
                "explanation": "Absolute cybersecurity immunity claim is legally unverifiable and prohibited under enterprise governance.",
                "citation": "AeroCloud Security Baseline 2026, Clause 14.1",
                "correction": "zero-trust mutual TLS 1.3 encryption across all inter-node channels under Clause 14.1",
            },
        ]

        for check in custom_claim_checks:
            for match in re.finditer(check["pattern"], text, flags=re.IGNORECASE):
                # Avoid exact duplicate spans if already flagged
                start, end = match.start(), match.end()
                if not any(f.start_idx == start and f.end_idx == end for f in findings):
                    findings.append(
                        AuditFinding(
                            id=f"find-claim-{uuid.uuid4().hex[:6]}",
                            pillar="claim",
                            severity="error",
                            flagged_text=match.group(0),
                            start_idx=start,
                            end_idx=end,
                            explanation=check["explanation"],
                            rule_citation=check["citation"],
                            suggested_correction=check["correction"],
                            confidence=0.96,
                        )
                    )

        return findings

