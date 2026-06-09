"use strict";exports.id=5133,exports.ids=[5133],exports.modules={6091:(e,r,t)=>{t.r(r),t.d(r,{default:()=>p});var a=t(326),s=t(7577),n=t(5047),o=t(5833),i=t(1756),l=t(8998),c=t(3701),d=t(6785);let m=(e,r,t,a,s)=>"README.md"===e?`# POC Package: ${t} for ${r}

This Proof-of-Concept package provides a complete template to integrate ${t} with ${a} on ${s}.

## Package Artifacts
- \`main.tf\`: Terraform cloud infrastructure provisioning Vertex AI and secure buckets.
- \`gemini_prompts.json\`: Pre-optimized system instructions and response schemas for Med-LM APIs.
- \`mock_patients.csv\`: 100 synthetic, HIPAA-compliant patient test records.
- \`integration_mapper.py\`: Python parser mapping EHR telemetry data into standard HL7 FHIR formats.
- \`stakeholder_deck.pptx\`: High-level presentation slide deck outline for C-suite alignment.

## Getting Started
1. Run \`terraform init && terraform apply\` to provision the staging environment.
2. Ingest the mock data: \`python integration_mapper.py --input mock_patients.csv\`
3. Run test prompts through Vertex AI endpoint using the prompts specified in \`gemini_prompts.json\`.`:"main.tf"===e?`# Terraform Configuration for ${r}
# Provider: Google Cloud Platform (GCP)
# Framework: ${s}

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
  project = "${r.toLowerCase().replace(/[^a-z0-9]/g,"")}-sandbox"
  region  = "us-central1"
}

# Provision GCS bucket for clinical inputs
resource "google_storage_bucket" "clinical_inputs" {
  name          = "${r.toLowerCase().replace(/[^a-z0-9]/g,"")}-clinical-inputs"
  location      = "us-central1"
  force_destroy = true

  uniform_bucket_level_access = true
}

# Provision Vertex AI endpoint for generative inference
resource "google_vertex_ai_endpoint" "med_lm_endpoint" {
  display_name = "${t.toUpperCase().replace(/[^A-Z0-9]/g,"_")}_ENDPOINT"
  location     = "us-central1"
}`:"gemini_prompts.json"===e?`{
  "system_instruction": "You are a specialized clinical AI assistant. Your primary task is to support ${t} in a secure medical environment.",
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
}`:"mock_patients.csv"===e?`patient_id,first_name,last_name,dob,gender,primary_diagnosis,hl7_version
P001,John,Doe,1980-05-15,M,Essential Hypertension (I10),2.5
P002,Jane,Smith,1975-09-22,F,Type 2 Diabetes Mellitus (E11.9),2.5
P003,Robert,Johnson,1962-11-03,M,Chronic Kidney Disease Stage 3 (N18.3),2.5
P004,Emily,Davis,1991-02-28,F,Acute Bronchitis (J20.9),2.5
P005,Michael,Miller,1955-07-14,M,Atrial Fibrillation (I48.91),2.5`:"integration_mapper.py"===e?`import json
import csv
import sys

# Simulated mapper for ${a} to HL7 FHIR
# Configured for: ${t}

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
    print("Ingesting data for ${r}...")
    print("Target EHR: ${a}")
    print("Target Use Case: ${t}")
    print("Running mapping transformations...")
    # Read rows and transform
    print("Success! Transformed records to FHIR format.")

if __name__ == '__main__':
    main()`:"stakeholder_deck.pptx"===e?`================================================================================
STAKEHOLDER PPTX DECK STRUCTURE OUTLINE
================================================================================
Target Client: ${r}
Target Scenario: ${t}
Integration Base: ${a} on ${s}

Slide 1: Title & Executive Summary
- Generative AI Scoping Workflow for ${t}
- Core Objective: Automated charting and latency reduction.

Slide 2: Technical Architecture
- Secure data flows between ${a} and Google Cloud.
- Vertex AI endpoints and regional landing zones.

Slide 3: Business & Financial Impact
- Estimated 1.2 hrs saved/day per clinician.
- Projected Payback Period: Under 6 months.`:"pubsub_buffer.tf"===e?`# Terraform Configuration for ${s}
# Pub/Sub Streaming Buffer for ${t}

resource "google_pubsub_topic" "ehr_telemetry_stream" {
  name = "\${var.account_slug}-telemetry-topic"
}

resource "google_pubsub_subscription" "telemetry_subscription" {
  name  = "\${var.account_slug}-telemetry-sub"
  topic = google_pubsub_topic.ehr_telemetry_stream.name

  ack_deadline_seconds = 20
}`:"redis_caching.py"===e?`# Python Caching Script for Speed
# Optimized for ${t} token caching

import redis

class RedisTokenCache:
    def __init__(self, host='localhost', port=6379):
        self.r = redis.Redis(host=host, port=port, decode_responses=True)

    def cache_token(self, session_id, token, ttl=3600):
        self.r.setex(f"session:{session_id}:token", ttl, token)

    def get_token(self, session_id):
        return self.r.get(f"session:{session_id}:token")`:"security_kms_cmek.tf"===e?`# Terraform Configuration for Advanced Security CMEK
# Encrypting clinical streams for ${r}

resource "google_kms_key_ring" "keyring" {
  name     = "\${var.account_slug}-keyring"
  location = "us-central1"
}

resource "google_kms_crypto_key" "clinical_data_key" {
  name            = "\${var.account_slug}-crypto-key"
  key_ring        = google_kms_key_ring.keyring.id
  rotation_period = "7776000s" # 90 days
}`:"# Simulated content for "+e;function p(){let e=(0,n.useRouter)(),{showToast:r}=(0,l.p)(),{demoState:t,scenarios:p}=(0,c.F)(),[u,g]=(0,s.useState)(""),[f,x]=(0,s.useState)(""),[b,h]=(0,s.useState)("Epic Systems (US Core FHIR)"),[y,v]=(0,s.useState)("Google Cloud Native (serverless Vertex)"),[_,k]=(0,s.useState)("Standard"),j=e=>t.isActive?`/demo${e}`:e,C=p.find(e=>e.id===u)||p[0],[w,N]=(0,s.useState)(!1),[P,$]=(0,s.useState)(null),S=(e,r)=>{let t=new Blob([r],{type:"text/plain;charset=utf-8"}),a=URL.createObjectURL(t),s=document.createElement("a");s.href=a,s.download=e,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(a)},A=[{file:"README.md",desc:"Comprehensive deployment & quick-start instructions",icon:"fa-file-markdown text-blue",badge:"Base Documentation",variant:"info"},{file:"main.tf",desc:"Terraform infrastructure configuration (GKE & Vertex AI)",icon:"fa-code text-gray-750",badge:"Cloud Infrastructure",variant:"info"},{file:"gemini_prompts.json",desc:"Optimized system prompts & schemas for Med-LM APIs",icon:"fa-wand-magic-sparkles text-purple",badge:"AI Orchestration",variant:"gemini"},{file:"mock_patients.csv",desc:"100 compliant synthetic patient records for testing",icon:"fa-file-csv text-green",badge:"Synthetic Datasets",variant:"success"},{file:"integration_mapper.py",desc:"Python parser to ingest EHR JSON payloads to FHIR",icon:"fa-code-fork text-gray-500",badge:"Integration Code",variant:"info"},{file:"stakeholder_deck.pptx",desc:"Presentation slides for hospital C-suite buy-in",icon:"fa-file-powerpoint text-red",badge:"Stakeholder Materials",variant:"success"},{file:"pubsub_buffer.tf",desc:"VPC Pub/Sub topic to buffer shift-change burst feeds",icon:"fa-circle-nodes text-amber",badge:"Advanced Infra",variant:"warning",isAdvanced:!0},{file:"redis_caching.py",desc:"Redis token cache integration script for speed",icon:"fa-bolt text-amber",badge:"Performance Code",variant:"warning",isAdvanced:!0},{file:"security_kms_cmek.tf",desc:"KMS Customer-Managed encryption key scripts",icon:"fa-shield-halved text-red",badge:"Advanced Security",variant:"critical",isAdvanced:!0}].filter(e=>"Standard"!==_||!e.isAdvanced);return(0,a.jsxs)("div",{className:"flex flex-col gap-6",children:[(0,a.jsxs)("div",{className:"flex flex-col gap-1 page-header select-none",children:[a.jsx("h1",{className:"text-gray-900",children:"Proof of Concept (POC) Generator"}),a.jsx("p",{className:"text-xs text-gray-500",children:"Generate a custom, deployable 6-to-9 artifact ZIP archive tailored to your customer's EHR and Cloud parameters."})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-5 gap-6",children:[(0,a.jsxs)("div",{className:"lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 select-none",children:[a.jsx("h3",{className:"text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3",children:"POC Configuration Parameters"}),(0,a.jsxs)("form",{onSubmit:e=>{e.preventDefault(),N(!0);let t=A.length,a=C?.account.name||"Custom Account";r(`Generating customized POC package for ${b}...`,"info","fa-wand-magic-sparkles"),setTimeout(()=>{N(!1);let e=`# POC Package: ${f} for ${a}
`;e+=`Generated: ${new Date().toLocaleString()}
Primary Use Case: ${f}
EHR Platform: ${b}
Cloud Framework: ${y}
Complexity: ${_}

================================================================================

`,A.forEach(r=>{let t=m(r.file,a,f,b,y);e+=`### File: ${r.file}
Description: ${r.desc}

\`\`\`
${t}
\`\`\`

================================================================================

`}),S(`${C?.id||"custom"}_poc_package.md`,e),r(`Success! Downloaded manifest package containing ${t} artifacts!`,"success")},2e3)},className:"flex flex-col gap-3.5 text-xs text-gray-700",children:[(0,a.jsxs)("div",{className:"flex flex-col gap-1",children:[a.jsx("label",{className:"font-semibold text-gray-500",children:"Select Customer Account"}),a.jsx("select",{value:u,onChange:e=>g(e.target.value),className:"border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none",children:p.map(e=>a.jsx("option",{value:e.id,children:e.account.name},e.id))})]}),(0,a.jsxs)("div",{className:"flex flex-col gap-1",children:[a.jsx("label",{className:"font-semibold text-gray-500",children:"Primary Use Case Mode"}),a.jsx("input",{type:"text",value:f,onChange:e=>x(e.target.value),className:"border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none",placeholder:"e.g., Patient Discharge Summarization",required:!0})]}),(0,a.jsxs)("div",{className:"flex flex-col gap-1",children:[a.jsx("label",{className:"font-semibold text-gray-500",children:"Target EHR Provider Platform"}),(0,a.jsxs)("select",{value:b,onChange:e=>h(e.target.value),className:"border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none",children:[a.jsx("option",{children:"Epic Systems (US Core FHIR)"}),a.jsx("option",{children:"Cerner Millennium (OMOP CDM)"}),a.jsx("option",{children:"Meditech Expanse (Proprietary REST)"})]})]}),(0,a.jsxs)("div",{className:"flex flex-col gap-1",children:[a.jsx("label",{className:"font-semibold text-gray-500",children:"Primary Cloud Framework"}),(0,a.jsxs)("select",{value:y,onChange:e=>v(e.target.value),className:"border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none",children:[a.jsx("option",{children:"Google Cloud Native (serverless Vertex)"}),a.jsx("option",{children:"Hybrid Cloud Sync (GKE Anthos)"}),a.jsx("option",{children:"On-Premises Private VPC"})]})]}),(0,a.jsxs)("div",{className:"flex flex-col gap-1",children:[a.jsx("label",{className:"font-semibold text-gray-500",children:"Implementation Complexity"}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-2 py-1",children:[a.jsx("button",{type:"button",onClick:()=>{k("Standard"),r("Set complexity: Standard (6 baseline artifacts)","info")},className:`py-2.5 border rounded font-bold uppercase tracking-wider transition-all duration-200 ${"Standard"===_?"bg-blue border-blue text-white shadow-sm":"bg-transparent border-gray-200 text-gray-500 hover:bg-gray-50"}`,children:"Standard"}),a.jsx("button",{type:"button",onClick:()=>{k("Advanced"),r("Set complexity: Advanced (9 infrastructure artifacts)","info")},className:`py-2.5 border rounded font-bold uppercase tracking-wider transition-all duration-200 ${"Advanced"===_?"bg-blue border-blue text-white shadow-sm":"bg-transparent border-gray-200 text-gray-500 hover:bg-gray-50"}`,children:"Advanced"})]})]}),a.jsx("button",{type:"submit",disabled:w,className:`w-full bg-blue hover:bg-blue-dk text-white text-xs font-semibold py-2.5 rounded-md btn-transition shadow-sm uppercase tracking-wider flex items-center justify-center gap-1.5 mt-3 ${w?"cursor-not-allowed bg-blue/60 shadow-none":"cursor-pointer"}`,children:w?(0,a.jsxs)(a.Fragment,{children:[a.jsx("i",{className:"fa-solid fa-spinner animate-spin"}),a.jsx("span",{children:"Packing ZIP Archive..."})]}):(0,a.jsxs)(a.Fragment,{children:[a.jsx("i",{className:"fa-solid fa-circle-down"}),a.jsx("span",{children:"Generate POC Package"})]})})]})]}),(0,a.jsxs)("div",{className:"lg:col-span-3 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3 select-none",children:[a.jsx("h3",{className:"text-xs font-bold uppercase tracking-wider text-gray-500",children:"Custom Artifact Package Content"}),(0,a.jsxs)("span",{className:"text-[10px] font-bold text-gray-500 uppercase select-none",children:["Packing ",A.length," Files"]})]}),a.jsx("div",{className:"flex flex-col gap-3",children:A.map((e,t)=>(0,a.jsxs)("div",{onClick:()=>{$(e),r(`Opened code viewer for ${e.file}`,"info")},className:`border border-gray-100 rounded-md p-3.5 flex items-center justify-between gap-4 bg-gray-50/30 btn-transition hover:bg-gray-50/50 cursor-pointer select-text ${e.isAdvanced?"animate-fade-in border-l-[3px] border-l-amber":""}`,children:[(0,a.jsxs)("div",{className:"flex items-start gap-3 min-w-0",children:[a.jsx("div",{className:"w-7 h-7 rounded bg-white border border-gray-250/40 flex items-center justify-center flex-shrink-0 mt-0.5 select-none",children:a.jsx("i",{className:`fa-solid ${e.icon} text-sm`})}),(0,a.jsxs)("div",{className:"flex flex-col leading-tight min-w-0 select-text",children:[a.jsx("span",{className:"text-xs font-bold text-gray-900",children:e.file}),a.jsx("span",{className:"text-[10px] text-gray-400 truncate mt-0.5 select-text",children:e.desc})]})]}),a.jsx(o.Z,{label:e.badge,variant:e.variant,className:"flex-shrink-0 select-none"})]},t))})]})]}),a.jsx("div",{className:"select-none",children:a.jsx(i.Z,{title:"Mandatory Deployment Pre-requisite Check",message:"Please ensure that you have fully run the Phase C (Technical Readiness) Assessment questionnaire and received a FDE Gate recommendation before deploying these infrastructure scripts in customer sandboxes.",variant:"info",actions:a.jsx("button",{onClick:()=>e.push(j(`/accounts/${u}`)),className:"bg-blue text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-blue-dk btn-transition shadow-sm uppercase tracking-wider",children:"Check Readiness"})})}),P&&a.jsx(d.Z,{isOpen:!!P,onClose:()=>$(null),width:"600px",title:`Generated Artifact: ${P.file}`,children:(0,a.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,a.jsxs)("p",{className:"text-[11px] text-gray-500 leading-relaxed",children:[P.desc," (Tailored for ",C?.account.name||"Custom Account",")"]}),a.jsx("div",{className:"bg-gray-950 text-gray-100 rounded-lg p-4 font-mono text-[11px] max-h-96 overflow-y-auto whitespace-pre select-text leading-normal border border-gray-800",children:m(P.file,C?.account.name||"Custom Account",f,b,y)}),(0,a.jsxs)("div",{className:"flex justify-end gap-2 pt-2.5 border-t border-gray-150 select-none",children:[a.jsx("button",{type:"button",onClick:()=>$(null),className:"border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold btn-transition",children:"Close"}),(0,a.jsxs)("button",{type:"button",onClick:()=>{let e=m(P.file,C?.account.name||"Custom Account",f,b,y);S(P.file,e),r(`Downloaded ${P.file} successfully!`,"success")},className:"bg-blue hover:bg-blue-dk text-white px-3.5 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm uppercase tracking-wider flex items-center gap-1.5",children:[a.jsx("i",{className:"fa-solid fa-circle-down"}),a.jsx("span",{children:"Download File"})]})]})]})})]})}},5833:(e,r,t)=>{t.d(r,{Z:()=>s});var a=t(326);function s({label:e,variant:r="info",className:t=""}){let s="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider select-none",n={success:"bg-green-50 text-green border border-green/10",warning:"bg-amber-50 text-amber border border-amber/10",critical:"bg-red-50 text-red border border-red/10",info:"bg-blue-50 text-blue border border-blue/10",gemini:"bg-purple-50 text-purple border border-purple/10 font-sans normal-case py-0.5 px-2 rounded-full"};return"gemini"===r?(0,a.jsxs)("span",{className:`${s} ${n.gemini} ${t}`,children:[a.jsx("i",{className:"fa-solid fa-wand-magic-sparkles mr-1.5 text-[10px]"}),a.jsx("span",{children:e||"Gemini"})]}):a.jsx("span",{className:`${s} ${n[r]} ${t}`,children:e})}t(7577)},1756:(e,r,t)=>{t.d(r,{Z:()=>s});var a=t(326);function s({title:e,message:r,variant:t,actions:s,className:n=""}){let o={crit:{border:"border-l-[3px] border-l-red border-red/10 bg-red-50/60",icon:"fa-circle-exclamation text-red"},warn:{border:"border-l-[3px] border-l-amber border-amber/10 bg-amber-50/60",icon:"fa-triangle-exclamation text-amber"},info:{border:"border-l-[3px] border-l-blue border-blue/10 bg-blue-50/60",icon:"fa-circle-info text-blue"},ok:{border:"border-l-[3px] border-l-green border-green/10 bg-green-50/60",icon:"fa-circle-check text-green"}},i=o[t]||o.info;return(0,a.jsxs)("div",{className:`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-r-lg ${i.border} ${n}`,children:[(0,a.jsxs)("div",{className:"flex gap-3 items-start",children:[a.jsx("div",{className:"mt-0.5 text-base flex-shrink-0",children:a.jsx("i",{className:`fa-solid ${i.icon}`})}),(0,a.jsxs)("div",{className:"flex flex-col leading-tight",children:[a.jsx("span",{className:"text-sm font-bold text-gray-900 mb-0.5",children:e}),a.jsx("span",{className:"text-xs text-gray-700",children:r})]})]}),s&&a.jsx("div",{className:"flex items-center gap-2 flex-shrink-0 flag-actions",children:s})]})}t(7577)},7481:(e,r,t)=>{t.r(r),t.d(r,{default:()=>s});var a=t(6621);let s=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,a.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]}};