"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";

interface CustomerPortalPageProps {
  params: {
    id: string;
  };
}

interface SimplifiedMilestone {
  id: string;
  title: string;
  description: string;
  status: "Completed" | "Pending Client" | "In Progress";
  dueDate: string;
}

export default function CustomerPortalPage({ params }: CustomerPortalPageProps) {
  const { showToast } = useToast();

  // Mock organization details derived from slug/id
  const orgName = params.id === "stanford-medicine" ? "Stanford Medicine" :
                  params.id === "cleveland-clinic" ? "Cleveland Clinic" : "Mayo Clinic";
                  
  const primaryUseCase = params.id === "stanford-medicine" ? "Clinical Trial Co-Pilot" :
                         params.id === "cleveland-clinic" ? "EHR Voice Dictation Integration" : "Patient Discharge Summarization";

  // Simplified client value statistics
  const valueStats = [
    { label: "Target Clinical Efficiency", value: "42%", desc: "Decrease in documentation drafting overhead" },
    { label: "Annualized Clinical Savings", value: "$1.80M", desc: "Estimated net savings across outpatient network" },
    { label: "Implementation Timeline", value: "14 Wks", desc: "Rapid secure deployment plan to pilot stage" },
  ];

  // Client pending milestones
  const [milestones, setMilestones] = useState<SimplifiedMilestone[]>([
    {
      id: "m-1",
      title: "HIPAA Business Associate Agreement (BAA)",
      description: "Execute the corporate BAA addendum for secure EHR data operations in Google Cloud.",
      status: "Completed",
      dueDate: "Completed 2026-05-18",
    },
    {
      id: "m-2",
      title: "EHR Sandbox Credential Delivery",
      description: "Secure transfer of target HL7/FHIR sandbox endpoints and authorization secrets.",
      status: "Pending Client",
      dueDate: "Due by June 10, 2026",
    },
    {
      id: "m-3",
      title: "Clinical Evaluation Panel Selection",
      description: "Nominate 3-5 clinical safety leads to participate in medical LLM grading reviews.",
      status: "In Progress",
      dueDate: "Target: June 18, 2026",
    },
    {
      id: "m-4",
      title: "End-User Pilot Acceptance Check",
      description: "Complete training simulation practice scenario reviews for nurse onboarding.",
      status: "Pending Client",
      dueDate: "Target: July 01, 2026",
    },
  ]);

  // Toggle a client milestone status
  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Completed") return item; // Don't toggle already locked completed ones

        const newStatus = item.status === "Pending Client" ? "In Progress" : "Pending Client";
        showToast(`Updated milestone status to: ${newStatus}`, "info");
        return { ...item, status: newStatus };
      })
    );
  };

  // Google contact cards
  const contactTeam = [
    { name: "Nitin Aggarwal", role: "Lead HCLS Customer Engineer", email: "nitinagga@google.com", avatar: "NA" },
    { name: "Sarah Jenkins", role: "Clinical Deployment Specialist", email: "sjenkins@google.com", avatar: "SJ" },
  ];

  // Calculate simplified client progress percentage
  const completedCount = milestones.filter((m) => m.status === "Completed").length;
  const inProgressCount = milestones.filter((m) => m.status === "In Progress").length;
  const progressPercentage = Math.round(((completedCount + inProgressCount * 0.5) / milestones.length) * 100);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-4">
      
      {/* Client Portal Header Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm select-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue bg-blue-50 px-2.5 py-0.5 rounded border border-blue/10">
              Client Collaboration Space
            </span>
            <Badge label="Security Verified" variant="success" />
          </div>
          
          <h1 className="text-lg font-bold text-gray-900 mt-1 select-text">
            HCLS AI Navigator Portal • {orgName}
          </h1>
          
          <p className="text-xs text-gray-500 select-text">
            Active Use Case: <strong className="text-gray-700 font-semibold">{primaryUseCase}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overall Implementation Progress</span>
            <span className="text-xs font-bold text-gray-800 font-mono">{progressPercentage}% Finished</span>
          </div>
          
          <div className="w-24">
            <ProgressBar percentage={progressPercentage} variant="green" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (8/12): Milestones & Value Stats */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 1. Plain-Language Expected Outcomes */}
          <div className="flex flex-col gap-3 select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Projected Outcomes & Performance Milestones
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {valueStats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-1"
                >
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <span className="text-xl font-bold text-blue leading-tight select-text font-sans">
                    {stat.value}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-1 select-text">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Joint Integration Checklist */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center select-none">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Joint Implementation Checklist
              </h2>
              <span className="text-[10px] font-bold text-gray-400">Click item to advance status</span>
            </div>

            <div className="flex flex-col gap-3">
              {milestones.map((m) => {
                const isComp = m.status === "Completed";
                const isProg = m.status === "In Progress";
                
                return (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`bg-white border rounded-lg p-4 flex items-start justify-between gap-3 btn-transition cursor-pointer select-none ${
                      isComp
                        ? "border-gray-200 bg-gray-50/40 opacity-85"
                        : isProg
                        ? "border-blue shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Custom beautiful checkbox circle */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border btn-transition ${
                        isComp
                          ? "bg-green border-green text-white"
                          : isProg
                          ? "border-blue bg-blue-50 text-blue"
                          : "border-gray-300 bg-white text-transparent"
                      }`}>
                        <i className="fa-solid fa-check text-[10px]"></i>
                      </div>

                      <div className="flex flex-col leading-snug gap-0.5">
                        <span className={`text-xs font-bold select-all ${isComp ? "text-gray-500 line-through" : "text-gray-800"}`}>
                          {m.title}
                        </span>
                        <p className="text-[11px] text-gray-500 select-text leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                      {isComp ? (
                        <Badge label="Completed" variant="success" />
                      ) : isProg ? (
                        <Badge label="In Progress" variant="info" />
                      ) : (
                        <Badge label="Action Required" variant="warning" />
                      )}
                      
                      <span className="text-[9px] font-mono text-gray-400 font-semibold">
                        {m.dueDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side (4/12): Contact Google Team & Resources */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Google CE Team Contacts */}
          <div className="flex flex-col gap-3 select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Your Google Support Team
            </h2>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-4">
              {contactTeam.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-none last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center text-xs font-bold select-none">
                    {member.avatar}
                  </div>
                  
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold text-gray-800 select-text">{member.name}</span>
                    <span className="text-[10px] text-gray-400 select-none">{member.role}</span>
                    
                    <a 
                      href={`mailto:${member.email}`}
                      className="text-[10px] text-blue hover:underline font-mono select-all mt-1"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborative Documents & Resources */}
          <div className="flex flex-col gap-3 select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Collaborative Resources
            </h2>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2.5 leading-snug text-[11px]">
                <i className="fa-solid fa-file-shield text-blue mt-0.5 text-xs"></i>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 select-text">HIPAA Security Whitepaper</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Cloud Healthcare security guidelines.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 leading-snug text-[11px] border-t border-gray-50 pt-2.5">
                <i className="fa-solid fa-network-wired text-purple mt-0.5 text-xs"></i>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 select-text">Epic Integration Checklist</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">FHIR standard authorization scopes.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
