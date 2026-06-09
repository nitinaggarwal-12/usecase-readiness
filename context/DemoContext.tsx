"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { demoScenarios, DemoScenario } from "@/lib/demo-data/scenarios";
import { useToast } from "@/components/ui/Toast";
import { questionsMap, Question } from "@/lib/demo-data/questions";

export type ScoreRange = "concerning" | "moderate" | "strong" | "excellent";
export type DemoDuration = "quick" | "standard" | "deep";

export interface DemoState {
  isActive: boolean;
  scenarioId: string;
  selectedScenario: DemoScenario | null;
  selectedFeatures: string[];
  scoreRange: ScoreRange;
  duration: DemoDuration;
  currentStepIndex: number;
  isTourMinimized: boolean;
  isPresenterMode: boolean;
  queuedNotifications: any[];
  completedAnswers: Record<string, number[]>;
  customScenarios: DemoScenario[];
}

interface DemoContextType {
  demoState: DemoState;
  scenarios: DemoScenario[];
  startDemo: (scenarioId: string, features: string[], scoreRange: ScoreRange, duration: DemoDuration) => void;
  exitDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (index: number) => void;
  setMinimized: (minimized: boolean) => void;
  setPresenterMode: (presenter: boolean) => void;
  queueRealNotification: (notif: any) => void;
  saveCompletedAnswers: (key: string, indices: number[]) => void;
  registerCustomScenario: (orgName: string, segment: string, useCase: string, assignedCodes?: string[], prefill?: boolean, assessmentName?: string, description?: string) => string;
  toggleAssessmentAssignment: (scenarioId: string, code: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

function findBestCombination(questions: Question[], targetScore: number): number[] {
  if (!questions || questions.length === 0) return [];
  let bestCombination: number[] = [];
  let minDiff = Infinity;

  function search(qIdx: number, currentIndices: number[], currentSum: number) {
    if (qIdx === questions.length) {
      const avg = currentSum / questions.length;
      const diff = Math.abs(avg - targetScore);
      if (diff < minDiff) {
        minDiff = diff;
        bestCombination = [...currentIndices];
      }
      return;
    }

    const q = questions[qIdx];
    for (let i = 0; i < q.options.length; i++) {
      search(qIdx + 1, [...currentIndices, i], currentSum + q.options[i].score);
    }
  }

  search(0, [], 0);
  return bestCombination;
}

export function getPreCompletedAnswers(): Record<string, number[]> {
  const answers: Record<string, number[]> = {};
  for (const sc of demoScenarios) {
    for (const [code, score] of Object.entries(sc.scores)) {
      if (score && typeof score === "number" && score > 0) {
        const questions = questionsMap[code];
        if (questions) {
          answers[`${sc.id}_${code}`] = findBestCombination(questions, score);
        }
      }
    }
  }
  return answers;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const [demoState, setDemoState] = useState<DemoState>({
    isActive: false,
    scenarioId: "",
    selectedScenario: null,
    selectedFeatures: [],
    scoreRange: "moderate",
    duration: "standard",
    currentStepIndex: 0,
    isTourMinimized: false,
    isPresenterMode: false,
    queuedNotifications: [],
    completedAnswers: {},
    customScenarios: [],
  });

  // Load state from sessionStorage to keep it persistent across page navigations in Demo Mode
  useEffect(() => {
    const savedState = sessionStorage.getItem("hcls_demo_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setDemoState(parsed);
      } catch (e) {
        console.error("Error loading demo state from session storage:", e);
      }
    }
  }, []);

  const saveState = (newState: DemoState) => {
    setDemoState(newState);
    sessionStorage.setItem("hcls_demo_state", JSON.stringify(newState));
  };

  const scenarios = [...demoScenarios, ...(demoState.customScenarios || [])].map((sc) => {
    const updatedScores = { ...sc.scores };
    Object.keys(questionsMap).forEach((code) => {
      const key = `${sc.id}_${code}`;
      const savedAnswers = demoState.completedAnswers[key];
      if (savedAnswers && savedAnswers.length > 0) {
        const questions = questionsMap[code];
        if (questions) {
          const total = savedAnswers.reduce((sum, optIdx, qIdx) => {
            const opt = questions[qIdx]?.options[optIdx];
            return sum + (opt ? opt.score : 0);
          }, 0);
          updatedScores[code] = Math.round(total / questions.length);
        }
      }
    });
    return {
      ...sc,
      scores: updatedScores,
    };
  });

  const startDemo = (
    scenarioId: string,
    features: string[],
    scoreRange: ScoreRange,
    duration: DemoDuration
  ) => {
    const selected = demoScenarios.find((s) => s.id === scenarioId) || null;
    
    // Resolve standard pre-completed answers
    const initialAnswers = getPreCompletedAnswers();
    
    // If there is a selected scenario, override its active assessment answers with the selected score range!
    if (selected) {
      const targetScore = scoreRange === "concerning" ? 46 : scoreRange === "moderate" ? 68 : scoreRange === "strong" ? 84 : 95;
      const codes = ["A", "B", "C", "D", "E"];
      for (const code of codes) {
        const originalScore = selected.scores[code];
        if (originalScore && typeof originalScore === "number" && originalScore > 0) {
          const questions = questionsMap[code];
          if (questions) {
            initialAnswers[`${scenarioId}_${code}`] = findBestCombination(questions, targetScore);
          }
        }
      }
    }

    const newState: DemoState = {
      isActive: true,
      scenarioId,
      selectedScenario: selected,
      selectedFeatures: features,
      scoreRange,
      duration,
      currentStepIndex: 0,
      isTourMinimized: false,
      isPresenterMode: false,
      queuedNotifications: [],
      completedAnswers: initialAnswers,
      customScenarios: [],
    };
    saveState(newState);
    
    showToast(`Demo ready — ${selected?.account.name || "Scenario"} loaded!`, "success");
    router.push("/demo/dashboard");
  };

  const exitDemo = () => {
    sessionStorage.removeItem("hcls_demo_state");
    setDemoState({
      isActive: false,
      scenarioId: "",
      selectedScenario: null,
      selectedFeatures: [],
      scoreRange: "moderate",
      duration: "standard",
      currentStepIndex: 0,
      isTourMinimized: false,
      isPresenterMode: false,
      queuedNotifications: [],
      completedAnswers: {},
      customScenarios: [],
    });

    showToast("Demo cleared — back to your real accounts", "info");
    router.push("/");
  };

  const registerCustomScenario = (orgName: string, segment: string, useCase: string, assignedCodes?: string[], prefill?: boolean, assessmentName?: string, description?: string): string => {
    const cleanOrg = orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cleanAssess = (assessmentName || "Initial").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slug = `${cleanOrg}-${cleanAssess}`;
    
    // Avoid duplicate IDs
    const exists = scenarios.find((s) => s.id === slug);
    const finalSlug = exists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const assigned = assignedCodes && assignedCodes.length > 0
      ? assignedCodes
      : ["A", "B", "C", "D", "E"]; // default pre-sales

    const initialScores: Record<string, number> = {
      A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0
    };
    if (prefill) {
      assigned.forEach((code) => {
        if (["A", "B", "C", "D", "E"].includes(code)) {
          initialScores[code] = 80;
        }
      });
    }

    const ucLower = useCase.toLowerCase();
    const segLower = segment.toLowerCase();
    const computedSignals: string[] = [];

    if (segLower.includes("life") || segLower.includes("pharma")) {
      computedSignals.push("FDA 21 CFR Part 11 Validation Compliance");
      computedSignals.push("GxP Clinical Trial Validation Scopes");
      computedSignals.push("EU AI Act Research & Development Exemptions");
    } else if (segLower.includes("medtech") || segLower.includes("device")) {
      computedSignals.push("FDA SaMD (Software as a Medical Device) Submission");
      computedSignals.push("EU MDR Article 120 AI Software Gate");
      computedSignals.push("ISO 13485 Medical Software Quality Standards");
    } else if (segLower.includes("payer") || segLower.includes("insur")) {
      computedSignals.push("CMS Interoperability & Prior Auth Rule Mandate");
      computedSignals.push("NAIC Model Bulletin on Insurance AI Auditing");
      computedSignals.push("HIPAA Privacy Rule for Cloud Ingestion Protocols");
    } else {
      // Providers & standard healthcare systems
      if (ucLower.includes("auth") || ucLower.includes("prior")) {
        computedSignals.push("CMS Prior Authorization Rule Mandate");
      } else if (ucLower.includes("decision") || ucLower.includes("cds") || ucLower.includes("advis")) {
        computedSignals.push("FDA Clinical Decision Support (CDS) Rule");
      } else {
        computedSignals.push("CMS Inpatient Data Interoperability Mandate (FHIR)");
      }
      computedSignals.push("HIPAA Privacy Rule for Cloud Ingestion Protocols");
      computedSignals.push("Colorado AI Act Compliance Review");
    }

    const customSc: DemoScenario = {
      id: finalSlug,
      assessmentName: assessmentName || "Initial Scoping",
      account: {
        name: orgName,
        type: `${segment} · Custom`,
        cloud: "Google Cloud Native",
        ehr: "Epic Systems v2024",
        useCase: useCase,
        stage: "Pre-Sales",
        ce: "Nitin Aggarwal",
        ae: "Sarah Jenkins",
        sa: "Devon Miller",
        description: description || ""
      },
      contacts: [
        { name: "Attending Physician", role: "Clinical Pilot Sponsor" }
      ],
      scores: initialScores,
      assignedAssessments: assigned,
      blockers: [],
      financialModel: {
        volumeLabel: "Annual Case Volume",
        volume: "85,000 cases",
        currentCostLabel: "Manual Intake Cost",
        currentCost: "$1,275,000",
        projectedCostLabel: "GenAI Automation Cost",
        projectedCost: "$255,000",
        currentMetricLabel: "Average Processing Time",
        currentMetric: "48 hours",
        projectedMetricLabel: "Target Processing Time",
        projectedMetric: "5 minutes",
        timeLabel: "Clinician Administrative Charting",
        currentTime: "12 mins / case",
        projectedTime: "30 secs / case",
        baseValue: "$1.02M",
        highValue: "$1.27M",
        payback: "3.2 months"
      },
      marketIntelligence: [],
      timeline: prefill
        ? [
            { name: "EHR Sandbox Scoping", duration: "Oct 12, 2024", status: "prog", isCriticalPath: true },
            { name: "HIPAA BAA Agreement Signed", duration: "Pending", status: "todo", isCriticalPath: true },
            { name: "Production Launch Verification", duration: "Target: Dec 15, 2024", status: "todo" }
          ]
        : [
            { name: "EHR Sandbox Scoping", duration: "Pending", status: "todo", isCriticalPath: true },
            { name: "HIPAA BAA Agreement Signed", duration: "Pending", status: "todo", isCriticalPath: true },
            { name: "Production Launch Verification", duration: "Pending", status: "todo" }
          ],
      regulatorySignals: computedSignals,
      humanStory: "The generative-ai workflow modernization saved our pilot practitioners an average of 1.2 hours per shift, reducing charting backlogs and restoring patient face-time.",
      closingParagraph: "Integrating generative clinical reasoning workflows accelerates prior auth intake, securing downstream financial claims and ensuring compliance blockers are cleared upfront.",
      expansionUseCases: [
        { rank: 1, useCase: "Discharge Summarization Agent", value: "$450k" }
      ]
    };

    // Pre-complete answers for custom scenario using target combination matcher
    const initialAnswers = { ...demoState.completedAnswers };
    if (prefill) {
      assigned.forEach((code) => {
        const questions = questionsMap[code];
        if (questions) {
          initialAnswers[`${finalSlug}_${code}`] = findBestCombination(questions, 80);
        }
      });
    }

    const newState: DemoState = {
      ...demoState,
      customScenarios: [...(demoState.customScenarios || []), customSc],
      completedAnswers: initialAnswers
    };
    saveState(newState);
    return finalSlug;
  };

  const toggleAssessmentAssignment = (scenarioId: string, code: string) => {
    setDemoState((prev) => {
      const updatedCustom = (prev.customScenarios || []).map((sc) => {
        if (sc.id === scenarioId) {
          const currentAssigned = sc.assignedAssessments || ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
          const isAssigned = currentAssigned.includes(code);
          const newAssigned = isAssigned
            ? currentAssigned.filter((c) => c !== code)
            : [...currentAssigned, code];

          const newScores = { ...sc.scores };
          if (!isAssigned) {
            if (["A", "B", "C", "D", "E"].includes(code) && !newScores[code]) {
              newScores[code] = 80;
            }
          } else {
            newScores[code] = 0;
          }

          return {
            ...sc,
            assignedAssessments: newAssigned,
            scores: newScores
          };
        }
        return sc;
      });

      const newState = {
        ...prev,
        customScenarios: updatedCustom
      };
      sessionStorage.setItem("hcls_demo_state", JSON.stringify(newState));
      return newState;
    });
  };

  const saveCompletedAnswers = (key: string, indices: number[]) => {
    setDemoState((prev) => {
      const newState = {
        ...prev,
        completedAnswers: {
          ...prev.completedAnswers,
          [key]: indices,
        },
      };
      // Save to session storage
      sessionStorage.setItem("hcls_demo_state", JSON.stringify(newState));
      return newState;
    });
  };

  const nextStep = () => {
    const maxSteps = getTourStepsCount();
    if (demoState.currentStepIndex < maxSteps - 1) {
      const newState = {
        ...demoState,
        currentStepIndex: demoState.currentStepIndex + 1,
      };
      saveState(newState);
    }
  };

  const prevStep = () => {
    if (demoState.currentStepIndex > 0) {
      const newState = {
        ...demoState,
        currentStepIndex: demoState.currentStepIndex - 1,
      };
      saveState(newState);
    }
  };

  const jumpToStep = (index: number) => {
    const maxSteps = getTourStepsCount();
    if (index >= 0 && index < maxSteps) {
      const newState = {
        ...demoState,
        currentStepIndex: index,
      };
      saveState(newState);
    }
  };

  const setMinimized = (minimized: boolean) => {
    const newState = {
      ...demoState,
      isTourMinimized: minimized,
    };
    saveState(newState);
  };

  const setPresenterMode = (presenter: boolean) => {
    const newState = {
      ...demoState,
      isPresenterMode: presenter,
    };
    saveState(newState);
    showToast(
      presenter ? "Presenter Mode ON (Hidden coaching tip blocks)" : "Presenter Mode OFF",
      "info"
    );
  };

  const queueRealNotification = (notif: any) => {
    if (demoState.isActive) {
      const newState = {
        ...demoState,
        queuedNotifications: [...demoState.queuedNotifications, notif],
      };
      saveState(newState);
    }
  };

  const getTourStepsCount = (): number => {
    if (demoState.duration === "quick") return 4;
    if (demoState.duration === "standard") return 8;
    return 15;
  };

  return (
    <DemoContext.Provider
      value={{
        demoState,
        scenarios,
        startDemo,
        exitDemo,
        nextStep,
        prevStep,
        jumpToStep,
        setMinimized,
        setPresenterMode,
        queueRealNotification,
        saveCompletedAnswers,
        registerCustomScenario,
        toggleAssessmentAssignment,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    return {
      demoState: {
        isActive: false,
        scenarioId: "",
        selectedScenario: null,
        selectedFeatures: [],
        scoreRange: "moderate" as ScoreRange,
        duration: "standard" as DemoDuration,
        currentStepIndex: 0,
        isTourMinimized: false,
        isPresenterMode: false,
        queuedNotifications: [],
        completedAnswers: {} as Record<string, number[]>,
        customScenarios: [] as DemoScenario[],
      },
      scenarios: demoScenarios,
      startDemo: () => {},
      exitDemo: () => {},
      nextStep: () => {},
      prevStep: () => {},
      jumpToStep: () => {},
      setMinimized: () => {},
      setPresenterMode: () => {},
      queueRealNotification: () => {},
      saveCompletedAnswers: () => {},
      registerCustomScenario: () => "",
      toggleAssessmentAssignment: () => {},
    };
  }
  return context;
}
