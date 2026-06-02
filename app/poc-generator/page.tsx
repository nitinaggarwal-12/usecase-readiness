"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import FlagCard from "@/components/ui/FlagCard";
import { useToast } from "@/components/ui/Toast";

interface Artifact {
  file: string;
  desc: string;
  icon: string;
  badge: string;
  variant: "info" | "success" | "warning" | "critical" | "gemini";
  isAdvanced?: boolean;
}

export default function POCGeneratorPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // 1. Configuration Form State
  const [account, setAccount] = useState("mayo-clinic");
  const [useCase, setUseCase] = useState("Patient Discharge Summarization");
  const [ehr, setEhr] = useState("Epic Systems");
  const [cloud, setCloud] = useState("Google Cloud Native");
  const [complexity, setComplexity] = useState<"Standard" | "Advanced">("Standard");

  const [isGenerating, setIsGenerating] = useState(false);

  // Complete 9-artifact specifications
  const artifacts: Artifact[] = [
    { file: "README.md", desc: "Comprehensive deployment & quick-start instructions", icon: "fa-file-markdown text-blue", badge: "Base Documentation", variant: "info" },
    { file: "main.tf", desc: "Terraform infrastructure configuration (GKE & Vertex AI)", icon: "fa-code text-gray-750", badge: "Cloud Infrastructure", variant: "info" },
    { file: "gemini_prompts.json", desc: "Optimized system prompts & schemas for Med-LM APIs", icon: "fa-wand-magic-sparkles text-purple", badge: "AI Orchestration", variant: "gemini" },
    { file: "mock_patients.csv", desc: "100 compliant synthetic patient records for testing", icon: "fa-file-csv text-green", badge: "Synthetic Datasets", variant: "success" },
    { file: "integration_mapper.py", desc: "Python parser to ingest EHR JSON payloads to FHIR", icon: "fa-code-fork text-gray-500", badge: "Integration Code", variant: "info" },
    { file: "stakeholder_deck.pptx", desc: "Presentation slides for hospital C-suite buy-in", icon: "fa-file-powerpoint text-red", badge: "Stakeholder Materials", variant: "success" },
    // Advanced complexity additions
    { file: "pubsub_buffer.tf", desc: "VPC Pub/Sub topic to buffer shift-change burst feeds", icon: "fa-circle-nodes text-amber", badge: "Advanced Infra", variant: "warning", isAdvanced: true },
    { file: "redis_caching.py", desc: "Redis token cache integration script for speed", icon: "fa-bolt text-amber", badge: "Performance Code", variant: "warning", isAdvanced: true },
    { file: "security_kms_cmek.tf", desc: "KMS Customer-Managed encryption key scripts", icon: "fa-shield-halved text-red", badge: "Advanced Security", variant: "critical", isAdvanced: true },
  ];

  const visibleArtifacts = artifacts.filter((art) => {
    if (complexity === "Standard" && art.isAdvanced) return false;
    return true;
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const count = visibleArtifacts.length;
    showToast(`Generating customized POC package for ${ehr}...`, "info", "fa-wand-magic-sparkles");

    setTimeout(() => {
      setIsGenerating(false);
      showToast(`Success! Created ZIP package containing ${count} artifacts!`, "success");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 page-header select-none">
        <h1 className="text-gray-900">Proof of Concept (POC) Generator</h1>
        <p className="text-xs text-gray-500">
          Generate a custom, deployable 6-to-9 artifact ZIP archive tailored to your customer&apos;s EHR and Cloud parameters.
        </p>
      </div>

      {/* 2-COLUMN GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN (2/5 width): Configuration Form */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 select-none">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            POC Configuration Parameters
          </h3>

          <form onSubmit={handleGenerate} className="flex flex-col gap-3.5 text-xs text-gray-700">
            
            {/* 1. Select Account */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-500">Select Customer Account</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
              >
                <option value="mayo-clinic">Mayo Clinic</option>
                <option value="stanford-medicine">Stanford Medicine</option>
                <option value="cleveland-clinic">Cleveland Clinic</option>
                <option value="ascension-health">Ascension Health</option>
              </select>
            </div>

            {/* 2. Use Case */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-500">Primary Use Case Mode</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
              >
                <option>Patient Discharge Summarization</option>
                <option>EHR Voice Dictation Integration</option>
                <option>Clinical Trial Co-Pilot</option>
                <option>FHIR Analytics Data Lake</option>
              </select>
            </div>

            {/* 3. EHR System */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-500">Target EHR Provider Platform</label>
              <select
                value={ehr}
                onChange={(e) => setEhr(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
              >
                <option>Epic Systems (US Core FHIR)</option>
                <option>Cerner Millennium (OMOP CDM)</option>
                <option>Meditech Expanse (Proprietary REST)</option>
              </select>
            </div>

            {/* 4. Cloud Architecture */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-500">Primary Cloud Framework</label>
              <select
                value={cloud}
                onChange={(e) => setCloud(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
              >
                <option>Google Cloud Native (serverless Vertex)</option>
                <option>Hybrid Cloud Sync (GKE Anthos)</option>
                <option>On-Premises Private VPC</option>
              </select>
            </div>

            {/* 5. Complexity Toggle (Controls artifacts shown) */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-500">Implementation Complexity</label>
              <div className="grid grid-cols-2 gap-2 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setComplexity("Standard");
                    showToast("Set complexity: Standard (6 baseline artifacts)", "info");
                  }}
                  className={`py-2.5 border rounded font-bold uppercase tracking-wider transition-all duration-200 ${
                    complexity === "Standard"
                      ? "bg-blue border-blue text-white shadow-sm"
                      : "bg-transparent border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComplexity("Advanced");
                    showToast("Set complexity: Advanced (9 infrastructure artifacts)", "info");
                  }}
                  className={`py-2.5 border rounded font-bold uppercase tracking-wider transition-all duration-200 ${
                    complexity === "Advanced"
                      ? "bg-blue border-blue text-white shadow-sm"
                      : "bg-transparent border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full bg-blue hover:bg-blue-dk text-white text-xs font-semibold py-2.5 rounded-md btn-transition shadow-sm uppercase tracking-wider flex items-center justify-center gap-1.5 mt-3 ${
                isGenerating ? "cursor-not-allowed bg-blue/60 shadow-none" : "cursor-pointer"
              }`}
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Packing ZIP Archive...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-down"></i>
                  <span>Generate POC Package</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN (3/5 width): Artifact List */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 select-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Custom Artifact Package Content
            </h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase select-none">
              Packing {visibleArtifacts.length} Files
            </span>
          </div>

          {/* Artifact List rows */}
          <div className="flex flex-col gap-3">
            {visibleArtifacts.map((art, idx) => (
              <div
                key={idx}
                className={`border border-gray-100 rounded-md p-3.5 flex items-center justify-between gap-4 bg-gray-50/30 btn-transition hover:bg-gray-50/50 select-text ${
                  art.isAdvanced ? "animate-fade-in border-l-[3px] border-l-amber" : ""
                }`}
              >
                {/* Icon + Name + Desc */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-7 h-7 rounded bg-white border border-gray-250/40 flex items-center justify-center flex-shrink-0 mt-0.5 select-none">
                    <i className={`fa-solid ${art.icon} text-sm`}></i>
                  </div>
                  <div className="flex flex-col leading-tight min-w-0 select-text">
                    <span className="text-xs font-bold text-gray-900">{art.file}</span>
                    <span className="text-[10px] text-gray-400 truncate mt-0.5 select-text">{art.desc}</span>
                  </div>
                </div>

                {/* Category Badge */}
                <Badge label={art.badge} variant={art.variant} className="flex-shrink-0 select-none" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PRE-REQUISITE WARNING FLAG AT BOTTOM */}
      <div className="select-none">
        <FlagCard
          title="Mandatory Deployment Pre-requisite Check"
          message="Please ensure that you have fully run the Phase C (Technical Readiness) Assessment questionnaire and received a FDE Gate recommendation before deploying these infrastructure scripts in customer sandboxes."
          variant="info"
          actions={
            <button
              onClick={() => router.push("/accounts/mayo-clinic")}
              className="bg-blue text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-blue-dk btn-transition shadow-sm uppercase tracking-wider"
            >
              Check Readiness
            </button>
          }
        />
      </div>

    </div>
  );
}
