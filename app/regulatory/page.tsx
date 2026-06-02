"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MetricCard from "@/components/ui/MetricCard";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

export default function RegulatoryIntelligencePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Modals state
  const [isFdaOpen, setIsFdaOpen] = useState(false);
  const [isAffectedOpen, setIsAffectedOpen] = useState(false);
  const [activeSignalTitle, setActiveSignalTitle] = useState("");

  // Mock SaMD form state
  const [useCaseType, setUseCaseType] = useState("Diagnostic");
  const [fdaRecommendation, setFdaRecommendation] = useState<string | null>(null);
  const [isRunningFda, setIsRunningFda] = useState(false);

  // Mock signals
  const regulatorySignals = [
    {
      title: "CMS Interoperability & Prior Authorization Mandate",
      source: "CMS.gov",
      deadline: "Nov 15, 2026",
      urgency: "crit" as const,
      chips: ["FHIR", "EPIC", "Prior-Auth"],
      affectedCount: 3,
    },
    {
      title: "FDA Final Guidance on Clinical Decision Support (CDS) Software",
      source: "FDA.gov",
      deadline: "Oct 01, 2026",
      urgency: "warn" as const,
      chips: ["AI/ML", "SaMD", "Clinical-Safety"],
      affectedCount: 2,
    },
    {
      title: "State Regulation: Algorithmic Discrimination in Healthcare Guidelines",
      source: "State Assembly",
      deadline: "Dec 30, 2026",
      urgency: "info" as const,
      chips: ["Ethics", "Data-Bias", "Local-Law"],
      affectedCount: 4,
    },
  ];

  // Mock upcoming compliance calendar events
  const calendarEvents = [
    { event: "CMS FHIR API Compliance Deadline", date: "Nov 15, 2026", overdue: false },
    { event: "FDA CDS Draft Guidance Review", date: "May 01, 2026", overdue: true }, // Overdue!
    { event: "VPC Key KMS Rotation Checkoff", date: "Jul 10, 2026", overdue: false },
  ];

  // Mock affected accounts lookup
  const mockAffectedAccounts = {
    "CMS Interoperability & Prior Authorization Mandate": [
      { org: "Mayo Clinic", status: "done", score: 82 },
      { org: "Stanford Medicine", status: "blk", score: 46 },
      { org: "Ascension Health", status: "prog", score: 72 },
    ],
    "FDA Final Guidance on Clinical Decision Support (CDS) Software": [
      { org: "Mayo Clinic", status: "done", score: 82 },
      { org: "Texas Children's Hospital", status: "blk", score: 49 },
    ],
    "State Regulation: Algorithmic Discrimination in Healthcare Guidelines": [
      { org: "Cleveland Clinic", status: "done", score: 94 },
      { org: "Mass General Brigham", status: "done", score: 91 },
    ],
  };

  const handleGeminiScan = () => {
    showToast("Gemini is scanning federal AI feeds...", "info", "fa-wand-magic-sparkles");
    setTimeout(() => {
      showToast("Feeds up-to-date. No new regulatory signals detected.", "success");
    }, 1500);
  };

  const handleViewAffected = (title: string) => {
    setActiveSignalTitle(title);
    setIsAffectedOpen(true);
  };

  const handleRunFdaClassification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunningFda(true);
    showToast("Running FDA SaMD classification model via Gemini...", "info", "fa-wand-magic-sparkles");
    
    setTimeout(() => {
      setIsRunningFda(false);
      setFdaRecommendation(
        "Gemini Recommendation: Software is classified as SaMD Class II (Diagnostic Support). FDA 510(k) clearance pathways are required. Assessment D templates have been auto-populated."
      );
      showToast("FDA SaMD Classification report generated successfully!", "success");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER ACTION BAR */}
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1 page-header">
          <h1 className="text-gray-900">Regulatory Intelligence Feed</h1>
          <p className="text-xs text-gray-500">
            Real-time regulatory signals and FDA compliance tracking for HCLS active portals.
          </p>
        </div>

        <button
          onClick={handleGeminiScan}
          className="bg-purple-50 hover:bg-purple-50/80 border border-purple/20 text-purple text-xs font-bold px-3 py-2 rounded-md btn-transition shadow-sm flex items-center gap-1.5"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          <span>Trigger Gemini Scan</span>
        </button>
      </div>

      {/* 4 PORTFOLIO METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <MetricCard
          title="Active Signal Feeds"
          value="12"
          trend="Federal & State"
          trendType="neutral"
          icon="fa-rss"
        />
        <MetricCard
          title="Critical Urgency"
          value="4"
          trend="Requires CE review"
          trendType="neutral"
          icon="fa-triangle-exclamation"
        />
        <MetricCard
          title="Affected Managed Portals"
          value="6"
          trend="3 pre-sales / 3 prod"
          trendType="neutral"
          icon="fa-hospital"
        />
        <MetricCard
          title="Averages Compliance Index"
          value="92%"
          trend="+1.5% vs last month"
          trendType="up"
          icon="fa-heart-pulse"
        />
      </div>

      {/* 2-COLUMN DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 width): Regulatory signals list */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Active HCLS Compliance Signals
          </h3>

          <div className="flex flex-col gap-4 select-none">
            {regulatorySignals.map((sig, idx) => {
              const borderClasses = {
                crit: "border-l-red border-red/10 bg-red-50/20",
                warn: "border-l-amber border-amber/10 bg-amber-50/20",
                info: "border-l-blue border-blue/10 bg-blue-50/20",
              };

              const badgeLabels = {
                crit: "Critical Urgency",
                warn: "Warning Urgency",
                info: "Informational",
              };

              const badgeTypes = {
                crit: "critical" as const,
                warn: "warning" as const,
                info: "info" as const,
              };

              return (
                <div
                  key={idx}
                  className={`border rounded-r-md p-4 border-l-[3px] flex flex-col gap-4 select-text ${borderClasses[sig.urgency]}`}
                >
                  {/* Title, Source, Urgency */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 leading-tight">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-900 select-text">{sig.title}</span>
                      <span className="text-[10px] text-gray-400">Source: {sig.source}</span>
                    </div>
                    <Badge label={badgeLabels[sig.urgency]} variant={badgeTypes[sig.urgency]} className="flex-shrink-0" />
                  </div>

                  {/* Badge tags chips & deadline */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100/30 text-[10px]">
                    {/* Tag Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {sig.chips.map((chip, cIdx) => (
                        <span key={cIdx} className="bg-white border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                          {chip}
                        </span>
                      ))}
                    </div>

                    <span className="font-bold text-gray-900">
                      Deadline: {sig.deadline}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end pt-1 select-none">
                    <button
                      onClick={() => handleViewAffected(sig.title)}
                      className="border border-gray-200 hover:bg-gray-50 text-gray-750 text-[10px] font-bold px-3 py-1.5 rounded btn-transition uppercase tracking-wider"
                    >
                      Affected Accounts ({sig.affectedCount})
                    </button>
                    <button
                      onClick={() => {
                        showToast("Auto-populated Assessment D compliance schemas!", "success");
                        router.push(`/accounts/mayo-clinic`);
                      }}
                      className="bg-blue hover:bg-blue-dk text-white text-[10px] font-bold px-3 py-1.5 rounded btn-transition shadow-sm uppercase tracking-wider"
                    >
                      Link to Assessment D
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width): Compliance Calendar & SaMD review */}
        <div className="flex flex-col gap-6">
          
          {/* A. Compliance Calendar (Red highlights for overdue) */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4 select-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-calendar-days text-blue"></i>
              <span>Compliance Calendar</span>
            </h3>

            <div className="flex flex-col gap-3 text-xs select-text">
              {calendarEvents.map((cal, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 border-b border-gray-50 last:border-0 pb-2.5 last:pb-0">
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-semibold text-gray-900 truncate">{cal.event}</span>
                    <span className={`text-[10px] font-bold uppercase mt-1 ${cal.overdue ? "text-red" : "text-gray-400"}`}>
                      {cal.overdue ? "Overdue" : "Upcoming"}
                    </span>
                  </div>
                  <span className={`font-bold flex-shrink-0 text-[11px] ${cal.overdue ? "text-red" : "text-gray-500"}`}>
                    {cal.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* B. FDA SaMD review briefing card */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden nsc select-none">
            <div className="flex flex-col gap-1 leading-tight">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                SaMD Classifier Tool
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                FDA Software as a Medical Device (SaMD) Review
              </h4>
              <p className="text-[11px] text-white/75 leading-relaxed mt-1">
                Analyze active workflows with Gemini to determine whether clinical LLMs require formal FDA clearance pathways.
              </p>
            </div>

            <button
              onClick={() => setIsFdaOpen(true)}
              className="w-full bg-white hover:bg-gray-100 text-navy text-xs font-bold py-2 rounded-md btn-transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
            >
              <i className="fa-solid fa-clipboard-question"></i>
              <span>Start FDA SaMD Review</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* MODALS WIRING                              */}
      {/* ========================================== */}

      {/* A. View Affected Accounts Modal (480px) */}
      <Modal
        isOpen={isAffectedOpen}
        onClose={() => setIsAffectedOpen(false)}
        width="480px"
        title={`Affected Accounts: ${activeSignalTitle}`}
      >
        <div className="flex flex-col gap-4 text-xs">
          <p className="text-[11px] text-gray-500">
            Below is the list of clinical managed accounts whose EHR systems or use cases are directly impacted by this regulation:
          </p>

          <div className="flex flex-col gap-2">
            {mockAffectedAccounts[activeSignalTitle as keyof typeof mockAffectedAccounts]?.map((acc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded bg-gray-50/50">
                <span className="font-bold text-gray-900">{acc.org}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Score: {acc.score}%</span>
                  <Badge
                    label={acc.status === "done" ? "Production" : acc.status === "blk" ? "At-Risk" : "Pre-Sales"}
                    variant={acc.status === "done" ? "success" : acc.status === "blk" ? "critical" : "info"}
                  />
                </div>
              </div>
            )) || <span className="text-gray-400">No accounts affected.</span>}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-50">
            <button
              onClick={() => setIsAffectedOpen(false)}
              className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-xs font-semibold btn-transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* B. FDA SaMD Review Modal (480px) */}
      <Modal
        isOpen={isFdaOpen}
        onClose={() => {
          setIsFdaOpen(false);
          setFdaRecommendation(null);
        }}
        width="480px"
        title="FDA SaMD Classification Review"
      >
        <form onSubmit={handleRunFdaClassification} className="flex flex-col gap-3 text-xs">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Fill out standard clinical scoping parameters below. Gemini will cross-reference current FDA registers to analyze classification levels:
          </p>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Primary Use Case Mode</label>
            <select
              value={useCaseType}
              onChange={(e) => setUseCaseType(e.target.value)}
              className="border border-gray-200 rounded p-2 w-full focus:border-blue focus:outline-none"
            >
              <option value="Diagnostic">Diagnostic Support (Analyzing disease signals)</option>
              <option value="Treatment">Treatment Support (Prescribing regimens)</option>
              <option value="Administrative">Administrative workflow (Summarizations & logs)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Intended Use Briefing Description</label>
            <textarea
              rows={2}
              placeholder="Briefly describe clinical outputs..."
              defaultValue="Auto-generate post-visit discharge summarizations from patient EHR HL7 streams for practitioner verification."
              className="border border-gray-200 rounded p-2 w-full focus:border-blue focus:outline-none resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-2.5 mt-1 leading-tight">
            <span className="font-bold text-gray-500 text-[9px] uppercase tracking-wider mb-1 select-none">SaMD Screening Checklist</span>
            <label className="flex items-start gap-2 font-medium text-gray-700 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="accent-blue rounded mt-0.5" />
              <span>Software output directly influences patient-level therapeutic actions.</span>
            </label>
            <label className="flex items-start gap-2 font-medium text-gray-700 cursor-pointer select-none mt-1">
              <input type="checkbox" defaultChecked className="accent-blue rounded mt-0.5" />
              <span>Practitioner relies on output without manual raw telemetry validation.</span>
            </label>
          </div>

          {/* Recommendation output */}
          {fdaRecommendation && (
            <div className="p-3.5 bg-purple-50 border border-purple-100 rounded-md flex items-start gap-2 text-[11px] text-purple mt-2 leading-relaxed select-text animate-fade-in">
              <i className="fa-solid fa-wand-magic-sparkles mt-0.5 flex-shrink-0"></i>
              <span>{fdaRecommendation}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-3 border-t border-gray-50 mt-2 select-none">
            <button
              type="button"
              onClick={() => {
                setIsFdaOpen(false);
                setFdaRecommendation(null);
              }}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold btn-transition"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isRunningFda}
              className={`bg-blue hover:bg-blue-dk text-white px-3.5 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm uppercase tracking-wider flex items-center gap-1.5 ${
                isRunningFda ? "cursor-not-allowed bg-blue/60 shadow-none" : "cursor-pointer"
              }`}
            >
              {isRunningFda ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Running...</span>
                </>
              ) : (
                <span>Run Classification</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
