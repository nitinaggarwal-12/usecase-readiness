"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import FlagCard from "@/components/ui/FlagCard";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { useDemo } from "@/context/DemoContext";
import { demoScenarios } from "@/lib/demo-data/scenarios";

type TabType = "Customer Profile" | "Assessments" | "Reports" | "Intelligence" | "Success Tracker" | "Portfolio" | "Audit Trail";

export default function AccountDetailPage() {
  const router = useRouter();
  const { id: accountId } = useParams() as { id: string };
  const { showToast } = useToast();
  const { demoState, scenarios, toggleAssessmentAssignment } = useDemo();
  const isDemo = demoState.isActive;

  // 1. Active tab state
  const [activeTab, setActiveTab] = useState<TabType>("Customer Profile");

  // 2. Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isBaaOpen, setIsBaaOpen] = useState(false);
  
  // Collab form mock inputs
  const [collabName, setCollabName] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [collabRole, setCollabRole] = useState("Business");

  // Load saved custom assessment if available in history
  const [customAccount, setCustomAccount] = useState<{
    orgName: string;
    useCase: string;
    stage: "Pre-Sales" | "At-Risk" | "Stable" | "Success";
    score: number;
    ehrSystem: string;
    cloudPrimary: string;
    ceName: string;
    aeName: string;
    saName: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hcls_usecase_readiness_history");
    if (saved && accountId) {
      try {
        const list: Array<{ id: string; customerName: string; segment?: string; useCase?: string; score?: number }> = JSON.parse(saved);
        const match = list.find(item => {
          const slug = item.customerName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return item.id === accountId || slug === accountId;
        });
        if (match) {
          const scoreVal = match.score || 0;
          setCustomAccount({
            orgName: match.customerName,
            useCase: match.useCase || "Usecase Scoping Discovery",
            stage: scoreVal >= 76 ? "Success" : (scoreVal >= 51 ? "Stable" : "At-Risk"),
            score: scoreVal,
            ehrSystem: "Epic Systems v2024",
            cloudPrimary: "Google Cloud Native",
            ceName: "Nitin Aggarwal",
            aeName: "Sarah Jenkins",
            saName: "Devon Miller",
            description: match.useCase || "Usecase Scoping Discovery details",
          });
        }
      } catch (e) {
        console.error("Error reading custom account data", e);
      }
    }
  }, [accountId]);

  // Resolve the active scenario using the route parameter accountId
  const resolvedScenario = scenarios.find(
    (s) => s.id === accountId || s.id.startsWith(accountId) || accountId.startsWith(s.id)
  ) || demoState.selectedScenario || scenarios[0];

  const getMockScoreValue = (range: string): number => {
    if (range === "concerning") return 46;
    if (range === "moderate") return 68;
    if (range === "strong") return 84;
    return 95;
  };

  const getScenarioScore = (sc: typeof demoScenarios[0]) => {
    if (sc.id === demoState.scenarioId) {
      return getMockScoreValue(demoState.scoreRange);
    }
    if (sc.id === "northside-health") return 68;
    if (sc.id === "pacific-medical") return 89;
    if (sc.id === "midamerica-payer") return 48;
    if (sc.id === "raphael-academic") return 91;
    
    // Dynamic average for custom scenarios
    const completedScores = Object.values(sc.scores).filter((s): s is number => typeof s === "number" && s > 0);
    if (completedScores.length > 0) {
      const sum = completedScores.reduce((a, b) => a + b, 0);
      return Math.round(sum / completedScores.length);
    }
    
    return 0;
  };

  const getDemoPath = (path: string) => {
    return isDemo ? `/demo${path}` : path;
  };

  // Determine mock data based on parameter id
  const isStanford = accountId === "stanford-medicine";
  
  const realAccountData = {
    orgName: isStanford ? "Stanford Medicine" : "Mayo Clinic",
    useCase: isStanford ? "Clinical Trial Co-Pilot" : "Patient Discharge Summarization",
    stage: isStanford ? ("At-Risk" as const) : ("Pre-Sales" as const),
    score: isStanford ? 46 : 82,
    ehrSystem: isStanford ? "Epic Systems v2024" : "Epic Systems v2023",
    cloudPrimary: isStanford ? "Google Cloud / hybrid" : "Google Cloud Native",
    ceName: "Nitin Aggarwal",
    aeName: "Sarah Jenkins",
    saName: "Devon Miller",
    description: isStanford ? "Clinical Trial Co-Pilot setup scoping description" : "Patient Discharge Summarization clinical scoping review",
  };

  const accountData = customAccount || (isDemo ? {
    orgName: resolvedScenario.account.name,
    useCase: resolvedScenario.account.useCase,
    stage: resolvedScenario.account.stage,
    score: getScenarioScore(resolvedScenario),
    ehrSystem: resolvedScenario.account.ehr,
    cloudPrimary: resolvedScenario.account.cloud,
    ceName: resolvedScenario.account.ce,
    aeName: resolvedScenario.account.ae || "Sarah Jenkins",
    saName: resolvedScenario.account.sa || "Devon Miller",
    description: resolvedScenario.account.description || "",
  } : realAccountData);

  // List of 10 assessments (A-E Pre-sales, F-J Post-sales)
  const getDemoAssessmentsList = (sc: typeof demoScenarios[0]) => {
    const baseAssessments = [
      { code: "A", name: "Strategic Vision & Objectives", type: "Strategic" },
      { code: "B", name: "Business Value & KPI Map", type: "Business" },
      { code: "C", name: "Technical Readiness & EHR", type: "Technical" },
      { code: "D", name: "Data Governance & Security", type: "Security" },
      { code: "E", name: "FDE Qualification (Internal)", type: "Internal" },
      { code: "F", name: "Solution Health Checklist", type: "Production" },
      { code: "G", name: "Value Realization Check", type: "Production" },
      { code: "H", name: "User Adoption & Change", type: "Production" },
      { code: "I", name: "Expansion Readiness Brief", type: "Production" },
      { code: "J", name: "Platform Maturity Report", type: "Production" },
    ];

    return baseAssessments.map((ba, index) => {
      const code = ba.code;
      let status: "done" | "prog" | "blk" | "todo" = "todo";
      let score = 0;
      let date = "—";
      let locked = true;

      const currentScore = sc.scores[code];
      const scoreVal = typeof currentScore === "number" ? currentScore : 0;

      if (scoreVal > 0) {
        if (sc.id === "northside-health") {
          if (code === "A") date = "Oct 12, 2024";
          else if (code === "B") date = "Oct 14, 2024";
          else if (code === "C") date = "Oct 22, 2024";
        } else if (sc.id === "pacific-medical") {
          date = "Nov 02, 2024";
        } else if (sc.id === "midamerica-payer") {
          date = code === "F" ? "Nov 10, 2024" : "Oct 01, 2024";
        } else if (sc.id === "raphael-academic") {
          date = "Sep 15, 2023";
        } else {
          date = "Recently";
        }
      }

      const assignedList = sc.assignedAssessments || ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      const isAssigned = assignedList.includes(code);

      const isSequential = !sc.assignedAssessments;
      if (isSequential) {
        if (index === 0) {
          locked = false;
        } else {
          const prevCode = baseAssessments[index - 1].code;
          const prevScore = sc.scores[prevCode];
          const isPrevCompleted = typeof prevScore === "number" && prevScore > 0;
          locked = !isPrevCompleted;
        }
      } else {
        // Custom scenario: unlocked if assigned, locked if unassigned (toggle dynamically)
        locked = !isAssigned;
      }

      if (scoreVal > 0) {
        score = scoreVal;
        if (scoreVal < 60) {
          status = "blk";
        } else {
          status = "done";
        }
      } else {
        status = "todo";
      }

      return {
        code,
        name: ba.name,
        type: ba.type,
        status,
        score,
        date,
        locked,
        isAssigned,
      };
    });
  };

  const getCustomAssessmentsList = (score: number) => {
    const scoreA = Math.min(Math.round(score * 1.1), 95);
    const scoreB = score;
    const scoreC = Math.max(Math.round(score * 0.8), 30);
    const scoreD = score >= 85 ? Math.round(score * 0.9) : 0;

    return [
      { code: "A", name: "Strategic Vision & Objectives", type: "Strategic", status: "done" as const, score: scoreA, date: "Jun 04, 2026", locked: false, isAssigned: true },
      { code: "B", name: "Business Value & KPI Map", type: "Business", status: "done" as const, score: scoreB, date: "Jun 04, 2026", locked: false, isAssigned: true },
      { code: "C", name: "Technical Readiness & EHR", type: "Technical", status: "prog" as const, score: scoreC, date: "Jun 04, 2026", locked: false, isAssigned: true },
      { code: "D", name: "Data Governance & Security", type: "Security", status: scoreD > 0 ? "done" as const : "todo" as const, score: scoreD, date: scoreD > 0 ? "Jun 04, 2026" : "—", locked: false, isAssigned: true },
      { code: "E", name: "FDE Qualification (Internal)", type: "Internal", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
      { code: "F", name: "Solution Health Checklist", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
      { code: "G", name: "Value Realization Check", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
      { code: "H", name: "User Adoption & Change", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
      { code: "I", name: "Expansion Readiness Brief", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
      { code: "J", name: "Platform Maturity Report", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
    ];
  };

  const realAssessmentsList = [
    { code: "A", name: "Strategic Vision & Objectives", type: "Strategic", status: "done" as const, score: isStanford ? 78 : 88, date: "Jun 01, 2026", locked: false, isAssigned: true },
    { code: "B", name: "Business Value & KPI Map", type: "Business", status: "done" as const, score: isStanford ? 64 : 84, date: "Jun 01, 2026", locked: false, isAssigned: true },
    { code: "C", name: "Technical Readiness & EHR", type: "Technical", status: isStanford ? "blk" as const : "prog" as const, score: isStanford ? 35 : 75, date: "Jun 02, 2026", locked: false, isAssigned: true },
    { code: "D", name: "Data Governance & Security", type: "Security", status: isStanford ? "todo" as const : "todo" as const, score: 0, date: "—", locked: isStanford ? true : false, isAssigned: true },
    { code: "E", name: "FDE Qualification (Internal)", type: "Internal", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
    { code: "F", name: "Solution Health Checklist", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
    { code: "G", name: "Value Realization Check", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
    { code: "H", name: "User Adoption & Change", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
    { code: "I", name: "Expansion Readiness Brief", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
    { code: "J", name: "Platform Maturity Report", type: "Production", status: "todo" as const, score: 0, date: "—", locked: true, isAssigned: true },
  ];

  const assessmentsList = customAccount
    ? getCustomAssessmentsList(customAccount.score)
    : (isDemo ? getDemoAssessmentsList(resolvedScenario) : realAssessmentsList);

  // Mock generated reports
  const getDemoReports = (sc: typeof demoScenarios[0]) => {
    const standardReportsMap: Record<string, { id: string; name: string; score: number; date: string }[]> = {
      "northside-health": [
        { id: "C", name: "Technical Readiness Mid-Scoping Report (Assessment C)", score: sc.id === demoState.scenarioId ? getMockScoreValue(demoState.scoreRange) : 58, date: "Oct 22, 2024" },
        { id: "B", name: "Business Value & KPI Map Report (Assessment B)", score: 68, date: "Oct 14, 2024" },
        { id: "A", name: "Strategic Vision & Objectives Report (Assessment A)", score: 76, date: "Oct 12, 2024" },
      ],
      "pacific-medical": [
        { id: "E", name: "FDE Qualification Engagement Report (Assessment E)", score: sc.id === demoState.scenarioId ? getMockScoreValue(demoState.scoreRange) : 89, date: "Nov 02, 2024" },
      ],
      "midamerica-payer": [
        { id: "F", name: "Claims Denial AI Baseline Report (Assessment F)", score: sc.id === demoState.scenarioId ? getMockScoreValue(demoState.scoreRange) : 48, date: "Nov 10, 2024" },
      ],
      "raphael-academic": [
        { id: "J", name: "Platform Maturity Report (Assessment J)", score: sc.id === demoState.scenarioId && demoState.scoreRange ? getMockScoreValue(demoState.scoreRange) : 91, date: "May 01, 2024" },
        { id: "G", name: "Value Confirmation Report (Assessment G)", score: 88, date: "Mar 15, 2024" },
      ]
    };

    if (standardReportsMap[sc.id]) {
      return standardReportsMap[sc.id];
    }

    const reports: { id: string; name: string; score: number; date: string }[] = [];
    const nameMap: Record<string, string> = {
      A: "Strategic Vision & Objectives Report",
      B: "Business Value & KPI Map Report",
      C: "Technical Readiness & EHR Report",
      D: "Data Governance & Security Report",
      E: "FDE Qualification Engagement Report",
      F: "Solution Health Checklist Report",
      G: "Value Realization Check Report",
      H: "User Adoption & Change Report",
      I: "Expansion Readiness Brief Report",
      J: "Platform Maturity Report"
    };

    for (const [code, score] of Object.entries(sc.scores)) {
      if (score && typeof score === "number" && score > 0) {
        reports.push({
          id: code,
          name: `${nameMap[code] || "Readiness Report"} (Assessment ${code})`,
          score: score,
          date: "Recently"
        });
      }
    }
    return reports.reverse();
  };

  const realReports = [
    { id: "rep-v1", name: "Pre-Sales Initial Baseline Report", score: isStanford ? 42 : 78, date: "Jun 01, 2026" },
    ...(isStanford ? [] : [{ id: "rep-v2", name: "Technical Readiness Mid-Scoping Report", score: 82, date: "Jun 02, 2026" }]),
  ];

  const mockReports = isDemo ? getDemoReports(resolvedScenario) : realReports;

  // Mock regulatory signals
  const getDemoSignals = (sc: typeof demoScenarios[0]) => {
    return sc.regulatorySignals.map((sig, i) => ({
      title: sig,
      urgency: (sig.includes("Interoperability") || sig.includes("Rule") || sig.includes("Act") ? "critical" : "warning") as "critical" | "warning",
      source: "Gemini Regulatory Scan",
      date: `${i + 1} days ago`,
    }));
  };

  const realSignals = [
    { title: "FDA Final Guidance: Clinical Decision Support (CDS) Rule", urgency: "critical", source: "FDA.gov", date: "3 days ago" },
    { title: "CMS Inpatient Data Interoperability Mandate (FHIR)", urgency: "warning", source: "CMS.gov", date: "1 week ago" },
  ];

  const mockSignals = isDemo ? getDemoSignals(resolvedScenario) : realSignals;

  // Mock success tracker milestones
  const getDemoMilestones = (sc: typeof demoScenarios[0]) => {
    return sc.timeline.map((m) => ({
      name: m.name,
      date: m.duration,
      status: m.status === "done" ? ("done" as const) : m.status === "blocked" ? ("blocked" as const) : ("todo" as const),
    }));
  };

  const realMilestones = [
    { name: "EHR Integration Scoping Completed", date: "Jun 01, 2026", status: "done" },
    { name: "HIPAA BAA Signed", date: isStanford ? "Pending" : "Jun 01, 2026", status: isStanford ? "blocked" : "done" },
    { name: "Nominated for FDE Fast-Track Scoping", date: "Target: Jun 15, 2026", status: "todo" },
  ];

  const mockMilestones = isDemo ? getDemoMilestones(resolvedScenario) : realMilestones;

  // Mock Audit trail logs
  const getDemoAuditLogs = (sc: typeof demoScenarios[0]) => {
    if (sc.id === "northside-health") {
      return [
        { action: "Assessment C Technical Scoping in progress", user: "Nitin Chandra", time: "2 hours ago" },
        { action: "Assessment B Business Value finalized", user: "Nitin Chandra", time: "1 day ago" },
        { action: "Account registered in Navigator Portal", user: "Nitin Chandra", time: "3 days ago" },
      ];
    }
    if (sc.id === "pacific-medical") {
      return [
        { action: "Nominated for FDE engagement", user: "Nitin Chandra", time: "5 mins ago" },
        { action: "Assessment E completed with score 89", user: "Nitin Chandra", time: "1 hour ago" },
      ];
    }
    if (sc.id === "midamerica-payer") {
      return [
        { action: "Member portal claims adoption flag escalated", user: "Nitin Chandra", time: "3 hours ago" },
        { action: "Assessment F marked blocked due to adoption rate", user: "Nitin Chandra", time: "1 day ago" },
      ];
    }
    if (sc.id === "raphael-academic") {
      return [
        { action: "Assessment J Platform Maturity report generated", user: "Nitin Chandra", time: "1 month ago" },
        { action: "Production launch validation sign-off completed", user: "Nitin Chandra", time: "2 months ago" },
      ];
    }

    // Dynamic audit logs for custom scenarios
    interface AuditLog {
      action: string;
      user: string;
      time: string;
    }
    const logs: AuditLog[] = [];
    const baseCodes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const codeNameMap: Record<string, string> = {
      A: "Strategic Vision",
      B: "Business Value",
      C: "Technical Scoping",
      D: "Data & Security Check",
      E: "FDE Qualification",
      F: "Solution Health Checklist",
      G: "Value Realization Check",
      H: "User Adoption Review",
      I: "Expansion Scoping",
      J: "Platform Maturity Audit"
    };

    baseCodes.forEach((code) => {
      const score = sc.scores[code];
      if (score && typeof score === "number" && score > 0) {
        logs.push({
          action: `Assessment ${code} ${codeNameMap[code]} finalized (Score: ${score})`,
          user: sc.account.ce || "Nitin Aggarwal",
          time: "Recently"
        });
      }
    });

    logs.push({
      action: "Account registered in Navigator Portal",
      user: sc.account.ce || "Nitin Aggarwal",
      time: "Recently"
    });

    return logs;
  };

  const realAuditLogs = [
    { action: "Assessment C Technical Scoping started", user: "Nitin Aggarwal", time: "3 hours ago" },
    { action: "Assessment B Business Value finalized", user: "Nitin Aggarwal", time: "1 day ago" },
    { action: "Account registered in Navigator Portal", user: "Nitin Aggarwal", time: "2 days ago" },
  ];

  const mockAuditLogs = isDemo ? getDemoAuditLogs(resolvedScenario) : realAuditLogs;

  interface AssessmentItem {
    code: string;
    name: string;
    type: string;
    status: "done" | "prog" | "blk" | "todo";
    score: number;
    date: string;
    locked: boolean;
    isAssigned: boolean;
  }

  // Tab buttons list
  const tabsList: TabType[] = ["Customer Profile", "Assessments", "Reports", "Intelligence", "Success Tracker", "Portfolio", "Audit Trail"];

  // Run Assessment Navigator click
  const handleAssessmentClick = (assess: AssessmentItem) => {
    if (customAccount) {
      const pillarMap: Record<string, number> = { A: 1, B: 2, C: 3, D: 6 };
      const targetPillar = pillarMap[assess.code] || 1;
      router.push(getDemoPath(`/usecase-readiness?id=${accountId}&pillar=${targetPillar}`));
      return;
    }

    if (isDemo && !assess.isAssigned) {
      toggleAssessmentAssignment(resolvedScenario.id, assess.code);
      showToast(`Assessment ${assess.code} assigned and activated!`, "success");
      return;
    }
    if (assess.locked) {
      showToast("This assessment is locked. Complete prior phases first.", "warning");
      return;
    }
    router.push(getDemoPath(`/assessments/${resolvedScenario.id}/${assess.code}`));
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* BACK NAVIGATION BUTTON */}
      <div className="select-none">
        <button
          onClick={() => router.push(getDemoPath("/"))}
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

      {/* 1. CUSTOMER PROFILE TAB PANEL */}
      {activeTab === "Customer Profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left Column (2/3 width): Clickable Assessments A-E */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Pre-Sales Readiness Journey (Phases A–D)
            </h3>
            <p className="text-[11px] text-gray-500 mb-2">
              Select an active assessment card below to run or resume discovery questionnaires. Locked modules will open sequentially:
            </p>

            <div className="flex flex-col gap-3">
              {assessmentsList.slice(0, 4).map((assess) => {
                const showLockedIcon = isDemo ? (assess.isAssigned && assess.locked) : assess.locked;
                return (
                  <div
                    key={assess.code}
                    onClick={() => handleAssessmentClick(assess)}
                    className={`border rounded-md p-4 flex items-center justify-between gap-4 btn-transition ${
                      isDemo && !assess.isAssigned
                        ? "border-dashed border-gray-300 bg-gray-50/30 hover:bg-gray-100/50 cursor-pointer"
                        : assess.locked 
                        ? "border-gray-100 opacity-60 cursor-not-allowed bg-gray-50/40" 
                        : "border-gray-100 cursor-pointer hover:bg-gray-50/50"
                    }`}
                  >
                    {/* Left title details */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Phase badge */}
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase ${
                        showLockedIcon
                          ? "bg-gray-200 text-gray-400" 
                          : assess.status === "done" 
                          ? "bg-blue-50 text-blue" 
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}>
                        {showLockedIcon ? <i className="fa-solid fa-lock text-[10px]"></i> : assess.code}
                      </div>
                      
                      <div className="flex flex-col leading-tight min-w-0">
                        <span className="text-xs font-bold text-gray-900 truncate">{assess.name}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{assess.type} Assessment</span>
                      </div>
                    </div>

                    {/* Right status details */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {(!isDemo || assess.isAssigned) && assess.status === "done" && (
                        <div className="w-7 h-7 rounded-full bg-green-50 border border-green/10 flex items-center justify-center text-[11px] font-bold text-green">
                          {assess.score}
                        </div>
                      )}
                      <Badge
                        label={
                          isDemo && !assess.isAssigned
                            ? "Optional (+ Assign)"
                            : assess.locked
                            ? "Locked"
                            : assess.status === "done"
                            ? "Done"
                            : assess.status === "prog"
                            ? "In Progress"
                            : "Start"
                        }
                        variant={
                          isDemo && !assess.isAssigned
                            ? "info"
                            : assess.locked
                            ? "info"
                            : assess.status === "done"
                            ? "success"
                            : assess.status === "prog"
                            ? "warning"
                            : "info"
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (1/3 width): Next Step CTA + Blocker Alerts */}
          <div className="flex flex-col gap-6">
            
            {/* Next Step CTA Component */}
            {(() => {
              const firstUncompleted = assessmentsList.find(a => a.status === "todo" || a.status === "prog" || a.status === "blk");
              
              const getDemoNextTarget = () => {
                if (!firstUncompleted) {
                  return {
                    title: "All Phases Completed!",
                    desc: `${resolvedScenario.account.name} has passed all milestones. Read the Platform Maturity Report.`,
                    label: "Read Report J",
                    target: "J"
                  };
                }
                
                const codeMap: Record<string, { title: string; desc: string; label: string }> = {
                  A: { title: "Phase A: Strategic Vision & Objectives", desc: "Align on executive priorities and establish baseline success criteria.", label: "Start Assessment" },
                  B: { title: "Phase B: Business Value & KPI Map", desc: "Map business value metrics and define target performance KPIs.", label: "Start Assessment" },
                  C: { title: "Phase C: EHR Technical Readiness", desc: "Analyze EHR integration interfaces, OAuth configurations, and scopes.", label: "Resume Scoping" },
                  D: { title: "Phase D: Data Governance & Security", desc: "Conduct compliance review, patient data flows, and secure storage mapping.", label: "Start Assessment" },
                  E: { title: "Phase E: FDE Qualification", desc: "Review discovery checklist and internal qualification gates.", label: "Finalize nomination" },
                  F: { title: "Phase F: Solution Health Checklist", desc: "Evaluate solution health parameters, API latency, and integration bottlenecks.", label: "Resume Checklist" },
                  G: { title: "Phase G: Value Realization Check", desc: "Confirm business value metrics and check ROI realizations.", label: "Start Review" },
                  H: { title: "Phase H: User Adoption & Change", desc: "Assess user adoption campaign and clinician feedback surveys.", label: "Start Review" },
                  I: { title: "Phase I: Expansion Readiness Brief", desc: "Analyze potential expansion use cases and resource workloads.", label: "Start Briefing" },
                  J: { title: "Phase J: Platform Maturity Report", desc: "Evaluate full circle platform maturity metrics and generate final report.", label: "Read Report" }
                };
                
                const mapped = codeMap[firstUncompleted.code] || {
                  title: `Phase ${firstUncompleted.code}: ${firstUncompleted.name}`,
                  desc: "Conduct clinical readiness assessment and review discovery requirements.",
                  label: "Resume Assessment"
                };
                
                return {
                  title: mapped.title,
                  desc: mapped.desc,
                  label: mapped.label,
                  target: firstUncompleted.code
                };
              };

              const demoNextTarget = isDemo ? getDemoNextTarget() : { title: "Phase C: EHR Technical Readiness", desc: "Conduct a 30-minute scoping review to analyze EPIC OAuth credentials and schema configurations.", label: "Resume Assessment", target: "C" };

              return (
                <div className="bg-navy text-white rounded-xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden nsc">
                  <div className="flex flex-col gap-1 leading-tight">
                    <span className="text-[10px] font-bold uppercase text-gray-400 select-none tracking-wider">
                      Next Assessment Target
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5 select-text">
                      {demoNextTarget.title}
                    </h4>
                    <p className="text-[11px] text-white/70 leading-relaxed mt-1">
                      {demoNextTarget.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (customAccount) {
                        const pillarMap: Record<string, number> = { A: 1, B: 2, C: 3, D: 6 };
                        const targetPillar = pillarMap[demoNextTarget.target] || 1;
                        router.push(getDemoPath(`/usecase-readiness?id=${accountId}&pillar=${targetPillar}`));
                      } else if (demoNextTarget.target === "J" && isDemo) {
                        router.push(getDemoPath(`/reports/${resolvedScenario.id}/J`));
                      } else {
                        router.push(getDemoPath(`/assessments/${resolvedScenario.id}/${demoNextTarget.target}`));
                      }
                    }}
                    className="w-full bg-white hover:bg-gray-100 text-navy text-xs font-bold py-2 rounded-md btn-transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
                  >
                    <i className="fa-solid fa-circle-play"></i>
                    <span>{demoNextTarget.label}</span>
                  </button>
                </div>
              );
            })()}

            {/* Critical Blockers flags list */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 select-none flex items-center gap-1.5">
                <i className="fa-solid fa-circle-exclamation text-red"></i>
                <span>Gating Blockers</span>
              </h3>
              
              <div className="flex flex-col gap-3">
                {isDemo ? (
                  resolvedScenario.blockers.length > 0 ? (
                    resolvedScenario.blockers.map((b) => (
                      <FlagCard
                        key={b.id}
                        title={b.title}
                        message={b.message}
                        variant={b.severity === "critical" ? "crit" : "warn"}
                        actions={
                          <button
                            onClick={() => {
                              if (b.title.includes("BAA")) {
                                setIsBaaOpen(true);
                              } else {
                                showToast(`Blocker owner: ${b.owner}. Resolution time: ${b.timeline}`, "info");
                              }
                            }}
                            className={`text-white text-[10px] font-bold px-2.5 py-1 rounded btn-transition shadow-sm uppercase tracking-wider ${
                              b.severity === "critical" ? "bg-red hover:bg-red/90" : "bg-amber hover:bg-amber/90"
                            }`}
                          >
                            {b.title.includes("BAA") ? "Fix Blocker" : "Details"}
                          </button>
                        }
                      />
                    ))
                  ) : (
                    <FlagCard
                      title="No critical blockers detected"
                      message="This account has passed standard baseline milestones and is fully ready."
                      variant="ok"
                      actions={
                        <button
                          onClick={() => showToast("Account health is verified!", "success")}
                          className="bg-green text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-green/90 btn-transition shadow-sm uppercase tracking-wider"
                        >
                          Verify
                        </button>
                      }
                    />
                  )
                ) : isStanford ? (
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
            {assessmentsList.map((assess) => {
              const showLockedIcon = isDemo ? (assess.isAssigned && assess.locked) : assess.locked;
              return (
                <div
                  key={assess.code}
                  onClick={() => handleAssessmentClick(assess)}
                  className={`border rounded-md p-4 flex items-center justify-between gap-4 btn-transition ${
                    isDemo && !assess.isAssigned
                      ? "border-dashed border-gray-300 bg-gray-50/30 hover:bg-gray-100/50 cursor-pointer"
                      : assess.locked 
                      ? "border-gray-100 opacity-60 cursor-not-allowed bg-gray-50/40" 
                      : "border-gray-100 cursor-pointer hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      showLockedIcon 
                        ? "bg-gray-200 text-gray-400" 
                        : assess.status === "done" 
                        ? "bg-blue-50 text-blue" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {showLockedIcon ? <i className="fa-solid fa-lock text-[10px]"></i> : assess.code}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs font-bold text-gray-900 truncate">{assess.name}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{assess.type} Assessment</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {(!isDemo || assess.isAssigned) && assess.status === "done" && (
                      <div className="w-7 h-7 rounded-full bg-green-50 border border-green/10 flex items-center justify-center text-[11px] font-bold text-green mr-1">
                        {assess.score}
                      </div>
                    )}
                    <Badge
                      label={
                        isDemo && !assess.isAssigned
                          ? "Optional (+ Assign)"
                          : assess.locked
                          ? "Locked"
                          : assess.status === "done"
                          ? `Score: ${assess.score}`
                          : assess.status === "prog"
                          ? "In Progress"
                          : "Start"
                      }
                      variant={
                        isDemo && !assess.isAssigned
                          ? "info"
                          : assess.locked
                          ? "info"
                          : assess.status === "done"
                          ? "success"
                          : assess.status === "prog"
                          ? "warning"
                          : "info"
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. REPORTS TAB PANEL */}
      {activeTab === "Reports" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Generated Readiness Reports
          </h3>

          <div className="flex flex-col gap-4">
            {/* Combined Report Card */}
            {isDemo && (
              <div className="border border-blue/15 rounded-md p-5 flex items-center justify-between gap-4 bg-blue-50/10 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-blue text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-file-shield text-base"></i>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold text-gray-900">Combined Clinical Readiness Report</span>
                    <span className="text-[11px] text-gray-500 mt-1">Aggregated score and insights from all assigned discovery phases</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue">
                    {accountData.score}
                  </div>
                  <button
                    onClick={() => router.push(getDemoPath(`/reports/${resolvedScenario.id}/combined`))}
                    className="bg-blue hover:bg-blue-dk text-white text-xs font-bold px-4 py-2 rounded shadow-sm btn-transition uppercase tracking-wider"
                  >
                    View Combined Report
                  </button>
                </div>
              </div>
            )}

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
                      onClick={() => router.push(getDemoPath(`/reports/${resolvedScenario.id}/${rep.id}`))}
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
                {accountData.description || `${accountData.useCase} represents a high Business Value match (+85%) to Google Cloud's Med-LM architectures. Scopes can achieve 30% reduction in notes turnaround times.`}
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
              onClick={() => router.push(getDemoPath(`/timeline/${resolvedScenario.id}`))}
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
              value={isDemo
                ? `https://hcls-navigator.google.com/demo-shared/${resolvedScenario.id}`
                : `https://hcls-navigator.google.com/share/cleveland-clinic-${accountId}`}
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
