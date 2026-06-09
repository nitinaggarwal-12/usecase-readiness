"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import FlagCard from "@/components/ui/FlagCard";
import { useToast } from "@/components/ui/Toast";
import { useDemo } from "@/context/DemoContext";
import Modal from "@/components/ui/Modal";

interface Artifact {
  file: string;
  desc: string;
  icon: string;
  badge: string;
  variant: "info" | "success" | "warning" | "critical" | "gemini";
  isAdvanced?: boolean;
}

const getSimulatedContent = (fileName: string, accountName: string, useCase: string, ehr: string, cloud: string): string => {
  if (fileName === "README.md") {
    return `# POC Package: ${useCase} for ${accountName}

This Proof-of-Concept package provides a complete template to integrate ${useCase} with ${ehr} on ${cloud}.

## Package Artifacts
- \`main.tf\`: Terraform cloud infrastructure provisioning Vertex AI and secure buckets.
- \`gemini_prompts.json\`: Pre-optimized system instructions and response schemas for Med-LM APIs.
- \`mock_patients.csv\`: 100 synthetic, HIPAA-compliant patient test records.
- \`integration_mapper.py\`: Python parser mapping EHR telemetry data into standard HL7 FHIR formats.
- \`stakeholder_deck.pptx\`: High-level presentation slide deck outline for C-suite alignment.

## Getting Started
1. Run \`terraform init && terraform apply\` to provision the staging environment.
2. Ingest the mock data: \`python integration_mapper.py --input mock_patients.csv\`
3. Run test prompts through Vertex AI endpoint using the prompts specified in \`gemini_prompts.json\`.`;
  }

  if (fileName === "main.tf") {
    return `# Terraform Configuration for ${accountName}
# Provider: Google Cloud Platform (GCP)
# Framework: ${cloud}

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "${accountName.toLowerCase().replace(/[^a-z0-9]/g, "")}-sandbox"
  region  = "us-central1"
}

# Provision GCS bucket for clinical inputs
resource "google_storage_bucket" "clinical_inputs" {
  name          = "${accountName.toLowerCase().replace(/[^a-z0-9]/g, "")}-clinical-inputs"
  location      = "us-central1"
  force_destroy = true

  uniform_bucket_level_access = true
}

# Provision Vertex AI endpoint for generative inference
resource "google_vertex_ai_endpoint" "med_lm_endpoint" {
  display_name = "${useCase.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_ENDPOINT"
  location     = "us-central1"
}`;
  }

  if (fileName === "gemini_prompts.json") {
    return `{
  "system_instruction": "You are a specialized clinical AI assistant. Your primary task is to support ${useCase} in a secure medical environment.",
  "model": "publishers/google/models/medlm-large-v1",
  "generation_config": {
    "temperature": 0.15,
    "topP": 0.95,
    "maxOutputTokens": 2048,
    "responseMimeType": "application/json"
  },
  "safety_settings": [
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_LOW_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
}`;
  }

  if (fileName === "mock_patients.csv") {
    return `patient_id,first_name,last_name,dob,gender,primary_diagnosis,hl7_version
P001,John,Doe,1980-05-15,M,Essential Hypertension (I10),2.5
P002,Jane,Smith,1975-09-22,F,Type 2 Diabetes Mellitus (E11.9),2.5
P003,Robert,Johnson,1962-11-03,M,Chronic Kidney Disease Stage 3 (N18.3),2.5
P004,Emily,Davis,1991-02-28,F,Acute Bronchitis (J20.9),2.5
P005,Michael,Miller,1955-07-14,M,Atrial Fibrillation (I48.91),2.5`;
  }

  if (fileName === "integration_mapper.py") {
    return `import json
import csv
import sys

# Simulated mapper for ${ehr} to HL7 FHIR
# Configured for: ${useCase}

def map_patient_to_fhir(row):
    return {
        "resourceType": "Patient",
        "id": row["patient_id"],
        "active": True,
        "name": [
            {
                "use": "official",
                "family": row["last_name"],
                "given": [row["first_name"]]
            }
        ],
        "gender": "male" if row["gender"] == "M" else "female",
        "birthDate": row["dob"]
    }

def main():
    print("Ingesting data for ${accountName}...")
    print("Target EHR: ${ehr}")
    print("Target Use Case: ${useCase}")
    print("Running mapping transformations...")
    # Read rows and transform
    print("Success! Transformed records to FHIR format.")

if __name__ == '__main__':
    main()`;
  }

  if (fileName === "stakeholder_deck.pptx") {
    return `================================================================================
STAKEHOLDER PPTX DECK STRUCTURE OUTLINE
================================================================================
Target Client: ${accountName}
Target Scenario: ${useCase}
Integration Base: ${ehr} on ${cloud}

Slide 1: Title & Executive Summary
- Generative AI Scoping Workflow for ${useCase}
- Core Objective: Automated charting and latency reduction.

Slide 2: Technical Architecture
- Secure data flows between ${ehr} and Google Cloud.
- Vertex AI endpoints and regional landing zones.

Slide 3: Business & Financial Impact
- Estimated 1.2 hrs saved/day per clinician.
- Projected Payback Period: Under 6 months.`;
  }

  if (fileName === "pubsub_buffer.tf") {
    return `# Terraform Configuration for ${cloud}
# Pub/Sub Streaming Buffer for ${useCase}

resource "google_pubsub_topic" "ehr_telemetry_stream" {
  name = "\${var.account_slug}-telemetry-topic"
}

resource "google_pubsub_subscription" "telemetry_subscription" {
  name  = "\${var.account_slug}-telemetry-sub"
  topic = google_pubsub_topic.ehr_telemetry_stream.name

  ack_deadline_seconds = 20
}`;
  }

  if (fileName === "redis_caching.py") {
    return `# Python Caching Script for Speed
# Optimized for ${useCase} token caching

import redis

class RedisTokenCache:
    def __init__(self, host='localhost', port=6379):
        self.r = redis.Redis(host=host, port=port, decode_responses=True)

    def cache_token(self, session_id, token, ttl=3600):
        self.r.setex(f"session:{session_id}:token", ttl, token)

    def get_token(self, session_id):
        return self.r.get(f"session:{session_id}:token")`;
  }

  if (fileName === "security_kms_cmek.tf") {
    return `# Terraform Configuration for Advanced Security CMEK
# Encrypting clinical streams for ${accountName}

resource "google_kms_key_ring" "keyring" {
  name     = "\${var.account_slug}-keyring"
  location = "us-central1"
}

resource "google_kms_crypto_key" "clinical_data_key" {
  name            = "\${var.account_slug}-crypto-key"
  key_ring        = google_kms_key_ring.keyring.id
  rotation_period = "7776000s" # 90 days
}`;
  }

  return "# Simulated content for " + fileName;
};

