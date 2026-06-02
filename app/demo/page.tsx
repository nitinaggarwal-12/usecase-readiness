"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface DemoScenario {
  id: string;
  title: string;
  badge: string;
  badgeVariant: "info" | "success" | "warning" | "critical";
  description: string;
  impact: string;
}

export default function DemoModePage() {
  const toastCtx = useToast();

  // Demo Scenarios
  const scenarios: DemoScenario[] = [
    {
      id: "pitch-mode",
      title: "Pre-Sales Pitch Simulation",
      badge: "Optimal Health",
      badgeVariant: "success",
      description: "Simulate a highly motivated prospect with modern FHIR stores already deployed, ready for immediate value mapping evaluation.",
      impact: "Impact: Ready to nominate as a Phase E qualification candidate with a starting portfolio score of 85.",
    },
    {
      id: "crisis-mode",
      title: "Post-Sales Integration Crisis Mode",
      badge: "High Risk Blocker",
      badgeVariant: "critical",
      description: "Inject synthetic HIPAA BAA blocks and Epic sandboxes credential delays. Test the system's attention alarms and 'Fix Now' triggers.",
      impact: "Impact: Drops Stanford Medicine score to 42; launches critical flags inside the dashboard ledger.",
    },
    {
      id: "audit-mode",
      title: "FDA Medical SaMD Audit Prep",
      badge: "Regulatory Signal",
      badgeVariant: "warning",
      description: "Simulate the arrival of new FDA guidance signals affecting clinical decision support systems. Perfect for testing real-time regulatory calendar alarms.",
      impact: "Impact: Populates regulatory ledger with 3 unread compliance flags and FDA classification updates.",
    },
  ];

  const [activeScenario, setActiveScenario] = useState("pitch-mode");

  // Dummy actions
  const handleTriggerScenario = () => {
    const selected = scenarios.find(sc => sc.id === activeScenario);
    if (selected) {
      toastCtx.showToast(`Simulated scenario triggered: '${selected.title}'`, "success");
    }
  };

  const handleClearBlockers = () => {
    toastCtx.showToast("Synthetic simulation state reset! Cleared all active blockers.", "info");
  };

  const handleGenerateSyntheticReport = () => {
    toastCtx.showToast("Synthetic Gemini-powered report generated. Available under Phase J archives.", "success");
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* Top Warning Alert/Banner */}
      <div className="bg-amber-50 border border-amber text-amber-950 rounded-lg p-4 flex items-start gap-3 shadow-sm">
        <div className="w-7 h-7 rounded bg-amber-100 text-amber flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
        </div>
        <div className="flex flex-col gap-0.5 leading-tight">
          <span className="text-xs font-bold text-amber-950">HCLS Portal Demonstration & Sandbox Mode</span>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5 select-text">
            You are currently in Sandbox mode. Changing options below will trigger synthetic mocks, test database signals, and inject alarms to test reactive logic.
          </p>
        </div>
      </div>

      {/* 2-Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Scenarios Selector (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Select Demo Simulation Scenario
          </h2>

          <div className="flex flex-col gap-4">
            {scenarios.map((sc) => {
              const isActive = activeScenario === sc.id;
              
              return (
                <div
                  key={sc.id}
                  onClick={() => setActiveScenario(sc.id)}
                  className={`bg-white border rounded-xl p-5 flex items-start gap-4 btn-transition cursor-pointer ${
                    isActive
                      ? "border-blue ring-1 ring-blue shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isActive ? "border-4 border-blue bg-white" : "border-gray-300 bg-white"
                  }`} />

                  <div className="flex flex-col leading-snug gap-1 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 select-all">{sc.title}</span>
                      <Badge label={sc.badge} variant={sc.badgeVariant} />
                    </div>
                    
                    <p className="text-[11px] text-gray-500 select-text leading-relaxed mt-1">
                      {sc.description}
                    </p>

                    <span className="text-[10px] text-blue font-bold mt-1 select-none">
                      {sc.impact}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trigger simulator button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleTriggerScenario}
              className="bg-blue hover:bg-blue-dk text-white text-xs font-semibold px-4 py-2.5 rounded-md shadow btn-transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-circle-play"></i>
              <span>Trigger Simulation State</span>
            </button>
          </div>
        </div>

        {/* Right Column: Rapid Debug Tools (1/3 width) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Rapid Sandbox Actions
          </h2>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-b border-gray-50 pb-3">
              <h3 className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-green"></i>
                <span>Bypass Gating Blockers</span>
              </h3>
              <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5 select-text">
                Temporarily bypass BAA checks and hospital EHR sandboxes credentials verification to access final reports.
              </p>
              <button
                onClick={handleClearBlockers}
                className="bg-gray-100 hover:bg-gray-200/80 text-gray-700 text-[10px] font-bold uppercase px-3 py-2 rounded mt-2.5 btn-transition focus:outline-none"
              >
                Clear Active Blockers
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <i className="fa-solid fa-wand-magic-sparkles text-purple"></i>
                <span>Synthetic Gemini Reports</span>
              </h3>
              <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5 select-text">
                Create a fully populated mock evaluation report for client demonstration showing custom bed optimization matrices.
              </p>
              <button
                onClick={handleGenerateSyntheticReport}
                className="bg-purple-50 text-purple hover:bg-purple-100/80 text-[10px] font-bold uppercase px-3 py-2 rounded mt-2.5 border border-purple/10 btn-transition focus:outline-none"
              >
                Generate Demo Report
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
