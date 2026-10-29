"use client";

import React, { useState } from "react";
import { 
  Check, 
  Wand2, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Zap
} from "lucide-react";
import { AuditFinding } from "../lib/types";

interface DiffCardProps {
  finding: AuditFinding;
  onApplyFix: (flaggedText: string, suggestedCorrection: string) => void;
  isCreatorMode: boolean;
  isFixed?: boolean;
}

export default function DiffCard({
  finding,
  onApplyFix,
  isCreatorMode,
  isFixed = false,
}: DiffCardProps) {
  const [justFixed, setJustFixed] = useState(isFixed);

  const handleApply = () => {
    onApplyFix(finding.flagged_text, finding.suggested_correction);
    setJustFixed(true);
  };

  const getSeverityBadge = () => {
    switch (finding.severity) {
      case "error":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/60 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Blocking Error
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-950/60 text-blue-300 border border-blue-500/30">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            Advisory
          </span>
        );
    }
  };

  const getPillarBadge = () => {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E5E4E2]/5 text-[#E6E0F0] border border-[#E5E4E2]/15 capitalize">
        {finding.pillar}
      </span>
    );
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
        justFixed
          ? "bg-[#0D0907]/60 border-emerald-500/40 opacity-75"
          : finding.severity === "error"
          ? "bg-[#0D0907]/80 border-[#E5E4E2]/10 hover:border-[#6F4E37]/60 hover:shadow-lg hover:shadow-[#6F4E37]/10"
          : "bg-[#0D0907]/80 border-[#E5E4E2]/10 hover:border-amber-500/40 hover:shadow-lg"
      }`}
    >
      {/* Top Metadata Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {getSeverityBadge()}
          {getPillarBadge()}
          <span className="text-xs font-mono text-[#E5E4E2]/40">
            Confidence: {Math.round(finding.confidence * 100)}%
          </span>
        </div>

        {/* Citation Chip */}
        <div
          title={finding.rule_citation}
          className="inline-flex items-center gap-1 text-xs font-mono text-[#E6E0F0] bg-[#6F4E37]/15 px-2.5 py-1 rounded-lg border border-[#6F4E37]/30 truncate max-w-[220px]"
        >
          <span className="truncate">[{finding.rule_citation}]</span>
        </div>
      </div>

      {/* Visual In-Place Diff View */}
      <div className="bg-[#0D0907] rounded-xl p-3.5 border border-[#E5E4E2]/10 mb-3 space-y-2 font-mono text-xs">
        {/* Flagged Red Strikethrough */}
        <div className="flex items-start gap-2">
          <span className="text-rose-400 font-bold select-none shrink-0">-</span>
          <span className="line-through bg-rose-950/70 text-rose-300 border border-rose-900/50 px-2 py-0.5 rounded font-semibold break-all">
            "{finding.flagged_text}"
          </span>
        </div>

        {/* Suggested Green Replacement */}
        <div className="flex items-start gap-2">
          <span className="text-emerald-400 font-bold select-none shrink-0">+</span>
          <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-900/50 px-2 py-0.5 rounded font-semibold break-all">
            "{finding.suggested_correction}"
          </span>
        </div>
      </div>

      {/* Legal & Brand Rationale */}
      <p className="text-xs text-[#E5E4E2]/70 leading-relaxed mb-4">
        {finding.explanation}
      </p>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E5E4E2]/10 text-xs">
        <span className="font-mono text-[#E5E4E2]/40 text-xs">
          Offset: [{finding.start_idx}:{finding.end_idx}]
        </span>

        {justFixed ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3.5 py-1.5 rounded-lg border border-emerald-500/30">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Fix Applied to Draft
          </span>
        ) : isCreatorMode ? (
          <button
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#6F4E37] to-[#8D6246] hover:from-[#7C573D] hover:to-[#9F6F50] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md shadow-[#6F4E37]/30 transition duration-200 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#E6E0F0]" />
            Apply Fix
          </button>
        ) : (
          <span className="text-xs text-[#E5E4E2]/40 italic">
            Switch to Creator Mode to apply fixes
          </span>
        )}
      </div>
    </div>
  );
}
