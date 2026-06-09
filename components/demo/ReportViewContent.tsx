"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import BenchmarkBar from "@/components/ui/BenchmarkBar";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { useDemo, ScoreRange } from "@/context/DemoContext";
import { questionsMap, Question } from "@/lib/demo-data/questions";

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

export default function ReportViewContent({ overrideParams }: { overrideParams?: { id: string; code: string } }) {
  const router = useRouter();
  const routeParams = useParams() as { id: string; code: string };
  const { id: scenarioId, code: reportCode } = overrideParams || routeParams;
  const { showToast } = useToast();
  const { demoState, scenarios } = useDemo();
  const isDemo = demoState.isActive;

  // 1. States
  const [showCEView, setShowCEView] = useState(true);
  
  // Modal states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Resolve the active scenario using the route parameter scenarioId
  const sc = scenarios.find(
    (s) => s.id === scenarioId || s.id.startsWith(scenarioId) || scenarioId.startsWith(s.id)
  ) || demoState.selectedScenario || scenarios[0];

  const getDemoPath = (path: string) => {
    return isDemo ? `/demo${path}` : path;
  };

  const getMockScoreValue = (range: ScoreRange): number => {
    if (range === "concerning") return 46;
    if (range === "moderate") return 68;
    if (range === "strong") return 84;
    return 95;
  };

  // Determine if this is a real static report ID or non-demo
  const isStaticReport = !isDemo || reportCode.startsWith("rep-");

  // Determine if this report (combined or individual) is completed
  let isReportReady = false;
  if (isStaticReport) {
    isReportReady = true;
  } else if (reportCode === "combined") {
    const assignedList = sc.assignedAssessments || ["A", "B", "C", "D", "E"];
    const completedCount = assignedList.filter((code) => {
      const score = sc.scores[code];
      return score && typeof score === "number" && score > 0;
    }).length;
    isReportReady = completedCount > 0;
  } else {
    const score = sc.scores[reportCode];
    isReportReady = typeof score === "number" && score > 0;
  }

  // Determine overall score dynamically
  let overallScore = 0;
  if (isStaticReport) {
    overallScore = 80;
  } else {
    const scScore = sc.scores[reportCode];
    if (reportCode === "combined") {
      const completedScores = Object.values(sc.scores).filter((s): s is number => typeof s === "number" && s > 0);
      if (completedScores.length > 0) {
        const sum = completedScores.reduce((a, b) => a + b, 0);
        overallScore = Math.round(sum / completedScores.length);
      } else {
        overallScore = 0;
      }
    } else if (scScore && typeof scScore === "number") {
      overallScore = scScore;
    } else if (sc.id === demoState.scenarioId) {
      overallScore = getMockScoreValue(demoState.scoreRange);
    } else {
      overallScore = 0;
    }
  }

  if (!isReportReady) {
    const assignedList = sc.assignedAssessments || ["A", "B", "C", "D", "E"];
    const completedCount = assignedList.filter((code) => {
      const score = sc.scores[code];
      return score && typeof score === "number" && score > 0;
    }).length;

    // Find the next uncompleted phase that is assigned
    const nextUncompletedCode = assignedList.find((code) => {
      const score = sc.scores[code];
      return !score || typeof score !== "number" || score === 0;
    });

    const codeNameMap: Record<string, string> = {
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

    return (
      <div className="flex flex-col gap-6 select-none animate-fade-in">
        {/* BACK NAVIGATION BUTTON */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={() => router.push(getDemoPath(`/accounts/${sc.id}`))}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-semibold btn-transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Account</span>
          </button>
        </div>

        {/* PENDING SCOPING DISPLAY CARD */}
        <article className="w-full flex flex-col items-center justify-center gap-6 bg-white border border-gray-200 rounded-xl p-12 shadow-md text-center max-w-2xl mx-auto mt-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple text-2xl shadow-sm animate-pulse">
            <i className="fa-solid fa-wand-magic-sparkles animate-pulse"></i>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {reportCode === "combined" ? "Combined Discovery Report" : `Phase ${reportCode} Discovery Report`}
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
              Report Pending Discovery Scoping
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed mt-1">
              Gemini synthesizes the readiness narrative and value models dynamically after discovery questions are filled. Currently, no assigned scoping questionnaires have been completed for <strong className="text-gray-700">{sc.account.name}</strong>.
            </p>
          </div>

          {/* PROGRESS SUMMARY */}
          <div className="w-full max-w-md bg-gray-50 border border-gray-150 rounded-lg p-4 flex flex-col gap-3.5 text-left mt-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-900 border-b border-gray-150 pb-2">
              <span>Assigned Questionnaires Progress</span>
              <span className="text-purple bg-purple-50 px-2 py-0.5 rounded font-mono">
                {completedCount} / {assignedList.length} Completed
              </span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
              {assignedList.map((code) => {
                const score = sc.scores[code];
                const isDone = score && typeof score === "number" && score > 0;
                return (
                  <div key={code} className="flex items-center justify-between text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isDone ? "bg-green-50 text-green" : "bg-gray-200 text-gray-400"
                      }`}>
                        {code}
                      </span>
                      <span className="truncate">{codeNameMap[code] || "Discovery Phase"}</span>
                    </div>
                    <Badge
                      label={isDone ? `Score: ${score}` : "Not Started"}
                      variant={isDone ? "success" : "info"}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTON */}
          {nextUncompletedCode && (
            <button
              onClick={() => router.push(getDemoPath(`/assessments/${sc.id}/${nextUncompletedCode}`))}
              className="bg-purple hover:bg-purple-800 text-white text-xs font-bold py-2.5 px-6 rounded-md btn-transition shadow-sm flex items-center gap-1.5 uppercase tracking-wider mt-2"
            >
              <i className="fa-solid fa-circle-play animate-pulse"></i>
              <span>Start Assessment {nextUncompletedCode}</span>
            </button>
          )}
        </article>
      </div>
    );
  }

  // Dimension Scores (Technical, Data, Business)
  const scoreDimensions = [
    { name: "Technical Readiness", score: Math.round(overallScore * 1.02) > 100 ? 100 : Math.round(overallScore * 1.02), color: "blue" as const },
    { name: "Data & Security", score: Math.round(overallScore * 0.95), color: "green" as const },
    { name: "Business Alignment", score: Math.round(overallScore * 1.01) > 100 ? 100 : Math.round(overallScore * 1.01), color: "green" as const },
  ];

  const getNarrative = () => {
    if (reportCode === "combined") {
      const completedCodes = Object.keys(sc.scores).filter((code) => {
        const score = sc.scores[code];
        return score && typeof score === "number" && score > 0;
      });
      return `Combined clinical readiness review for ${sc.account.name}. Scopes have completed ${completedCodes.join(", ")} discovery phases with an aggregated readiness score of ${overallScore}%. Integration pathways are aligned to baseline requirements.`;
    }

    // Resolve dynamic inputs summary
    const key = `${sc.id}_${reportCode}`;
    const savedIndices = demoState.completedAnswers[key];
    const questions = questionsMap[reportCode];
    let inputSummary = "";

    if (questions && savedIndices && savedIndices.length > 0) {
      if (reportCode === "C") {
        const ingestionOpt = questions[0]?.options[savedIndices[0]]?.text;
        const authOpt = questions[1]?.options[savedIndices[1]]?.text;
        if (ingestionOpt && authOpt) {
          inputSummary = ` Technical discovery validates that ingestion relies on ${ingestionOpt.toLowerCase()} secured by ${authOpt.toLowerCase()}.`;
        }
      } else if (reportCode === "D") {
        const baaOpt = questions[0]?.options[savedIndices[0]]?.text;
        const consentOpt = questions[1]?.options[savedIndices[1]]?.text;
        if (baaOpt && consentOpt) {
          inputSummary = ` Legal scoping confirms that the ${baaOpt.toLowerCase()} and patient consent configurations align to ${consentOpt.toLowerCase()}.`;
        }
      }
    }

    if (sc.id === "raphael-academic") {
      if (reportCode === "G") {
        return `Value Confirmation review for ${sc.account.name}. Gemini has compiled 180 days of production telemetry confirming a total realized annual value of $2.4M across 342 active cases processed daily. Overall performance is running 14% ahead of the pre-sales baseline target.`;
      }
      if (reportCode === "J") {
        return `Flagship Platform Maturity Review (Assessment J) for ${sc.account.name}. This full-circle validation report maps the entire journey from September 2023 pre-sales baseline to the current post-sales production maturity. The clinical documentation pipeline is confirmed 81% physician adopted, saving clinicians 3.8 hours processing time per prior authorization case.`;
      }
    }
    return `Integrating Google Cloud's generative-ai clinical models has successfully modernized the ${sc.account.useCase} workflows at ${sc.account.name}. By extracting structured EHR data and automating clinical tasks, scoping assessments indicate significant improvements in administrative throughput and physician satisfaction.${inputSummary}`;
  };

  const valueMetrics = [
    {
      label: sc.financialModel.volumeLabel,
      baseline: "Manual / Baseline",
      actual: sc.financialModel.volume,
      variance: "100% matched",
      positive: true
    },
    {
      label: `${sc.financialModel.currentCostLabel} vs ${sc.financialModel.projectedCostLabel}`,
      baseline: sc.financialModel.currentCost,
      actual: sc.financialModel.projectedCost,
      variance: "AI Optimized",
      positive: true
    },
    {
      label: sc.financialModel.timeLabel,
      baseline: sc.financialModel.currentTime,
      actual: sc.financialModel.projectedTime,
      variance: "Processed in real-time",
      positive: true
    }
  ];

  const humanStoryQuote = sc.humanStory || "The automated clinical package saved our attending clinicians an average of 1.2 hours per shift. These time savings were immediately translated back to direct patient care, significantly reducing end-of-shift charting backlogs across our pilot medicine ward.";
  const humanStoryAuthor = sc.id === "raphael-academic" ? "Program Chair" : "Chief Medical Officer";
  const humanStoryAffil = sc.id === "raphael-academic" ? "Prior Auth Program Director" : `${sc.account.name} Provider Network`;

  const getNextAction = () => {
    if (sc.id === "northside-health") {
      return {
        title: "Initiate EHR Integration Phase D",
        desc: "Enable HIPAA BAA data flows and map Epic App Orchard developer credentials to regional GCP landing zones.",
        label: "Initiate Phase D",
        target: "D"
      };
    }
    if (sc.id === "pacific-medical") {
      return {
        title: "Finalize FDE Dedicated Engineer Onboarding",
        desc: "Nominate Pacific Coast Medical Group for dedicated post-sales deployment engineering support.",
        label: "Finalize Nomination",
        target: "E"
      };
    }
    if (sc.id === "midamerica-payer") {
      return {
        title: "Resolve Member Portal Adoption Gap",
        desc: "Trigger outreach to covered members to increase claims portal utilization from 22% to 70%.",
        label: "Escalate Adoption",
        target: "F"
      };
    }
    if (reportCode === "G") {
      return {
        title: "Initiate Platform Maturity J Audit",
        desc: "Begin final scoping checks for Assessment J to validate enterprise-wide adoption metrics.",
        label: "Initiate Phase J",
        target: "J"
      };
    }

    // Dynamic next step for custom scenarios or combined reports:
    const assignedList = sc.assignedAssessments || ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const nextUncompletedCode = assignedList.find((code) => {
      const score = sc.scores[code];
      return !score || typeof score !== "number" || score === 0;
    });

    if (!nextUncompletedCode) {
      return {
        title: "All Assigned Phases Completed!",
        desc: "This customer has completed all assigned assessments. You are ready for final sign-off.",
        label: "Return to Account",
        target: ""
      };
    }

    const codeMap: Record<string, { title: string; desc: string; label: string }> = {
      A: { title: "Initiate Phase A: Strategic Vision", desc: "Align with the C-suite on executive pain points and clinical burnout objectives.", label: "Initiate Phase A" },
      B: { title: "Initiate Phase B: Business Value Map", desc: "Define business metrics and quantify direct ROI drivers with baseline data.", label: "Initiate Phase B" },
      C: { title: "Initiate Phase C: Technical EHR Scoping", desc: "Map OAuth endpoints, Epic developer sandboxes, and secure ingestion pipes.", label: "Initiate Phase C" },
      D: { title: "Initiate Phase D: Data & Security Review", desc: "Conduct regulatory review, secure cloud landing zones, and legal BAA checks.", label: "Initiate Phase D" },
      E: { title: "Initiate Phase E: FDE Nomination Gate", desc: "Finalize pre-sales discovery checklists to gate dedicated post-sales engineers.", label: "Initiate Phase E" },
      F: { title: "Initiate Phase F: Solution Health Checklist", desc: "Map post-sales integration latency and monitor telemetry adoption gaps.", label: "Initiate Phase F" },
      G: { title: "Initiate Phase G: Value Realization Review", desc: "Confirm cumulative business value metrics and check ROI realizations.", label: "Initiate Phase G" },
      H: { title: "Initiate Phase H: Adoption Review", desc: "Run clinician adoption feedback campaigns and staff training modules.", label: "Initiate Phase H" },
      I: { title: "Initiate Phase I: Expansion Brief", desc: "Rank potential follow-on clinical use cases for expansion planning.", label: "Initiate Phase I" },
      J: { title: "Initiate Phase J: Platform Maturity Audit", desc: "Generate final Platform Maturity Report and outline next clinical chapters.", label: "Initiate Phase J" }
    };

    const matched = codeMap[nextUncompletedCode] || {
      title: `Initiate Phase ${nextUncompletedCode}`,
      desc: "Complete next scoping requirements to advance readiness scoring.",
      label: `Start Phase ${nextUncompletedCode}`
    };

    return {
      title: matched.title,
      desc: matched.desc,
      label: matched.label,
      target: nextUncompletedCode
    };
  };

  const nextAction = getNextAction();

  const closingText = sc.closingParagraph || `Every clinical advancement represents a technical foundation built on trust, speed, and security. By engineering automated clinical solutions, Google Cloud enables providers to focus on what matters most: patient outcomes.`;



  const handleRegenerate = () => {
    showToast("Gemini is recalculating readiness schemas...", "info", "fa-wand-magic-sparkles");
    setTimeout(() => {
      showToast("Report regenerated with Gemini 1.5 Pro!", "success");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* STICKY ACTION BAR AT TOP */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-[-20px] md:top-[-24px] z-10 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => router.push(getDemoPath(`/accounts/${sc.id}`))}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-semibold btn-transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Account</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Toggle Customer View */}
          <button
            onClick={() => {
              setShowCEView(!showCEView);
              showToast(
                showCEView ? "Previewing Customer Portal View (CE data hidden)" : "Displaying full Internal CE View",
                "info"
              );
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded border btn-transition ${
              showCEView 
                ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100" 
                : "bg-purple-50 text-purple border-purple/20 font-bold"
            }`}
          >
            <i className="fa-solid fa-eye mr-1"></i>
            <span>{showCEView ? "Preview Customer View" : "Show CE View"}</span>
          </button>

          {/* Gemini Regenerate Button */}
          <button
            onClick={handleRegenerate}
            className="bg-purple-50 hover:bg-purple-50/80 border border-purple/20 text-purple text-xs font-bold px-3 py-1.5 rounded btn-transition shadow-sm flex items-center gap-1.5"
            title="Bust Upstash cache and regenerate with Gemini 1.5 Pro"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>Regenerate</span>
          </button>

          {/* Compare button */}
          <button
            onClick={() => setIsCompareOpen(true)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-750 text-xs font-medium px-3 py-1.5 rounded btn-transition"
          >
            <i className="fa-solid fa-right-left mr-1.5 text-[10px]"></i>
            <span>Compare</span>
          </button>

          {/* Share button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="bg-blue hover:bg-blue-dk text-white text-xs font-semibold px-3 py-1.5 rounded btn-transition shadow-sm"
          >
            <i className="fa-solid fa-share-nodes mr-1.5"></i>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* MAIN SCROLLABLE REPORT CONTAINER */}
      <article className="w-full flex flex-col gap-8 bg-white border border-gray-200 rounded-xl p-8 shadow-md select-none">
        
        {/* SECTION 1: SCORE HEADER ROW */}
        <section className="flex flex-col gap-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {reportCode === "combined" ? "Combined AI Readiness Assessment Report" : `AI Readiness Assessment Report (Assessment ${reportCode})`}
              </span>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight select-text">{sc.account.name}</h2>
              <p className="text-xs text-gray-500 select-text">{sc.account.useCase}</p>
              <span className="text-[10px] font-bold text-gray-400 mt-1 select-text">Scanned on Oct 22, 2024</span>
            </div>

            {/* Large Score Ring */}
            <div className="flex-shrink-0">
              <ScoreRing score={overallScore} size="lg" />
            </div>
          </div>

          {/* Benchmark Bar */}
          <div className="flex flex-col gap-1 py-2">
            <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider select-none">
              Comparative Readiness Performance
            </span>
            <BenchmarkBar score={overallScore} peerAvg={68} topQuartile={84} />
          </div>
        </section>

        {/* SECTION 2: SCORE BREAKDOWN */}
        <section className="flex flex-col gap-4 pb-6 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Maturity Dimension Scores
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scoreDimensions.map((dim, idx) => (
              <div key={idx} className="border border-gray-150 bg-gray-50/50 rounded-md p-4 flex flex-col gap-2 justify-between">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-900">
                  <span>{dim.name}</span>
                  <span className="text-blue">{dim.score}%</span>
                </div>
                <ProgressBar percentage={dim.score} variant={dim.color} />
              </div>
            ))}
          </div>
        </section>



        {/* SECTION 3: FINANCIAL VALUE REALIZED */}
        <section className="flex flex-col gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Financial & Clinical Value Model
            </h3>
            <Badge label="Gemini 1.5 Pro" variant="gemini" />
          </div>

          {/* AI Generated Summary Paragraph */}
          <p className="text-xs text-gray-700 leading-relaxed select-text bg-purple-50/20 border border-purple/5 p-4 rounded-md">
            {getNarrative()}
          </p>

          {/* Value Attribution Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-left">
              <span>Attribution Dimension</span>
              <span>EHR Baseline</span>
              <span>Automated Target</span>
            </div>

            <div className="flex flex-col text-xs text-gray-700">
              {valueMetrics.map((m, idx) => (
                <div key={idx} className="grid grid-cols-3 border-b border-gray-100 last:border-0 p-3 items-center hover:bg-gray-50/50 select-text">
                  <div className="font-semibold text-gray-900 leading-tight">{m.label}</div>
                  <div>{m.baseline}</div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-blue">{m.actual}</span>
                    <span className="text-[10px] text-green font-semibold mt-0.5">{m.variance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: THE HUMAN STORY */}
        <section className="pb-2">
          <div className="bg-human-story border-l-[3px] border-l-purple rounded-r-lg p-6 flex flex-col gap-3 shadow-sm select-text">
            <p className="text-xs italic text-purple-800 leading-relaxed font-medium">
              &ldquo;{humanStoryQuote}&rdquo;
            </p>
            <div className="flex flex-col text-[10px] text-purple font-semibold uppercase tracking-wider">
              <span>— {humanStoryAuthor}</span>
              <span className="text-purple-800/70 mt-0.5">{humanStoryAffil}</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERNAL CE VIEW (Conditional) */}
        {showCEView && (
          <section className="border border-purple/20 bg-purple-50 rounded-xl p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-purple/10 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple flex items-center gap-1.5">
                <i className="fa-solid fa-eye-slash text-purple"></i>
                <span>Internal CE View — Not Visible to Customer</span>
              </h4>
              <Badge label="CE Eyes Only" variant="gemini" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs select-text">
              <div className="flex flex-col leading-tight">
                <span className="text-purple/60 font-semibold uppercase text-[9px] tracking-wider">Churn Risk</span>
                <span className="text-green font-bold text-sm mt-0.5">
                  {sc.id === "midamerica-payer" ? "HIGH" : "LOW"}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-purple/60 font-semibold uppercase text-[9px] tracking-wider">Expansion Signal</span>
                <span className="text-blue font-bold text-sm mt-0.5">
                  {sc.id === "raphael-academic" ? "EXPANDING" : "STABLE"}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-purple/60 font-semibold uppercase text-[9px] tracking-wider">Customer NPS</span>
                <span className="text-purple font-bold text-sm mt-0.5">
                  {sc.id === "raphael-academic" ? "9 / 10" : "8 / 10"}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-purple/60 font-semibold uppercase text-[9px] tracking-wider">Platform maturity</span>
                <span className="text-gray-900 font-bold text-sm mt-0.5">
                  {reportCode === "combined" ? "Combined Scopes" : `Phase ${reportCode} Scoped`}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6: ONE NEXT STEP CTA */}
        <section className="bg-navy text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden nsc">
          <div className="flex flex-col gap-1.5 leading-tight min-w-0">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider select-none">
              One Recommended Next Action
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5 select-text truncate">
              {nextAction.title}
            </h4>
            <p className="text-[11px] text-white/75 leading-relaxed mt-1 select-text">
              {nextAction.desc}
            </p>
          </div>

          <button
            onClick={() => {
              if (nextAction.target) {
                router.push(getDemoPath(`/assessments/${sc.id}/${nextAction.target}`));
              } else {
                router.push(getDemoPath(`/accounts/${sc.id}`));
              }
            }}
            className="bg-white hover:bg-gray-100 text-navy text-xs font-bold py-2 px-4 rounded-md btn-transition shadow-sm flex-shrink-0 uppercase tracking-wider"
          >
            {nextAction.label}
          </button>
        </section>

        {/* SECTION 7: CLOSING SIGNATURE PARAGRAPH */}
        <section className="bg-gray-900 text-white rounded-xl p-6 shadow-md flex flex-col gap-4 closing-card select-none">
          <p className="text-sm leading-relaxed select-text">
            {closingText}
          </p>
          <div className="flex flex-col gap-1.5 pt-3 border-t border-white/10 select-none">
            <span className="text-base font-bold text-blue-100 tracking-wide leading-tight highlight">
              Google Healthcare & Life Sciences Group
            </span>
            <span className="text-xs font-semibold text-white/90 italic final">
              &ldquo;The next chapter starts here.&rdquo;
            </span>
          </div>
        </section>

        {/* APPENDIX: DETAILED DISCOVERY QUESTIONNAIRE AUDIT */}
        {(() => {
          if (reportCode === "combined") {
            const completedCodes = Object.keys(sc.scores).filter((code) => {
              const score = sc.scores[code];
              return score && typeof score === "number" && score > 0;
            });

            if (completedCodes.length === 0) return null;

            return (
              <section className="flex flex-col gap-4 border-t border-gray-150 pt-6 select-text">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 select-none flex items-center gap-1.5">
                  <i className="fa-solid fa-clipboard-list text-gray-400"></i>
                  <span>Appendix: Aggregated Discovery Questionnaire Audit</span>
                </h3>
                <div className="flex flex-col gap-5 w-full">
                  {completedCodes.map((code) => {
                    const key = `${sc.id}_${code}`;
                    let savedIndices = demoState.completedAnswers[key];
                    if ((!savedIndices || savedIndices.length === 0) && typeof sc.scores[code] === "number" && (sc.scores[code] as number) > 0) {
                      const questions = questionsMap[code];
                      if (questions) {
                        savedIndices = findBestCombination(questions, sc.scores[code] as number);
                      }
                    }
                    const questions = questionsMap[code];
                    
                    if (!questions || !savedIndices || savedIndices.length === 0) return null;

                    return (
                      <div key={code} className="flex flex-col gap-2.5 border-l-2 border-blue-100 pl-4 py-1">
                        <span className="text-[10px] font-bold text-blue uppercase tracking-wider select-none">Phase {code} Inputs</span>
                        {questions.map((q, qIdx) => {
                          const chosenOptIdx = savedIndices[qIdx];
                          const chosenOpt = q.options[chosenOptIdx];
                          if (!chosenOpt) return null;

                          return (
                            <div key={q.id} className="flex flex-col gap-1 text-xs">
                              <div className="flex items-start justify-between gap-3 font-semibold text-gray-900 leading-snug">
                                <span>{q.text}</span>
                                <span className="text-blue shrink-0 font-mono text-[9px] bg-blue-50 px-1 py-0.5 rounded">Score: {chosenOpt.score}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-gray-600 font-medium pl-2 mt-0.5 leading-normal">
                                <i className="fa-solid fa-circle-check text-green text-[10px] mt-0.5 shrink-0"></i>
                                <span>{chosenOpt.text}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          const key = `${sc.id}_${reportCode}`;
          let savedIndices = demoState.completedAnswers[key];
          if ((!savedIndices || savedIndices.length === 0) && typeof sc.scores[reportCode] === "number" && (sc.scores[reportCode] as number) > 0) {
            const questions = questionsMap[reportCode];
            if (questions) {
              savedIndices = findBestCombination(questions, sc.scores[reportCode] as number);
            }
          }
          const questions = questionsMap[reportCode];
          
          if (!questions || !savedIndices || savedIndices.length === 0) return null;

          return (
            <section className="flex flex-col gap-4 border-t border-gray-150 pt-6 select-text">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 select-none flex items-center gap-1.5">
                <i className="fa-solid fa-clipboard-list text-gray-400"></i>
                <span>Appendix: Discovery Questionnaire Responses Audit</span>
              </h3>
              <div className="flex flex-col gap-3.5 w-full">
                {questions.map((q, qIdx) => {
                  const chosenOptIdx = savedIndices[qIdx];
                  const chosenOpt = q.options[chosenOptIdx];
                  if (!chosenOpt) return null;

                  return (
                    <div key={q.id} className="flex flex-col gap-1 text-xs">
                      <div className="flex items-start justify-between gap-3 font-semibold text-gray-900 leading-snug">
                        <span>Question {q.id}: {q.text}</span>
                        <span className="text-blue shrink-0 font-mono text-[10px] bg-blue-50 px-1 py-0.5 rounded">Score: {chosenOpt.score}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-gray-600 font-medium pl-4 mt-0.5 leading-normal">
                        <i className="fa-solid fa-circle-check text-green text-[10px] mt-0.5 shrink-0"></i>
                        <span>{chosenOpt.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

      </article>

      {/* MODALS WIRING */}
      {/* A. Share Link Modal */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        width="440px"
        title="Generate Secure Share Link"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {isDemo 
              ? "Create a secure read-only demo showcase link (expires in 24 hours):" 
              : "Create a secure read-only dashboard link that can be shared directly with customer sponsors:"}
          </p>

          <div className="flex flex-col gap-2 border border-gray-150 rounded bg-gray-50 p-3">
            {[
              "Require zero Google Login credentials to view",
              isDemo ? "Includes a floating showcase banner automatically" : `Limit access strictly to ${sc.account.name}'s portal`,
              isDemo ? "Automatically expires in 24 hours" : "Set automatic security token expiry (90 days)",
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
                ? `https://hcls-navigator.google.com/demo-shared/${sc.id}-${reportCode}`
                : `https://hcls-navigator.google.com/share/${sc.id}-${reportCode}`}
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

      {/* B. Comparison Modal */}
      <Modal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        width="600px"
        title="Compare Readiness Version Scores"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500">
            Review progress metrics comparing original pre-sales baselines (v1) against post-sales maturity reviews (v2):
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50/50 text-center flex flex-col items-center gap-2">
              <span className="section-title text-gray-500">Pre-Sales Baseline (v1)</span>
              <div className="text-2xl font-extrabold text-amber-600 mt-2">
                {Math.round(overallScore * 0.85)}%
              </div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Needs blockers resolved</span>
            </div>

            <div className="border border-gray-200 rounded-md p-4 bg-gray-50/50 text-center flex flex-col items-center gap-2">
              <span className="section-title text-gray-500">Current Assessment (v2)</span>
              <div className="text-2xl font-extrabold text-green-600 mt-2">{overallScore}%</div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Passed FDE Nomination Gates</span>
            </div>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-100 rounded-md flex items-start gap-2 text-[11px] text-purple">
            <i className="fa-solid fa-wand-magic-sparkles mt-0.5 flex-shrink-0"></i>
            <span>
              <strong>Gemini Narrative:</strong> User adoption scores increased following BAA sign-off and the successful deployment of model orchestration pipelines. Recommended next action is to move the active staging target into production.
            </span>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-gray-50">
            <button
              onClick={() => setIsCompareOpen(false)}
              className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
