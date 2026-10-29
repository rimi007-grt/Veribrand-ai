# 🛡️ VeriBrand AI
> **Autonomous Pre-Publication Brand Governance & Institutional Truth Architecture**

VeriBrand AI is an enterprise-grade pre-publication governance platform designed to eliminate regulatory violations, deceptive marketing claims, trademark dilution, and accessibility failures *before* content goes live.

---

## ⚡ The 4 Pre-Flight Verification Pillars

| Pillar | Governance Focus | Enforced Authority / Standard |
| :--- | :--- | :--- |
| **📘 Regulatory Advertising Compliance** | Banned puffery, superlative claims, price superiority, absolute guarantees | **ASCI Code Chapter I** (Advertising Standards Council of India) |
| **📗 Enterprise Claim Grounding** | Grounding numerical SLAs, egress benchmarks, latency constraints | **Master Spec 2026** (Semantic Vector RAG + Google Gemini 1.5 Flash) |
| **📙 Brand Kit & Trademark Integrity** | Mandatory registered marks, casing, approved color combinations | **AeroCloud Systems Brand Kit** (`AeroCloud™`, `MeshSync®`) |
| **📕 Visual & Accessibility Auditing** | Mathematical relative luminance & contrast ratio verification | **W3C WCAG 2.1 SC 1.4.3 Level AA** (4.5:1 body, 3.0:1 large text) |

---

## 🏗️ Architecture & Project Structure

```
veribrand-ai/
├── backend/                  # FastAPI (Python 3.11), Pydantic v2, CV & NLP Engines
│   ├── app/
│   │   ├── api/              # REST Endpoints (/api/v1/audit/text, /visual, /presets)
│   │   ├── core/             # Configuration & Environment Settings
│   │   ├── engines/          # TerminologyEngine, VisionWCAGEngine, ClaimVerifier
│   │   ├── models/           # Shared Pydantic v2 Contract Models
│   │   └── main.py           # FastAPI Application Entrypoint
│   └── requirements.txt
├── frontend/                 # Next.js 14 (App Router), TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── app/              # Studio Workspace, Telemetry Analytics, Matrix
│   │   ├── components/       # PresetSelector, DiffCard, WorkflowHeader
│   │   └── lib/              # API Client & Types
│   ├── package.json
│   └── tailwind.config.ts
├── shared_data/              # Authoritative Knowledge Base & Standards
│   ├── standards/
│   │   ├── asci_rules.json       # ASCI Chapter I banned terms & legal citations
│   │   └── wcag_thresholds.json  # W3C WCAG 2.1 AA luminance formulas & thresholds
│   ├── brand_kits/
│   │   ├── brand_guidelines.json # AeroCloud palette, banned pairings, trademarks
│   │   └── approved_claims.json  # 5 enterprise specs with numerical boundaries
│   └── test_samples/
│       └── benchmark_samples.json # Ground-truth benchmark test suite
└── streamlit_app.py          # Unified Interactive Streamlit Deployment
```

---

## 🚀 Quickstart Guide

### Option 1: Launch Interactive Streamlit Studio (Recommended)

Streamlit provides an all-in-one studio with preset loading, real-time diff card replacement, banner image dropzone, and cryptographic audit certification:

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt
pip install streamlit pandas pillow

# 2. Launch Streamlit
streamlit run streamlit_app.py
```
App will open at `http://localhost:8501`.

---

### Option 2: Full-Stack (FastAPI Backend + Next.js Frontend)

#### Step 1: Start FastAPI Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API docs available at `http://localhost:8000/docs`.

#### Step 2: Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend workspace available at `http://localhost:3000`.

---

## 🎯 Verification Engine Capabilities

### 1. Deterministic ASCI & Trademark Regex Engine (`TerminologyEngine`)
* Ingests `asci_rules.json` and `brand_guidelines.json`.
* Identifies puffery and misleading superlatives (e.g., *"cheapest"*, *"revolutionary"*, *"guaranteed cure"*, *"unbeatable"*).
* Flags missing trademark symbols (enforces `AeroCloud™` and `MeshSync®`).
* Generates exact character start/end offsets and compliant drop-in replacements.

### 2. Dense Vector Claim Verifier (`ClaimVerifier`)
* Uses SentenceTransformers / fast cosine vector space to retrieve top authoritative claims from `approved_claims.json`.
* Audits candidate text with Google Gemini 1.5 Flash in structured JSON schema mode.
* Detects unbacked SLA claims (e.g., flagging *"100% foolproof uptime"* against the 99.95% SLA limit in Master Spec 2026, Section 2.1).

### 3. Computer Vision WCAG Contrast Engine (`VisionWCAGEngine`)
* Extracts dominant foreground and background colors via Pillow / OpenCV color quantization.
* Computes W3C relative luminance:
  $$L = 0.2126 \times R_{\text{lin}} + 0.7152 \times G_{\text{lin}} + 0.0722 \times B_{\text{lin}}$$
* Calculates exact contrast ratio:
  $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
* Automatically catches disallowed brand pairings (e.g. `#38BDF8` on `#FFFFFF` fails at 1.95:1).

---

## 🛡️ License & Compliance Notice
Codified for enterprise pre-flight brand compliance. Built with strict adherence to ASCI Advertising Codes and W3C WCAG 2.1 Accessibility Guidelines.
