"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MetricCard from "@/components/ui/MetricCard";
import AccountCard, { AssessmentStatus as Status } from "@/components/ui/AccountCard";
import FlagCard from "@/components/ui/FlagCard";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // 1. Greeting state (Dynamic by time of day)
  const [greeting, setGreeting] = useState("Hello, Nitin!");
  const [activeFilter, setActiveFilter] = useState<"All" | "Pre-Sales" | "Production" | "At-Risk">("All");
  
  // Modal State
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);

  // Mock Form inputs
  const [newOrgName, setNewOrgName] = useState("");
  const [newUseCase, setNewUseCase] = useState("Patient Discharge Summarization");
  const [newSegment, setNewSegment] = useState("Provider (Hospitals & Clinics)");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning, Nitin");
    } else if (hour < 18) {
      setGreeting("Good afternoon, Nitin");
    } else {
      setGreeting("Good evening, Nitin");
    }

    // Check for query parameters to trigger new account modal from topbar
    const query = new URLSearchParams(window.location.search);
    if (query.get("newAccount") === "true") {
      setIsNewAccountOpen(true);
      // Clear query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Mock active accounts data
  const accountsData = [
    {
      id: "mayo-clinic",
      orgName: "Mayo Clinic",
      useCase: "Patient Discharge Summarization",
      stage: "Pre-Sales" as const,
      score: 82,
      isAtRisk: false,
      assessments: ["done", "done", "prog", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
    },
    {
      id: "stanford-medicine",
      orgName: "Stanford Medicine",
      useCase: "Clinical Trial Co-Pilot",
      stage: "At-Risk" as const,
      score: 46,
      isAtRisk: true,
      assessments: ["done", "done", "blk", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
    },
    {
      id: "cleveland-clinic",
      orgName: "Cleveland Clinic",
      useCase: "EHR Voice Dictation Integration",
      stage: "Production" as const,
      score: 94,
      isAtRisk: false,
      assessments: ["done", "done", "done", "done", "done", "done", "prog", "todo", "todo", "todo"] as Status[],
    },
    {
      id: "ascension-health",
      orgName: "Ascension Health",
      useCase: "FHIR Analytics Data Lake",
      stage: "Pre-Sales" as const,
      score: 72,
      isAtRisk: false,
      assessments: ["done", "prog", "todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
    },
    {
      id: "partners-healthcare",
      orgName: "Mass General Brigham",
      useCase: "Outpatient Scheduling Agent",
      stage: "Production" as const,
      score: 91,
      isAtRisk: false,
      assessments: ["done", "done", "done", "done", "done", "done", "done", "done", "prog", "todo"] as Status[],
    },
    {
      id: "texas-childrens",
      orgName: "Texas Children's Hospital",
      useCase: "Pediatric CDS Advisor",
      stage: "At-Risk" as const,
      score: 49,
      isAtRisk: true,
      assessments: ["done", "done", "blk", "todo", "todo", "todo", "todo", "todo", "todo", "todo"] as Status[],
    },
  ];

  // Filter account cards
  const filteredAccounts = accountsData.filter((acc) => {
    if (activeFilter === "All") return true;
    return acc.stage === activeFilter;
  });

  // Mock activity logs
  const recentActivity = [
    { text: "You nominated Mayo Clinic for FDE qualification", time: "10 mins ago", icon: "fa-trophy" },
    { text: "Completed Data & Security check for Mass General Brigham", time: "2 hours ago", icon: "fa-shield-halved" },
    { text: "Gemini generated strategic plan for Ascension Health", time: "Yesterday", icon: "fa-wand-magic-sparkles" },
    { text: "New FDA guidance signal detected for Clinical Decision Support", time: "2 days ago", icon: "fa-triangle-exclamation" },
  ];

  // Handle new account creation
  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewAccountOpen(false);
    
    // Trigger success toast
    showToast(`Account for '${newOrgName}' registered successfully!`, "success");
    
    // In mock mode, navigate to Account Detail representing the new account
    router.push("/accounts/mayo-clinic");
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
          onClick={() => setIsNewAccountOpen(true)}
          className="bg-blue hover:bg-blue-dk text-white text-xs font-medium px-3 py-2 rounded-md btn-transition flex items-center gap-1.5 shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
          <span>New Account</span>
        </button>
      </div>

      {/* 1. PORTFOLIO METRICS (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <MetricCard
          title="Managed Accounts"
          value="6"
          trend="+2 vs last quarter"
          trendType="up"
          icon="fa-hospital"
        />
        <MetricCard
          title="Portfolio Maturity Avg"
          value="74%"
          trend="+4.8%"
          trendType="up"
          icon="fa-heart-pulse"
        />
        <MetricCard
          title="Business Value Realized"
          value="$2.45M"
          trend="+$350k"
          trendType="up"
          icon="fa-circle-dollar-to-slot"
        />
        <MetricCard
          title="Active System Blockers"
          value="2"
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
                onClick={() => router.push(`/accounts/${acc.id}`)}
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
              <FlagCard
                title="BAA Pending: Ascension Health"
                message="Discharge summarization launch blocked until legal completes HIPAA BAA sign-off."
                variant="crit"
                actions={
                  <button 
                    onClick={() => router.push("/notifications")}
                    className="bg-red text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-red/95 shadow-sm uppercase tracking-wider"
                  >
                    Escalate
                  </button>
                }
              />

              <FlagCard
                title="Value Case Delayed: Stanford Medicine"
                message="ROI projections must be updated with current local bed capacity inputs."
                variant="warn"
                actions={
                  <button 
                    onClick={() => router.push("/bv-command")}
                    className="bg-amber text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-amber/95 shadow-sm uppercase tracking-wider"
                  >
                    Review
                  </button>
                }
              />
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
        title="Register New Clinical Account"
      >
        <form onSubmit={handleCreateAccountSubmit} className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Fill out basic details below to initialize this account&apos;s assessment journey (A through J):
          </p>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-gray-700">Organization Name</label>
            <input
              type="text"
              placeholder="e.g., Stanford Medicine"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
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

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-gray-700">Primary Use Case</label>
            <select 
              value={newUseCase}
              onChange={(e) => setNewUseCase(e.target.value)}
              className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
            >
              <option>Patient Discharge Summarization</option>
              <option>EHR Voice Dictation Integration</option>
              <option>Clinical Trial Co-Pilot</option>
              <option>HIPAA Analytics Data Lake</option>
              <option>Outpatient Scheduling Agent</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-gray-50 mt-1">
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
              Create Account
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
