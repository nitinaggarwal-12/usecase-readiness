"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MetricCard from "@/components/ui/MetricCard";
import AccountCard, { AssessmentStatus as Status } from "@/components/ui/AccountCard";
import FlagCard from "@/components/ui/FlagCard";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { useDemo } from "@/context/DemoContext";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { demoState, scenarios, registerCustomScenario } = useDemo();
  const isDemo = demoState.isActive;

  // 1. Greeting state (Dynamic by time of day)
  const [greeting, setGreeting] = useState("Hello, Nitin!");
  const [activeFilter, setActiveFilter] = useState<"All" | "Pre-Sales" | "Production" | "At-Risk">("All");
  
  // Modal State
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);

  // Dynamic Customers & Assessments Scoping states
  const uniqueCustomers = Array.from(new Set(scenarios.map((s) => s.account.name)));
  const [selectedCustomerOption, setSelectedCustomerOption] = useState("new-customer");

  // Find assessments registered for selected customer
  const existingAssessmentsForCustomer = scenarios
    .filter((s) => s.account.name === selectedCustomerOption)
    .map((s) => s.assessmentName || "Initial Scoping");

  const [selectedAssessmentOption, setSelectedAssessmentOption] = useState("new-assessment");

  // Mock Form inputs
  const [newOrgName, setNewOrgName] = useState("");
  const [newUseCase, setNewUseCase] = useState("");
  const [newSegment, setNewSegment] = useState("Provider (Hospitals & Clinics)");
  const [newAssessmentName, setNewAssessmentName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [assignedAssessments, setAssignedAssessments] = useState<string[]>(["A", "B", "C", "D", "E"]);
  const [prefillDemoData, setPrefillDemoData] = useState(false);

  useEffect(() => {
    if (selectedCustomerOption !== "new-customer") {
      const match = scenarios.find((s) => s.account.name === selectedCustomerOption);
      if (match) {
        setNewSegment(match.account.type.split(" · ")[0] || "Provider (Hospitals & Clinics)");
        setNewUseCase(match.account.useCase);
        setNewDescription(match.account.description || "");
      }
      
      const cycles = scenarios
        .filter((s) => s.account.name === selectedCustomerOption)
        .map((s) => s.assessmentName || "Initial Scoping");
      if (cycles.length > 0) {
        setSelectedAssessmentOption(cycles[0]);
      } else {
        setSelectedAssessmentOption("new-assessment");
      }
    } else {
      setNewOrgName("");
      setNewUseCase("");
      setNewSegment("Provider (Hospitals & Clinics)");
      setNewDescription("");
      setSelectedAssessmentOption("new-assessment");
    }
  }, [selectedCustomerOption, scenarios]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    // Check for query parameters to trigger new account modal from topbar
    const query = new URLSearchParams(window.location.search);
    if (query.get("newAccount") === "true") {
      setIsNewAccountOpen(true);
      // Clear query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const getMockScoreValue = (range: string): number => {
    if (range === "concerning") return 46;
    if (range === "moderate") return 68;
    if (range === "strong") return 84;
    return 95;
  };

  const getDemoPath = (path: string) => {
    return isDemo ? `/demo${path}` : path;
  };

  // Build mapped accounts when in demo mode
  const mappedAccounts = scenarios.map((sc) => {
    const isSelected = sc.id === demoState.scenarioId;
    let score = 0;
    if (isSelected) {
      score = getMockScoreValue(demoState.scoreRange);
    } else if (sc.id === "northside-health") {
      score = 68;
    } else if (sc.id === "pacific-medical") {
      score = 89;
    } else if (sc.id === "midamerica-payer") {
      score = 48;
    } else if (sc.id === "raphael-academic") {
      score = 91;
    } else {
      const completedScores = Object.values(sc.scores).filter((s): s is number => typeof s === "number" && s > 0);
      if (completedScores.length > 0) {
        const sum = completedScores.reduce((a, b) => a + b, 0);
        score = Math.round(sum / completedScores.length);
      }
    }

    const assessments: Status[] = ["todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo"];
    const baseCodes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    baseCodes.forEach((code, index) => {
      const scoreVal = sc.scores[code];
      if (scoreVal && typeof scoreVal === "number" && scoreVal > 0) {
        if (scoreVal < 60) {
          assessments[index] = "blk";
        } else {
          assessments[index] = "done";
        }
      } else {
        assessments[index] = "todo";
      }
    });

    return {
      id: sc.id,
      orgName: sc.account.name,
      useCase: sc.account.useCase,
      stage: sc.account.stage,
      score,
      isAtRisk: sc.account.stage === "At-Risk" || score < 50,
      assessments,
      assessmentName: sc.assessmentName,
    };
  });

  // Mock active accounts data for non-demo mode
  const realAccountsData = [
    {
      id: "mayo-clinic",
      orgName: "Mayo Clinic",
      useCase: "Patient Discharge Summarization",
      stage: "Pre-Sales" as const,
      score: 82,
      isAtRisk: false,
      assessments: ["done", "done", "prog", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
      assessmentName: "Initial Scoping",
    },
    {
      id: "stanford-medicine",
      orgName: "Stanford Medicine",
      useCase: "Clinical Trial Co-Pilot",
      stage: "At-Risk" as const,
      score: 46,
      isAtRisk: true,
      assessments: ["done", "done", "blk", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
      assessmentName: "Initial Scoping",
    },
    {
      id: "cleveland-clinic",
      orgName: "Cleveland Clinic",
      useCase: "EHR Voice Dictation Integration",
      stage: "Production" as const,
      score: 94,
      isAtRisk: false,
      assessments: ["done", "done", "done", "done", "done", "done", "prog", "todo", "todo", "todo"] as Status[],
      assessmentName: "Initial Scoping",
    },
    {
      id: "ascension-health",
      orgName: "Ascension Health",
      useCase: "FHIR Analytics Data Lake",
      stage: "Pre-Sales" as const,
      score: 72,
      isAtRisk: false,
      assessments: ["done", "prog", "todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
      assessmentName: "Initial Scoping",
    },
    {
      id: "partners-healthcare",
      orgName: "Mass General Brigham",
      useCase: "Outpatient Scheduling Agent",
      stage: "Production" as const,
      score: 91,
      isAtRisk: false,
      assessments: ["done", "done", "done", "done", "done", "done", "done", "done", "prog", "todo"] as Status[],
      assessmentName: "Initial Scoping",
    },
    {
      id: "texas-childrens",
      orgName: "Texas Children's Hospital",
      useCase: "Pediatric CDS Advisor",
      stage: "At-Risk" as const,
      score: 49,
      isAtRisk: true,
      assessments: ["done", "done", "blk", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
      assessmentName: "Initial Scoping",
    },
  ];

  const accountsData = isDemo ? mappedAccounts : realAccountsData;

  // Filter account cards
  const filteredAccounts = accountsData.filter((acc) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Pre-Sales" && acc.stage === "FDE Nominated") return true;
    return acc.stage === activeFilter;
  });

  // Dynamic Attention Required Flags
  interface AttentionFlag {
    id: string;
    title: string;
    message: string;
    variant: "crit" | "warn" | "info" | "ok";
    actionRoute: string | null;
    actionLabel: string;
  }

  const attentionFlags: AttentionFlag[] = isDemo 
    ? (demoState.selectedScenario?.blockers.map((b) => ({
        id: b.id,
        title: `${b.title}: ${demoState.selectedScenario?.account.name}`,
        message: b.message,
        variant: b.severity === "critical" ? ("crit" as const) : ("warn" as const),
        actionRoute: b.title.includes("BAA") ? "/notifications" : b.title.includes("Sandbox") || b.title.includes("Adoption") ? "/bv-command" : null,
        actionLabel: b.title.includes("BAA") ? "Escalate" : "Review"
      })) || [])
    : [
        {
          id: "baa-ascension",
          title: "BAA Pending: Ascension Health",
          message: "Discharge summarization launch blocked until legal completes HIPAA BAA sign-off.",
          variant: "crit" as const,
          actionRoute: "/notifications",
          actionLabel: "Escalate"
        },
        {
          id: "value-stanford",
          title: "Value Case Delayed: Stanford Medicine",
          message: "ROI projections must be updated with current local bed capacity inputs.",
          variant: "warn" as const,
          actionRoute: "/bv-command",
          actionLabel: "Review"
        }
      ];

  if (isDemo && attentionFlags.length === 0) {
    attentionFlags.push({
      id: "no-blockers",
      title: "No critical blockers detected",
      message: "This account has passed standard baseline milestones and is fully ready.",
      variant: "ok",
      actionRoute: null,
      actionLabel: "Verify"
    });
  }

  // Dynamic Portfolio Metrics calculations
  const totalAccountsVal = accountsData.length.toString();
  const portfolioMaturityAvg = `${Math.round(accountsData.reduce((sum, a) => sum + a.score, 0) / accountsData.length)}%`;
  const businessValueRealized = isDemo ? "$2.40M" : "$2.45M";
  const activeSystemBlockers = accountsData.reduce((sum, a) => sum + a.assessments.filter(x => x === "blk").length, 0).toString();

  // Dynamic Recent Activity logs
  const activeScenarioId = demoState.scenarioId;
  const recentActivity = isDemo 
    ? (activeScenarioId === "pacific-medical"
        ? [
            { text: "You nominated Pacific Coast Medical Group for FDE engagement", time: "5 mins ago", icon: "fa-trophy" },
            { text: "EHR Sandbox Telemetry Data validation completed", time: "1 hour ago", icon: "fa-shield-halved" },
            { text: "Regulatory review check completed for Colorado AI Act", time: "Yesterday", icon: "fa-circle-check" }
          ]
        : activeScenarioId === "midamerica-payer"
        ? [
            { text: "Member portal claims adoption campaign initiated", time: "1 hour ago", icon: "fa-users" },
            { text: "Adoption gap escalation sent to Territory AE", time: "4 hours ago", icon: "fa-triangle-exclamation" },
            { text: "Renewal risk flag triggered 47 days before expiry", time: "Yesterday", icon: "fa-bell" }
          ]
        : activeScenarioId === "raphael-academic"
        ? [
            { text: "Quarterly Value Confirmation Report generated by Gemini", time: "3 hours ago", icon: "fa-file-invoice-dollar" },
            { text: "Dr. Chen confirmed prior auth processing time reduced to 3.8 hours", time: "Yesterday", icon: "fa-heart-pulse" },
            { text: "Expansion planning initiated for Clinical Documentation Assistant", time: "2 days ago", icon: "fa-wand-magic-sparkles" }
          ]
        : [ // northside-health default
            { text: "Completed Strategic Vision & Objectives review for Northside Health", time: "10 mins ago", icon: "fa-circle-check" },
            { text: "Epic App Orchard credential request submitted", time: "2 hours ago", icon: "fa-shield-halved" },
            { text: "Gemini scanned CMS Prior Auth Rule regulatory signals", time: "Yesterday", icon: "fa-wand-magic-sparkles" }
          ])
    : [
        { text: "You nominated Mayo Clinic for FDE qualification", time: "10 mins ago", icon: "fa-trophy" },
        { text: "Completed Data & Security check for Mass General Brigham", time: "2 hours ago", icon: "fa-shield-halved" },
        { text: "Gemini generated strategic plan for Ascension Health", time: "Yesterday", icon: "fa-wand-magic-sparkles" },
        { text: "New FDA guidance signal detected for Clinical Decision Support", time: "2 days ago", icon: "fa-triangle-exclamation" },
      ];

  // Handle new account creation
  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewAccountOpen(false);
    
    let targetScenarioId = "";

    if (selectedCustomerOption === "new-customer") {
      // Create new customer and new assessment
      targetScenarioId = registerCustomScenario(
        newOrgName,
        newSegment,
        newUseCase,
        assignedAssessments,
        prefillDemoData,
        newAssessmentName || "Initial Scoping",
        newDescription
      );
      showToast(`Assessment cycle '${newAssessmentName || "Initial Scoping"}' registered for new customer '${newOrgName}'!`, "success");
    } else {
      // Existing customer
      if (selectedAssessmentOption === "new-assessment") {
        // Create new assessment under existing customer
        targetScenarioId = registerCustomScenario(
          selectedCustomerOption,
          newSegment,
          newUseCase,
          assignedAssessments,
          prefillDemoData,
          newAssessmentName || "New Assessment",
          newDescription
        );
        showToast(`New assessment cycle '${newAssessmentName || "New Assessment"}' created for '${selectedCustomerOption}'!`, "success");
      } else {
        // Selected an existing assessment cycle: just navigate to it!
        const match = scenarios.find(
          (s) => s.account.name === selectedCustomerOption && (s.assessmentName || "Initial Scoping") === selectedAssessmentOption
        );
        if (match) {
          targetScenarioId = match.id;
          showToast(`Loading existing assessment cycle '${selectedAssessmentOption}' for '${selectedCustomerOption}'`, "info");
        } else {
          showToast("Selected assessment cycle not found.", "error");
          return;
        }
      }
    }
    
    if (targetScenarioId) {
      router.push(getDemoPath(`/accounts/${targetScenarioId}`));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner/Header with Dynamic Greeting */}
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1 page-header">
          <h1 className="text-gray-900">{greeting}, Nitin!</h1>
          <p className="text-xs text-gray-500">
            Here is your clinical readiness portfolio overview for today.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCustomerOption("new-customer");
            setSelectedAssessmentOption("new-assessment");
            setNewAssessmentName("");
            setIsNewAccountOpen(true);
          }}
          className="bg-blue hover:bg-blue-dk text-white text-xs font-medium px-3 py-2 rounded-md btn-transition flex items-center gap-1.5 shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
          <span>New Assessment</span>
        </button>
      </div>

      {/* 1. PORTFOLIO METRICS (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <MetricCard
          title="Managed Accounts"
          value={totalAccountsVal}
          trend="+2 vs last quarter"
          trendType="up"
          icon="fa-hospital"
        />
        <MetricCard
          title="Portfolio Maturity Avg"
          value={portfolioMaturityAvg}
          trend="+4.8%"
          trendType="up"
          icon="fa-heart-pulse"
        />
        <MetricCard
          title="Business Value Realized"
          value={businessValueRealized}
          trend="+$350k"
          trendType="up"
          icon="fa-circle-dollar-to-slot"
        />
        <MetricCard
          title="Active System Blockers"
          value={activeSystemBlockers}
          trend="-1 resolved"
          trendType="down"
          icon="fa-triangle-exclamation"
        />
      </div>

      {/* 2-COLUMN LAYOUT: Main list left, Blockers & Activities right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 width): Main Accounts Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Grid Filter Buttons Bar */}
          <div className="flex items-center justify-between py-1 border-b border-gray-200 select-none">
            <div className="flex items-center gap-2">
              {(["All", "Pre-Sales", "Production", "At-Risk"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md btn-transition focus:outline-none ${
                    activeFilter === filter
                      ? "bg-white text-blue shadow-sm border border-gray-200 font-semibold"
                      : "text-gray-500 hover:text-gray-950 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <span className="text-[10px] font-bold uppercase text-gray-500 select-none">
              Showing {filteredAccounts.length} of {accountsData.length} Accounts
            </span>
          </div>

          {/* Main Accounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredAccounts.map((acc) => (
              <AccountCard
                key={acc.id}
                orgName={acc.orgName}
                useCase={acc.useCase}
                stage={acc.stage}
                score={acc.score}
                isAtRisk={acc.isAtRisk}
                assessments={acc.assessments}
                assessmentName={acc.assessmentName}
                onClick={() => router.push(getDemoPath(`/accounts/${acc.id}`))}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width): Blockers / Flags & Recent Activity */}
        <div className="flex flex-col gap-6">
          
          {/* A. Portfolio flags / alarms */}
          <div className="flex flex-col gap-3 select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <i className="fa-solid fa-bell text-red"></i>
              <span>Attention Required</span>
            </h2>
            
            <div className="flex flex-col gap-3">
              {attentionFlags.map((flag) => (
                <FlagCard
                  key={flag.id}
                  title={flag.title}
                  message={flag.message}
                  variant={flag.variant}
                  actions={
                    flag.actionRoute ? (
                      <button 
                        onClick={() => router.push(getDemoPath(flag.actionRoute!))}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider text-white ${
                          flag.variant === "crit" ? "bg-red hover:bg-red/95" : "bg-amber hover:bg-amber/95"
                        }`}
                      >
                        {flag.actionLabel}
                      </button>
                    ) : flag.variant === "ok" ? (
                      <button 
                        onClick={() => showToast("Account health is verified!", "success")}
                        className="bg-green text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-green/95 shadow-sm uppercase tracking-wider"
                      >
                        {flag.actionLabel}
                      </button>
                    ) : null
                  }
                />
              ))}
            </div>
          </div>

          {/* B. Recent Activity list */}
          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-list-ul text-blue"></i>
              <span>Recent Activity</span>
            </h2>

            <div className="flex flex-col gap-4 mt-2">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                    <i className={`fa-solid ${act.icon} text-[10px]`}></i>
                  </div>
                  <div className="flex flex-col leading-tight text-[11px]">
                    <span className="text-gray-700 select-text">{act.text}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL COMPONENT FOR CREATING ACCOUNTS       */}
      {/* ========================================== */}
      <Modal
        isOpen={isNewAccountOpen}
        onClose={() => setIsNewAccountOpen(false)}
        width="440px"
        title="Start New Assessment Cycle"
      >
        <form onSubmit={handleCreateAccountSubmit} className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Select an existing customer to run a new cycle or register a new customer from scratch.
          </p>

          {/* 1. Customer Selection */}
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-gray-700">Select Customer Name</label>
            <select
              value={selectedCustomerOption}
              onChange={(e) => setSelectedCustomerOption(e.target.value)}
              className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
            >
              <option value="new-customer">+ Register New Customer...</option>
              {uniqueCustomers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. New Customer Name Input (visible only for new customer) */}
          {selectedCustomerOption === "new-customer" && (
            <div className="flex flex-col gap-1 text-xs animate-fade-in">
              <label className="font-semibold text-gray-700">New Customer Name</label>
              <input
                type="text"
                placeholder="e.g., Bayer Healthcare"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
                required
              />
            </div>
          )}

          {/* 3. Customer Scopes (Segment, Use Case, Description) - visible when creating a new cycle */}
          {(selectedCustomerOption === "new-customer" || selectedAssessmentOption === "new-assessment") && (
            <>
              {selectedCustomerOption === "new-customer" && (
                <div className="flex flex-col gap-1 text-xs animate-fade-in">
                  <label className="font-semibold text-gray-700">Healthcare Industry Segment</label>
                  <select 
                    value={newSegment}
                    onChange={(e) => setNewSegment(e.target.value)}
                    className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
                  >
                    <option>Provider (Hospitals & Clinics)</option>
                    <option>Payer (Insurance & Finance)</option>
                    <option>Life Sciences (Pharmaceuticals)</option>
                    <option>MedTech & Devices</option>
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1 text-xs animate-fade-in">
                <label className="font-semibold text-gray-700">Use Case</label>
                <input 
                  type="text"
                  placeholder="e.g., Patient Discharge Summarization"
                  value={newUseCase}
                  onChange={(e) => setNewUseCase(e.target.value)}
                  className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 text-xs animate-fade-in">
                <label className="font-semibold text-gray-700">Description</label>
                <textarea
                  placeholder="Describe the clinical objective, primary benefits, and scoping constraints..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none resize-none"
                  rows={2}
                />
              </div>
            </>
          )}

          {/* 4. Assessment Cycle selection - visible only for existing customers */}
          {selectedCustomerOption !== "new-customer" && (
            <div className="flex flex-col gap-1 text-xs animate-fade-in">
              <label className="font-semibold text-gray-700">Select Assessment Cycle</label>
              <select
                value={selectedAssessmentOption}
                onChange={(e) => setSelectedAssessmentOption(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
              >
                {existingAssessmentsForCustomer.map((assessName) => (
                  <option key={assessName} value={assessName}>
                    {assessName} (Open)
                  </option>
                ))}
                <option value="new-assessment">+ Create New Assessment Cycle...</option>
              </select>
            </div>
          )}

          {/* 5. New Assessment Cycle Name Input - visible for new customer or when "+ Create New Assessment Cycle..." is selected */}
          {(selectedCustomerOption === "new-customer" || selectedAssessmentOption === "new-assessment") && (
            <div className="flex flex-col gap-1 text-xs animate-fade-in">
              <label className="font-semibold text-gray-700">Assessment Cycle Name</label>
              <input
                type="text"
                placeholder="e.g., July Scoping Review, Q3 Assessment"
                value={newAssessmentName}
                onChange={(e) => setNewAssessmentName(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
                required
              />
            </div>
          )}

          {/* 6. Assign Active Assessments (visible if creating a new assessment cycle) */}
          {(selectedCustomerOption === "new-customer" || selectedAssessmentOption === "new-assessment") && (
            <div className="flex flex-col gap-1 text-xs animate-fade-in">
              <label className="font-semibold text-gray-700">Assign Active Assessments</label>
              <div className="grid grid-cols-2 gap-2 mt-1 max-h-32 overflow-y-auto border border-gray-200 rounded p-2.5 bg-gray-50/50">
                {[
                  { code: "A", name: "A: Strategic Vision" },
                  { code: "B", name: "B: Business Value" },
                  { code: "C", name: "C: Technical Readiness" },
                  { code: "D", name: "D: Data Security" },
                  { code: "E", name: "E: FDE Qualification" },
                  { code: "F", name: "F: Solution Health" },
                  { code: "G", name: "G: Value Realization" },
                  { code: "H", name: "H: User Adoption" },
                  { code: "I", name: "I: Expansion Readiness" },
                  { code: "J", name: "J: Platform Maturity" }
                ].map((ass) => {
                  const checked = assignedAssessments.includes(ass.code);
                  return (
                    <label key={ass.code} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setAssignedAssessments(prev =>
                            prev.includes(ass.code)
                              ? prev.filter(c => c !== ass.code)
                              : [...prev, ass.code]
                          );
                        }}
                        className="rounded border-gray-300 text-blue focus:ring-blue w-3.5 h-3.5"
                      />
                      <span className="truncate">{ass.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. Prefill demo data (visible if creating a new assessment cycle) */}
          {(selectedCustomerOption === "new-customer" || selectedAssessmentOption === "new-assessment") && (
            <div className="flex items-center gap-2 mt-1 py-1 select-none animate-fade-in">
              <input
                type="checkbox"
                id="prefillDemoData"
                checked={prefillDemoData}
                onChange={(e) => setPrefillDemoData(e.target.checked)}
                className="rounded border-gray-350 text-blue focus:ring-blue w-3.5 h-3.5 cursor-pointer"
              />
              <label htmlFor="prefillDemoData" className="font-medium text-gray-700 cursor-pointer text-xs select-none">
                Pre-populate with mock answers & score 80 (Demo Showcase)
              </label>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-3 border-t border-gray-50 mt-1 select-none">
            <button
              type="button"
              onClick={() => setIsNewAccountOpen(false)}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded text-xs font-semibold btn-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue hover:bg-blue-dk text-white px-3.5 py-2 rounded text-xs font-semibold btn-transition shadow-sm"
            >
              {selectedCustomerOption !== "new-customer" && selectedAssessmentOption !== "new-assessment"
                ? "Open Assessment"
                : "Create Assessment"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
