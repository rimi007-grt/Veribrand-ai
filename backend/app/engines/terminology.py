"""Terminology & Trademark Engine for VeriBrand AI.

Deterministic Regex & Trademark Matcher:
- Ingests brand_guidelines.json and asci_rules.json
- Scans input text for banned words and unformatted trademarks
- Returns structured AuditFinding objects with character start/end offsets,
  authoritative citations, and suggested replacements.
"""

from __future__ import annotations

import json
from pathlib import Path
import re
from typing import Any, Dict, List, Optional
import uuid

from app.core.config import get_settings
from app.models.audit import AuditFinding


class TerminologyEngine:
    """Enforces ASCI Chapter I puffery rules and AeroCloud brand trademark policies."""

    def __init__(self, shared_data_dir: Optional[Path] = None):
        self.settings = get_settings()
        self.data_dir = shared_data_dir or self.settings.SHARED_DATA_DIR
        if not self.data_dir.exists():
            # Robust fallback to local or relative locations
            fallback = Path(__file__).resolve().parent.parent.parent.parent / "shared_data"
            if fallback.exists():
                self.data_dir = fallback
            else:
                self.data_dir = Path("shared_data").resolve()

        self.asci_rules: Dict[str, Any] = self._load_json(self.data_dir / "standards" / "asci_rules.json")
        self.brand_guidelines: Dict[str, Any] = self._load_json(self.data_dir / "brand_kits" / "brand_guidelines.json")

    def _load_json(self, path: Path) -> Dict[str, Any]:
        """Safely load JSON data or return empty dictionary."""
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as err:
                print(f"[TerminologyEngine] Failed to parse JSON at {path}: {err}")
        return {}

    def scan(self, text: str) -> List[AuditFinding]:
        """Perform comprehensive scan of input text for ASCI banned terms and trademark violations."""
        if not text:
            return []

        findings: List[AuditFinding] = []

        # ---------------------------------------------------------------------
        # 1. ASCI Chapter I Advertising Rules & Puffery Terms
        # ---------------------------------------------------------------------
        rules = self.asci_rules.get("rules", [])
        for rule in rules:
            banned_term = rule.get("banned_term", "")
            clause_ref = rule.get("clause_reference", "ASCI Chapter I")
            citation = f"{clause_ref}: Puffery & Deceptive Claims Rule"
            justification = rule.get(
                "regulatory_justification",
                f"Use of '{banned_term}' violates ASCI advertising guidelines for truthful representation."
            )
            severity = rule.get("severity", "error")
            category = rule.get("category", "unsubstantiated_puffery")
            pillar = "tone" if "puffery" in category else "terminology"

            alternatives = rule.get("compliant_alternatives", [])
            suggested_correction = (
                alternatives[0] if alternatives else "Remove or qualify with audited empirical benchmark."
            )

            patterns = rule.get("match_patterns") or [rf"\b{re.escape(banned_term)}\b"]
            for pattern_str in patterns:
                try:
                    for match in re.finditer(pattern_str, text, flags=re.IGNORECASE):
                        flagged_text = match.group(0)
                        findings.append(
                            AuditFinding(
                                id=f"find-asci-{uuid.uuid4().hex[:6]}",
                                pillar=pillar,
                                severity=severity,
                                flagged_text=flagged_text,
                                start_idx=match.start(),
                                end_idx=match.end(),
                                explanation=justification,
                                rule_citation=citation,
                                suggested_correction=suggested_correction,
                                confidence=0.98,
                            )
                        )
                except re.error as err:
                    print(f"[TerminologyEngine] Invalid regex pattern '{pattern_str}': {err}")

        # ---------------------------------------------------------------------
        # 2. Mandatory Brand Trademarks (AeroCloud™ & MeshSync®)
        # ---------------------------------------------------------------------
        trademarks = self.brand_guidelines.get("mandatory_trademarks", [])
        for tm in trademarks:
            canonical_form = tm.get("canonical_form", "")
            symbol = tm.get("symbol", "")
            explanation = tm.get(
                "explanation",
                f"Mandatory trademark policy: Brand asset must be formatted as '{canonical_form}'."
            )
            citation = f"Brand Kit: Mandatory Trademark {canonical_form}"

            # Scan for unformatted or miscapitalized variations:
            # e.g., "Aerocloud", "Aero Cloud", "AeroCloud" (without ™)
            # e.g., "Meshsync", "Mesh Sync", "MeshSync" (without ®)
            prohibited_patterns = tm.get("prohibited_patterns", [])

            for pattern_str in prohibited_patterns:
                try:
                    for match in re.finditer(pattern_str, text):
                        flagged_text = match.group(0)
                        # Verify it is not already properly suffixed
                        if not flagged_text.endswith(symbol):
                            findings.append(
                                AuditFinding(
                                id=f"find-tm-{uuid.uuid4().hex[:6]}",
                                pillar="terminology",
                                severity="error",
                                flagged_text=flagged_text,
                                start_idx=match.start(),
                                end_idx=match.end(),
                                explanation=explanation,
                                rule_citation=citation,
                                suggested_correction=canonical_form,
                                confidence=0.99,
                            )
                        )
                except re.error as err:
                    print(f"[TerminologyEngine] Invalid trademark pattern '{pattern_str}': {err}")

        # Sort findings by start_idx ascending
        findings.sort(key=lambda f: f.start_idx)
        return findings

