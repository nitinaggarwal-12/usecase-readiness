"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import FlagCard from "@/components/ui/FlagCard";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

type TabType = "Overview" | "Assessments" | "Reports" | "Intelligence" | "Success Tracker" | "Portfolio" | "Audit Trail";

export default function AccountDetailPage() {
  const router = useRouter();
  const { id: accountId } = useParams() as { id: string };
  const { showToast } = useToast();

  // 1. Active tab state
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  // 2. Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isBaaOpen, setIsBaaOpen] = useState(false);
  
  // Collab form mock inputs
  const [collabName, setCollabName] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [collabRole, setCollabRole] = useState("Business");

  // Determine mock data based on parameter id
  const isStanford = accountId === "stanford-medicine";
  
  const accountData = {
    orgName: isStanford ? "Stanford Medicine" : "Mayo Clinic",
    useCase: isStanford ? "Clinical Trial Co-Pilot" : "Patient Discharge Summarization",
    stage: isStanford ? ("At-Risk" as const) : ("Pre-Sales" as const),
    score: isStanford ? 46 : 82,
    ehrSystem: isStanford ? "Epic Systems v2024" : "Epic Systems v2023",
    cloudPrimary: isStanford ? "Google Cloud / hybrid" : "Google Cloud Native",
    ceName: "Nitin Aggarwal",
    aeName: "Sarah Jenkins",
    saName: "Devon Miller",
  };

  // List of 10 assessments (A-E Pre-sales, F-J Post-sales)
  const assessmentsList = [
    { code: "A", name: "Strategic Vision & Objectives", type: "Strategic", status: "done" as const, score: isStanford ? 78 : 88, date: "Jun 01, 2026", locked: false },
    { code: "B", name: "Business Value & KPI Map", type: "Business", status: "done" as const, score: isStanford ? 64 : 84, date: "Jun 01, 2026", locked: false },
    { code: "C", name: "Technical Readiness & EHR", type: "Technical", status: isStanford ? "blk" as const : "prog" as const, score: isStanford ? 35 : 75, date: "Jun 02, 2026", locked: false },
    { code: "D", name: "Data Governance & Security", type: "Security", status: isStanford ? "todo" as const : "todo" as const, score: 0, date: "—", locked: isStanford ? true : false },
    { code: "E", name: "FDE Qualification (Internal)", type: "Internal", status: "todo" as const, score: 0, date: "—", locked: true },
    { code: "F", name: "Solution Health Checklist", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true },
    { code: "G", name: "Value Realization Check", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true },
    { code: "H", name: "User Adoption & Change", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true },
    { code: "I", name: "Expansion Readiness Brief", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true },
    { code: "J", name: "Platform Maturity Report", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true },
  ];

  // Mock generated reports
  const mockReports = [
    { id: "rep-v1", name: "Pre-Sales Initial Baseline Report", score: isStanford ? 42 : 78, date: "Jun 01, 2026" },
    ...(isStanford ? [] : [{ id: "rep-v2", name: "Technical Readiness Mid-Scoping Report", score: 82, date: "Jun 02, 2026" }]),
  ];

  // Mock regulatory signals
  const mockSignals = [
    { title: "FDA Final Guidance: Clinical Decision Support (CDS) Rule", urgency: "critical", source: "FDA.gov", date: "3 days ago" },
    { title: "CMS Inpatient Data Interoperability Mandate (FHIR)", urgency: "warning", source: "CMS.gov", date: "1 week ago" },
  ];

  // Mock success tracker milestones
  const mockMilestones = [
    { name: "EHR Integration Scoping Completed", date: "Jun 01, 2026", status: "done" },
    { name: "HIPAA BAA Signed", date: isStanford ? "Pending" : "Jun 01, 2026", status: isStanford ? "blocked" : "done" },
    { name: "Nominated for FDE Fast-Track Scoping", date: "Target: Jun 15, 2026", status: "todo" },
  ];

  // Mock Audit trail logs
  const mockAuditLogs = [
    { action: "Assessment C Technical Scoping started", user: "Nitin Aggarwal", time: "3 hours ago" },
    { action: "Assessment B Business Value finalized", user: "Nitin Aggarwal", time: "1 day ago" },
    { action: "Account registered in Navigator Portal", user: "Nitin Aggarwal", time: "2 days ago" },
  ];

  // Tab buttons list
  const tabsList: TabType[] = ["Overview", "Assessments", "Reports", "Intelligence", "Success Tracker", "Portfolio", "Audit Trail"];

  // Run Assessment Navigator click
  const handleAssessmentClick = (code: string, isLocked: boolean) => {
    if (isLocked) {
      showToast("This assessment is locked. Complete prior phases first.", "warning");
      return;
    }
    router.push(`/assessments/${accountId}/${code}`);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* BACK NAVIGATION BUTTON */}
      <div className="select-none">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 btn-transition font-medium"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* SOLID NAVY SCORE HEADER BAND (Screen Header Component) */}
      <div className="bg-navy text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 select-none score-header">
        {/* Left details */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-bold leading-none">{accountData.orgName}</h2>
            <Badge label={accountData.stage} variant={accountData.stage === "At-Risk" ? "critical" : "info"} />
          </div>
          <p className="text-xs text-white/70 truncate">{accountData.useCase}</p>
          
          <div className="flex items-center gap-4 mt-2 text-[11px] text-white/60">
            <span><strong className="text-white/80">EHR:</strong> {accountData.ehrSystem}</span>
            <span><strong className="text-white/80">Cloud:</strong> {accountData.cloudPrimary}</span>
          </div>
        </div>

        {/* Right circular score ring */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex flex-col text-right text-xs leading-tight hidden sm:flex">
            <span className="font-bold text-white">Overall Readiness</span>
            <span className="text-[11px] text-white/60">EPIC Integration Weight</span>
          </div>
          <ScoreRing score={accountData.score} size="lg" className="border-white text-white ring-4 ring-white/10" />
        </div>
      </div>

      {/* 7-TAB NAVIGATION ROW */}
      <div className="flex border-b border-gray-200 select-none overflow-x-auto whitespace-nowrap py-1">
        {tabsList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold px-4 py-2 border-b-[2.5px] transition-all duration-200 focus:outline-none ${
              activeTab === tab
                ? "border-blue text-blue font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========================================================== */}
      {/* TAB PANELS VIEWPORTS                                       */}
      {/* ========================================================== */}

      {/* 1. OVERVIEW TAB PANEL */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left Column (2/3 width): Clickable Assessments A-E */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Pre-Sales Readiness Journey (Phases A–E)
            </h3>
            <p className="text-[11px] text-gray-500 mb-2">
              Select an active assessment card below to run or resume discovery questionnaires. Locked modules will open sequentially:
            </p>

            <div className="flex flex-col gap-3">
              {assessmentsList.slice(0, 5).map((assess) => (
                <div
                  key={assess.code}
                  onClick={() => handleAssessmentClick(assess.code, assess.locked)}
                  className={`border border-gray-100 rounded-md p-4 flex items-center justify-between gap-4 btn-transition hover:bg-gray-50/50 ${
                    assess.locked ? "opacity-60 cursor-not-allowed bg-gray-50/40" : "cursor-pointer"
                  }`}
                >
                  {/* Left title details */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Phase badge */}
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase ${
                      assess.locked 
                        ? "bg-gray-200 text-gray-400" 
                        : assess.status === "done" 
                        ? "bg-blue-50 text-blue" 
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}>
                      {assess.locked ? <i className="fa-solid fa-lock text-[10px]"></i> : assess.code}
                    </div>
                    
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs font-bold text-gray-900 truncate">{assess.name}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{assess.type} Assessment</span>
                    </div>
                  </div>

                  {/* Right status details */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {assess.status === "done" && (
                      <div className="w-7 h-7 rounded-full bg-green-50 border border-green/10 flex items-center justify-center text-[11px] font-bold text-green">
                        {assess.score}
                      </div>
                    )}
                    <Badge
                      label={assess.locked ? "Locked" : assess.status === "done" ? "Done" : assess.status === "prog" ? "In Progress" : "Start"}
                      variant={assess.locked ? "info" : assess.status === "done" ? "success" : assess.status === "prog" ? "warning" : "info"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (1/3 width): Next Step CTA + Blocker Alerts */}
          <div className="flex flex-col gap-6">
            
            {/* Next Step CTA Component */}
            <div className="bg-navy text-white rounded-xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden nsc">
              <div className="flex flex-col gap-1 leading-tight">
                <span className="text-[10px] font-bold uppercase text-gray-400 select-none tracking-wider">
                  Next Assessment Target
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 select-text">
                  Phase C: EHR Technical Readiness
                </h4>
                <p className="text-[11px] text-white/70 leading-relaxed mt-1">
                  Conduct a 30-minute scoping review to analyze EPIC OAuth credentials and schema configurations.
                </p>
              </div>

              <button
                onClick={() => router.push(`/assessments/${accountId}/C`)}
                className="w-full bg-white hover:bg-gray-100 text-navy text-xs font-bold py-2 rounded-md btn-transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
              >
                <i className="fa-solid fa-circle-play"></i>
                <span>Resume Assessment</span>
              </button>
            </div>

            {/* Critical Blockers flags list */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 select-none flex items-center gap-1.5">
                <i className="fa-solid fa-circle-exclamation text-red"></i>
                <span>Gating Blockers</span>
              </h3>
              
              <div className="flex flex-col gap-3">
                {isStanford ? (
                  <FlagCard
                    title="HIPAA BAA Pending Sign-off"
                    message="Clinical scoping completed but patient payloads are blocked pending legal BAA execution."
                    variant="crit"
                    actions={
                      <button
                        onClick={() => setIsBaaOpen(true)}
                        className="bg-red text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-red/90 btn-transition shadow-sm uppercase tracking-wider"
                      >
                        Fix Blocker
                      </button>
                    }
                  />
                ) : (
                  <FlagCard
                    title="No critical blockers detected"
                    message="This account has passed standard baseline milestones and is fully ready for final scoping."
                    variant="ok"
                    actions={
                      <button
                        onClick={() => showToast("Account health is 100% correct!", "success")}
                        className="bg-green text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-green/90 btn-transition shadow-sm uppercase tracking-wider"
                      >
                        Verify
                      </button>
                    }
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. ASSESSMENTS TAB PANEL */}
      {activeTab === "Assessments" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div className="flex flex-col leading-tight">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Assessment Ledger (A–J)</h3>
              <span className="text-[11px] text-gray-400 mt-1">Pre-sales and post-sales journey progression</span>
            </div>
            <button
              onClick={() => setIsCollabOpen(true)}
              className="bg-blue hover:bg-blue-dk text-white text-xs font-medium px-3 py-1.5 rounded btn-transition shadow-sm flex items-center gap-1.5"
            >
              <i className="fa-solid fa-users"></i>
              <span>Invite Customer Collab</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessmentsList.map((assess) => (
              <div
                key={assess.code}
                onClick={() => handleAssessmentClick(assess.code, assess.locked)}
                className={`border border-gray-100 rounded-md p-4 flex items-center justify-between gap-4 btn-transition hover:bg-gray-50/50 ${
                  assess.locked ? "opacity-60 cursor-not-allowed bg-gray-50/40" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    assess.locked 
                      ? "bg-gray-200 text-gray-400" 
                      : assess.status === "done" 
                      ? "bg-blue-50 text-blue" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {assess.locked ? <i className="fa-solid fa-lock text-[10px]"></i> : assess.code}
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-xs font-bold text-gray-900 truncate">{assess.name}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{assess.type} Assessment</span>
                  </div>
                </div>

                <Badge
                  label={assess.locked ? "Locked" : assess.status === "done" ? `Score: ${assess.score}` : assess.status === "prog" ? "In Progress" : "Locked"}
                  variant={assess.locked ? "info" : assess.status === "done" ? "success" : assess.status === "prog" ? "warning" : "info"}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REPORTS TAB PANEL */}
      {activeTab === "Reports" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Generated Readiness Reports
          </h3>

          <div className="flex flex-col gap-3">
            {mockReports.map((rep) => (
              <div key={rep.id} className="border border-gray-100 rounded-md p-4 flex items-center justify-between gap-4 bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-blue flex items-center justify-center text-xs flex-shrink-0">
                    <i className="fa-solid fa-file-lines text-sm"></i>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold text-gray-900">{rep.name}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">Generated on {rep.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[11px] font-bold text-blue">
                    {rep.score}
                  </div>
                  <button
                    onClick={() => router.push(`/reports/${rep.id}`)}
                    className="bg-blue hover:bg-blue-dk text-white text-xs font-medium px-3 py-1.5 rounded btn-transition shadow-sm"
                  >
                    Read Report
                  </button>
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded btn-transition"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INTELLIGENCE TAB PANEL */}
      {activeTab === "Intelligence" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Regulatory Signal scanning */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Gemini Scan Regulatory Signals</h3>
              <button
                onClick={() => showToast("Gemini Scanning active feeds...", "info", "fa-wand-magic-sparkles")}
                className="bg-purple-50 hover:bg-purple-50/80 border border-purple/10 text-purple text-[11px] font-bold px-2.5 py-1.5 rounded-md btn-transition shadow-sm"
              >
                <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>
                <span>Trigger Gemini Scan</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {mockSignals.map((sig, idx) => (
                <div key={idx} className={`border border-gray-100 rounded-md p-4 border-l-[3px] ${
                  sig.urgency === "critical" ? "border-l-red" : "border-l-amber"
                } bg-gray-50/30`}>
                  <div className="flex justify-between gap-4 items-start">
                    <span className="text-xs font-bold text-gray-900">{sig.title}</span>
                    <Badge label={sig.urgency} variant={sig.urgency === "critical" ? "critical" : "warning"} />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
                    <span>Source: {sig.source}</span>
                    <span>Scanned {sig.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Insight Briefing */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 select-none">
              <i className="fa-solid fa-circle-info text-purple"></i>
              <span>Gemini AI Briefing</span>
            </h3>
            
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-md flex flex-col gap-2 text-[11px] text-purple leading-relaxed">
              <span className="font-bold flex items-center gap-1">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Executive Summary</span>
              </span>
              <p className="text-gray-700">
                Patient Discharge Summarization represents a high Business Value match (+85%) to Google Cloud's Med-LM architectures. Scopes can achieve 30% reduction in discharge notes turnaround times. The primary bottleneck is the outstanding HIPAA BAA signature which requires urgent C-suite engagement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUCCESS TRACKER TAB PANEL */}
      {activeTab === "Success Tracker" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div className="flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Roadmap & Milestones</h3>
              <span className="text-[11px] text-gray-400 mt-1">Blockers-to-production pathway timeline</span>
            </div>
            <button
              onClick={() => router.push(`/timeline/${accountId}`)}
              className="bg-blue hover:bg-blue-dk text-white text-xs font-medium px-3 py-1.5 rounded btn-transition shadow-sm flex items-center gap-1.5"
            >
              <i className="fa-solid fa-calendar-days"></i>
              <span>View Timeline / Gantt</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 pl-4 relative border-l border-gray-200 ml-2 py-2">
            {mockMilestones.map((m, idx) => (
              <div key={idx} className="relative flex items-start gap-4 select-none">
                {/* Dot representing state */}
                <div className={`absolute left-[-21px] w-3 h-3 rounded-full border-2 border-white flex items-center justify-center ${
                  m.status === "done" 
                    ? "bg-green" 
                    : m.status === "blocked" 
                    ? "bg-red animate-ping" 
                    : "bg-gray-300"
                }`} />
                
                <div className="flex flex-col leading-tight text-xs">
                  <span className="font-bold text-gray-900">{m.name}</span>
                  <span className={`text-[10px] mt-0.5 font-medium ${
                    m.status === "done" ? "text-green" : m.status === "blocked" ? "text-red" : "text-gray-400"
                  }`}>{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PORTFOLIO (TEAM) TAB PANEL */}
      {activeTab === "Portfolio" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-6 animate-fade-in">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
              Account Team & Technical Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs select-none">
            {/* Team block */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase text-gray-500">Google Account Team</span>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 border border-gray-100 rounded-md">
                <div className="flex flex-col leading-tight">
                  <span className="text-gray-400 font-semibold">Customer Engineer</span>
                  <span className="text-gray-900 font-medium mt-0.5">{accountData.ceName}</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-gray-400 font-semibold">Account Executive</span>
                  <span className="text-gray-900 font-medium mt-0.5">{accountData.aeName}</span>
                </div>
                <div className="flex flex-col leading-tight col-span-2 mt-2">
                  <span className="text-gray-400 font-semibold">Solutions Architect</span>
                  <span className="text-gray-900 font-medium mt-0.5">{accountData.saName}</span>
                </div>
              </div>
            </div>

            {/* Technical details */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase text-gray-500">System Infrastructure Specs</span>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 border border-gray-100 rounded-md">
                <div className="flex flex-col leading-tight">
                  <span className="text-gray-400 font-semibold">EHR Provider Platform</span>
                  <span className="text-gray-900 font-medium mt-0.5">{accountData.ehrSystem}</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-gray-400 font-semibold">Primary Cloud Framework</span>
                  <span className="text-gray-900 font-medium mt-0.5">{accountData.cloudPrimary}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. AUDIT TRAIL TAB PANEL */}
      {activeTab === "Audit Trail" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Security Audit Trail Logs
          </h3>

          <div className="flex flex-col gap-3 select-none">
            {mockAuditLogs.map((log, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 p-3 border border-gray-100 rounded bg-gray-50/30 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <i className="fa-solid fa-history text-[10px]"></i>
                  </div>
                  <span className="text-gray-900 truncate select-text">{log.action}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-right text-[10px] text-gray-400">
                  <span>By {log.user}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODALS WIRING (Triggered by Actions)                       */}
      {/* ========================================================== */}

      {/* A. Share Link Modal */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        width="440px"
        title="Generate Secure Share Link"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Create a secure read-only dashboard link that can be shared directly with customer sponsors:
          </p>

          <div className="flex flex-col gap-2 border border-gray-100 rounded bg-gray-50 p-3">
            {[
              "Require zero Google Login credentials to view",
              "Limit access strictly to Cleveland Clinic's portal",
              "Set automatic security token expiry (90 days)",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <i className="fa-solid fa-circle-check text-green text-[11px]"></i>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded p-2 bg-white mt-1">
            <input
              type="text"
              readOnly
              value={`https://hcls-navigator.google.com/share/cleveland-clinic-${accountId}`}
              className="text-[11px] text-gray-500 focus:outline-none select-all w-full truncate bg-transparent"
            />
            <button
              onClick={() => {
                setIsShareOpen(false);
                showToast("Secure link copied to clipboard!", "success");
              }}
              className="bg-blue hover:bg-blue-dk text-white text-[10px] font-bold px-2.5 py-1.5 rounded flex-shrink-0 uppercase tracking-wider"
            >
              Copy
            </button>
          </div>
        </div>
      </Modal>

      {/* B. Invite Customer Collab Modal */}
      <Modal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        width="440px"
        title="Invite Customer Collaboration"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsCollabOpen(false);
            showToast(`Invitation sent successfully to ${collabName}!`, "success");
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-gray-700">Collaborator Full Name</label>
            <input
              type="text"
              placeholder="e.g., Dr. John Doe"
              value={collabName}
              onChange={(e) => setCollabName(e.target.value)}
              className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="e.g., jdoe@mayocrap.org" // wait, let's keep it clean: e.g. jdoe@mayo.edu
              value={collabEmail}
              onChange={(e) => setCollabEmail(e.target.value)}
              className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-gray-700">Healthcare Staff Role</label>
            <select 
              value={collabRole} 
              onChange={(e) => setCollabRole(e.target.value)} 
              className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none"
            >
              <option>Business sponsor (CMO / CEO)</option>
              <option>IT Infrastructure lead</option>
              <option>Security & Compliance officer</option>
              <option>Financial value sponsor</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-gray-50 mt-2">
            <button
              type="button"
              onClick={() => setIsCollabOpen(false)}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold btn-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue hover:bg-blue-dk text-white px-3.5 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>

      {/* C. BAA Action Escalate Modal */}
      <Modal
        isOpen={isBaaOpen}
        onClose={() => setIsBaaOpen(false)}
        width="440px"
        title="Escalate BAA Contract Setup"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            This action will dispatch a pre-filled escalation alert to Google Cloud Legal and your account executives to prioritize HIPAA BAA sign-off:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-[11px] font-mono text-gray-700 select-all leading-normal whitespace-pre-wrap">
{`To: legal-hcls@google.com
CC: sjenkins@google.com, dmiller@google.com
Subject: URGENT: HIPAA BAA Escalation - ${accountData.orgName}

Dear Legal,
Please expedite the review of outstanding HIPAA Business Associate Agreement (BAA) amendments for ${accountData.orgName}. 
Technical readiness for 'Clinical Trial Co-Pilot' is fully configured.

Regards,
${accountData.ceName} (HCLS CE)`}
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-gray-50">
            <button
              onClick={() => setIsBaaOpen(false)}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold btn-transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsBaaOpen(false);
                showToast("BAA Escalation email dispatched successfully!", "success");
              }}
              className="bg-red hover:bg-red/90 text-white px-3.5 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm uppercase tracking-wider"
            >
              Send Email
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
