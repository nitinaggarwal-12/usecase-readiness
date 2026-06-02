"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";

interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  progress: number;
  type: string;
  summary: string;
  icon: string;
}

interface PracticeScenario {
  id: string;
  title: string;
  difficulty: "Medium" | "Hard" | "Expert";
  scenarioText: string;
  clinicalContext: string;
  options: {
    score: number;
    text: string;
    feedback: string;
  }[];
}

export default function LearningCenterPage() {
  const { showToast } = useToast();

  // Training Modules state
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: "mod-1",
      title: "FDE Compliance Readiness & BAA Execution",
      duration: "45 mins",
      progress: 100,
      type: "Regulatory & Security",
      summary: "Deep-dive on HIPAA boundaries, Business Associate Agreement (BAA) structures, and EHR isolation guidelines in Google Cloud.",
      icon: "fa-shield-halved",
    },
    {
      id: "mod-2",
      title: "EHR Data Pipelines (HL7 & FHIR Integration)",
      duration: "60 mins",
      progress: 70,
      type: "Technical Delivery",
      summary: "Setting up secure Cloud Healthcare API data feeds, mapping legacy HL7 v2 segments to FHIR resources, and validating resource integrity.",
      icon: "fa-network-wired",
    },
    {
      id: "mod-3",
      title: "Clinical Evaluation Metrics & Safety Guards",
      duration: "90 mins",
      progress: 30,
      type: "Clinical Safety",
      summary: "Understanding grounded clinical metrics, safety filters, bias prevention, and deploying clinical evaluation panels for medical LLMs.",
      icon: "fa-heart-pulse",
    },
    {
      id: "mod-4",
      title: "Gemini Model Tuning & Grounding for HCLS",
      duration: "120 mins",
      progress: 0,
      type: "AI Infrastructure",
      summary: "Best practices for model fine-tuning, enterprise search grounding using medical literature, and setting up robust safety parameters.",
      icon: "fa-wand-magic-sparkles",
    },
  ]);

  // Practice Scenarios State
  const scenarios: PracticeScenario[] = [
    {
      id: "scen-1",
      title: "EHR Voice Dictation Clinical Safety Boundary",
      difficulty: "Hard",
      scenarioText: "A clinician dictating patient outpatient notes states: 'no signs of active metastases', but due to ambient clinical background noise, the dictation model outputs 'signs of active metastases'. The draft is currently designed to automatically push directly into the Epic EHR without intermediate clinician review.",
      clinicalContext: "Target System: Epic EHR Integration. High-stakes oncology segment.",
      options: [
        {
          score: 5,
          text: "Enforce mandatory human-in-the-loop clinical validation, rendering the draft in a secure workspace for clinician confirmation before EHR commit.",
          feedback: "Excellent safety assessment! Clinical validation is a critical safety buffer. Automating raw drafts without review violates HIPAA safety guardrails.",
        },
        {
          score: 3,
          text: "Implement secondary semantic grounding against past oncology history using Vertex AI Search to flag the discrepancy.",
          feedback: "Reasonable secondary audit layer, but grounding cannot replace human validation in high-stakes clinical diagnostics.",
        },
        {
          score: 1,
          text: "Reduce model safety filters to increase transcription throughput and speed up automatic saving.",
          feedback: "Critical safety failure. Lowering safety thresholds in automated EHR pathways increases patient misdiagnosis risk.",
        },
      ],
    },
    {
      id: "scen-2",
      title: "FHIR Patient Record Identity Sync Conflict",
      difficulty: "Medium",
      scenarioText: "During a live FHIR sync event, a pediatric network observes that duplicate clinical records are automatically merging based on matching first/last names and identical dates of birth. However, their demographic addresses and insurance IDs differ.",
      clinicalContext: "Target System: Cloud Healthcare API FHIR Store. Pediatric Care Unit.",
      options: [
        {
          score: 5,
          text: "Establish a strict Enterprise Master Patient Index (EMPI) gate that quarantines mismatches for manual identity verification.",
          feedback: "Spot on! Overlapping patient names and identical dates of birth are common risk vectors; strict quarantine stops wrongful record mix-ups.",
        },
        {
          score: 3,
          text: "Permit automatic merging, but trigger an immediate retrospective alert notification to the clinic administrator.",
          feedback: "Risky workflow. Notifying after the merge leaves a window of clinical risk where a clinician could act on wrongful patient records.",
        },
        {
          score: 1,
          text: "Configure the FHIR store to automatically resolve conflicts by keeping the record with the highest sequence number.",
          feedback: "Unsafe and arbitrary. Sequential overwriting risks permanent deletion of valid patient history and patient data corruption.",
        },
      ],
    },
  ];

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isGraded, setIsGraded] = useState(false);
  const [gradedScore, setGradedScore] = useState(0);
  const [gradedFeedback, setGradedFeedback] = useState("");

  const currentScenario = scenarios[selectedScenarioIndex];

  const handleOptionSelect = (index: number) => {
    if (isGraded) return;
    setSelectedOptionIndex(index);
  };

  const handleGradePractice = () => {
    if (selectedOptionIndex === null) {
      showToast("Please select a practice option first!", "warning");
      return;
    }

    const chosenOption = currentScenario.options[selectedOptionIndex];
    setGradedScore(chosenOption.score);
    setGradedFeedback(chosenOption.feedback);
    setIsGraded(true);

    if (chosenOption.score === 5) {
      showToast("Perfect Score! Practice verified by Gemini.", "success");
      
      // Progress a module to show interactive learning
      setModules(prev => 
        prev.map(m => m.id === "mod-3" ? { ...m, progress: Math.min(m.progress + 25, 100) } : m)
      );
    } else if (chosenOption.score === 3) {
      showToast("Partial credit. Grounding checks passed, but review required.", "warning");
    } else {
      showToast("Safety Blocker Detected. Grade: Critical Failure.", "error");
    }
  };

  const handleResetScenario = () => {
    setSelectedOptionIndex(null);
    setIsGraded(false);
    setGradedScore(0);
    setGradedFeedback("");
  };

  const handleScenarioChange = (idx: number) => {
    setSelectedScenarioIndex(idx);
    setSelectedOptionIndex(null);
    setIsGraded(false);
    setGradedScore(0);
    setGradedFeedback("");
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top header bar */}
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-lg font-semibold">CE Clinical Learning Center</h1>
          <p className="text-xs text-gray-500">
            Master Google Healthcare Customer Engineering skills and safety certifications.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-1.5 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Score:</span>
          <span className="text-xs font-bold text-blue font-mono">480 / 600 XP</span>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Training Modules (5/12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Training Curriculum
            </h2>
            <span className="text-[10px] font-bold text-blue uppercase">4 Modules</span>
          </div>

          <div className="flex flex-col gap-4">
            {modules.map((mod) => (
              <div 
                key={mod.id}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 shadow-sm btn-transition flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue flex-shrink-0 mt-0.5">
                      <i className={`fa-solid ${mod.icon} text-sm`}></i>
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-gray-800 select-all">{mod.title}</span>
                      <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i> {mod.duration} • {mod.type}
                      </span>
                    </div>
                  </div>
                  
                  {/* Badge based on progress */}
                  {mod.progress === 100 ? (
                    <Badge label="Completed" variant="success" />
                  ) : mod.progress > 0 ? (
                    <Badge label="In Progress" variant="warning" />
                  ) : (
                    <Badge label="Not Started" variant="info" />
                  )}
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed select-text">
                  {mod.summary}
                </p>

                {/* Progress tracking */}
                <div className="flex items-center gap-3 select-none mt-1">
                  <div className="flex-grow">
                    <ProgressBar 
                      percentage={mod.progress} 
                      variant={mod.progress === 100 ? "green" : "blue"} 
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-gray-600 w-8 text-right">
                    {mod.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Practice Scenarios (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-play text-purple"></i>
              <span>Gemini Clinical Practice Arena</span>
            </h2>
            <Badge label="Gemini Powered" variant="gemini" />
          </div>

          {/* Main Simulator Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
            
            {/* Tab bar for scenarios */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                {scenarios.map((sc, index) => (
                  <button
                    key={sc.id}
                    onClick={() => handleScenarioChange(index)}
                    className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded btn-transition ${
                      selectedScenarioIndex === index
                        ? "bg-white text-purple border border-gray-200 shadow-sm"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    Scenario {index + 1}
                  </button>
                ))}
              </div>
              <Badge 
                label={currentScenario.difficulty} 
                variant={currentScenario.difficulty === "Hard" ? "critical" : "warning"}
              />
            </div>

            {/* Scenario body */}
            <div className="p-5 flex flex-col gap-4">
              
              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-purple uppercase tracking-wide select-none">
                  Target Diagnostic Scenario
                </span>
                <h3 className="text-xs font-bold text-gray-900 leading-snug select-text">
                  {currentScenario.title}
                </h3>
                <div className="bg-purple-50/40 border border-purple/10 rounded p-3 mt-2">
                  <p className="text-[11px] text-gray-700 leading-relaxed font-sans select-text italic">
                    &ldquo;{currentScenario.scenarioText}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1 select-none">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>{currentScenario.clinicalContext}</span>
                </div>
              </div>

              {/* Options Area */}
              <div className="flex flex-col gap-3 mt-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide select-none">
                  Choose the safest CE implementation path:
                </span>

                <div className="flex flex-col gap-2.5">
                  {currentScenario.options.map((opt, index) => {
                    const isSelected = selectedOptionIndex === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={isGraded}
                        className={`text-left p-3 rounded border text-xs btn-transition flex items-start gap-3 focus:outline-none ${
                          isSelected
                            ? isGraded
                              ? opt.score === 5
                                ? "bg-green-50/60 border-green text-green-950"
                                : opt.score === 3
                                ? "bg-amber-50/60 border-amber text-amber-950"
                                : "bg-red-50/60 border-red text-red-950"
                              : "bg-purple-50/60 border-purple text-purple-950 ring-1 ring-purple"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        } ${isGraded ? "cursor-default" : "cursor-pointer"}`}
                      >
                        {/* Radio circle indicator */}
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? isGraded
                              ? opt.score === 5
                                ? "bg-green text-white"
                                : opt.score === 3
                                ? "bg-amber text-white"
                                : "bg-red text-white"
                              : "border-4 border-purple bg-white"
                            : "border border-gray-300 bg-white"
                        }`}>
                          {isSelected && isGraded && (
                            <i className="fa-solid fa-check text-[8px]"></i>
                          )}
                        </div>

                        <span className="leading-relaxed font-medium select-text">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions & Graded Feedback Panel */}
              <div className="mt-3 flex flex-col gap-4 border-t border-gray-100 pt-4 select-none">
                
                {/* Not graded action */}
                {!isGraded ? (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleGradePractice}
                      disabled={selectedOptionIndex === null}
                      className={`text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 shadow-sm btn-transition ${
                        selectedOptionIndex === null
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-purple hover:bg-purple/90 text-white"
                      }`}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      <span>Gemini Grade Practice</span>
                    </button>
                  </div>
                ) : (
                  /* Graded feedback state */
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    
                    {/* Feedback Card */}
                    <div className={`border rounded-lg p-4 flex flex-col gap-3 ${
                      gradedScore === 5
                        ? "bg-green-50/50 border-green/20 text-green-950"
                        : gradedScore === 3
                        ? "bg-amber-50/50 border-amber/20 text-amber-950"
                        : "bg-red-50/50 border-red/20 text-red-950"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider">Gemini Grading Evaluation</span>
                          <Badge label="Verified" variant="gemini" />
                        </div>
                        
                        <div className="flex items-center gap-1 font-mono text-xs font-bold">
                          <span>Score:</span>
                          <span className={
                            gradedScore === 5 ? "text-green" : gradedScore === 3 ? "text-amber" : "text-red"
                          }>
                            {gradedScore} / 5
                          </span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed font-sans select-text">
                        {gradedFeedback}
                      </p>
                    </div>

                    {/* Actions to reset or continue */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleResetScenario}
                        className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-xs font-semibold btn-transition shadow-sm"
                      >
                        Retry Scenario
                      </button>
                      
                      <button
                        onClick={() => {
                          const nextIdx = (selectedScenarioIndex + 1) % scenarios.length;
                          handleScenarioChange(nextIdx);
                          showToast(`Swapped to Scenario ${nextIdx + 1}`, "info");
                        }}
                        className="bg-gray-950 hover:bg-gray-900 text-white px-4 py-2 rounded text-xs font-semibold btn-transition shadow-sm"
                      >
                        Next Practice Case
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
