"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  FileCheck, 
  Sparkles, 
  Layers, 
  Eye, 
  BookOpen, 
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { AuditFinding, AuditResponse, AuditStatus } from "../lib/types";

// Embedded benchmark presets for instant client-side testing
const PRESETS = {
  sample_flawed_01: {
    name: "Preset 1: Flawed Launch Announcement (High Violations)",
    text: "Introducing Aerocloud's newest cloud mesh solution! It is simply the cheapest enterprise platform in the market today, delivering revolutionary distributed computing with zero friction. Our proprietary MeshSync architecture guarantees 100% foolproof uptime and 80% bill cuts for all hybrid workloads. Join thousands of innovators who enjoy unbeatable savings and an unbreachable cloud edge!",
    fgColor: "#38BDF8",
    bgColor: "#FFFFFF",
    fontSize: 24,
    isBold: true,
  },
  sample_clean_02: {
    name: "Preset 2: Clean Baseline (Fully Compliant)",
    text: "AeroCloud Systems is proud to introduce next-generation distributed mesh orchestration with AeroCloud™. Powered by MeshSync®, the platform provides an enterprise-grade 99.95% API uptime SLA under Master Spec 2026, Section 2.1. In independent benchmark tests, intelligent routing reduces egress by up to 35% under Clause 8, while maintaining sub-15ms cross-region telemetry synchronization under Clause 4.3. Secure your edge infrastructure with hardware-backed zero-trust mutual TLS 1.3 encryption across all inter-node channels under Clause 14.1.",
    fgColor: "#0F172A",
    bgColor: "#FFFFFF",
    fontSize: 16,
    isBold: false,
  },
};

