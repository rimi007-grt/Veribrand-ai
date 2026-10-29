"""VeriBrand AI core audit verification engines."""

from app.engines.claim_verifier import ClaimVerifier
from app.engines.terminology import TerminologyEngine
from app.engines.vision_wcag import VisionWCAGEngine

# Backward-compatible aliases
ClaimEngine = ClaimVerifier
RuleEngine = TerminologyEngine
VisualEngine = VisionWCAGEngine

__all__ = [
    "ClaimVerifier",
    "TerminologyEngine",
    "VisionWCAGEngine",
    "ClaimEngine",
    "RuleEngine",
    "VisualEngine",
]