export default function POCGeneratorPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const { demoState, scenarios } = useDemo();

  // 1. Configuration Form State
  const [account, setAccount] = useState("");
  const [useCase, setUseCase] = useState("");
  const [ehr, setEhr] = useState("Epic Systems (US Core FHIR)");
  const [cloud, setCloud] = useState("Google Cloud Native (serverless Vertex)");
  const [complexity, setComplexity] = useState<"Standard" | "Advanced">("Standard");

  const getDemoPath = (path: string) => {
    return demoState.isActive ? `/demo${path}` : path;
  };

  // Initialize account once scenarios are available
  useEffect(() => {
    if (scenarios.length > 0 && !account) {
      setAccount(demoState.scenarioId || scenarios[0].id);
    }
  }, [scenarios, demoState.scenarioId, account]);

  const selectedAcc = scenarios.find((s) => s.id === account) || scenarios[0];

  useEffect(() => {
    if (selectedAcc) {
      setUseCase(selectedAcc.account.useCase);
      
      const ehrStr = selectedAcc.account.ehr || "";
      const lowerEhr = ehrStr.toLowerCase();
      if (lowerEhr.includes("epic")) {
        setEhr("Epic Systems (US Core FHIR)");
      } else if (lowerEhr.includes("cerner")) {
        setEhr("Cerner Millennium (OMOP CDM)");
      } else if (lowerEhr.includes("meditech")) {
        setEhr("Meditech Expanse (Proprietary REST)");
      }

      const cloudStr = selectedAcc.account.cloud || "";
      const lowerCloud = cloudStr.toLowerCase();
      if (lowerCloud.includes("gcp") || lowerCloud.includes("google")) {
        setCloud("Google Cloud Native (serverless Vertex)");
      } else if (lowerCloud.includes("hybrid") || lowerCloud.includes("anthos") || lowerCloud.includes("gke")) {
        setCloud("Hybrid Cloud Sync (GKE Anthos)");
      }
    }
  }, [account, selectedAcc]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeViewerArtifact, setActiveViewerArtifact] = useState<Artifact | null>(null);

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
    const accountName = selectedAcc?.account.name || "Custom Account";
    showToast(`Generating customized POC package for ${ehr}...`, "info", "fa-wand-magic-sparkles");

    setTimeout(() => {
      setIsGenerating(false);
      
      // Generate bundled manifest MD file
      let manifestContent = `# POC Package: ${useCase} for ${accountName}\n`;
      manifestContent += `Generated: ${new Date().toLocaleString()}\n`;
      manifestContent += `Primary Use Case: ${useCase}\n`;
      manifestContent += `EHR Platform: ${ehr}\n`;
      manifestContent += `Cloud Framework: ${cloud}\n`;
      manifestContent += `Complexity: ${complexity}\n\n`;
      manifestContent += `================================================================================\n\n`;

      visibleArtifacts.forEach((art) => {
        const code = getSimulatedContent(art.file, accountName, useCase, ehr, cloud);
        manifestContent += `### File: ${art.file}\n`;
        manifestContent += `Description: ${art.desc}\n\n`;
        manifestContent += `\`\`\`\n${code}\n\`\`\`\n\n`;
        manifestContent += `================================================================================\n\n`;
      });

      const filename = `${selectedAcc?.id || "custom"}_poc_package.md`;
      downloadTextFile(filename, manifestContent);

      showToast(`Success! Downloaded manifest package containing ${count} artifacts!`, "success");
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
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Use Case */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-500">Primary Use Case Mode</label>
              <input
                type="text"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
                placeholder="e.g., Patient Discharge Summarization"
                required
              />
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
                onClick={() => {
                  setActiveViewerArtifact(art);
                  showToast(`Opened code viewer for ${art.file}`, "info");
                }}
                className={`border border-gray-100 rounded-md p-3.5 flex items-center justify-between gap-4 bg-gray-50/30 btn-transition hover:bg-gray-50/50 cursor-pointer select-text ${
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
              onClick={() => router.push(getDemoPath(`/accounts/${account}`))}
              className="bg-blue text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-blue-dk btn-transition shadow-sm uppercase tracking-wider"
            >
              Check Readiness
            </button>
          }
        />
      </div>

      {/* Dynamic Artifact Code Viewer Modal */}
      {activeViewerArtifact && (
        <Modal
          isOpen={!!activeViewerArtifact}
          onClose={() => setActiveViewerArtifact(null)}
          width="600px"
          title={`Generated Artifact: ${activeViewerArtifact.file}`}
        >
          <div className="flex flex-col gap-4">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {activeViewerArtifact.desc} (Tailored for {selectedAcc?.account.name || "Custom Account"})
            </p>
            
            <div className="bg-gray-950 text-gray-100 rounded-lg p-4 font-mono text-[11px] max-h-96 overflow-y-auto whitespace-pre select-text leading-normal border border-gray-800">
              {getSimulatedContent(activeViewerArtifact.file, selectedAcc?.account.name || "Custom Account", useCase, ehr, cloud)}
            </div>
            
            <div className="flex justify-end gap-2 pt-2.5 border-t border-gray-150 select-none">
              <button
                type="button"
                onClick={() => setActiveViewerArtifact(null)}
                className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold btn-transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const content = getSimulatedContent(activeViewerArtifact.file, selectedAcc?.account.name || "Custom Account", useCase, ehr, cloud);
                  downloadTextFile(activeViewerArtifact.file, content);
                  showToast(`Downloaded ${activeViewerArtifact.file} successfully!`, "success");
                }}
                className="bg-blue hover:bg-blue-dk text-white px-3.5 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm uppercase tracking-wider flex items-center gap-1.5"
              >
                <i className="fa-solid fa-circle-down"></i>
                <span>Download File</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
