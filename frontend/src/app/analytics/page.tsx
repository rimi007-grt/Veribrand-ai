"use client";

import React, { useState } from "react";
import WorkflowHeader from "../../components/WorkflowHeader";
import { UserRole, WorkflowStatus } from "../../lib/types";
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  FileCheck2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap
} from "lucide-react";

export default function AnalyticsPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("Brand Manager Mode");
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("Approved for Publication");

  // Top Recurring Violations
  const recurringViolations = [
    {
      category: "ASCI Puffery (Clause 1.4)",
      count: 142,
      percentage: 42,
      trend: "+4.2%",
      color: "bg-gradient-to-r from-rose-500 to-rose-700",
      description: "Superlative price superiority claims ('cheapest', 'unbeatable') without audited market surveys.",
    },
    {
      category: "Unbacked SLA Claims (Clause 2.1)",
      count: 128,
      percentage: 38,
      trend: "-2.1%",
      color: "bg-gradient-to-r from-[#6F4E37] to-[#8D6246]",
      description: "Claims asserting '100% uptime' or exceeding the approved 99.95% API SLA boundary.",
    },
    {
      category: "Missing TM Symbols (AeroCloud™)",
      count: 41,
      percentage: 12,
      trend: "-8.5%",
      color: "bg-gradient-to-r from-[#E6E0F0] to-[#B3A0D0]",
      description: "Missing mandatory ™ or ® mark on first commercial reference and product names.",
    },
    {
      category: "WCAG Contrast Failures (AA)",
      count: 27,
      percentage: 8,
      trend: "+1.0%",
      color: "bg-gradient-to-r from-purple-500 to-purple-700",
      description: "Light cyan (#38BDF8) placed over pure white (#FFFFFF), failing the 3.0:1 / 4.5:1 ratio.",
    },
  ];

  // Departmental Risk Matrix
  const departmentalRisk = [
    {
      department: "External Creative Agencies",
      auditsRun: 184,
      passRate: "58.4%",
      riskIndex: "High Risk (7.8 / 10)",
      riskColor: "text-rose-300 bg-rose-950/60 border-rose-500/40",
      primaryIssue: "ASCI Puffery & Exaggerated Cost Claims",
      slaCompliance: "62%",
    },
    {
      department: "Growth & Product Marketing",
      auditsRun: 326,
      passRate: "81.2%",
      riskIndex: "Moderate Risk (4.3 / 10)",
      riskColor: "text-amber-300 bg-amber-950/60 border-amber-500/40",
      primaryIssue: "Missing TM Symbols (MeshSync®)",
      slaCompliance: "88%",
    },
    {
      department: "Internal Enterprise Copywriters",
      auditsRun: 412,
      passRate: "94.6%",
      riskIndex: "Low Risk (1.4 / 10)",
      riskColor: "text-emerald-300 bg-emerald-950/60 border-emerald-500/40",
      primaryIssue: "Occasional WCAG Graphic Contrast",
      slaCompliance: "99%",
    },
    {
      department: "Developer Relations & Technical Docs",
      auditsRun: 298,
      passRate: "98.1%",
      riskIndex: "Low Risk (0.8 / 10)",
      riskColor: "text-emerald-300 bg-emerald-950/60 border-emerald-500/40",
      primaryIssue: "None (Exemplary Citation Rigor)",
      slaCompliance: "100%",
    },
  ];

  // Recent Verification Audit Logs
  const auditLogs = [
    {
      id: "LOG-9281",
      asset: "Q4 Kubernetes Mesh Acceleration Launch Post",
      author: "Apex Digital Agency",
      channel: "LinkedIn & X",
      status: "Flagged (3 Violations)",
      score: "65%",
      timestamp: "12 mins ago",
    },
    {
      id: "LOG-9280",
      asset: "Clause 14.1 Zero-Trust Architecture Brief",
      author: "DevOps Content Guild",
      channel: "Developer Portal",
      status: "Passed (100% Compliant)",
      score: "100%",
      timestamp: "45 mins ago",
    },
    {
      id: "LOG-9279",
      asset: "Enterprise Cloud Transit Benchmark Report",
      author: "Product Strategy Lead",
      channel: "Press Release",
      status: "Passed (100% Compliant)",
      score: "100%",
      timestamp: "2 hours ago",
    },
    {
      id: "LOG-9278",
      asset: "Hybrid Mesh Flash Sale Banner",
      author: "Growth Marketing",
      channel: "Display Ads",
      status: "Rejected by Brand Manager",
      score: "40%",
      timestamp: "5 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0907] text-[#E5E4E2] font-sans selection:bg-[#6F4E37]/40 selection:text-[#E6E0F0] relative overflow-hidden flex flex-col">
      
      {/* Dynamic Background Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#6F4E37]/25 via-[#E6E0F0]/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[#6F4E37]/15 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#6F4E37]/10 blur-[150px] pointer-events-none -z-10 rounded-full" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
        style={{ backgroundImage: `radial-gradient(#E5E4E2 1px, transparent 1px)`, backgroundSize: '32px 32px' }} 
      />

      <WorkflowHeader
        workflowStatus={workflowStatus}
        currentRole={currentRole}
        onRoleToggle={(role) => setCurrentRole(role)}
        onApprove={() => alert("Approved")}
        onReject={() => alert("Rejected")}
        hasBlockingErrors={false}
        activePath="/analytics"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#6F4E37]/20 border border-[#6F4E37]/40 text-[#E6E0F0] text-xs font-semibold tracking-wider uppercase backdrop-blur-md mb-2">
              <Zap className="w-3.5 h-3.5 text-[#E6E0F0]" />
              <span>Brand Assurance & Legal Governance</span>
              <span className="text-[#E5E4E2]/40">•</span>
              <span>Telemetry Q4 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#E5E4E2] tracking-tight">
              Enterprise Compliance Analytics & Risk Index
            </h1>
            <p className="text-xs sm:text-sm text-[#E5E4E2]/60 mt-1 max-w-2xl">
              Automated pre-publication monitoring across advertising puffery (ASCI), approved SLA claims, and visual accessibility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#E6E0F0] bg-[#0D0907]/80 px-4 py-2.5 rounded-xl border border-[#E5E4E2]/10 shadow-xl flex items-center gap-2 font-mono">
              <Clock className="w-4 h-4 text-[#E6E0F0]" />
              Real-Time Stream Active
            </span>
          </div>
        </div>

        {/* Executive KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0D0907]/80 p-5 rounded-2xl border border-[#E5E4E2]/10 shadow-xl backdrop-blur-md space-y-1">
            <span className="text-[11px] font-bold text-[#E5E4E2]/50 uppercase tracking-wider block font-mono">
              Total Audits Run
            </span>
            <div className="text-3xl font-black text-[#E5E4E2] font-mono">1,220</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>

          <div className="bg-[#0D0907]/80 p-5 rounded-2xl border border-[#E5E4E2]/10 shadow-xl backdrop-blur-md space-y-1">
            <span className="text-[11px] font-bold text-[#E5E4E2]/50 uppercase tracking-wider block font-mono">
              Pre-Publication Pass Rate
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono">84.2%</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+6.2% since 1-Click Fix</span>
            </div>
          </div>

          <div className="bg-[#0D0907]/80 p-5 rounded-2xl border border-[#E5E4E2]/10 shadow-xl backdrop-blur-md space-y-1">
            <span className="text-[11px] font-bold text-[#E5E4E2]/50 uppercase tracking-wider block font-mono">
              Mean Time to Remediation
            </span>
            <div className="text-3xl font-black text-[#E6E0F0] font-mono">42 sec</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-82% vs manual review</span>
            </div>
          </div>

          <div className="bg-[#0D0907]/80 p-5 rounded-2xl border border-[#E5E4E2]/10 shadow-xl backdrop-blur-md space-y-1">
            <span className="text-[11px] font-bold text-[#E5E4E2]/50 uppercase tracking-wider block font-mono">
              Risk Exposure Index
            </span>
            <div className="text-3xl font-black text-[#E5E4E2] font-mono">2.1 / 10</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Low Regulatory Risk</span>
            </div>
          </div>
        </div>

        {/* Middle Two-Column Grid: Top Recurring Violations & Departmental Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Top Recurring Violations */}
          <section className="lg:col-span-6 bg-[#0D0907]/80 rounded-2xl border border-[#E5E4E2]/10 shadow-xl backdrop-blur-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#E5E4E2] tracking-tight flex items-center gap-2 uppercase font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Top Recurring Violations
                </h2>
                <p className="text-xs text-[#E5E4E2]/50 mt-0.5">
                  Proportion of flagged draft assertions by regulatory category
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#E6E0F0]">Total: 338</span>
            </div>

            <div className="space-y-4">
              {recurringViolations.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E5E4E2]">{item.category}</span>
                    <span className="font-mono text-[#E6E0F0] font-bold">
                      {item.percentage}% ({item.count} hits)
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-[#0D0907] rounded-full h-2.5 overflow-hidden border border-[#E5E4E2]/10">
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#E5E4E2]/50 leading-snug">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Departmental Risk Index */}
          <section className="lg:col-span-6 bg-[#0D0907]/80 rounded-2xl border border-[#E5E4E2]/10 shadow-xl backdrop-blur-md p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-[#E5E4E2] tracking-tight flex items-center gap-2 uppercase font-mono">
                <Users className="w-4 h-4 text-[#E6E0F0]" />
                Departmental Risk Index
              </h2>
              <p className="text-xs text-[#E5E4E2]/50 mt-0.5">
                Compliance hygiene and SLA accuracy across publishing groups
              </p>
            </div>

            <div className="space-y-3">
              {departmentalRisk.map((dept) => (
                <div
                  key={dept.department}
                  className="p-4 rounded-xl border border-[#E5E4E2]/10 hover:border-[#6F4E37]/50 transition bg-[#0D0907] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E5E4E2]">{dept.department}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${dept.riskColor}`}>
                      {dept.riskIndex}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#E5E4E2]/60">
                    <div>
                      <span className="text-[#E5E4E2]/40">Pass Rate: </span>
                      <strong className="text-[#E5E4E2] font-mono">{dept.passRate}</strong>
                    </div>
                    <div>
                      <span className="text-[#E5E4E2]/40">Audits Run: </span>
                      <strong className="text-[#E5E4E2] font-mono">{dept.auditsRun}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-[#E5E4E2]/50 border-t border-[#E5E4E2]/10 pt-2 flex items-center justify-between">
                    <span>Issue: <strong className="text-[#E6E0F0]">{dept.primaryIssue}</strong></span>
                    <span className="text-emerald-400 font-semibold font-mono">SLA: {dept.slaCompliance}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Bottom Section: Recent Audit Log Stream */}
        <section className="bg-[#0D0907]/80 rounded-2xl border border-[#E5E4E2]/10 shadow-xl backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#E5E4E2] tracking-tight flex items-center gap-2 uppercase font-mono">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Recent Pre-Flight Verification Logs
            </h3>
            <span className="text-xs text-[#E5E4E2]/50 font-mono">Live Audit Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0907] text-[#E5E4E2]/50 font-semibold uppercase tracking-wider border-b border-[#E5E4E2]/10 font-mono">
                <tr>
                  <th className="py-3 px-3">Trace ID</th>
                  <th className="py-3 px-3">Asset Title</th>
                  <th className="py-3 px-3">Author / Agency</th>
                  <th className="py-3 px-3">Channel</th>
                  <th className="py-3 px-3">Result</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E2]/5 text-[#E5E4E2]/80">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#E5E4E2]/5 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#E6E0F0]">{log.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#E5E4E2] max-w-xs truncate">{log.asset}</td>
                    <td className="py-3 px-3">{log.author}</td>
                    <td className="py-3 px-3 text-[#E5E4E2]/50">{log.channel}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        log.status.includes("Passed")
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                          : log.status.includes("Rejected")
                          ? "bg-rose-950/60 text-rose-300 border-rose-500/30"
                          : "bg-amber-950/60 text-amber-300 border-amber-500/30"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#E6E0F0]">{log.score}</td>
                    <td className="py-3 px-3 text-right text-[#E5E4E2]/40 font-mono">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
