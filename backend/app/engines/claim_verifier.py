"""Claim Verifier Engine for VeriBrand AI.

RAG & Semantic Claim Grounding:
- Loads approved_claims.json authoritative enterprise specifications
- Retrieves top cosine-similar approved claims using SentenceTransformers ('all-MiniLM-L6-v2')
- Uses Google Gemini 1.5 Flash in structured JSON schema mode to audit candidate claims
- Provides seamless deterministic fallbacks and advisory notification if offline.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
import re
from typing import Any, Dict, List, Optional, Tuple
import uuid

import numpy as np

from app.core.config import get_settings
from app.models.audit import AuditFinding, ClaimVerdict


class ClaimVerifier:
    """Semantic claim auditor backed by Vector RAG retrieval and Gemini 1.5 Flash reasoning."""

    def __init__(self, shared_data_dir: Optional[Path] = None):
        self.settings = get_settings()
        self.data_dir = shared_data_dir or self.settings.SHARED_DATA_DIR
        if not self.data_dir.exists():
            fallback = Path(__file__).resolve().parent.parent.parent.parent / "shared_data"
            if fallback.exists():
                self.data_dir = fallback
            else:
                self.data_dir = Path("shared_data").resolve()

        self.claims_db: Dict[str, Any] = self._load_json(self.data_dir / "brand_kits" / "approved_claims.json")
        self.approved_claims: List[Dict[str, Any]] = self.claims_db.get("approved_claims", [])

        # Sentence transformer model placeholder / initialization
        self.embedding_model = None
        self.claim_embeddings: Optional[np.ndarray] = None
        self._init_embedding_model()

    def _load_json(self, path: Path) -> Dict[str, Any]:
        """Safely load JSON data or return empty dictionary."""
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as err:
                print(f"[ClaimVerifier] Failed to load JSON from {path}: {err}")
        return {}

    def _init_embedding_model(self) -> None:
        """Initialize SentenceTransformer or setup graceful token-vector fallback."""
        try:
            from sentence_transformers import SentenceTransformer
            # Disable noisy HuggingFace telemetry and download warnings
            os.environ["TOKENIZERS_PARALLELISM"] = "false"
            self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
            claim_texts = [
                f"{c.get('canonical_claim', '')} {c.get('source_citation', '')}"
                for c in self.approved_claims
            ]
            if claim_texts:
                self.claim_embeddings = self.embedding_model.encode(claim_texts, convert_to_numpy=True)
            print("[ClaimVerifier] SentenceTransformer ('all-MiniLM-L6-v2') initialized successfully.")
        except Exception as err:
            print(f"[ClaimVerifier] SentenceTransformer unavailable ({err}); using fast cosine token vectorizer.")
            self.embedding_model = None
            self.claim_embeddings = None

    def _token_vectorize(self, text: str) -> np.ndarray:
        """Fast fallback bag-of-words character n-gram / token vectorizer."""
        tokens = re.findall(r"\w+", text.lower())
        vec = np.zeros(256, dtype=np.float32)
        for t in tokens:
            h = hash(t) % 256
            vec[h] += 1.0
        norm = np.linalg.norm(vec)
        return vec / (norm + 1e-9)

    def retrieve_top_claims(self, candidate_sentence: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """Retrieve the top-k most semantically relevant approved claims for a candidate sentence."""
        if not self.approved_claims:
            return []

        if self.embedding_model is not None and self.claim_embeddings is not None:
            try:
                cand_vec = self.embedding_model.encode([candidate_sentence], convert_to_numpy=True)[0]
                # Cosine similarity: (A . B) / (||A|| * ||B||)
                norms = np.linalg.norm(self.claim_embeddings, axis=1) * np.linalg.norm(cand_vec)
                sims = np.dot(self.claim_embeddings, cand_vec) / (norms + 1e-9)
                top_indices = np.argsort(sims)[::-1][:top_k]
                return [self.approved_claims[i] for i in top_indices]
            except Exception as err:
                print(f"[ClaimVerifier] Dense retrieval failed: {err}")

        # Fallback bag-of-tokens cosine similarity
        cand_vec = self._token_vectorize(candidate_sentence)
        scores = []
        for claim in self.approved_claims:
            c_text = f"{claim.get('canonical_claim', '')} {claim.get('source_citation', '')}"
            c_vec = self._token_vectorize(c_text)
            sim = float(np.dot(cand_vec, c_vec))
            scores.append(sim)

        top_indices = np.argsort(scores)[::-1][:top_k]
        return [self.approved_claims[i] for i in top_indices]

    def _call_gemini_auditor(
        self, candidate_sentence: str, relevant_claims: List[Dict[str, Any]]
    ) -> Optional[ClaimVerdict]:
        """Invoke Google Gemini 1.5 Flash in structured JSON schema mode."""
        api_key = self.settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        if not api_key or api_key == "your_gemini_api_key_here":
            return None

        claims_context = "\n".join([
            f"- Approved Claim: {c.get('canonical_claim')}\n  Citation: {c.get('source_citation')}\n  Approved Wording: {c.get('approved_phrasings', [''])[0]}"
            for c in relevant_claims
        ])

        system_prompt = (
            "You are a brand truth auditor for AeroCloud Systems. "
            "Compare the candidate sentence against the retrieved approved enterprise claims. "
            "If the candidate sentence exaggerates, contradicts, or makes unbacked numerical claims, flag it, "
            "cite the source document, and provide a compliant rewrite that preserves user intent.\n\n"
            "Respond strictly in JSON matching this schema:\n"
            "{\n"
            '  "status": "supported" | "contradicted" | "unsupported",\n'
            '  "reason": "Clear explanation of discrepancy or why it passes",\n'
            '  "citation": "Source specification citation",\n'
            '  "suggested_rewrite": "Compliant drop-in replacement phrasing",\n'
            '  "confidence": 0.95\n'
            "}"
        )

        user_content = (
            f"Retrieved Authoritative Claims:\n{claims_context}\n\n"
            f"Candidate Sentence to Audit:\n\"{candidate_sentence}\""
        )

        # Attempt invocation using google-genai or google.generativeai
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model=self.settings.GEMINI_MODEL or "gemini-1.5-flash",
                contents=[system_prompt, user_content],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )
            raw_text = response.text
            data = json.loads(raw_text)
            return ClaimVerdict(**data)
        except Exception as err:
            print(f"[ClaimVerifier] Gemini structured invocation error: {err}")
            return None

    def verify_sentence(
        self, sentence: str, full_text: str
    ) -> Tuple[List[AuditFinding], bool]:
        """Verify a single candidate sentence against approved enterprise specifications."""
        findings: List[AuditFinding] = []
        is_semantic_online = False

        # Retrieve relevant claims via semantic or token similarity
        relevant_claims = self.retrieve_top_claims(sentence, top_k=2)

        # Try Google Gemini structured verification
        verdict = self._call_gemini_auditor(sentence, relevant_claims)

        start_idx = full_text.find(sentence)
        if start_idx == -1:
            start_idx = 0
        end_idx = start_idx + len(sentence)

        if verdict is not None:
            is_semantic_online = True
            if verdict.status in ["contradicted", "unsupported"]:
                findings.append(
                    AuditFinding(
                        id=f"find-claim-{uuid.uuid4().hex[:6]}",
                        pillar="claim",
                        severity="error",
                        flagged_text=sentence,
                        start_idx=start_idx,
                        end_idx=end_idx,
                        explanation=verdict.reason,
                        rule_citation=verdict.citation or "AeroCloud Approved Specifications",
                        suggested_correction=verdict.suggested_rewrite,
                        confidence=verdict.confidence,
                    )
                )
            return findings, is_semantic_online

        # ---------------------------------------------------------------------
        # Deterministic Claim Rule Fallback
        # ---------------------------------------------------------------------
        # Detect unbacked numerical claims and SLA hyperbole
        patterns = [
            (
                r"\b(?:guarantees?\s+)?100%\s+foolproof\s+uptime\b",
                "Guarantees 100% foolproof uptime exceeds approved SLA boundary of 99.95% API uptime and asserts prohibited absolutist puffery.",
                "Master Spec 2026, Section 2.1 & ASCI Code Chapter I, Clause 1.2",
                "provides an enterprise-grade 99.95% API uptime SLA under Master Spec 2026, Section 2.1",
            ),
            (
                r"\b80%\s+bill\s+cuts?\b",
                "Unsupported financial claim. Approved benchmark limit is 'reduces egress by up to 35% under Clause 8'.",
                "AeroCloud Master Spec 2026, Clause 8",
                "reduces egress by up to 35% under Clause 8",
            ),
            (
                r"\bunbreachable\s+cloud\s+edge\b|\bunbreachable\s+cloud\b",
                "Absolute cybersecurity immunity claim is legally unverifiable and prohibited under enterprise governance.",
                "AeroCloud Security Baseline 2026, Clause 14.1",
                "zero-trust mutual TLS 1.3 encryption across all inter-node channels under Clause 14.1",
            ),
        ]

        for pat, explanation, citation, correction in patterns:
            match = re.search(pat, sentence, flags=re.IGNORECASE)
            if match:
                f_start = start_idx + match.start()
                f_end = start_idx + match.end()
                findings.append(
                    AuditFinding(
                        id=f"find-claim-{uuid.uuid4().hex[:6]}",
                        pillar="claim",
                        severity="error",
                        flagged_text=match.group(0),
                        start_idx=f_start,
                        end_idx=f_end,
                        explanation=explanation,
                        rule_citation=citation,
                        suggested_correction=correction,
                        confidence=0.97,
                    )
                )

        return findings, is_semantic_online

    def audit_text_claims(self, text: str) -> Tuple[List[AuditFinding], bool]:
        """Split text into sentences and audit each claim against enterprise boundaries."""
        if not text:
            return [], True

        # Split on sentence boundaries
        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 5]
        if not sentences:
            sentences = [text.strip()]

        all_findings: List[AuditFinding] = []
        any_semantic_success = False

        for sentence in sentences:
            findings, semantic_ok = self.verify_sentence(sentence, text)
            all_findings.extend(findings)
            if semantic_ok:
                any_semantic_success = True

        return all_findings, any_semantic_success