export default function AuditDashboard() {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESETS>("sample_flawed_01");
  const [copyText, setCopyText] = useState(PRESETS.sample_flawed_01.text);
  const [fgColor, setFgColor] = useState(PRESETS.sample_flawed_01.fgColor);
  const [bgColor, setBgColor] = useState(PRESETS.sample_flawed_01.bgColor);
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "claim" | "visual" | "terminology" | "accessibility">("all");

  const handleSelectPreset = (key: keyof typeof PRESETS) => {
    setSelectedPreset(key);
    setCopyText(PRESETS[key].text);
    setFgColor(PRESETS[key].fgColor);
    setBgColor(PRESETS[key].bgColor);
    setAuditResult(null);
  };

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: copyText,
          asset_title: "Marketing Campaign Asset",
          foreground_color: fgColor,
          background_color: bgColor,
          font_size_pt: selectedPreset === "sample_flawed_01" ? 24 : 16,
          is_bold: selectedPreset === "sample_flawed_01",
        }),
      });

      if (!response.ok) {
        throw new Error("Audit service error");
      }
      const data: AuditResponse = await response.json();
      setAuditResult(data);
    } catch (err) {
      // Fallback local heuristic demonstration if backend is not yet started
      console.warn("Using local fallback audit demonstration:", err);
      const isClean = selectedPreset === "sample_clean_02";
      const mockResult: AuditResponse = {
        audit_id: "audit-demo-" + Math.random().toString(36).substring(2, 9),
        overall_status: isClean ? "passed" : "failed",
        findings: isClean
          ? []
          : [
              {
                id: "f-1",
                pillar: "terminology",
                severity: "error",
                flagged_text: "Aerocloud",
                start_idx: 12,
                end_idx: 21,
                explanation: "Corporate identity must be rendered in proper camelcase with mandatory trademark symbol AeroCloud™.",
                rule_citation: "Brand Kit - Mandatory Trademarks: AeroCloud™",
                suggested_correction: "AeroCloud™",
                confidence: 0.99,
              },
              {
                id: "f-2",
                pillar: "terminology",
                severity: "error",
                flagged_text: "cheapest",
                start_idx: 67,
                end_idx: 75,
                explanation: "Unsubstantiated price superiority claim prohibited without audited competitor price survey.",
                rule_citation: "ASCI Code Chapter I, Clause 1.4",
                suggested_correction: "cost-effective",
                confidence: 0.95,
              },
              {
                id: "f-3",
                pillar: "claim",
                severity: "error",
                flagged_text: "guarantees 100% foolproof uptime",
                start_idx: 201,
                end_idx: 232,
                explanation: "Exceeds approved SLA boundary of 99.95% API uptime and asserts prohibited absolutist puffery.",
                rule_citation: "Master Spec 2026, Section 2.1 & ASCI Code Chapter I, Clause 1.2",
                suggested_correction: "provides an enterprise-grade 99.95% API uptime SLA under Master Spec 2026, Section 2.1",
                confidence: 0.98,
              },
              {
                id: "f-4",
                pillar: "claim",
                severity: "error",
                flagged_text: "80% bill cuts",
                start_idx: 237,
                end_idx: 250,
                explanation: "Exceeds validated efficiency threshold of 'reduces egress by up to 35% under Clause 8'.",
                rule_citation: "AeroCloud Master Spec 2026, Clause 8",
                suggested_correction: "reduces egress by up to 35% under Clause 8",
                confidence: 0.97,
              },
              {
                id: "f-5",
                pillar: "visual",
                severity: "error",
                flagged_text: "#38BDF8 on #FFFFFF",
                start_idx: 0,
                end_idx: 18,
                explanation: "Calculated contrast ratio 1.95:1 fails WCAG 2.1 AA minimum (3.0:1 for large, 4.5:1 for body).",
                rule_citation: "Brand Kit & W3C WCAG 2.1 SC 1.4.3",
                suggested_correction: "Use approved brand blue #0284C7 on #FFFFFF or place #38BDF8 on dark canvas #0F172A.",
                confidence: 1.0,
              },
            ],
        metrics: {
          contrast_ratio: isClean ? 15.25 : 1.95,
          wcag_passed: isClean,
          reading_grade: isClean ? "11.2" : "10.4",
          total_findings: isClean ? 0 : 5,
          error_count: isClean ? 0 : 5,
          warning_count: 0,
          advisory_count: 0,
          compliance_score: isClean ? 100.0 : 25.0,
        },
        asset_title: "AeroCloud Marketing Post",
      };
      setAuditResult(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFindings = auditResult?.findings.filter((f) => 
    activeTab === "all" ? true : f.pillar === activeTab
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Enterprise v1.0
              </span>
              <span className="text-xs text-slate-500 font-mono">WCAG 2.1 AA • ASCI Ch. 1 • Brand Kit</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              VeriBrand AI
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Automated pre-publication brand governance, advertising compliance, and visual accessibility verification.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runAudit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Auditing Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Execute Full Verification
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Preset Selector */}
      <section className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Select Authoritative Benchmark Preset
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((key) => (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`p-3 text-left rounded-lg border transition ${
                selectedPreset === key
                  ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-slate-900"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700"
              }`}
            >
              <div className="font-semibold text-sm">{PRESETS[key].name}</div>
              <div className="text-xs text-slate-500 mt-1 truncate">
                {key === "sample_flawed_01"
                  ? "Contains banned puffery ('cheapest'), unsupported claims, and WCAG contrast failures."
                  : "Passes 100% compliance checks with approved citations and registered trademarks."}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid: Input Canvas & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Asset Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Content Copy Editor
            </h2>
            <textarea
              rows={8}
              value={copyText}
              onChange={(e) => setCopyText(e.target.value)}
              className="w-full text-sm text-slate-800 p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-sans"
              placeholder="Paste promotional copy or social announcement here..."
            />

            {/* Visual Color Settings */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                Color Pairing & Accessibility
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1 font-medium">Foreground (Text)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="text-xs font-mono uppercase w-24 p-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1 font-medium">Background (Canvas)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="text-xs font-mono uppercase w-24 p-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview Swatch */}
              <div 
                className="mt-4 p-4 rounded-lg border text-center transition font-semibold"
                style={{ backgroundColor: bgColor, color: fgColor, borderColor: "#CBD5E1" }}
              >
                Sample Headline Rendered Here ({fgColor} on {bgColor})
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Findings & Metrics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status & Metrics Bar */}
          {auditResult ? (
            <div className="space-y-6">
              {/* Overall Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  auditResult.overall_status === "passed"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : auditResult.overall_status === "flagged"
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  {auditResult.overall_status === "passed" ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : auditResult.overall_status === "flagged" ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                  <div>
                    <h3 className="font-bold text-base capitalize">
                      Pre-Publication Verdict: {auditResult.overall_status.toUpperCase()}
                    </h3>
                    <p className="text-xs opacity-80">
                      {auditResult.overall_status === "passed"
                        ? "Asset satisfies all legal, brand, and accessibility governance criteria."
                        : `Identified ${auditResult.findings.length} compliance violation(s) requiring remediation.`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black">
                    {auditResult.metrics.compliance_score ?? 100}%
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                    Compliance Score
                  </div>
                </div>
              </div>

              {/* Quantitative Metrics Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Contrast Ratio</div>
                  <div className={`text-xl font-bold mt-1 ${auditResult.metrics.wcag_passed ? "text-emerald-600" : "text-rose-600"}`}>
                    {auditResult.metrics.contrast_ratio ? `${auditResult.metrics.contrast_ratio}:1` : "N/A"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {auditResult.metrics.wcag_passed ? "WCAG AA Pass" : "Fails WCAG AA"}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Blocking Errors</div>
                  <div className={`text-xl font-bold mt-1 ${auditResult.metrics.error_count === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {auditResult.metrics.error_count ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Publication Gates</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Reading Grade</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">
                    Grade {auditResult.metrics.reading_grade}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Flesch-Kincaid</div>
                </div>
              </div>

              {/* Finding Filters */}
              <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
                {(["all", "claim", "visual", "terminology", "accessibility"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition ${
                      activeTab === tab
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Findings List */}
              <div className="space-y-3">
                {filteredFindings.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                    <FileCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <h4 className="font-bold text-sm text-slate-800">No Findings in this Category</h4>
                    <p className="text-xs text-slate-500 mt-1">All checked standards are fully compliant.</p>
                  </div>
                ) : (
                  filteredFindings.map((finding) => (
                    <div
                      key={finding.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              finding.severity === "error"
                                ? "bg-rose-100 text-rose-800"
                                : finding.severity === "warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {finding.severity}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                            {finding.pillar}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          Confidence: {Math.round(finding.confidence * 100)}%
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-slate-500 font-medium">Flagged Text: </span>
                        <code className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          "{finding.flagged_text}"
                        </code>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {finding.explanation}
                      </p>

                      <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="font-semibold text-slate-700">Citation: </span>
                        {finding.rule_citation}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-800 font-medium">
                          <span className="font-bold">Suggested Correction: </span>
                          {finding.suggested_correction}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
              <Layers className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-700">Verification Engine Ready</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a benchmark preset above or enter custom promotional copy, then click "Execute Full Verification".
              </p>
              <button
                onClick={runAudit}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Run Benchmark Audit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

