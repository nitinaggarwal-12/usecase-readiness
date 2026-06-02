"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import BenchmarkBar from "@/components/ui/BenchmarkBar";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

export default function ReportViewPage() {
  const router = useRouter();
  const { id: reportId } = useParams() as { id: string };
  const { showToast } = useToast();

  // 1. States
  const [showCEView, setShowCEView] = useState(true);
  
  // Modal states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Mock report lookup data (using standard values)
  const accountId = "mayo-clinic";
  const accountName = "Mayo Clinic";
  const useCase = "Patient Discharge Summarization";
  const reportDate = "June 02, 2026";
  const overallScore = 82;

  // Section 2: Dimension Scores
  const scoreDimensions = [
    { name: "Technical Readiness", score: 85, color: "blue" as const },
    { name: "Data & Security", score: 78, color: "green" as const },
    { name: "Business Alignment", score: 83, color: "green" as const },
  ];

  // Section 3: Value table data
  const valueMetrics = [
    { label: "Discharge Transcription Time", baseline: "3.4 hrs", actual: "1.2 hrs", variance: "-2.2 hrs (64% reduction)", positive: true },
    { label: "Physician Documentation Burnout (NPS)", baseline: "-14", actual: "+42", variance: "+56 pts improvement", positive: true },
    { label: "Daily Bed Turnaround Scopes", baseline: "420 beds", actual: "540 beds", variance: "+120 beds (+28%)", positive: true },
  ];

  const handleRegenerate = () => {
    showToast("Gemini is recalculating readiness schemas...", "info", "fa-wand-magic-sparkles");
    setTimeout(() => {
      showToast("Report regenerated with Gemini 1.5 Pro!", "success");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* STICKY ACTION BAR AT TOP */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-[52px] z-10 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => router.push(`/accounts/${accountId}`)}
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

      {/* MAIN SCROLLABLE REPORT CONTAINER (Max-width 740px) */}
      <article className="max-w-[740px] w-full mx-auto flex flex-col gap-8 bg-white border border-gray-200 rounded-xl p-8 shadow-md select-none">
        
        {/* ========================================== */}
        {/* SECTION 1: SCORE HEADER ROW               */}
        {/* ========================================== */}
        <section className="flex flex-col gap-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                AI Readiness Assessment Report
              </span>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight select-text">{accountName}</h2>
              <p className="text-xs text-gray-500 select-text">{useCase}</p>
              <span className="text-[10px] font-bold text-gray-400 mt-1 select-text">Scanned on {reportDate}</span>
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

        {/* ========================================== */}
        {/* SECTION 2: SCORE BREAKDOWN                 */}
        {/* ========================================== */}
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

        {/* ========================================== */}
        {/* SECTION 3: FINANCIAL VALUE REALIZED        */}
        {/* ========================================== */}
        <section className="flex flex-col gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Financial & Clinical Value Realized
            </h3>
            <Badge label="Gemini 1.5 Pro" variant="gemini" />
          </div>

          {/* AI Generated Summary Paragraph */}
          <p className="text-xs text-gray-700 leading-relaxed select-text bg-purple-50/20 border border-purple/5 p-4 rounded-md">
            Integrating Google Cloud&apos;s generative-ai clinical models has successfully modernized the patient discharge summarization pipelines at <strong>Mayo Clinic</strong>. By extracting structured FHIR telemetry payloads and automating note drafts directly into the Epic Systems EHR, clinicians have observed a significant reduction in administrative documentation fatigue alongside improved bed turnover throughput.
          </p>

          {/* Value Attribution Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-left">
              <span>Attribution Dimension</span>
              <span>EHR Baseline</span>
              <span>Automated Target</span>
            </div>

            {/* Table Rows */}
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

        {/* ========================================== */}
        {/* SECTION 4: THE HUMAN STORY (Quote Block)  */}
        {/* ========================================== */}
        <section className="pb-2">
          <div className="bg-human-story border-l-[3px] border-l-purple rounded-r-lg p-6 flex flex-col gap-3 shadow-sm select-text">
            <p className="text-xs italic text-purple-800 leading-relaxed font-medium">
              &ldquo;The automated discharge summarization package saved our attending hospitalists an average of 1.2 hours per shift. These time savings were immediately translated back to direct patient care, significantly reducing end-of-shift charting backlogs across our entire pilot medicine ward.&rdquo;
            </p>
            <div className="flex flex-col text-[10px] text-purple font-semibold uppercase tracking-wider">
              <span>— Chief Medical Officer</span>
              <span className="text-purple-800/70 mt-0.5">Mayo Clinic Provider Network</span>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 5: INTERNAL CE VIEW (Conditional)  */}
        {/* ========================================== */}
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
                <span className="text-green font-bold text-sm mt-0.5">LOW (N/A)</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-purple/60 font-semibold uppercase text-[9px] tracking-wider">Expansion Signal</span>
                <span className="text-blue font-bold text-sm mt-0.5">HIGH (US-East)</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-purple/60 font-semibold uppercase text-[9px] tracking-wider">Customer NPS</span>
                <span className="text-purple font-bold text-sm mt-0.5">9 / 10</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-purple/60 font-semibold uppercase text-[9px] tracking-wider">Platform maturity</span>
                <span className="text-gray-900 font-bold text-sm mt-0.5">Phase C Passed</span>
              </div>
            </div>
          </section>
        )}

        {/* ========================================== */}
        {/* SECTION 6: ONE NEXT STEP CTA               */}
        {/* ========================================== */}
        <section className="bg-navy text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden nsc">
          <div className="flex flex-col gap-1.5 leading-tight min-w-0">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider select-none">
              One Recommended Next Action
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5 select-text truncate">
              Upgrade EHR Scoping to Epic 2024 Sandboxes
            </h4>
            <p className="text-[11px] text-white/75 leading-relaxed mt-1 select-text">
              Enable US Core FHIR bulk export capabilities inside the patient discharge module.
            </p>
          </div>

          <button
            onClick={() => router.push(`/assessments/${accountId}/D`)}
            className="bg-white hover:bg-gray-100 text-navy text-xs font-bold py-2 px-4 rounded-md btn-transition shadow-sm flex-shrink-0 uppercase tracking-wider"
          >
            Initiate Phase D
          </button>
        </section>

        {/* ========================================== */}
        {/* SECTION 7: CLOSING SIGNATURE PARAGRAPH     */}
        {/* ========================================== */}
        <section className="bg-gray-900 text-white rounded-xl p-6 shadow-md flex flex-col gap-4 closing-card select-none">
          <p className="text-sm leading-relaxed select-text">
            Every clinical advancement represents a technical foundation built on trust, speed, and security. By engineering automated discharge summarization co-pilots, Google Cloud enables providers to focus on what matters most: patient outcomes.
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

      </article>

      {/* ========================================== */}
      {/* MODALS WIRING                              */}
      {/* ========================================== */}

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
              "Limit access strictly to Mayo Clinic's portal",
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
              value={`https://hcls-navigator.google.com/share/mayo-clinic-${reportId}`}
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
              <div className="text-2xl font-extrabold text-amber-600 mt-2">62%</div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Needs blockers resolved</span>
            </div>

            <div className="border border-gray-200 rounded-md p-4 bg-gray-50/50 text-center flex flex-col items-center gap-2">
              <span className="section-title text-gray-500">Current Assessment (v2)</span>
              <div className="text-2xl font-extrabold text-green-600 mt-2">82%</div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Passed FDE Nomination Gates</span>
            </div>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-100 rounded-md flex items-start gap-2 text-[11px] text-purple">
            <i className="fa-solid fa-wand-magic-sparkles mt-0.5 flex-shrink-0"></i>
            <span>
              <strong>Gemini Narrative:</strong> User adoption scores increased by +20% following BAA sign-off and the successful deployment of FHIR ingestion pipeline scripts. Recommended next action is to move Mayo Clinic into production status.
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
