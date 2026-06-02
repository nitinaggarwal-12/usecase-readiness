"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MetricCard from "@/components/ui/MetricCard";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

type ScenarioType = "aggressive" | "base" | "conservative";

interface GanttItem {
  stream: string;
  status: "done" | "prog" | "todo" | "blk";
  color: "blue" | "green" | "amber" | "red";
  // percentage metrics for Aggressive, Base, Conservative
  metrics: {
    aggressive: { left: number; width: number };
    base: { left: number; width: number };
    conservative: { left: number; width: number };
  };
  milestoneLabel?: string;
  milestonePct?: number;
}

export default function TimelinePage() {
  const router = useRouter();
  const { id: accountId } = useParams() as { id: string };
  const { showToast } = useToast();

  // 1. Active scenario state
  const [scenario, setScenario] = useState<ScenarioType>("base");

  // Look up account names
  const isStanford = accountId === "stanford-medicine";
  const accountName = isStanford ? "Stanford Medicine" : "Mayo Clinic";

  // Dynamic deadlines and targets based on active scenario
  const scenarioMetadata = {
    aggressive: {
      fdeDate: "July 15, 2026",
      days: "45 Days",
      risk: "High Risk (80%)",
      riskType: "down" as const,
      desc: "Accelerated FDE path. Assumes legal BAA executes inside 3 days and EHR credentials are fast-tracked.",
    },
    base: {
      fdeDate: "August 30, 2026",
      days: "90 Days",
      risk: "Moderate Risk (35%)",
      riskType: "up" as const,
      desc: "Standard timeline. Allocates typical corporate periods for EHR OAuth deployments and KMS CMEK key cycles.",
    },
    conservative: {
      fdeDate: "October 15, 2026",
      days: "180 Days",
      risk: "Low Risk (15%)",
      riskType: "neutral" as const,
      desc: "Risk-mitigated roadmap. Incorporates padding for extended legal reviews, hospital custom sandboxes, and compliance cycles.",
    },
  };

  const activeMeta = scenarioMetadata[scenario];

  // 4 core work streams for the Gantt chart
  const ganttStreams: GanttItem[] = [
    {
      stream: "Legal & Compliance (BAA Contract)",
      status: isStanford ? "blk" : "done",
      color: isStanford ? "red" : "green",
      metrics: {
        aggressive: { left: 0, width: 15 },
        base: { left: 0, width: 25 },
        conservative: { left: 0, width: 30 },
      },
      milestoneLabel: "BAA Signed",
      milestonePct: 25,
    },
    {
      stream: "Infra Provisioning (VPC & KMS Keys)",
      status: "prog",
      color: "blue",
      metrics: {
        aggressive: { left: 15, width: 25 },
        base: { left: 25, width: 30 },
        conservative: { left: 30, width: 25 },
      },
      milestoneLabel: "Keys Active",
      milestonePct: 55,
    },
    {
      stream: "Clinical EHR Mapping (FHIR USCore)",
      status: "todo",
      color: "amber",
      metrics: {
        aggressive: { left: 40, width: 30 },
        base: { left: 55, width: 25 },
        conservative: { left: 55, width: 20 },
      },
      milestoneLabel: "API Mapped",
      milestonePct: 75,
    },
    {
      stream: "Local Sandbox Testing & Dry-runs",
      status: "todo",
      color: "amber",
      metrics: {
        aggressive: { left: 70, width: 30 },
        base: { left: 80, width: 20 },
        conservative: { left: 75, width: 25 },
      },
      milestoneLabel: "FDE Nominated",
      milestonePct: 100,
    },
  ];

  const handleScenarioChange = (type: ScenarioType) => {
    setScenario(type);
    showToast(`Timeline updated: ${type.toUpperCase()} mode activated.`, "info");
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* STICKY ACTION BAR */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-[52px] z-10 flex items-center justify-between gap-4 select-none">
        <button
          onClick={() => router.push(`/strategic-plan/${accountId}`)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-semibold btn-transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Strategic Plan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/accounts/${accountId}`)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-750 text-xs font-semibold px-3.5 py-1.5 rounded btn-transition"
          >
            Exit to Account
          </button>
        </div>
      </div>

      {/* HEADER AREA */}
      <div className="page-header select-none">
        <h1 className="text-gray-900">Readiness Journey Timeline</h1>
        <p className="text-xs text-gray-500">
          Interactive Gantt roadmap mapping the path to Fast-Track Deployment (FDE) for {accountName}.
        </p>
      </div>

      {/* 3-SCENARIO TOGGLE BAR */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3 select-none">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
            Select Target Scenario
          </span>
          <Badge label={`${scenario} scenario`} variant="gemini" />
        </div>

        <div className="grid grid-cols-3 gap-3 py-1">
          {(["aggressive", "base", "conservative"] as ScenarioType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleScenarioChange(type)}
              className={`text-xs font-bold py-2.5 rounded-md btn-transition border uppercase tracking-wider focus:outline-none ${
                scenario === type
                  ? "bg-blue text-white border-blue shadow-sm font-extrabold"
                  : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {type} Mode
            </button>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed italic bg-gray-50 p-3 border border-gray-100 rounded">
          {activeMeta.desc}
        </p>
      </div>

      {/* DYNAMIC METRICS ROW (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
        <MetricCard
          title="Target FDE Submission"
          value={activeMeta.fdeDate}
          trend="Target date"
          trendType="neutral"
          icon="fa-calendar-check"
        />
        <MetricCard
          title="Estimated Scoping Period"
          value={activeMeta.days}
          trend="Work days"
          trendType="neutral"
          icon="fa-clock"
        />
        <MetricCard
          title="Implementation Risk"
          value={activeMeta.risk}
          trend="Confidence index"
          trendType={activeMeta.riskType}
          icon="fa-triangle-exclamation"
        />
      </div>

      {/* GANTT CHART CARD CARD */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 select-none">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Blockers-To-FDE Gantt Chart
          </h3>
          <span className="text-[10px] font-semibold text-gray-400">
            Width/Left = Percentage of Scoping Period
          </span>
        </div>

        {/* Scrollable Gantt Chart viewport for mobile */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-[560px] flex flex-col gap-6 py-4 relative">
            
            {/* Vertical Grid Backdrop Month Lines (4 segments represent weeks/months) */}
            <div className="absolute inset-y-0 left-[180px] right-0 flex justify-between pointer-events-none z-0">
              {[1, 2, 3, 4].map((col) => (
                <div key={col} className="h-full w-[1px] border-l border-dashed border-gray-200" />
              ))}
            </div>

            {/* Gantt Stream Tracks */}
            {ganttStreams.map((item, idx) => {
              const activeMetrics = item.metrics[scenario];
              
              const fillColors = {
                blue: "bg-blue border border-blue-dk/10",
                green: "bg-green border border-green/10",
                amber: "bg-amber border border-amber/10",
                red: "bg-red border border-red/10",
              };

              return (
                <div key={idx} className="grid grid-cols-12 items-center gap-4 z-10 relative">
                  {/* Stream title (3 cols) */}
                  <div className="col-span-4 flex flex-col leading-tight pr-2 truncate">
                    <span className="text-xs font-bold text-gray-900 truncate">{item.stream}</span>
                    <span className="text-[9px] uppercase font-bold text-gray-400 mt-0.5">{item.status}</span>
                  </div>

                  {/* Gantt bar track (8 cols) */}
                  <div className="col-span-8 relative h-6 w-full bg-gray-50 border border-gray-150/50 rounded-md">
                    {/* Dynamic absolute positioned bar */}
                    <div
                      className={`absolute h-full rounded-md transition-all duration-500 ease-out flex items-center px-3 text-[9px] font-extrabold uppercase tracking-wider text-white select-none ${
                        fillColors[item.color]
                      }`}
                      style={{
                        left: `${activeMetrics.left}%`,
                        width: `${activeMetrics.width}%`,
                      }}
                      title={`${item.stream}: ${activeMetrics.width}% duration`}
                    >
                      <span className="truncate">{activeMetrics.width}%</span>
                    </div>

                    {/* Diamond Milestone Marker (transform rotate-45) */}
                    {item.milestonePct && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-navy border-2 border-white transform rotate-45 z-20 shadow cursor-pointer"
                        style={{ left: `${item.milestonePct}%` }}
                        title={`Milestone Gate: ${item.milestoneLabel}`}
                        onClick={() => showToast(`Milestone Captured: ${item.milestoneLabel}`, "success")}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Chart Timeline Legend Footer */}
            <div className="grid grid-cols-12 items-center gap-4 pt-4 border-t border-gray-100 select-none text-[9px] uppercase font-bold tracking-wider text-gray-400">
              <div className="col-span-4">Remediation Streams</div>
              <div className="col-span-8 flex justify-between pr-2 select-none">
                <span>Kickoff</span>
                <span>Month 1</span>
                <span>Month 2</span>
                <span>Month 3</span>
                <span>FDE Target</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
