"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import OptionCard from "@/components/ui/OptionCard";
import ContextNote from "@/components/ui/ContextNote";
import BlockerAlert from "@/components/ui/BlockerAlert";
import { useToast } from "@/components/ui/Toast";

interface Question {
  id: number;
  text: string;
  context?: string;
  options: { text: string; score: number; triggersBlocker?: boolean; blockerTitle?: string; blockerMsg?: string }[];
  coachingTip: string;
}

export default function AssessmentFlowPage() {
  const router = useRouter();
  const { id: accountId, type: assessmentType } = useParams() as { id: string; type: string };
  const { showToast } = useToast();

  // 1. States
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Look up account details
  const isStanford = accountId === "stanford-medicine";
  const accountName = isStanford ? "Stanford Medicine" : "Mayo Clinic";
  const useCase = isStanford ? "Clinical Trial Co-Pilot" : "Patient Discharge Summarization";

  // Mock 8 Questions for Technical Readiness (Phase C)
  const questions: Question[] = [
    {
      id: 1,
      text: "What is the primary data ingestion mechanism planned for patient feeds?",
      context: "EPIC Systems EHR environment detected. Ingestion mechanism dictates security auditing requirements.",
      options: [
        { text: "Option A: Real-time FHIR APIs via authenticated secure HTTPS endpoints.", score: 100 },
        { text: "Option B: Semi-automated batch processing using secure SFTP folders.", score: 80 },
        { text: "Option C: Direct DB query pulls utilizing read-only SQL connections.", score: 60 },
        { text: "Option D: Manual spreadsheet/CSV exports extracted periodically (no active pipe).", score: 35, triggersBlocker: true, blockerTitle: "Ingestion Blocker: Manual CSV Extracts", blockerMsg: "Manual imports do not support patient safety guidelines or real-time summarization loops. automated pathways are mandatory for production." }
      ],
      coachingTip: "Ask the customer's integration lead if their EPIC version supports bulk FHIR. Avoid SQL database queries directly to preserve production database performance."
    },
    {
      id: 2,
      text: "What authentication standard is configured for EHR system access?",
      context: "HIPAA requirements dictate encrypted transport tokens for all connected interfaces.",
      options: [
        { text: "Option A: OAuth 2.0 with secure client credentials and token rotation.", score: 100 },
        { text: "Option B: API Keys passed securely in HTTPS header values.", score: 80 },
        { text: "Option C: Basic auth (username/password) over secure HTTPS links.", score: 50 },
        { text: "Option D: No authentication protocol configured (unsecured internal network).", score: 15, triggersBlocker: true, blockerTitle: "Security Blocker: Missing Authentication", blockerMsg: "Connecting to clinical patient payloads without authenticated endpoints represents an immediate HIPAA security violation." }
      ],
      coachingTip: "Confirm they have set up an OAuth client inside their Epic App Orchard developer account before proceeding with production credentials."
    },
    {
      id: 3,
      text: "What is the estimated daily volume of summarization requests?",
      options: [
        { text: "Option A: Low volume (less than 1,000 transactions per day).", score: 100 },
        { text: "Option B: Moderate volume (1,000 to 10,000 transactions per day).", score: 90 },
        { text: "Option C: High volume (greater than 10,000 transactions per day).", score: 80 }
      ],
      coachingTip: "High volumes require setting up Google Cloud Pub/Sub pipelines and Upstash Redis caching to buffer burst requests during clinic shift handovers."
    },
    {
      id: 4,
      text: "Is clinical data encrypted at rest and in transit throughout the pipeline?",
      options: [
        { text: "Option A: Yes, fully encrypted using Customer-Managed Encryption Keys (CMEK).", score: 100 },
        { text: "Option B: Yes, using default Google Cloud encryption keys.", score: 90 },
        { text: "Option C: Partially encrypted (encrypted in transit only).", score: 60 },
        { text: "Option D: No encryption configured.", score: 20, triggersBlocker: true, blockerTitle: "Data Protection Blocker: Missing Encryption", blockerMsg: "HIPAA rules require 256-bit encryption at rest and in transit for all protected health information (PHI) payloads." }
      ],
      coachingTip: "Confirm that CMEK keys are managed inside the customer's Google Cloud KMS project so they retain full revoke rights over their clinical datasets."
    },
    {
      id: 5,
      text: "Where will the LLM orchestration services be hosted?",
      options: [
        { text: "Option A: Fully managed Vertex AI serverless endpoints.", score: 100 },
        { text: "Option B: Containerized microservices inside Google Kubernetes Engine (GKE).", score: 90 },
        { text: "Option C: Secure virtual machines inside Compute Engine.", score: 75 },
        { text: "Option D: Customer's on-premises servers (hybrid sync required).", score: 50 }
      ],
      coachingTip: "Vertex AI endpoints are strongly recommended for speed and serverless scaling. GKE is acceptable if they have existing strict Kubernetes compliance meshes."
    },
    {
      id: 6,
      text: "What clinical mapping standard is used for internal data models?",
      options: [
        { text: "Option A: Native HL7 FHIR resources (US Core Implementation Guide).", score: 100 },
        { text: "Option B: OMOP Common Data Model standards.", score: 85 },
        { text: "Option C: Custom proprietary relational data schemas.", score: 60 },
        { text: "Option D: Unstructured free-text tables (no formal schema mappings).", score: 40 }
      ],
      coachingTip: "HL7 FHIR is the native standard for our Med-LM APIs. Custom schemas will require an additional preprocessing pipeline which increases costs."
    },
    {
      id: 7,
      text: "Is there a disaster recovery and replication protocol active?",
      options: [
        { text: "Option A: Yes, multi-region automated database replication and failover.", score: 100 },
        { text: "Option B: Yes, dual-zone replication inside a single primary region.", score: 85 },
        { text: "Option C: Basic backup cycles (nightly snapshots, no live failovers).", score: 60 },
        { text: "Option D: No backup or replication protocol configured.", score: 30 }
      ],
      coachingTip: "Healthcare systems require a high-availability (HA) target setup. Make sure multi-region replication is active on cloud storage databases."
    },
    {
      id: 8,
      text: "What sandbox environments are available for pre-production integration testing?",
      options: [
        { text: "Option A: Dual sandboxes (EHR non-prod sandbox + Google Cloud staging).", score: 100 },
        { text: "Option B: Single sandbox environment (EHR staging only).", score: 80 },
        { text: "Option C: No formal sandboxes (testing must occur on dummy local records).", score: 50 },
        { text: "Option D: Testing directly in the production environment.", score: 10, triggersBlocker: true, blockerTitle: "Environment Blocker: Live Production Testing", blockerMsg: "Testing unverified LLM pipelines directly against live clinical patients is strictly prohibited under healthcare safety rules." }
      ],
      coachingTip: "Request that the customer provisions a non-production EPIC sandbox credentials set (usually called 'TST' or 'DEC') before we finalize integration templates."
    }
  ];

  const activeQuestion = questions[currentQIndex];
  const selectedOptionData = selectedAnswer !== null ? activeQuestion.options[selectedAnswer] : null;

  // Calculate FDE nomination gate
  const calculateScoreAndGate = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const avgScore = Math.round(totalScore / questions.length);
    
    let gate: "GREEN" | "YELLOW" | "RED" = "GREEN";
    if (avgScore < 50) gate = "RED";
    else if (avgScore < 75) gate = "YELLOW";

    return { score: avgScore, gate };
  };

  const handleOptionClick = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleContinue = () => {
    if (selectedAnswer === null) {
      showToast("Please select an answer before continuing.", "info");
      return;
    }

    const currentScore = activeQuestion.options[selectedAnswer].score;
    const newAnswers = [...answers, currentScore];
    setAnswers(newAnswers);

    // Trigger blocker toast if answer has blocker
    if (selectedOptionData?.triggersBlocker) {
      showToast(`Blocker Captured: ${selectedOptionData.blockerTitle}`, "warning", "fa-triangle-exclamation");
    }

    if (currentQIndex < questions.length - 1) {
      // Advance question
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Finish questionnaire
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
      // Pop last answer
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
      setSelectedAnswer(null);
    } else {
      router.push(`/accounts/${accountId}`);
    }
  };

  const { score: finalScore, gate: fdeGate } = calculateScoreAndGate();

  // Render completion screen
  if (isCompleted) {
    const gateStyles = {
      GREEN: {
        border: "border-green/20",
        bg: "bg-green-50",
        text: "text-green",
        badge: "success" as const,
        msg: "Meets all technical standards. Nominate for Fast-Track Deployment!",
      },
      YELLOW: {
        border: "border-amber/20",
        bg: "bg-amber-50",
        text: "text-amber",
        badge: "warning" as const,
        msg: "Scoping contains resolved blockers. Address highlighted gaps first.",
      },
      RED: {
        border: "border-red/20",
        bg: "bg-red-50",
        text: "text-red",
        badge: "critical" as const,
        msg: "Significant readiness gaps detected. Resubmit after architecture remediation.",
      },
    };

    const activeGate = gateStyles[fdeGate];

    return (
      <div className="max-w-[680px] mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-lg text-center flex flex-col items-center gap-6 animate-fade-in select-none">
        
        {/* Success Check Circle */}
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green/20 flex items-center justify-center text-green select-none">
          <i className="fa-solid fa-circle-check text-3xl"></i>
        </div>

        {/* Headers */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-extrabold text-gray-900">Assessment Discovery Completed!</h2>
          <p className="text-xs text-gray-500">
            Phase {assessmentType} questionnaire completed for {accountName}.
          </p>
        </div>

        {/* Score Ring Container */}
        <div className="flex items-center gap-4 justify-center py-2">
          <ScoreRing score={finalScore} size="lg" className="scale-110" />
        </div>

        {/* Calculated FDE Nomination Gate Badge */}
        <div className={`w-full border rounded-lg p-4 flex flex-col items-center gap-2 mt-1 ${activeGate.bg} ${activeGate.border}`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase select-none">
            <span className="text-gray-500">FDE Nomination Gate:</span>
            <Badge label={`${fdeGate} GATE`} variant={activeGate.badge} />
          </div>
          <span className="text-[11px] font-medium text-gray-700 text-center">{activeGate.msg}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4 border-t border-gray-100 select-none">
          <button
            onClick={() => {
              showToast("FDE nomination dispatched successfully!", "success");
              router.push(`/accounts/${accountId}`);
            }}
            disabled={fdeGate !== "GREEN"}
            className={`text-xs font-semibold py-2.5 px-4 rounded-md btn-transition shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider ${
              fdeGate === "GREEN" 
                ? "bg-green text-white hover:bg-green/95 cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/50 shadow-none"
            }`}
          >
            <i className="fa-solid fa-trophy"></i>
            <span>Nominate for FDE</span>
          </button>

          <button
            onClick={() => router.push(`/reports/rep-v2`)}
            className="bg-blue hover:bg-blue-dk text-white text-xs font-semibold py-2.5 px-4 rounded-md btn-transition shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <i className="fa-solid fa-file-lines"></i>
            <span>View Full Report</span>
          </button>

          <button
            onClick={() => router.push(`/accounts/${accountId}`)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-md btn-transition flex items-center justify-center gap-1.5"
          >
            <span>Exit to Account Detail</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* 1. SOLID NAVY CONTEXT BAR (Presenter Mode button, Exit button) */}
      <div className="bg-navy text-white rounded-xl px-6 py-3.5 shadow-sm flex items-center justify-between gap-6 select-none">
        <div className="flex flex-col min-w-0 leading-none">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-white">{accountName}</span>
            <div className="w-[3px] h-[3px] rounded-full bg-white/40"></div>
            <span className="text-[10px] text-white/70 uppercase font-bold tracking-wide">
              Phase {assessmentType} Scoping
            </span>
          </div>
          <span className="text-[10px] text-white/50 font-semibold mt-1.5">
            Question {currentQIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Presenter Mode Toggle Button */}
          <button
            onClick={() => {
              setIsPresenterMode(!isPresenterMode);
              showToast(
                isPresenterMode ? "Switched to internal CE Mode" : "Switched to Presenter Mode (Hidden Coaching Tips)",
                "info"
              );
            }}
            className={`text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wider btn-transition border ${
              isPresenterMode
                ? "bg-white text-navy border-white"
                : "bg-transparent text-white border-white/20 hover:bg-navy-lt hover:border-white/40"
            }`}
            title="Presenter mode hides CE-only notes during meetings"
          >
            <i className="fa-solid fa-tv mr-1"></i>
            <span>{isPresenterMode ? "Exit Presenter" : "Presenter Mode"}</span>
          </button>

          <button
            onClick={() => router.push(`/accounts/${accountId}`)}
            className="bg-navy-lt hover:bg-red text-white text-[10px] font-bold px-2.5 py-1.5 rounded border border-white/10 hover:border-red/20 btn-transition uppercase tracking-wider"
          >
            Exit
          </button>
        </div>
      </div>

      {/* 2. PROGRESS BAR (3px height) */}
      <div className="w-full h-[3px] bg-gray-200 rounded-full overflow-hidden select-none mt-[-12px]">
        <div
          className="h-full bg-blue transition-all duration-300 ease-out"
          style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* 3. CENTERED QUESTION CARD (max-width 620px) */}
      <div className="max-w-[620px] w-full mx-auto flex flex-col gap-5 mt-4 select-none">
        
        {/* A. Context Note (shown conditionally if exists) */}
        {activeQuestion.context && (
          <ContextNote text={activeQuestion.context} className="shadow-sm" />
        )}

        {/* B. Core Question Card container */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-900 leading-snug select-text">
            {activeQuestion.text}
          </h3>

          {/* C. Answer Options (Option Cards with radio) */}
          <div className="flex flex-col gap-2.5 mt-1">
            {activeQuestion.options.map((opt, idx) => (
              <OptionCard
                key={idx}
                text={opt.text}
                selected={selectedAnswer === idx}
                onClick={() => handleOptionClick(idx)}
              />
            ))}
          </div>

          {/* D. Blocker Alert (conditionally rendered if answer triggers blocker) */}
          {selectedOptionData?.triggersBlocker && (
            <BlockerAlert
              title={selectedOptionData.blockerTitle || "Compliance Blocker Detected"}
              message={selectedOptionData.blockerMsg || "This choice halts compliance pathways."}
              onFix={() => {
                showToast("Opening legal escalation form...", "info");
              }}
              className="mt-2 animate-fade-in"
            />
          )}
        </div>

        {/* E. CE Coaching Tip (dashed border, hidden in Presenter Mode!) */}
        {!isPresenterMode && activeQuestion.coachingTip && (
          <div className="bg-blue-50/40 border border-dashed border-blue/30 rounded-lg p-4 flex items-start gap-3 shadow-sm animate-fade-in">
            <i className="fa-solid fa-lightbulb text-blue mt-0.5 flex-shrink-0"></i>
            <div className="flex flex-col text-[11px] text-gray-700 leading-relaxed">
              <span className="font-bold text-blue uppercase tracking-wider mb-1 select-none">
                CE Coaching Tip (Internal Only)
              </span>
              <p className="select-text">{activeQuestion.coachingTip}</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. FIXED BOTTOM NAV BAR */}
      <div className="max-w-[620px] w-full mx-auto flex items-center justify-between select-none pt-4 border-t border-gray-200 mt-4">
        <button
          onClick={handleBack}
          className="border border-gray-200 hover:bg-gray-50 text-gray-750 text-xs font-semibold py-2 px-4 rounded-md btn-transition flex items-center gap-1.5"
        >
          <i className="fa-solid fa-chevron-left"></i>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Voice Input Helper */}
          <button
            onClick={() =>
              showToast("Speech-to-text listening... Speak your clinical response now.", "info", "fa-microphone")
            }
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center btn-transition"
            title="Use Voice Input for dictation discovery notes"
          >
            <i className="fa-solid fa-microphone text-sm"></i>
          </button>

          {/* Continue / Submit */}
          <button
            onClick={handleContinue}
            className="bg-blue hover:bg-blue-dk text-white text-xs font-semibold py-2 px-4 rounded-md btn-transition shadow-sm flex items-center gap-1.5"
          >
            <span>{currentQIndex === questions.length - 1 ? "Submit Assessment" : "Continue"}</span>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

    </div>
  );
}
