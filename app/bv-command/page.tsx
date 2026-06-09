"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MetricCard from "@/components/ui/MetricCard";
import FlagCard from "@/components/ui/FlagCard";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

function BVCommandCenterPageContent() {
  const { showToast } = useToast();

  // Load active assessment from sessionStorage
  const [activeAssessment, setActiveAssessment] = useState<{
    customerName: string;
    useCase: string;
    score: number;
  } | null>(null);

  const searchParams = useSearchParams();
  const urlId = searchParams ? searchParams.get("id") : null;

  useEffect(() => {
    if (urlId) {
      const saved = localStorage.getItem("hcls_usecase_readiness_history");
      if (saved) {
        try {
          const list: Array<{ id: string; customerName: string; segment?: string; useCase?: string; score?: number }> = JSON.parse(saved);
          const match = list.find(item => {
            const slug = item.customerName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return item.id === urlId || slug === urlId;
          });
          if (match) {
            const scoreVal = typeof match.score === "number" ? match.score : 100;
            setActiveAssessment({
              customerName: match.customerName,
              useCase: match.useCase || "Generative AI deployment Integration",
              score: scoreVal
            });
            sessionStorage.setItem("hcls_usecase_readiness_meta", JSON.stringify({
              customerName: match.customerName,
              useCase: match.useCase || "Generative AI deployment Integration",
              score: scoreVal,
              activeAssessmentId: match.id,
              showResults: true
            }));
            return;
          }
        } catch (e) {
          console.error("Failed to parse history or find matching id", e);
        }
      }
    }

    const savedMeta = sessionStorage.getItem("hcls_usecase_readiness_meta");
    if (savedMeta) {
      try {
        const meta = JSON.parse(savedMeta);
        if (meta.customerName) {
          setActiveAssessment({
            customerName: meta.customerName,
            useCase: meta.useCase || "Generative AI deployment Integration",
            score: typeof meta.score === "number" ? meta.score : 100
          });
        }
      } catch (e) {
        console.error("Failed to parse readiness meta", e);
      }
    }
  }, [urlId]);

  // Modal state for escalation
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [escalationTarget, setEscalationTarget] = useState({ org: "Stanford Medicine", score: 46, risk: "$750k" });

  // Mock Pipeline Stage Table Data
  const pipelineStages = [
    { stage: "Discovery (A-B)", count: 4, value: "$3.4M", pct: 35, color: "bg-gray-500" },
    { stage: "Scoping (C-D)", count: 6, value: "$4.8M", pct: 55, color: "bg-blue" },
    { stage: "Nomination (E)", count: 2, value: "$2.1M", pct: 20, color: "bg-amber" },
    { stage: "Production (F-J)", count: 3, value: "$3.1M", pct: 30, color: "bg-green" },
  ];

  // Mock Heatmap Scores (3x3 grid representing different dimensions across territories)
  const heatmapData = [
    { territory: "US-East", tech: 92, sec: 78, biz: 84 },
    { territory: "US-West", tech: 88, sec: 52, biz: 76 },
    { territory: "US-Central", tech: 46, sec: 64, biz: 55 },
  ];

  // Mock Bar Chart data for value realizations
  const barChartData = [
    { month: "Q1", pct: 42, label: "$1.2M" },
    { month: "Q2", pct: 68, label: "$2.4M" },
    { month: "Q3", pct: 84, label: "$3.6M" },
    { month: "Q4", pct: 95, label: "$4.1M" },
  ];

  const handleEscalateClick = (orgName: string, scoreVal: number, riskVal: string) => {
    setEscalationTarget({ org: orgName, score: scoreVal, risk: riskVal });
    setIsEscalateOpen(true);
  };

  // Helper to get color cell class based on score range
  const getHeatmapCellClass = (score: number) => {
    if (score >= 90) return "bg-blue/10 border-blue text-blue hover:bg-blue/20";
    if (score >= 75) return "bg-green-50 border-green text-green hover:bg-green-50/80";
    if (score >= 50) return "bg-amber-50 border-amber text-amber hover:bg-amber-50/80";
    return "bg-red-50 border-red text-red hover:bg-red-50/80";
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HERO BAND (Navy-to-Navy-Light Gradient) */}
      <div className="bg-gradient-to-r from-navy to-navy-lt text-white rounded-xl p-6 shadow-sm flex flex-col gap-2 select-none hero-band">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold leading-none">Business Value Command Center</h2>
          <Badge label="Enterprise Executive Overview" variant="gemini" />
        </div>
        <p className="text-xs text-white/70 max-w-[680px] leading-relaxed pt-1">
          Portfolio-level business value metrics, value at risk, and account health summaries across all HCLS territories.
        </p>
      </div>

      {/* 4 PORTFOLIO METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <MetricCard
          title="Total Pipeline Value"
          value="$13.40M"
          trend="15 active deals"
          trendType="neutral"
          icon="fa-vault"
        />
        <MetricCard
          title="Value Realized (YTD)"
          value="$4.12M"
          trend="+$1.2M this month"
          trendType="up"
          icon="fa-circle-dollar-to-slot"
        />
        <MetricCard
          title="Active Value At Risk"
          value="$1.85M"
          trend="3 accounts flagged"
          trendType="down"
          icon="fa-triangle-exclamation"
        />
        <MetricCard
          title="Portfolio Health Index"
          value="82%"
          trend="+2.4% vs last month"
          trendType="up"
          icon="fa-heart-pulse"
        />
      </div>

      {/* 2-COLUMN GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 width): Pipeline Stages & Heatmap */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* A. Pipeline Stage Table with inline bar indicators */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
              Value Pipeline Stage Breakdown
            </h3>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <span>Scoping Stage</span>
                <span>Deals Count</span>
                <span>Stage Value</span>
                <span>Volume Share</span>
              </div>

              {/* Rows */}
              <div className="flex flex-col text-xs text-gray-700">
                {pipelineStages.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-4 border-b border-gray-100 last:border-0 p-3 items-center hover:bg-gray-50/50 select-text">
                    <span className="font-semibold text-gray-900">{row.stage}</span>
                    <span>{row.count} accounts</span>
                    <span className="font-semibold text-blue">{row.value}</span>
                    
                    {/* Inline progress bar indicator */}
                    <div className="flex items-center gap-2 select-none">
                      <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                        <div className={`h-full rounded ${row.color}`} style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold w-8">{row.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. Account Heatmap Grid (colored cells) */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Territory Maturity Heatmap
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Dimension scores (Technical, Security, Business Alignment) across active regions
              </p>
            </div>

            {/* Grid backdrop heatmap */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* Header */}
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">
                <div className="text-left">Territory</div>
                <div>Technical (%)</div>
                <div>Security (%)</div>
                <div>Business (%)</div>
              </div>

              {/* Rows */}
              <div className="flex flex-col text-xs font-semibold text-center select-none">
                {heatmapData.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-4 border-b border-gray-100 last:border-0 p-3 items-center hover:bg-gray-50/50">
                    <div className="text-left text-gray-900 font-bold">{row.territory}</div>
                    
                    <div className={`py-2 rounded border flex items-center justify-center text-[11px] font-bold mx-2 ${getHeatmapCellClass(row.tech)}`}>
                      {row.tech}%
                    </div>
                    <div className={`py-2 rounded border flex items-center justify-center text-[11px] font-bold mx-2 ${getHeatmapCellClass(row.sec)}`}>
                      {row.sec}%
                    </div>
                    <div className={`py-2 rounded border flex items-center justify-center text-[11px] font-bold mx-2 ${getHeatmapCellClass(row.biz)}`}>
                      {row.biz}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 width): Value-At-Risk Flags & Performance Bar Chart */}
        <div className="flex flex-col gap-6">
          
          {/* Active assessment scoping highlight */}
          {activeAssessment && (
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/20 border border-blue-200 rounded-xl p-4 shadow-sm flex flex-col gap-2.5 select-none">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wider text-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-150">
                  Active Scoped Assessment
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  activeAssessment.score >= 75 
                    ? "bg-green-50 text-green border-green-200" 
                    : activeAssessment.score >= 51 
                      ? "bg-amber-50 text-amber border-amber-200"
                      : "bg-red-50 text-red border-red-200"
                }`}>
                  {activeAssessment.score}%
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-gray-900">{activeAssessment.customerName}</h4>
                <p className="text-[11px] text-gray-500 leading-snug font-medium italic mt-0.5">
                  &ldquo;{activeAssessment.useCase}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* A. Value-at-Risk Flags list */}
          <div className="flex flex-col gap-3 select-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-exclamation text-red"></i>
              <span>Blockers Value At Risk</span>
            </h3>

            <div className="flex flex-col gap-3">
              {activeAssessment && activeAssessment.score < 75 && (
                <FlagCard
                  title={`${activeAssessment.customerName} ($1.20M deal)`}
                  message={`Scoping blockers detected on ${activeAssessment.useCase}. (Score: ${activeAssessment.score}%)`}
                  variant="crit"
                  actions={
                    <button
                      onClick={() => handleEscalateClick(activeAssessment.customerName, activeAssessment.score, "$1.20M")}
                      className="bg-red text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-red/90 btn-transition shadow-sm uppercase tracking-wider"
                    >
                      Escalate
                    </button>
                  }
                />
              )}
              <FlagCard
                title="Stanford Medicine ($750k deal)"
                message="Technical scoping blocked on active HIPAA BAA sign-off. (Score: 46)"
                variant="crit"
                actions={
                  <button
                    onClick={() => handleEscalateClick("Stanford Medicine", 46, "$750k")}
                    className="bg-red text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-red/90 btn-transition shadow-sm uppercase tracking-wider"
                  >
                    Escalate
                  </button>
                }
              />

              <FlagCard
                title="Texas Children's Hospital ($450k deal)"
                message="Data pipelines blocked. EHR OAuth credentials pending. (Score: 49)"
                variant="crit"
                actions={
                  <button
                    onClick={() => handleEscalateClick("Texas Children's Hospital", 49, "$450k")}
                    className="bg-red text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-red/90 btn-transition shadow-sm uppercase tracking-wider"
                  >
                    Escalate
                  </button>
                }
              />
            </div>
          </div>

          {/* B. Performance Vertical Bar Chart (using flex heights) */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4 select-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-chart-simple text-blue"></i>
              <span>Value Realization Progress</span>
            </h3>

            {/* Vertical Bar Chart using flex container */}
            <div className="h-36 w-full flex items-end justify-between px-4 border-b border-gray-200 pb-2 pt-4">
              {barChartData.map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end w-10 group">
                  {/* Value tooltip on hover */}
                  <span className="text-[8px] font-bold text-blue bg-blue-50 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-all">
                    {bar.label}
                  </span>
                  
                  {/* Dynamic vertical bar height */}
                  <div
                    className="w-5 rounded-t bg-blue hover:bg-blue-dk btn-transition shadow-sm"
                    style={{ height: `${bar.pct}%` }}
                    title={`Value realized: ${bar.label}`}
                  />
                  
                  <span className="text-[9px] uppercase font-bold text-gray-400">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* ESCALATE MODAL INTEGRATION                 */}
      {/* ========================================== */}
      <Modal
        isOpen={isEscalateOpen}
        onClose={() => setIsEscalateOpen(false)}
        width="440px"
        title={`Escalate Value Block: ${escalationTarget.org}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsEscalateOpen(false);
            showToast(`Escalated ${escalationTarget.org} to AE and BV Leader!`, "success");
          }}
          className="flex flex-col gap-4 text-xs"
        >
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Trigger an executive value escalation for <strong>{escalationTarget.org}</strong>. This will notify territory leaders to clear gating blockers:
          </p>

          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 border border-gray-150 rounded">
            <div className="flex flex-col leading-tight">
              <span className="text-gray-400 font-semibold uppercase text-[9px]">Deal Value</span>
              <span className="text-gray-900 font-bold mt-0.5">{escalationTarget.risk}</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-gray-400 font-semibold uppercase text-[9px]">Readiness Score</span>
              <span className="text-red font-bold mt-0.5">{escalationTarget.score}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-700">Escalation Reason</label>
            <select className="border border-gray-200 rounded p-2 w-full focus:border-blue focus:outline-none">
              <option>HIPAA BAA contract review deadlock in legal</option>
              <option>EHR infrastructure credentials pending IT lead</option>
              <option>Technical scoping resources constraint</option>
              <option>Loss of clinical executive sponsorship</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 mt-1">
            <span className="font-bold text-gray-500 text-[9px] uppercase tracking-wider">Notify Accounts Team</span>
            <div className="flex flex-col gap-1.5 font-semibold text-gray-700 pl-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue rounded" />
                <span>Notify territory Account Executive (AE)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue rounded" />
                <span>Notify HCLS Business Value Leader</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-gray-50">
            <button
              type="button"
              onClick={() => setIsEscalateOpen(false)}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold btn-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red hover:bg-red/90 text-white px-3.5 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm uppercase tracking-wider"
            >
              Escalate
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default function BVCommandCenterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500 text-xs">Loading Command Center...</div>}>
      <BVCommandCenterPageContent />
    </Suspense>
  );
}
