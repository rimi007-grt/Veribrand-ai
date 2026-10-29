"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Trophy, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  BookOpen, 
  Compass, 
  Terminal 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b12] text-[#f8fafc] font-sans selection:bg-[#2563eb] selection:text-white relative overflow-x-hidden">
      
      {/* Atmospheric Vignette Layer */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10" 
        style={{ background: "radial-gradient(120% 90% at 50% 30%, transparent 45%, rgba(3, 5, 8, 0.75) 100%)" }} 
      />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between px-6 sm:px-12 bg-[#070b12]/80 backdrop-blur-md border-b border-[#94a3b8]/15">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#0f172a"/>
            <circle cx="16" cy="16" r="8" fill="#2563eb" opacity="0.85"/>
            <path d="M11 16l3.5 3.5 6.5-6.5" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <b className="text-sm tracking-widest font-semibold block uppercase">VERIBRAND AI</b>
            <i className="not-italic text-[9px] tracking-widest text-[#64748b] uppercase block">PRE-FLIGHT GOVERNANCE</i>
          </div>
        </div>

        <nav className="flex items-center gap-6 sm:gap-9 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          <a href="#matrix" className="hover:text-[#f8fafc] transition hidden sm:inline-block">Audit Pillars</a>
          <a href="#inspector" className="hover:text-[#f8fafc] transition hidden sm:inline-block">Diff Inspector</a>
          <Link href="/analytics" className="hover:text-[#f8fafc] transition">Governance</Link>
          <Link 
            href="/workspace" 
            className="px-5 py-2.5 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold transition shadow-md shadow-[#2563eb]/25"
          >
            Run Live Audit
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] pt-32 pb-16 px-6 sm:px-12 max-w-6xl mx-auto flex flex-col justify-between">
        <div className="max-w-3xl space-y-6 pt-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#38bdf8]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-lg shadow-[#10b981] animate-pulse"></span>
            Pre-Publication Firewall Active
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#f8fafc] uppercase leading-[1.08]">
            Where content meets <br />
            <span className="text-[#38bdf8]">institutional truth.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-2xl font-light">
            Grammarly checks syntax. VeriBrand verifies factual assertions against enterprise spec sheets, validates WCAG 2.1 contrast math, and enforces approved brand lexicon in under 4 seconds.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/workspace"
              className="px-8 py-3.5 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider transition shadow-xl shadow-[#2563eb]/30 flex items-center gap-2"
            >
              <span>Launch Pre-Flight Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/analytics"
              className="px-8 py-3.5 rounded bg-[#0f172a] hover:bg-[#0f172a]/80 text-[#f8fafc] border border-[#94a3b8]/20 text-xs font-bold uppercase tracking-wider transition"
            >
              Risk Telemetry & Logs
            </Link>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-[#94a3b8]/15">
          <div className="space-y-1">
            <b className="text-3xl sm:text-4xl font-light text-[#f8fafc]">&lt; 4.0s</b>
            <span className="text-xs uppercase tracking-wider text-[#64748b] block font-medium">Pre-Flight Turnaround</span>
          </div>
          <div className="space-y-1">
            <b className="text-3xl sm:text-4xl font-light text-[#f8fafc]">100%</b>
            <span className="text-xs uppercase tracking-wider text-[#64748b] block font-medium">W3C Contrast Compliance</span>
          </div>
          <div className="space-y-1">
            <b className="text-3xl sm:text-4xl font-light text-[#f8fafc]">0%</b>
            <span className="text-xs uppercase tracking-wider text-[#64748b] block font-medium">Hallucinated Claims</span>
          </div>
        </div>
      </section>

      {/* Chapter II: Verification Matrix (Cards) */}
      <section id="matrix" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-6">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-[#38bdf8] mb-2">
            Verification Matrix
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight uppercase text-[#f8fafc]">
            The 5 Core Audit Engines
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mt-2 font-light">
            Every marketing draft, visual banner, and whitepaper is cross-examined simultaneously before reaching production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Card 1 */}
          <article className="p-7 rounded-lg bg-[#0f172a] border border-[#94a3b8]/15 hover:border-[#38bdf8]/40 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl">
            <div className="space-y-3">
              <div className="text-xs font-semibold tracking-widest text-[#38bdf8] font-mono">
                01 / GROUNDING
              </div>
              <h3 className="text-xl font-normal text-[#f8fafc]">Factual Claim RAG</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Scans extracted numerical and performance bounds against approved corporate truth documents using dense cosine vector retrieval.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#94a3b8]/15 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#64748b]">
              <span>Engine: <b className="text-[#f8fafc] font-medium">SentenceTransformers</b></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#10b981] border border-[#10b981]/30 bg-[#0f172a]">Verified</span>
            </div>
          </article>

          {/* Card 2 */}
          <article className="p-7 rounded-lg bg-[#0f172a] border border-[#94a3b8]/15 hover:border-[#38bdf8]/40 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl">
            <div className="space-y-3">
              <div className="text-xs font-semibold tracking-widest text-[#38bdf8] font-mono">
                02 / REGULATORY
              </div>
              <h3 className="text-xl font-normal text-[#f8fafc]">Terminology & Puffery</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Deterministic regex and Trie matchers enforcing ASCI Chapter I compliance, comparative advertising rules, and trademark formatting.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#94a3b8]/15 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#64748b]">
              <span>Rulebase: <b className="text-[#f8fafc] font-medium">ASCI & FTC Code</b></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#10b981] border border-[#10b981]/30 bg-[#0f172a]">Deterministic</span>
            </div>
          </article>

          {/* Card 3 */}
          <article className="p-7 rounded-lg bg-[#0f172a] border border-[#94a3b8]/15 hover:border-[#38bdf8]/40 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl">
            <div className="space-y-3">
              <div className="text-xs font-semibold tracking-widest text-[#38bdf8] font-mono">
                03 / ACCESSIBILITY
              </div>
              <h3 className="text-xl font-normal text-[#f8fafc]">Vision & WCAG Math</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Extracts dominant foreground and background pixels using OpenCV/Pillow to calculate real-time luminance contrast ratios.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#94a3b8]/15 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#64748b]">
              <span>Standard: <b className="text-[#f8fafc] font-medium">WCAG 2.1 AA (4.5:1)</b></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#ef4444] border border-[#ef4444]/30 bg-[#0f172a]">Auto-Detect</span>
            </div>
          </article>
        </div>
      </section>

      {/* Interactive Diff Inspector Terminal */}
      <section id="inspector" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-6">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-[#38bdf8] mb-2">
            Explainable Remediation
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight uppercase text-[#f8fafc]">
            Inline Diff & Source Provenance
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mt-2 font-light">
            Non-destructive corrections cite exact company clauses, allowing creators to apply compliant replacements with a single click.
          </p>
        </div>

        {/* Diff Terminal Window */}
        <div className="bg-[#020408] border border-[#94a3b8]/20 rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-[#0b111e] px-5 py-3 border-b border-[#94a3b8]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#ef4444] border border-[#ef4444]/30 bg-[#0f172a]">
              Claim Contradiction Detected
            </span>
          </div>

          <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed">
            <p>
              "AeroCloud introduces its new deployment mesh,{" "}
              <span className="bg-[#ef4444]/20 text-[#fca5a5] px-2 py-0.5 rounded line-through">
                promising 100% foolproof uptime without a single second of downtime
              </span>{" "}
              <span className="bg-[#10b981]/20 text-[#86efac] px-2 py-0.5 rounded font-semibold">
                delivering a guaranteed 99.95% API uptime SLA
              </span>{" "}
              across multi-region clusters."
            </p>

            <div className="mt-4 pt-3 border-t border-[#94a3b8]/10 text-xs text-[#64748b]">
              ↳ Flagged by <strong className="text-[#f8fafc]">Semantic Claim RAG</strong> | Source: <span className="text-[#38bdf8]">Master SLA Spec 2026, Section 2.1</span>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider transition shadow-xl shadow-[#2563eb]/25"
          >
            <span>Open Full Interactive Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#94a3b8]/15 bg-[#070b12] py-8 px-6 sm:px-12 text-center text-xs text-[#64748b]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>VERIBRAND AI • Institutional Brand Governance & Truth Architecture</div>
          <div className="flex items-center gap-6">
            <span>ASCI Chapter I</span>
            <span>W3C WCAG 2.1 AA</span>
            <span>AeroCloud™ Spec 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
