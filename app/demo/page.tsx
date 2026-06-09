"use client";

import React, { useState } from "react";
import ScoreRing from "@/components/ui/ScoreRing";
import { useToast } from "@/components/ui/Toast";
import { useDemo, ScoreRange, DemoDuration } from "@/context/DemoContext";
import { demoScenarios } from "@/lib/demo-data/scenarios";

// Features checklist config items
const FEATURE_ITEMS = [
  { id: "dashboard", label: "Dashboard Overview", desc: "Flags, metrics, account health at a glance" },
  { id: "intelligence", label: "Account Intelligence", desc: "Market signals, leadership changes, news" },
  { id: "assess_flow", label: "Assessment Flow (A–E Pre-Sales)", desc: "Live question walkthrough with blocker detection" },
  { id: "assess_complete", label: "Assessment Complete & FDE Gate", desc: "Score reveal, benchmark, FDE gate calculation" },
  { id: "report_view", label: "Report View — Gemini-Generated", desc: "Score, financial table, human story, closing para" },
  { id: "strategic", label: "Strategic Plan", desc: "Gap analysis, action sequence, Fix Now buttons" },
  { id: "timeline", label: "Journey Timeline / Gantt", desc: "3-scenario toggle, critical path, FDE date" },
  { id: "bv", label: "BV Command Center", desc: "Pipeline, value at risk, heatmap, prediction score" },
  { id: "regulatory", label: "Regulatory Intelligence", desc: "CMS rule, Colorado AI Act, FDA SaMD signals" },
  { id: "intake", label: "Document Intake", desc: "PDF upload, extraction results, confidence levels" },
  { id: "poc", label: "POC Generator", desc: "Config + artifact list + generate action" },
  { id: "learning", label: "Learning Center", desc: "Modules, practice scenario, certification badge" },
  { id: "integrations", label: "Integration Marketplace", desc: "Connected tools, available connectors, API keys" },
  { id: "portal", label: "Customer Portal", desc: "What the customer actually sees (no CE data)" },
  { id: "fde_nom", label: "FDE Nomination Flow", desc: "Assessment E, GREEN gate, nomination confirmation" },
  { id: "full_circle", label: "Full Circle Report (Assessment J)", desc: "The flagship report — journey map + closing para" },
  { id: "value_confirm", label: "Value Confirmation", desc: "Report G with human story and $value confirmed" },
  { id: "expansion", label: "Expansion Planning", desc: "Assessment I + use case ranking + portfolio view" }
];

