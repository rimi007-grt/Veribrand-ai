"""Visual compliance and accessibility engine enforcing WCAG 2.1 and brand color guidelines."""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import uuid

from app.core.config import get_settings
from app.models.audit import AuditFinding


class VisualEngine:
    """Calculates color contrast ratios and enforces WCAG 2.1 AA accessibility standards."""

    def __init__(self, shared_data_dir: Path | None = None):
        self.settings = get_settings()
        self.data_dir = shared_data_dir or self.settings.SHARED_DATA_DIR
        if not self.data_dir.exists():
            fallback = Path("shared_data").resolve()
            if fallback.exists():
                self.data_dir = fallback
        self.wcag_thresholds = self._load_json(self.data_dir / "standards" / "wcag_thresholds.json")
        self.brand_guidelines = self._load_json(self.data_dir / "brand_kits" / "brand_guidelines.json")

    def _load_json(self, path: Path) -> Dict[str, Any]:
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    @staticmethod
    def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
        """Convert hex string (e.g., '#38BDF8' or '38BDF8') to (R, G, B) tuple."""
        clean_hex = hex_code.strip().lstrip("#")
        if len(clean_hex) == 3:
            clean_hex = "".join([c * 2 for c in clean_hex])
        if len(clean_hex) != 6:
            raise ValueError(f"Invalid hex color code: {hex_code}")
        r = int(clean_hex[0:2], 16)
        g = int(clean_hex[2:4], 16)
        b = int(clean_hex[4:6], 16)
        return r, g, b

    @classmethod
    def calculate_relative_luminance(cls, r: int, g: int, b: int) -> float:
        """Compute relative luminance according to W3C sRGB formula."""
        channels = [r / 255.0, g / 255.0, b / 255.0]
        linear_channels = []
        for c in channels:
            if c <= 0.04045:
                linear_channels.append(c / 12.92)
            else:
                linear_channels.append(((c + 0.055) / 1.055) ** 2.4)
        return 0.2126 * linear_channels[0] + 0.7152 * linear_channels[1] + 0.0722 * linear_channels[2]

    @classmethod
    def calculate_contrast_ratio(cls, color_a: str, color_b: str) -> float:
        """Compute contrast ratio (range 1.0 to 21.0) between two hex colors."""
        ra, ga, ba = cls.hex_to_rgb(color_a)
        rb, gb, bb = cls.hex_to_rgb(color_b)
        la = cls.calculate_relative_luminance(ra, ga, ba)
        lb = cls.calculate_relative_luminance(rb, gb, bb)
        l_light = max(la, lb)
        l_dark = min(la, lb)
        ratio = (l_light + 0.05) / (l_dark + 0.05)
        return round(ratio, 2)

    def evaluate_contrast(
        self,
        foreground: str,
        background: str,
        font_size_pt: float = 16.0,
        is_bold: bool = False,
    ) -> Tuple[float, bool, List[AuditFinding]]:
        """Evaluate color contrast against WCAG 2.1 AA and Brand Guidelines."""
        ratio = self.calculate_contrast_ratio(foreground, background)
        findings: List[AuditFinding] = []

        is_large_text = font_size_pt >= 18.0 or (font_size_pt >= 14.0 and is_bold)
        min_required = 3.0 if is_large_text else 4.5
        wcag_passed = ratio >= min_required

        # Check against disallowed pairings in Brand Guidelines
        disallowed = self.brand_guidelines.get("pairing_rules", {}).get("disallowed_pairings", [])
        norm_fg = foreground.strip().upper()
        norm_bg = background.strip().upper()

        for rule in disallowed:
            rule_fg = rule.get("foreground_color", "").upper()
            rule_bg = rule.get("background_color", "").upper()
            if norm_fg == rule_fg and norm_bg == rule_bg:
                remediations = rule.get("approved_remediations", [])
                remediation_text = remediations[0] if remediations else "Use approved high-contrast brand color."
                findings.append(
                    AuditFinding(
                        id=f"find-brand-color-{uuid.uuid4().hex[:6]}",
                        pillar="visual",
                        severity="error",
                        flagged_text=f"{foreground} on {background}",
                        start_idx=0,
                        end_idx=len(f"{foreground} on {background}"),
                        explanation=rule.get("reason", "Disallowed color pairing in Brand Kit."),
                        rule_citation="Brand Kit - Disallowed Color Pairings",
                        suggested_correction=remediation_text,
                        confidence=1.0,
                    )
                )

        # If it also fails WCAG 2.1 AA
        if not wcag_passed:
            citation = "W3C WCAG 2.1 SC 1.4.3 Level AA"
            tier_desc = "large display text (min 3.0:1)" if is_large_text else "body text (min 4.5:1)"
            findings.append(
                AuditFinding(
                    id=f"find-wcag-{uuid.uuid4().hex[:6]}",
                    pillar="accessibility",
                    severity="error",
                    flagged_text=f"Contrast {ratio}:1 ({foreground} on {background})",
                    start_idx=0,
                    end_idx=len(f"{foreground} on {background}"),
                    explanation=(
                        f"Calculated contrast ratio of {ratio}:1 fails W3C WCAG 2.1 Level AA requirement of "
                        f"{min_required}:1 for {tier_desc}."
                    ),
                    rule_citation=citation,
                    suggested_correction=f"Increase contrast ratio to at least {min_required}:1 by selecting a darker foreground or lighter background.",
                    confidence=1.0,
                )
            )

        return ratio, wcag_passed, findings

