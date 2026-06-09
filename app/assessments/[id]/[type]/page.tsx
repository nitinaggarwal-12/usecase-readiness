"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import OptionCard from "@/components/ui/OptionCard";
import ContextNote from "@/components/ui/ContextNote";
import BlockerAlert from "@/components/ui/BlockerAlert";
import { useToast } from "@/components/ui/Toast";
import { useDemo } from "@/context/DemoContext";
import { questionsMap, Question } from "@/lib/demo-data/questions";

export default function AssessmentFlowPage() {
  const router = useRouter();
  const { id: accountId, type: assessmentType } = useParams() as { id: string; type: string };
  const { showToast } = useToast();
  const { demoState, scenarios, saveCompletedAnswers } = useDemo();
  const isDemo = demoState.isActive;

  // Resolve demo scenario
  const resolvedScenario = scenarios.find(
    (s) => s.id === accountId || s.id.startsWith(accountId) || accountId.startsWith(s.id)
  ) || demoState.selectedScenario || scenarios[0];

  // Resolve questions for this phase (fall back to Phase C if not defined)
  const questions: Question[] = questionsMap[assessmentType] || questionsMap.C;

  const assessmentNames: Record<string, string> = {
    A: "Strategic Vision & Objectives",
    B: "Business Value & KPI Map",
    C: "Technical Readiness & EHR",
    D: "Data Governance & Security",
    E: "FDE Qualification (Internal)",
    F: "Solution Health Checklist",
    G: "Value Realization Check",
    H: "User Adoption & Change",
    I: "Expansion Readiness Brief",
    J: "Platform Maturity Report",
  };
  const assessmentName = assessmentNames[assessmentType] || "Clinical Readiness Discovery";

  // 1. States
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() => {
    if (isDemo && resolvedScenario) {
      const key = `${resolvedScenario.id}_${assessmentType}`;
      const saved = demoState.completedAnswers[key];
      if (saved && saved.length === questions.length) {
        return [...saved];
      }
    }
    return new Array(questions.length).fill(-1);
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(() => {
    if (isDemo && resolvedScenario) {
      const key = `${resolvedScenario.id}_${assessmentType}`;
      const saved = demoState.completedAnswers[key];
      if (saved && saved.length === questions.length && saved[0] !== undefined) {
        return saved[0];
      }
    }
    return null;
  });
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(() => {
    if (isDemo && resolvedScenario) {
      const score = resolvedScenario.scores[assessmentType];
      return typeof score === "number" && score > 0;
    }
    return false;
  });

  // Keep selectedAnswer in sync with active question index
  React.useEffect(() => {
    const savedVal = selectedIndices[currentQIndex];
    setSelectedAnswer(savedVal !== undefined && savedVal !== -1 ? savedVal : null);
  }, [currentQIndex, selectedIndices]);

  const getDemoPath = (path: string) => {
    return isDemo ? `/demo${path}` : path;
  };

  // Look up account details
  const isStanford = accountId === "stanford-medicine";
  const accountName = isDemo ? resolvedScenario.account.name : (isStanford ? "Stanford Medicine" : "Mayo Clinic");

  const activeQuestion = questions[currentQIndex];
  const selectedOptionData = selectedAnswer !== null ? activeQuestion?.options[selectedAnswer] : null;

  // Calculate FDE nomination gate
  const calculateScoreAndGate = () => {
    if (isDemo) {
      const scoreVal = resolvedScenario.scores[assessmentType];
      if (scoreVal && typeof scoreVal === "number" && scoreVal > 0) {
        let gate: "GREEN" | "YELLOW" | "RED" = "GREEN";
        if (scoreVal < 55) gate = "RED";
        else if (scoreVal < 75) gate = "YELLOW";
        return { score: scoreVal, gate };
      }

      if (resolvedScenario.id === "northside-health") {
        return { score: 58, gate: "YELLOW" as const };
      }
      if (resolvedScenario.id === "pacific-medical") {
        return { score: 89, gate: "GREEN" as const };
      }
      if (resolvedScenario.id === "midamerica-payer") {
        return { score: 48, gate: "RED" as const };
      }
      if (resolvedScenario.id === "raphael-academic") {
        return { score: 91, gate: "GREEN" as const };
      }
    }

    const totalScore = selectedIndices.reduce((sum, optIdx, qIdx) => {
      const q = questions[qIdx];
      const opt = q?.options[optIdx];
      return sum + (opt ? opt.score : 0);
    }, 0);
    const avgScore = questions.length > 0 ? Math.round(totalScore / questions.length) : 0;
    
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

    const newIndices = [...selectedIndices];
    newIndices[currentQIndex] = selectedAnswer;
    setSelectedIndices(newIndices);

    // Trigger blocker toast if answer has blocker
    if (selectedOptionData?.triggersBlocker) {
      showToast(`Blocker Captured: ${selectedOptionData.blockerTitle}`, "warning", "fa-triangle-exclamation");
    }

    if (currentQIndex < questions.length - 1) {
      // Advance question
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Finish questionnaire and save answers
      saveCompletedAnswers(`${resolvedScenario.id}_${assessmentType}`, newIndices);
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    } else {
      router.push(getDemoPath(`/accounts/${resolvedScenario.id}`));
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
      <div className="w-full bg-white border border-gray-200 rounded-xl p-8 shadow-lg text-center flex flex-col items-center gap-6 animate-fade-in select-none">
        
        {/* Success Check Circle */}
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green/20 flex items-center justify-center text-green select-none">
          <i className="fa-solid fa-circle-check text-3xl"></i>
        </div>

        {/* Headers */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-extrabold text-gray-900">Assessment Discovery Completed!</h2>
          <p className="text-xs text-gray-700 font-semibold mt-0.5">
            {assessmentName} (Phase {assessmentType})
          </p>
          <p className="text-[11px] text-gray-500">
            Questionnaire completed for {accountName}.
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
              router.push(getDemoPath(`/accounts/${resolvedScenario.id}`));
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
            onClick={() => router.push(getDemoPath(`/reports/${resolvedScenario.id}/${assessmentType}`))}
            className="bg-blue hover:bg-blue-dk text-white text-xs font-semibold py-2.5 px-4 rounded-md btn-transition shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <i className="fa-solid fa-file-lines"></i>
            <span>View Full Report</span>
          </button>

          <button
            onClick={() => {
              const key = `${resolvedScenario.id}_${assessmentType}`;
              const saved = demoState.completedAnswers[key];
              if (saved && saved.length === questions.length) {
                setSelectedIndices([...saved]);
                setSelectedAnswer(saved[0] !== undefined ? saved[0] : null);
              } else {
                setSelectedIndices(new Array(questions.length).fill(-1));
                setSelectedAnswer(null);
              }
              setIsCompleted(false);
              setCurrentQIndex(0);
            }}
            className="border border-blue/20 hover:bg-blue-50/30 text-blue text-xs font-semibold py-2.5 px-4 rounded-md btn-transition flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Edit Responses</span>
          </button>

          <button
            onClick={() => router.push(getDemoPath(`/accounts/${resolvedScenario.id}`))}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-md btn-transition flex items-center justify-center gap-1.5"
          >
            <span>Exit to Account Detail</span>
          </button>
        </div>

        {/* Dynamic Questionnaire Responses Review */}
        {(() => {
          const key = `${resolvedScenario.id}_${assessmentType}`;
          const savedIndices = demoState.completedAnswers[key] || selectedIndices;
          if (!savedIndices || savedIndices.length === 0) return null;

          return (
            <div className="w-full text-left mt-6 pt-6 border-t border-gray-150 flex flex-col gap-4 select-text">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 select-none">
                Discovery Questionnaire Responses Review
              </h3>
              <div className="flex flex-col gap-4 w-full">
                {questions.map((q, qIdx) => {
                  const chosenOptIdx = savedIndices[qIdx];
                  const chosenOpt = q.options[chosenOptIdx];
                  return (
                    <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col gap-2 w-full text-xs">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <span className="font-bold text-gray-900 leading-snug">
                          Question {q.id}: {q.text}
                        </span>
                        {chosenOpt && (
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                            chosenOpt.score >= 80 ? "bg-green-50 text-green" : chosenOpt.score >= 50 ? "bg-amber-50 text-amber" : "bg-red-50 text-red"
                          }`}>
                            Score: {chosenOpt.score}
                          </span>
                        )}
                      </div>
                      
                      {chosenOpt ? (
                        <div className="flex items-start gap-2 text-gray-700 font-medium mt-1 leading-snug">
                          <i className="fa-solid fa-circle-check text-green mt-0.5 flex-shrink-0 text-xs"></i>
                          <span>{chosenOpt.text}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic mt-1">No answer recorded</span>
                      )}

                      {/* Compliance Blocker Alert */}
                      {chosenOpt?.triggersBlocker && (
                        <div className="bg-red-50 border border-red/10 rounded-md p-3 text-[10px] text-red leading-normal flex items-start gap-2 mt-2">
                          <i className="fa-solid fa-triangle-exclamation text-xs mt-0.5 flex-shrink-0"></i>
                          <div className="flex flex-col">
                            <strong className="font-bold uppercase tracking-wider text-[9px]">{chosenOpt.blockerTitle}</strong>
                            <span className="mt-0.5">{chosenOpt.blockerMsg}</span>
                          </div>
                        </div>
                      )}

                      {/* Coaching Tip */}
                      {q.coachingTip && (
                        <div className="bg-blue-50/30 border border-dashed border-blue/20 rounded p-2.5 mt-2 flex gap-2 text-[10px] text-gray-600 italic">
                          <i className="fa-solid fa-lightbulb text-blue flex-shrink-0 text-xs mt-0.5"></i>
                          <div>
                            <strong className="font-bold text-blue not-italic uppercase tracking-wider text-[8px] block mb-0.5">CE Internal Coaching Tip:</strong>
                            {q.coachingTip}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

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
              {assessmentName} (Phase {assessmentType})
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
            onClick={() => router.push(getDemoPath(`/accounts/${resolvedScenario.id}`))}
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

      {/* 3. CENTERED QUESTION CARD (max-width 4xl) */}
      <div className="w-full flex flex-col gap-5 mt-4 select-none">
        
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
      <div className="w-full flex items-center justify-between select-none pt-4 border-t border-gray-200 mt-4">
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
