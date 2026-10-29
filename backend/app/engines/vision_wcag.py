"""Computer Vision WCAG Contrast Engine for VeriBrand AI.

Accepts image uploads (PNG/JPEG), extracts dominant foreground and background colors
using Pillow / OpenCV color quantization, computes W3C relative luminance & contrast ratio,
and evaluates compliance against WCAG 2.1 AA standards and AeroCloud brand guidelines.
"""

from __future__ import annotations

import io
import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import uuid

import numpy as np
from PIL import Image

from app.core.config import get_settings
from app.models.audit import AuditFinding


class VisionWCAGEngine:
    """Extracts graphic color palettes and evaluates WCAG 2.1 AA luminance contrast ratios."""

    def __init__(self, shared_data_dir: Optional[Path] = None):
        self.settings = get_settings()
        self.data_dir = shared_data_dir or self.settings.SHARED_DATA_DIR
        if not self.data_dir.exists():
            fallback = Path(__file__).resolve().parent.parent.parent.parent / "shared_data"
            if fallback.exists():
                self.data_dir = fallback
            else:
                self.data_dir = Path("shared_data").resolve()

        self.wcag_thresholds: Dict[str, Any] = self._load_json(self.data_dir / "standards" / "wcag_thresholds.json")
        self.brand_guidelines: Dict[str, Any] = self._load_json(self.data_dir / "brand_kits" / "brand_guidelines.json")

    def _load_json(self, path: Path) -> Dict[str, Any]:
        """Safely load JSON data or return empty dictionary."""
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as err:
                print(f"[VisionWCAGEngine] Failed to load JSON from {path}: {err}")
        return {}

    @staticmethod
    def rgb_to_hex(r: int, g: int, b: int) -> str:
        """Convert RGB integers (0-255) to uppercase hex code."""
        return f"#{r:02X}{g:02X}{b:02X}"

    @staticmethod
    def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
        """Convert hex string (e.g. '#38BDF8' or '38BDF8') to (r, g, b) tuple."""
        clean = hex_code.strip().lstrip("#")
        if len(clean) == 3:
            clean = "".join([c * 2 for c in clean])
        if len(clean) != 6:
            raise ValueError(f"Invalid hex color code: '{hex_code}'")
        return int(clean[0:2], 16), int(clean[2:4], 16), int(clean[4:6], 16)

    @classmethod
    def calculate_relative_luminance(cls, r: int, g: int, b: int) -> float:
        """Compute relative luminance according to W3C sRGB formula.

        L = 0.2126 * R + 0.7152 * G + 0.0722 * B
        where color channels are linearized.
        """
        channels = [r / 255.0, g / 255.0, b / 255.0]
        linear_channels = []
        for c in channels:
            if c <= 0.04045:
                linear_channels.append(c / 12.92)
            else:
                linear_channels.append(((c + 0.055) / 1.055) ** 2.4)
        return 0.2126 * linear_channels[0] + 0.7152 * linear_channels[1] + 0.0722 * linear_channels[2]

    @classmethod
    def calculate_contrast_ratio(cls, color_a_rgb: Tuple[int, int, int], color_b_rgb: Tuple[int, int, int]) -> float:
        """Compute WCAG 2.1 contrast ratio: (L1 + 0.05) / (L2 + 0.05). Range: 1.0 to 21.0."""
        la = cls.calculate_relative_luminance(*color_a_rgb)
        lb = cls.calculate_relative_luminance(*color_b_rgb)
        l_lighter = max(la, lb)
        l_darker = min(la, lb)
        ratio = (l_lighter + 0.05) / (l_darker + 0.05)
        return round(ratio, 2)

    def extract_dominant_colors(self, image_bytes: bytes) -> Tuple[Tuple[int, int, int], Tuple[int, int, int]]:
        """Extract dominant background canvas color and prominent foreground element color from image."""
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            # Downscale for performance and noise reduction
            image.thumbnail((250, 250))
            np_img = np.array(image)

            # Sample border pixels to reliably detect the background canvas
            border_pixels = np.concatenate([
                np_img[0, :, :],          # top row
                np_img[-1, :, :],         # bottom row
                np_img[:, 0, :],          # left column
                np_img[:, -1, :],         # right column
            ], axis=0)

            # Median of border gives robust background estimate
            bg_r, bg_g, bg_b = np.median(border_pixels, axis=0).astype(int)
            bg_color = (int(bg_r), int(bg_g), int(bg_b))

            # Quantize image to find top distinct color clusters
            quantized = image.quantize(colors=6, method=Image.Quantize.MEDIANCUT)
            palette = quantized.getpalette()
            color_counts = quantized.getcolors()

            candidates: List[Tuple[int, Tuple[int, int, int]]] = []
            if color_counts and palette:
                for count, idx in color_counts:
                    r = palette[idx * 3]
                    g = palette[idx * 3 + 1]
                    b = palette[idx * 3 + 2]
                    candidates.append((count, (r, g, b)))

            # Sort by frequency descending
            candidates.sort(key=lambda x: x[0], reverse=True)

            # Foreground is the most frequent color that has significant Euclidean color distance from background
            fg_color = None
            for _, color in candidates:
                dist = np.linalg.norm(np.array(color) - np.array(bg_color))
                if dist > 40:  # Distinct visual element threshold
                    fg_color = color
                    break

            if fg_color is None:
                # Fallback: if uniform or near-monochrome, contrast against standard dark/light
                fg_color = (15, 23, 42) if self.calculate_relative_luminance(*bg_color) > 0.5 else (255, 255, 255)

            return fg_color, bg_color

        except Exception as err:
            print(f"[VisionWCAGEngine] Image extraction error: {err}. Using default brand palette fallback.")
            return (56, 189, 248), (255, 255, 255)  # #38BDF8 on #FFFFFF

    def evaluate_image(
        self,
        image_bytes: bytes,
        font_size_pt: float = 16.0,
        is_bold: bool = False,
    ) -> Tuple[float, bool, str, str, List[AuditFinding]]:
        """Run computer vision contrast audit on an uploaded creative banner or graphic."""
        fg_rgb, bg_rgb = self.extract_dominant_colors(image_bytes)
        fg_hex = self.rgb_to_hex(*fg_rgb)
        bg_hex = self.rgb_to_hex(*bg_rgb)

        ratio = self.calculate_contrast_ratio(fg_rgb, bg_rgb)
        is_large_text = font_size_pt >= 18.0 or (font_size_pt >= 14.0 and is_bold)
        min_ratio = 3.0 if is_large_text else 4.5
        wcag_passed = ratio >= min_ratio

        findings: List[AuditFinding] = []

        # 1. Check against AeroCloud Brand Kit disallowed color pairings
        disallowed = self.brand_guidelines.get("pairing_rules", {}).get("disallowed_pairings", [])
        for rule in disallowed:
            rule_fg = rule.get("foreground_color", "").upper()
            rule_bg = rule.get("background_color", "").upper()
            if fg_hex.upper() == rule_fg and bg_hex.upper() == rule_bg:
                remediations = rule.get("approved_remediations", [])
                suggested_correction = (
                    remediations[0] if remediations else "Use approved brand blue #0284C7 on light background."
                )
                findings.append(
                    AuditFinding(
                        id=f"find-brand-color-{uuid.uuid4().hex[:6]}",
                        pillar="visual",
                        severity="error",
                        flagged_text=f"{fg_hex} on {bg_hex}",
                        start_idx=0,
                        end_idx=len(f"{fg_hex} on {bg_hex}"),
                        explanation=(
                            f"Disallowed Brand Kit pairing: {rule.get('reason', 'Color combination violates AeroCloud brand standards.')} "
                            f"(Detected ratio: {ratio}:1, required: {min_ratio}:1)."
                        ),
                        rule_citation="Brand Kit: Disallowed Color Pairings",
                        suggested_correction=suggested_correction,
                        confidence=0.98,
                    )
                )

        # 2. Check against W3C WCAG 2.1 AA contrast threshold
        if not wcag_passed:
            tier_name = "large display text (minimum 3.0:1)" if is_large_text else "body text (minimum 4.5:1)"
            findings.append(
                AuditFinding(
                    id=f"find-wcag-{uuid.uuid4().hex[:6]}",
                    pillar="accessibility",
                    severity="error",
                    flagged_text=f"Contrast {ratio}:1 ({fg_hex} on {bg_hex})",
                    start_idx=0,
                    end_idx=len(f"Contrast {ratio}:1 ({fg_hex} on {bg_hex})"),
                    explanation=(
                        f"Calculated contrast ratio of {ratio}:1 fails W3C WCAG 2.1 Level AA requirement of "
                        f"{min_ratio}:1 for {tier_name}. Text on this graphic will be illegible for low-vision readers."
                    ),
                    rule_citation="W3C WCAG 2.1 SC 1.4.3: Contrast (Minimum)",
                    suggested_correction=(
                        f"Adjust foreground element to a darker shade (e.g. #0284C7 or #0F172A) "
                        f"or lighten the background to achieve at least {min_ratio}:1 contrast."
                    ),
                    confidence=0.99,
                )
            )

        return ratio, wcag_passed, fg_hex, bg_hex, findings