export default function DemoConfigPage() {
  const { startDemo } = useDemo();
  const { showToast } = useToast();

  // 1. Config states
  const [selectedScenarioId, setSelectedScenarioId] = useState("northside-health");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(FEATURE_ITEMS.map(f => f.id));
  const [selectedScoreRange, setSelectedScoreRange] = useState<ScoreRange>("moderate");
  const [selectedDuration, setSelectedDuration] = useState<DemoDuration>("standard");

  // Loading overlay state
  const [isLoading, setIsLoading] = useState(false);

  // Scenario details helper
  const selectedScenario = demoScenarios.find(s => s.id === selectedScenarioId) || demoScenarios[0];

  // Helper for checkbox lists
  const handleFeatureToggle = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSelectAllFeatures = () => {
    if (selectedFeatures.length === FEATURE_ITEMS.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(FEATURE_ITEMS.map(f => f.id));
    }
  };

  // Score number based on selection range
  const getMockScoreValue = (range: ScoreRange): number => {
    if (range === "concerning") return 46;
    if (range === "moderate") return 68;
    if (range === "strong") return 84;
    return 95;
  };

  // Launch compilation action
  const handleGenerateDemo = () => {
    setIsLoading(true);
    showToast("Compiling synthetic showcase models...", "info", "fa-spinner");

    setTimeout(() => {
      setIsLoading(false);
      startDemo(selectedScenarioId, selectedFeatures, selectedScoreRange, selectedDuration);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-8 relative px-2">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex flex-col items-center justify-center gap-4 text-white">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-sm font-bold tracking-wider select-none animate-pulse">
            Loading synthetic data...
          </span>
        </div>
      )}

      {/* Screen Title */}
      <div className="flex flex-col gap-2 select-none pt-2">
        <h1 className="text-gray-900 text-3xl font-extrabold tracking-tight">Showcase Demo Mode Setup</h1>
        <p className="text-base text-gray-500">
          Configure a dedicated healthcare sandbox simulation environment for customer presentations.
        </p>
      </div>

      {/* Main Two-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Steps Wizards (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
               {/* Step 1: Scenario Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col gap-5">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-655 border-b border-gray-100 pb-2.5 select-none">
              Step 1: Choose Your Customer Scenario
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {demoScenarios.map((sc) => {
                const isSelected = selectedScenarioId === sc.id;
                // Badges lookup based on scenario
                const badges = sc.id === "northside-health" ? ["Pre-Sales", "AWS", "Prior Auth"] :
                               sc.id === "pacific-medical" ? ["FDE Nominated", "GCP", "Clinical Doc"] :
                               sc.id === "midamerica-payer" ? ["At Risk", "Azure", "Claims Denial"] :
                               ["Production", "$2.4M Confirmed", "Expanding"];
                
                return (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`border rounded-lg p-5 flex items-start gap-4 btn-transition cursor-pointer select-none ${
                      isSelected
                        ? "border-blue ring-1 ring-blue bg-blue-50/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 ${
                      isSelected ? "border-4 border-blue bg-white" : "border-gray-300 bg-white"
                    }`} />

                    <div className="flex flex-col leading-tight gap-1 w-full">
                      <div className="flex items-center justify-between gap-2.5 flex-wrap">
                        <span className="text-base font-extrabold text-gray-900 select-all">{sc.account.name}</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {badges.map((b, i) => (
                            <span 
                              key={i} 
                              className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                b.includes("At Risk") ? "bg-red-50 text-red border border-red/10" :
                                b.includes("Production") ? "bg-green-50 text-green border border-green/10" :
                                "bg-blue-50 text-blue border border-blue/10"
                              }`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-655 select-text leading-relaxed mt-1">
                        {sc.account.type} • Cloud: {sc.account.cloud} • EHR: {sc.account.ehr}
                      </p>
                      <p className="text-sm text-gray-600 select-text italic mt-1 leading-normal">
                        {sc.account.useCase}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Showcases Checklist */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2.5 select-none">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-655">
                Step 2: Choose What to Demo
              </h2>
              <button
                onClick={handleSelectAllFeatures}
                className="text-sm font-extrabold text-blue uppercase hover:underline"
              >
                {selectedFeatures.length === FEATURE_ITEMS.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURE_ITEMS.map((item) => {
                const isChecked = selectedFeatures.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleFeatureToggle(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded border btn-transition cursor-pointer select-none ${
                      isChecked
                        ? "border-blue-50 bg-blue-50/10 text-gray-900"
                        : "border-gray-150 bg-white text-gray-500"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isChecked ? "bg-blue border-blue text-white" : "border-gray-300 bg-white"
                    }`}>
                      {isChecked && <i className="fa-solid fa-check text-[10px]"></i>}
                    </div>
                    <div className="flex flex-col leading-snug">
                      <span className="text-sm font-extrabold text-gray-900 select-all">{item.label}</span>
                      <span className="text-xs text-gray-600 select-text mt-0.5">{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Score Range Select */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col gap-5">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-655 border-b border-gray-100 pb-2.5 select-none">
              Step 3: Choose Score Range for Assessments
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
              {([
                { id: "concerning", label: "Concerning", icon: "fa-circle-exclamation", color: "text-red", desc: "Score 35–54 (RED Gate)" },
                { id: "moderate", label: "Moderate", icon: "fa-triangle-exclamation", color: "text-amber", desc: "Score 55–74 (YELLOW Gate)" },
                { id: "strong", label: "Strong", icon: "fa-circle-check", color: "text-green", desc: "Score 75–89 (GREEN Gate)" },
                { id: "excellent", label: "Excellent", icon: "fa-circle-play", color: "text-purple", desc: "Score 90–100 (Expansion)" }
              ] as const).map((opt) => {
                const isSelected = selectedScoreRange === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedScoreRange(opt.id)}
                    className={`border rounded-lg p-4 text-center flex flex-col items-center gap-2 btn-transition cursor-pointer ${
                      isSelected
                        ? "border-blue ring-1 ring-blue bg-blue-50/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <i className={`fa-solid ${opt.icon} ${opt.color} text-2xl`}></i>
                    <span className="text-base font-extrabold text-gray-900 leading-none">{opt.label}</span>
                    <span className="text-xs text-gray-600 leading-tight mt-0.5">{opt.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 4: Demo Duration */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col gap-5">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-655 border-b border-gray-100 pb-2.5 select-none">
              Step 4: Choose Demo Duration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none">
              {([
                { id: "quick", label: "⚡ Quick", dur: "8 min", desc: "Dashboard + 1 Assessment + Report" },
                { id: "standard", label: "✓ Standard", dur: "20 min", desc: "Full Pre-Sales Journey" },
                { id: "deep", label: "◎ Deep Dive", dur: "45 min", desc: "Full Journey + Advanced Config" }
              ] as const).map((opt) => {
                const isSelected = selectedDuration === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedDuration(opt.id)}
                    className={`border rounded-lg p-4 flex flex-col gap-2 btn-transition cursor-pointer ${
                      isSelected
                        ? "border-blue ring-1 ring-blue bg-blue-50/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-gray-900 leading-none">{opt.label}</span>
                      <span className="text-sm font-mono text-blue font-bold">{opt.dur}</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-normal">{opt.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Big action submit trigger */}
          <div className="select-none">
            <button
              onClick={handleGenerateDemo}
              className="bg-blue hover:bg-blue-dk text-white text-lg font-black py-4 px-8 rounded-lg w-full text-center shadow-lg btn-transition flex items-center justify-center gap-2 uppercase tracking-wide focus:outline-none"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Generate Demo — Load {selectedScenario.account.name}</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Showcase Preview Panel (5/12 width) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-md sticky top-[120px] flex flex-col gap-5 select-none">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-655 border-b border-gray-100 pb-2.5">
            Live Demo Preview
          </h2>

          <div className="bg-gray-50/50 border border-gray-150 rounded-lg p-5 flex flex-col gap-4">
            
            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1.5 leading-snug">
                <span className="text-base font-extrabold text-gray-900 select-all">{selectedScenario.account.name}</span>
                <span className="text-sm text-gray-600 select-none">{selectedScenario.account.type}</span>
                <span className="text-sm text-blue font-bold mt-1 select-text">{selectedScenario.account.useCase}</span>
              </div>

              {/* Mock score ring display */}
              <div className="flex-shrink-0">
                <ScoreRing 
                  score={getMockScoreValue(selectedScoreRange)} 
                  size="default" 
                />
              </div>
            </div>

            {/* Config metadata summary */}
            <div className="grid grid-cols-2 gap-4 text-xs leading-none bg-white border border-gray-100 rounded p-4 select-none">
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold uppercase text-xs tracking-wider">Demo Duration</span>
                <span className="text-gray-900 font-bold mt-0.5 capitalize text-sm">
                  {selectedDuration === "quick" ? "Quick (8m)" : selectedDuration === "standard" ? "Standard (20m)" : "Deep Dive (45m)"}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold uppercase text-xs tracking-wider">Feature Showcases</span>
                <span className="text-gray-900 font-bold mt-0.5 text-sm">{selectedFeatures.length} of {FEATURE_ITEMS.length} selected</span>
              </div>
            </div>

            {/* Checklist of features selection */}
            <div className="flex flex-col gap-2 select-none max-h-40 overflow-y-auto pr-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selected Showcases:</span>
              <div className="flex flex-col gap-1.5 pl-1">
                {selectedFeatures.map(fid => {
                  const matched = FEATURE_ITEMS.find(f => f.id === fid);
                  if (!matched) return null;
                  return (
                    <div key={fid} className="flex items-center gap-1.5 text-sm text-gray-655 font-semibold">
                      <i className="fa-solid fa-circle-check text-green text-xs"></i>
                      <span className="truncate">{matched.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* All data is synthetic safety check card */}
          <div className="bg-green-50/50 border border-green/10 rounded-lg p-4 flex items-start gap-3">
            <i className="fa-solid fa-circle-check text-green text-lg mt-0.5"></i>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold text-green">All data is synthetic.</span>
              <span className="text-sm text-green/80 mt-1">Showcase safe. Safe to share screen with clients.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
