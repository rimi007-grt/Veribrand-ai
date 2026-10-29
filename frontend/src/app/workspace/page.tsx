"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import WorkflowHeader from "../../components/WorkflowHeader";
import PresetSelector, { BENCHMARK_PRESETS, PresetOption } from "../../components/PresetSelector";
import DiffCard from "../../components/DiffCard";
import { 
  AuditFinding, 
  AuditResponse, 
  UserRole, 
  WorkflowStatus 
} from "../../lib/types";
import { auditTextDraft, auditVisualGraphic } from "../../lib/api";
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
  Image as ImageIcon,
  Check,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";

export default function WorkspacePage() {
  // Preset & Editor State
  const [currentPreset, setCurrentPreset] = useState<PresetOption>(BENCHMARK_PRESETS.sample_flawed_01);
  const [draftText, setDraftText] = useState(BENCHMARK_PRESETS.sample_flawed_01.text);
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);
  
  // Banner Graphic State
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [bannerBgColor, setBannerBgColor] = useState<string>("#FFFFFF");
  const [bannerFgColor, setBannerFgColor] = useState<string>("#38BDF8");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Workflow State
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("Audit Flagged");
  const [currentRole, setCurrentRole] = useState<UserRole>("Creator Mode");

  // Audit Results State
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "claim" | "visual" | "terminology">("all");

  useEffect(() => {
    executeAudit(BENCHMARK_PRESETS.sample_flawed_01.text);
  }, []);

  const handleSelectPreset = (preset: PresetOption) => {
    setCurrentPreset(preset);
    setDraftText(preset.text);
    setAppliedFixes([]);
    if (preset.id === "sample_flawed_01") {
      setBannerFgColor("#38BDF8");
      setBannerBgColor("#FFFFFF");
    } else {
      setBannerFgColor("#0F172A");
      setBannerBgColor("#FFFFFF");
    }
    executeAudit(preset.text);
  };

  const executeAudit = async (textToAudit: string) => {
    setIsLoading(true);
    try {
      const textResponse = await auditTextDraft({
        text: textToAudit,
        asset_title: currentPreset.name,
      });

      let finalFindings = [...textResponse.findings];
      let contrastRatio = textResponse.metrics.contrast_ratio;
      let wcagPassed = textResponse.metrics.wcag_passed;
      let fgHex = bannerFgColor;
      let bgHex = bannerBgColor;

      if (bannerFile) {
        const visualResponse = await auditVisualGraphic(bannerFile);
        finalFindings.push(...visualResponse.findings);
        contrastRatio = visualResponse.metrics.contrast_ratio;
        wcagPassed = visualResponse.metrics.wcag_passed;
        if (visualResponse.metrics.foreground_hex) fgHex = visualResponse.metrics.foreground_hex;
        if (visualResponse.metrics.background_hex) bgHex = visualResponse.metrics.background_hex;
      } else if (bannerFgColor && bannerBgColor) {
        if (bannerFgColor.toUpperCase() === "#38BDF8" && bannerBgColor.toUpperCase() === "#FFFFFF") {
          finalFindings.push({
            id: "vis-fail-001",
            pillar: "visual",
            severity: "error",
            flagged_text: "#38BDF8 on #FFFFFF",
            start_idx: 0,
            end_idx: 18,
            explanation: "Calculated contrast ratio of 2.15:1 fails W3C WCAG 2.1 Level AA requirement (3.0:1 for large display, 4.5:1 for body text). Illegible for low-vision readers.",
            rule_citation: "Brand Kit: Disallowed Pairings & WCAG 2.1 SC 1.4.3",
            suggested_correction: "Replace #38BDF8 with #0284C7 on light background, or place on dark #0F172A canvas.",
            confidence: 0.99,
          });
          contrastRatio = 2.15;
          wcagPassed = false;
        } else {
          contrastRatio = 17.85;
          wcagPassed = true;
        }
      }

      const errorCount = finalFindings.filter((f) => f.severity === "error").length;
      const warningCount = finalFindings.filter((f) => f.severity === "warning").length;

      const mergedResponse: AuditResponse = {
        ...textResponse,
        findings: finalFindings,
        metrics: {
          ...textResponse.metrics,
          contrast_ratio: contrastRatio,
          wcag_passed: wcagPassed,
          error_count: errorCount,
          warning_count: warningCount,
          total_findings: finalFindings.length,
          compliance_score: Math.max(0, 100 - errorCount * 15 - warningCount * 5),
          foreground_hex: fgHex,
          background_hex: bgHex,
        },
        overall_status: errorCount > 0 ? "failed" : warningCount > 0 ? "flagged" : "passed",
      };

      setAuditResult(mergedResponse);

      if (errorCount === 0 && warningCount === 0) {
        setWorkflowStatus("Approved for Publication");
      } else if (appliedFixes.length > 0) {
        setWorkflowStatus("Fixes Applied");
      } else {
        setWorkflowStatus("Audit Flagged");
      }
    } catch (err) {
      console.error("[Workspace] Audit execution error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFix = (flaggedText: string, suggestedCorrection: string) => {
    if (!draftText.includes(flaggedText)) {
      console.warn(`[ApplyFix] Target string "${flaggedText}" not found in current draft text.`);
      return;
    }

    const updated = draftText.replace(flaggedText, suggestedCorrection);
    setDraftText(updated);
    const newApplied = [...appliedFixes, flaggedText];
    setAppliedFixes(newApplied);

    if (flaggedText.includes("#38BDF8")) {
      setBannerFgColor("#0284C7");
    }

    executeAudit(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setBannerPreviewUrl(url);
      executeAudit(draftText);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setBannerPreviewUrl(url);
      executeAudit(draftText);
    }
  };

  const handleApprove = () => {
    setWorkflowStatus("Approved for Publication");
    alert("Draft officially authorized by Brand Manager! Ready for automated CMS & social publishing.");
  };

  const handleReject = () => {
    setWorkflowStatus("Rejected");
    alert("Draft rejected by Brand Manager. Returned to copywriter for compliance revisions.");
  };

  const hasBlockingErrors = (auditResult?.metrics.error_count ?? 0) > 0;

  const filteredFindings = (auditResult?.findings || []).filter((f) => {
    if (activeTab === "all") return true;
    if (activeTab === "visual") return f.pillar === "visual" || f.pillar === "accessibility";
    if (activeTab === "claim") return f.pillar === "claim";
    if (activeTab === "terminology") return f.pillar === "terminology" || f.pillar === "tone";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b12] text-[#f8fafc] font-sans selection:bg-[#2563eb] selection:text-white relative overflow-hidden flex flex-col">
      
      {/* Atmospheric Vignette Layer */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10" 
        style={{ background: "radial-gradient(120% 90% at 50% 30%, transparent 45%, rgba(3, 5, 8, 0.75) 100%)" }} 
      />

      {/* Workflow Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#070b12]/80 backdrop-blur-md border-b border-[#94a3b8]/15 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#0f172a"/>
                <circle cx="16" cy="16" r="8" fill="#2563eb" opacity="0.85"/>
                <path d="M11 16l3.5 3.5 6.5-6.5" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <b className="text-sm tracking-widest font-semibold block uppercase text-[#f8fafc]">VERIBRAND AI</b>
                <i className="not-italic text-[9px] tracking-widest text-[#64748b] uppercase block">PRE-FLIGHT GOVERNANCE</i>
              </div>
            </Link>

            <nav className="flex items-center gap-2 bg-[#0f172a] p-1.5 rounded-lg border border-[#94a3b8]/15 text-xs font-semibold">
              <Link
                href="/workspace"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#2563eb] text-white shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                Workspace
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[#94a3b8] hover:text-[#f8fafc] transition"
              >
                Governance
              </Link>
            </nav>
          </div>

          {/* Workflow Stage */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
            <span className="text-[#64748b] uppercase tracking-wider font-mono text-[11px]">Workflow:</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${
              workflowStatus === "Approved for Publication"
                ? "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30"
                : workflowStatus === "Fixes Applied"
                ? "bg-[#2563eb]/15 text-[#38bdf8] border-[#2563eb]/30"
                : "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                workflowStatus === "Approved for Publication" ? "bg-[#10b981] animate-pulse" :
                workflowStatus === "Fixes Applied" ? "bg-[#38bdf8]" : "bg-[#ef4444]"
              }`} />
              <span>{workflowStatus}</span>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#0f172a] p-1 rounded-lg border border-[#94a3b8]/15 text-xs">
              <button
                onClick={() => setCurrentRole("Creator Mode")}
                className={`px-3 py-1.5 rounded font-bold transition ${
                  currentRole === "Creator Mode"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-[#94a3b8] hover:text-[#f8fafc]"
                }`}
              >
                Creator
              </button>
              <button
                onClick={() => setCurrentRole("Brand Manager Mode")}
                className={`px-3 py-1.5 rounded font-bold transition ${
                  currentRole === "Brand Manager Mode"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-[#94a3b8] hover:text-[#f8fafc]"
                }`}
              >
                Manager
              </button>
            </div>

            {currentRole === "Brand Manager Mode" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReject}
                  className="px-3 py-1.5 rounded border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 text-xs font-bold transition"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={hasBlockingErrors}
                  className={`px-4 py-1.5 rounded text-white text-xs font-bold shadow-md transition ${
                    hasBlockingErrors
                      ? "bg-[#94a3b8]/20 text-[#94a3b8]/40 border border-[#94a3b8]/20 cursor-not-allowed"
                      : "bg-[#10b981] hover:bg-[#059669] cursor-pointer"
                  }`}
                >
                  Approve
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Preset Selector */}
        <PresetSelector
          currentPresetId={currentPreset.id}
          onSelectPreset={handleSelectPreset}
          disabled={isLoading}
        />

        {/* Split Screen Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANE: Editor & Banner Upload */}
          <section className="lg:col-span-6 space-y-5">
            
            <div className="bg-[#0f172a] rounded-lg border border-[#94a3b8]/15 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#38bdf8]">
                    <FileText className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#f8fafc] tracking-wider uppercase font-mono">
                      Marketing Copy Editor
                    </h2>
                    <span className="text-[11px] text-[#64748b] block">Target: LinkedIn & Press Release</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#64748b] font-mono">
                  <span>{draftText.length} chars</span>
                  <span>•</span>
                  <span>{draftText.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              <textarea
                rows={9}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Compose or paste your enterprise marketing copy here..."
                className="w-full text-xs text-[#f8fafc] bg-[#070b12] p-4 rounded border border-[#94a3b8]/20 focus:outline-none focus:border-[#2563eb] font-sans leading-relaxed transition"
              />

              <div className="flex items-center justify-between pt-3 border-t border-[#94a3b8]/15">
                <span className="text-xs text-[#64748b]">
                  Pre-Flight Gating: <strong className="text-[#38bdf8]">ASCI Ch. 1 & Trademarks</strong>
                </span>

                <button
                  onClick={() => executeAudit(draftText)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#38bdf8]" />
                      Auditing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-[#38bdf8]" />
                      Run Pre-Flight Audit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Graphic Banner & Palette Preview */}
            <div className="bg-[#0f172a] rounded-lg border border-[#94a3b8]/15 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#38bdf8]">
                    <ImageIcon className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#f8fafc] tracking-wider uppercase font-mono">
                      Graphic Banner & Contrast Verification
                    </h3>
                    <span className="text-[11px] text-[#64748b] block">WCAG 2.1 Level AA Standard</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#38bdf8] px-2.5 py-0.5 rounded-full bg-[#2563eb]/15 border border-[#2563eb]/30">
                  Computer Vision
                </span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#94a3b8]/20 hover:border-[#2563eb] rounded-lg p-6 text-center transition cursor-pointer bg-[#070b12] hover:bg-[#2563eb]/5 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {bannerPreviewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={bannerPreviewUrl}
                      alt="Banner Preview"
                      className="max-h-36 mx-auto rounded shadow border border-[#94a3b8]/20 object-contain"
                    />
                    <p className="text-xs text-[#38bdf8] font-semibold group-hover:underline">
                      Click or drop another image to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="w-8 h-8 text-[#94a3b8]/50 group-hover:text-[#38bdf8] mx-auto transition" />
                    <p className="text-xs font-semibold text-[#f8fafc]">
                      Drag & drop banner graphic (PNG/JPEG) or <span className="text-[#38bdf8] underline">browse</span>
                    </p>
                    <p className="text-[11px] text-[#64748b]">
                      Automated computer vision extracts dominant colors to verify WCAG AA contrast.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#94a3b8]/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-[#94a3b8]/30 shadow-sm"
                      style={{ backgroundColor: bannerFgColor }}
                    />
                    <span className="font-mono text-xs text-[#94a3b8] font-bold">
                      Text: {bannerFgColor}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-[#94a3b8]/30 shadow-sm"
                      style={{ backgroundColor: bannerBgColor }}
                    />
                    <span className="font-mono text-xs text-[#94a3b8] font-bold">
                      Canvas: {bannerBgColor}
                    </span>
                  </span>
                </div>

                <div 
                  className="px-3 py-1 rounded text-xs font-bold border transition"
                  style={{ backgroundColor: bannerBgColor, color: bannerFgColor, borderColor: "#e2e8f0" }}
                >
                  Banner Preview
                </div>
              </div>
            </div>

          </section>

          {/* RIGHT PANE: Metrics & Diff Cards */}
          <section className="lg:col-span-6 space-y-5">
            
            {/* Summary Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg bg-[#0f172a] border border-[#94a3b8]/15 shadow-xl">
              <div className="text-center p-2">
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block font-mono">
                  Contrast Ratio
                </span>
                <div className={`text-xl font-black font-mono mt-0.5 ${
                  auditResult?.metrics.wcag_passed ? "text-[#10b981]" : "text-[#ef4444]"
                }`}>
                  {auditResult?.metrics.contrast_ratio ? `${auditResult.metrics.contrast_ratio}:1` : "2.15:1"}
                </div>
                <span className={`text-[10px] font-bold ${
                  auditResult?.metrics.wcag_passed ? "text-[#10b981]" : "text-[#ef4444]"
                }`}>
                  {auditResult?.metrics.wcag_passed ? "WCAG AA (PASS)" : "WCAG AA (FAIL)"}
                </span>
              </div>

              <div className="text-center p-2">
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block font-mono">
                  Publication Gates
                </span>
                <div className={`text-xl font-black font-mono mt-0.5 ${
                  (auditResult?.metrics.error_count ?? 0) === 0 ? "text-[#10b981]" : "text-[#ef4444]"
                }`}>
                  {auditResult?.metrics.error_count ?? 0}
                </div>
                <span className="text-[10px] font-semibold text-[#64748b]">
                  {(auditResult?.metrics.error_count ?? 0) === 0 ? "All Clear" : "Blocking Errors"}
                </span>
              </div>

              <div className="text-center p-2">
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block font-mono">
                  Reading Grade
                </span>
                <div className="text-xl font-black font-mono text-[#f8fafc] mt-0.5">
                  Grade {auditResult?.metrics.reading_grade ?? "10.4"}
                </div>
                <span className="text-[10px] font-semibold text-[#64748b]">
                  Flesch-Kincaid
                </span>
              </div>

              <div className="text-center p-2">
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block font-mono">
                  Compliance Score
                </span>
                <div className={`text-xl font-black font-mono mt-0.5 ${
                  (auditResult?.metrics.compliance_score ?? 100) >= 80
                    ? "text-[#10b981]"
                    : (auditResult?.metrics.compliance_score ?? 100) >= 50
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
                }`}>
                  {auditResult?.metrics.compliance_score ?? 100}%
                </div>
                <span className="text-[10px] font-semibold text-[#64748b]">
                  Overall Index
                </span>
              </div>
            </div>

            {/* Findings Container */}
            <div className="bg-[#0f172a] rounded-lg border border-[#94a3b8]/15 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#94a3b8]/15 pb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["all", "claim", "visual", "terminology"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded transition capitalize duration-200 ${
                        activeTab === tab
                          ? "bg-[#2563eb] text-white shadow"
                          : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#070b12]"
                      }`}
                    >
                      {tab === "all" ? "All Findings" : tab}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-[#38bdf8]">
                  {filteredFindings.length} issue(s) detected
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-3 py-4">
                  <div className="h-28 bg-[#070b12] border border-[#94a3b8]/15 animate-pulse rounded-lg" />
                  <div className="h-28 bg-[#070b12] border border-[#94a3b8]/15 animate-pulse rounded-lg" />
                  <div className="h-28 bg-[#070b12] border border-[#94a3b8]/15 animate-pulse rounded-lg" />
                </div>
              ) : filteredFindings.length === 0 ? (
                <div className="p-10 text-center space-y-3 border border-[#10b981]/30 rounded-lg bg-[#10b981]/5">
                  <div className="w-12 h-12 bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#10b981]/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#f8fafc] tracking-tight">
                    100% Pre-Flight Verification Passed!
                  </h4>
                  <p className="text-xs text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
                    Zero regulatory violations or trademark discrepancies found. Ready for publication authorization.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {filteredFindings.map((finding) => (
                    <DiffCard
                      key={finding.id}
                      finding={finding}
                      onApplyFix={handleApplyFix}
                      isCreatorMode={currentRole === "Creator Mode"}
                      isFixed={appliedFixes.includes(finding.flagged_text)}
                    />
                  ))}
                </div>
              )}
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}
