"""Rule engine enforcing ASCI advertising standards and brand trademark rules."""

import json
from pathlib import Path
import re
from typing import Any, Dict, List
import uuid

from app.core.config import get_settings
from app.models.audit import AuditFinding


class RuleEngine:
    """Evaluates promotional content against ASCI Chapter I guidelines and Brand Kit trademarks."""

    def __init__(self, shared_data_dir: Path | None = None):
        self.settings = get_settings()
        self.data_dir = shared_data_dir or self.settings.SHARED_DATA_DIR
        if not self.data_dir.exists():
            # Fallback for current working directory or relative path
            fallback = Path("shared_data").resolve()
            if fallback.exists():
                self.data_dir = fallback
        self.asci_rules = self._load_json(self.data_dir / "standards" / "asci_rules.json")
        self.brand_guidelines = self._load_json(self.data_dir / "brand_kits" / "brand_guidelines.json")

    def _load_json(self, path: Path) -> Dict[str, Any]:
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def audit_terminology_and_tone(self, text: str) -> List[AuditFinding]:
        findings: List[AuditFinding] = []

        # 1. Audit ASCI banned puffery and misleading claims
        rules = self.asci_rules.get("rules", [])
        for rule in rules:
            patterns = rule.get("match_patterns", [f"\\b{re.escape(rule['banned_term'])}\\b"])
            severity = rule.get("severity", "error")
            citation = rule.get("clause_reference", "ASCI Chapter I")
            justification = rule.get("regulatory_justification", "Prohibited under ASCI Code.")
            alternatives = rule.get("compliant_alternatives", [])
            correction = alternatives[0] if alternatives else "Remove or qualify with empirical evidence."
            pillar = "tone" if rule.get("category") in ["exaggerated_puffery", "unsubstantiated_puffery"] else "terminology"

            for pat in patterns:
                for match in re.finditer(pat, text, flags=re.IGNORECASE):
                    flagged = match.group(0)
                    findings.append(
                        AuditFinding(
                            id=f"find-asci-{uuid.uuid4().hex[:6]}",
                            pillar=pillar,
                            severity=severity,
                            flagged_text=flagged,
                            start_idx=match.start(),
                            end_idx=match.end(),
                            explanation=justification,
                            rule_citation=citation,
                            suggested_correction=correction,
                            confidence=0.95,
                        )
                    )

        # 2. Audit Mandatory Trademarks (AeroCloud™ and MeshSync®)
        trademarks = self.brand_guidelines.get("mandatory_trademarks", [])
        for tm in trademarks:
            canonical = tm.get("canonical_form")
            symbol = tm.get("symbol", "")
            prohibited_patterns = tm.get("prohibited_patterns", [])
            explanation = tm.get("explanation", f"Mandatory trademark '{canonical}' formatting violation.")
            citation = f"Brand Kit - Mandatory Trademarks: {canonical}"

            for pattern in prohibited_patterns:
                for match in re.finditer(pattern, text):
                    # Verify whether the match already includes the symbol
                    flagged = match.group(0)
                    if not flagged.endswith(symbol):
                        findings.append(
                            AuditFinding(
                                id=f"find-tm-{uuid.uuid4().hex[:6]}",
                                pillar="terminology",
                                severity="error",
                                flagged_text=flagged,
                                start_idx=match.start(),
                                end_idx=match.end(),
                                explanation=explanation,
                                rule_citation=citation,
                                suggested_correction=canonical,
                                confidence=0.99,
                            )
                        )

        return findings

