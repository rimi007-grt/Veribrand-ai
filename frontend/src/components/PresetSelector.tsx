"use client";

import React from "react";
import { Sparkles, AlertTriangle, CheckCircle2, ChevronDown, Compass } from "lucide-react";

export interface PresetOption {
  id: "sample_flawed_01" | "sample_clean_02";
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  text: string;
  bannerColor: string;
}

export const BENCHMARK_PRESETS: Record<string, PresetOption> = {
  sample_flawed_01: {
    id: "sample_flawed_01",
    name: "Preset 1: Flawed LinkedIn Launch Post",
    badge: "5 Blocking Errors",
    badgeColor: "bg-rose-950/60 text-rose-300 border-rose-500/30",
    description: "Contains banned ASCI puffery ('cheapest'), unbacked SLA claims (100% uptime, 80% cuts), and missing trademarks.",
    text: "Introducing Aerocloud's newest cloud mesh solution! It is simply the cheapest enterprise platform in the market today, delivering revolutionary distributed computing with zero friction. Our proprietary MeshSync architecture guarantees 100% foolproof uptime and 80% bill cuts for all hybrid workloads. Join thousands of innovators who enjoy unbeatable savings and an unbreachable cloud edge!",
    bannerColor: "#38BDF8",
  },
  sample_clean_02: {
    id: "sample_clean_02",
    name: "Preset 2: Clean Baseline Enterprise Post",
    badge: "100% Compliant",
    badgeColor: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
    description: "Satisfies all regulatory and brand checks with approved SLA citations, registered trademarks, and WCAG AA contrast.",
    text: "AeroCloud Systems is proud to introduce next-generation distributed mesh orchestration with AeroCloud™. Powered by MeshSync®, the platform provides an enterprise-grade 99.95% API uptime SLA under Master Spec 2026, Section 2.1. In independent benchmark tests, intelligent routing reduces egress by up to 35% under Clause 8, while maintaining sub-15ms cross-region telemetry synchronization under Clause 4.3. Secure your edge infrastructure with hardware-backed zero-trust mutual TLS 1.3 encryption across all inter-node channels under Clause 14.1.",
    bannerColor: "#0F172A",
  },
};

interface PresetSelectorProps {
  currentPresetId: string;
  onSelectPreset: (preset: PresetOption) => void;
  disabled?: boolean;
}

export default function PresetSelector({
  currentPresetId,
  onSelectPreset,
  disabled = false,
}: PresetSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0D0907]/80 border border-[#E5E4E2]/10 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6F4E37]/20 border border-[#6F4E37]/50 flex items-center justify-center text-[#E6E0F0] shadow-md shadow-[#6F4E37]/20">
          <Sparkles className="w-5 h-5 text-[#E6E0F0]" />
        </div>
        <div>
          <span className="text-xs font-black text-[#E5E4E2] tracking-wider uppercase block font-mono">
            BENCHMARK DEMO PRESETS
          </span>
          <span className="text-xs text-[#E5E4E2]/50">
            Instant authoritative datasets for live evaluation
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <select
            value={currentPresetId}
            onChange={(e) => {
              const selected = BENCHMARK_PRESETS[e.target.value];
              if (selected) {
                onSelectPreset(selected);
              }
            }}
            disabled={disabled}
            className="w-full appearance-none bg-[#0D0907] border border-[#E5E4E2]/20 text-[#E5E4E2] text-xs font-bold py-2.5 px-3.5 pr-8 rounded-xl focus:outline-none focus:border-[#6F4E37] focus:ring-1 focus:ring-[#6F4E37] transition cursor-pointer disabled:opacity-50"
          >
            <option value="sample_flawed_01">
              🚨 Preset 1: Flawed Post (5 Violations)
            </option>
            <option value="sample_clean_02">
              ✅ Preset 2: Clean Baseline (100% Pass)
            </option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#E5E4E2]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Indicator Pill */}
        {currentPresetId === "sample_flawed_01" ? (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Flawed Post
          </span>
        ) : (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            100% Compliant
          </span>
        )}
      </div>
    </div>
  );
}
