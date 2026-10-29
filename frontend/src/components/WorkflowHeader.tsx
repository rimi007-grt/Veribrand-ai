"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  Edit3, 
  BarChart3, 
  Layers,
  Zap,
  ArrowRight
} from "lucide-react";
import { UserRole, WorkflowStatus } from "../lib/types";

interface WorkflowHeaderProps {
  workflowStatus: WorkflowStatus;
  currentRole: UserRole;
  onRoleToggle: (role: UserRole) => void;
  onApprove: () => void;
  onReject: () => void;
  hasBlockingErrors: boolean;
  activePath?: string;
}

export default function WorkflowHeader({
  workflowStatus,
  currentRole,
  onRoleToggle,
  onApprove,
  onReject,
  hasBlockingErrors,
  activePath = "/workspace",
}: WorkflowHeaderProps) {
  const getStatusBadgeStyle = () => {
    switch (workflowStatus) {
      case "Approved for Publication":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20";
      case "Fixes Applied":
        return "bg-[#6F4E37]/30 text-[#E6E0F0] border-[#6F4E37]/50 shadow-sm shadow-[#6F4E37]/30";
      case "Audit Flagged":
        return "bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20";
      case "Rejected":
        return "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20";
      default:
        return "bg-[#E5E4E2]/5 text-[#E5E4E2]/80 border-[#E5E4E2]/15";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D0907]/85 backdrop-blur-md border-b border-[#E5E4E2]/10 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Main Navigation */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <Link href="/workspace" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-[#6F4E37]/20 border border-[#6F4E37]/50 flex items-center justify-center text-[#E6E0F0] group-hover:scale-105 group-hover:border-[#6F4E37] transition duration-300 shadow-lg shadow-[#6F4E37]/20">
              <Zap className="w-5 h-5 text-[#E6E0F0]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-[#E5E4E2] font-mono group-hover:text-white transition">
                VERIBRAND<span className="text-[#6F4E37] font-sans">.AI</span>
              </span>
              <span className="text-[10px] text-[#E5E4E2]/50 block tracking-widest uppercase font-semibold">
                Governance Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 bg-[#0D0907] p-1.5 rounded-xl border border-[#E5E4E2]/10 text-xs font-semibold">
            <Link
              href="/workspace"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition duration-200 ${
                activePath === "/workspace"
                  ? "bg-[#6F4E37]/30 text-[#E6E0F0] border border-[#6F4E37]/50 shadow-sm"
                  : "text-[#E5E4E2]/60 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Workspace
            </Link>
            <Link
              href="/analytics"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition duration-200 ${
                activePath === "/analytics"
                  ? "bg-[#6F4E37]/30 text-[#E6E0F0] border border-[#6F4E37]/50 shadow-sm"
                  : "text-[#E5E4E2]/60 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Risk Telemetry
            </Link>
          </nav>
        </div>

        {/* Center: Workflow Stage Progression */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#E5E4E2]/40 uppercase tracking-wider font-mono text-[11px]">Workflow:</span>
          <div className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-300 flex items-center gap-2 ${getStatusBadgeStyle()}`}>
            <span className={`w-2 h-2 rounded-full ${
              workflowStatus === "Approved for Publication" ? "bg-emerald-400 animate-pulse" :
              workflowStatus === "Fixes Applied" ? "bg-[#E6E0F0]" :
              workflowStatus === "Audit Flagged" ? "bg-amber-400" :
              workflowStatus === "Rejected" ? "bg-rose-400" : "bg-slate-400"
            }`} />
            <span>{workflowStatus}</span>
          </div>
        </div>

        {/* Right: Role Switcher & Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Role Toggle Switcher */}
          <div className="flex items-center bg-[#0D0907] p-1 rounded-xl border border-[#E5E4E2]/15 text-xs">
            <button
              onClick={() => onRoleToggle("Creator Mode")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition duration-200 ${
                currentRole === "Creator Mode"
                  ? "bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/40"
                  : "text-[#E5E4E2]/50 hover:text-[#E5E4E2]"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Creator
            </button>
            <button
              onClick={() => onRoleToggle("Brand Manager Mode")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition duration-200 ${
                currentRole === "Brand Manager Mode"
                  ? "bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/40"
                  : "text-[#E5E4E2]/50 hover:text-[#E5E4E2]"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Manager
            </button>
          </div>

          {/* Brand Manager Publication Controls */}
          {currentRole === "Brand Manager Mode" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onReject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-950/40 text-xs font-bold transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                onClick={onApprove}
                disabled={hasBlockingErrors}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-md transition ${
                  hasBlockingErrors
                    ? "bg-[#E5E4E2]/10 text-[#E5E4E2]/30 border border-[#E5E4E2]/10 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-900/30 active:scale-95 cursor-pointer"
                }`}
                title={hasBlockingErrors ? "Resolve all blocking errors before authorizing publication" : "Authorize asset for immediate publication"}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve Publication
              </button>
            </div>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#E6E0F0] bg-[#6F4E37]/20 border border-[#6F4E37]/40 px-3 py-1.5 rounded-lg">
              <span>⚡</span> 1-Click Fix Active
            </span>
          )}

        </div>
      </div>
    </header>
  );
}
