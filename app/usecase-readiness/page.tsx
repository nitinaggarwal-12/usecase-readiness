"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

interface Option {
  text: string;
  score: number;
}

interface Question {
  id: number;
  text: string;
  type: "Single-Select" | "Multi-Select";
  weight: number;
  options: Option[];
}

interface Pillar {
  id: number;
  name: string;
  questions: Question[];
}

interface SavedReadinessAssessment {
  id: string;
  customerName: string;
  segment: string;
  useCase: string;
  assessmentName: string;
  answers: Record<number, number | number[] | null | undefined>;
  score: number;
  archetype: string;
  updatedAt: string;
}

const pillarsData: Pillar[] = [
  {
    id: 1,
    name: "Current State & Business Value",
    questions: [
      {
        id: 1,
        text: "How is this specific workflow currently handled?",
        type: "Single-Select",
        weight: 1,
        options: [
          { text: "Manual and fragmented across disparate legacy apps.", score: 1 },
          { text: "Rule-based automation (e.g., rigid RPA scripts).", score: 2 },
          { text: "Outsourced or routed to a tiered support team.", score: 3 },
          { text: "Partially hybrid using siloed, basic AI tools.", score: 4 },
          { text: "Highly optimized legacy system hitting a cognitive/scaling ceiling.", score: 5 }
        ]
      },
      {
        id: 2,
        text: "What is the primary operational pain point driving this project?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Information retrieval drag across messy documents.", score: 1 },
          { text: "Cognitive overload and scaling backlogs.", score: 2 },
          { text: "Manual data splicing and formatting between systems.", score: 3 },
          { text: "Rigid, frustrating conversational flows in current bots.", score: 4 },
          { text: "Slow speed-to-insight for complex analytical research.", score: 5 }
        ]
      },
      {
        id: 3,
        text: "What level of executive sponsorship does this use case have?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Conceptual interest only; no formal sponsor.", score: 1 },
          { text: "Sponsor identified, but no dedicated budget.", score: 2 },
          { text: "Budget allocated, but success metrics are loose.", score: 3 },
          { text: "Dedicated VP/C-level sponsor with time-boxed delivery mandates.", score: 4 },
          { text: "Board-level strategic initiative with defined ROI KPIs.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Data Architecture & Grounding",
    questions: [
      {
        id: 4,
        text: "How clean and structured are the documents required for this use case?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Fragmented, outdated, and full of conflicting versions.", score: 1 },
          { text: "Centralized but requires heavy manual curation.", score: 2 },
          { text: "Organized, but lacks automated update processes.", score: 3 },
          { text: "Version-controlled \"Single Source of Truth.\"", score: 4 },
          { text: "Highly structured markdown/JSON feeds audited by experts.", score: 5 }
        ]
      },
      {
        id: 5,
        text: "What is your current enterprise search maturity?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "No centralized search; manual directory browsing.", score: 1 },
          { text: "Standard keyword matching or basic SQL.", score: 2 },
          { text: "Dedicated enterprise search (e.g., Elasticsearch, Solr).", score: 3 },
          { text: "Semantic/vector search pipelines in production.", score: 4 },
          { text: "Hybrid semantic-keyword engines with automated chunking/re-ranking.", score: 5 }
        ]
      },
      {
        id: 6,
        text: "How frequently does the required data change?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Static historical archives (rarely changes).", score: 1 },
          { text: "Low-velocity (monthly/manual updates).", score: 2 },
          { text: "Medium-velocity (nightly/weekly batch ETL).", score: 3 },
          { text: "High-velocity (hourly automated incremental ingestion).", score: 4 },
          { text: "Real-time streaming (sub-second messaging/API triggers).", score: 5 }
        ]
      },
      {
        id: 7,
        text: "What data modalities must the AI process?",
        type: "Multi-Select",
        weight: 2,
        options: [
          { text: "Clean text only (Emails, basic docs).", score: 1 },
          { text: "Structured tabular data (BigQuery, CSVs).", score: 2 },
          { text: "Layout-heavy scans (Invoices, PDFs with charts).", score: 3 },
          { text: "Rich media (Call-center audio, video feeds).", score: 4 },
          { text: "Cross-modal relationship graphs.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Engineering, Orchestration & Delivery",
    questions: [
      {
        id: 8,
        text: "Who is building and maintaining this solution?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Non-technical business users (No developers available).", score: 1 },
          { text: "Single external System Integrator (SI) partner.", score: 2 },
          { text: "Multi-SI / Complex external vendor delivery.", score: 3 },
          { text: "Internal IT or software engineering team.", score: 4 },
          { text: "Co-engineering model with strict knowledge-transfer to internal team.", score: 5 }
        ]
      },
      {
        id: 9,
        text: "What is your orchestration strategy?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Zero code; upload and chat interface needed (NotebookLM target).", score: 1 },
          { text: "Out-of-the-box autonomous web/data research (Deep Research target).", score: 2 },
          { text: "Basic stateless REST API calls to foundational models.", score: 3 },
          { text: "Open-source orchestrators (LangChain/LlamaIndex) hosted internally.", score: 4 },
          { text: "Enterprise code-first frameworks (Agent Development Kit / Agent Engine).", score: 5 }
        ]
      },
      {
        id: 10,
        text: "How will the agent integrate with external tools and databases?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Read-only; no external integrations required.", score: 1 },
          { text: "Legacy hardcoded API wrappers.", score: 2 },
          { text: "Standard modern webhooks (REST/GraphQL).", score: 3 },
          { text: "Universal plug-and-play standards (Model Context Protocol).", score: 4 },
          { text: "Dynamic autonomous delegation (Agent2Agent Protocol).", score: 5 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "FinOps, Scale & LLMOps",
    questions: [
      {
        id: 11,
        text: "What are your latency and scale requirements?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Low-volume; latency fluctuations are acceptable.", score: 1 },
          { text: "Standard variable enterprise traffic (On-Demand pricing).", score: 2 },
          { text: "High-volume requiring semantic caching layers.", score: 3 },
          { text: "Mission-critical scale requiring Provisioned Throughput.", score: 4 },
          { text: "Massive repetitive scale requiring Model Distillation.", score: 5 }
        ]
      },
      {
        id: 12,
        text: "Will users repeatedly query massive, static files (e.g., 500-page manuals or long videos)?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "No, context changes entirely per query.", score: 1 },
          { text: "Yes, but we will chunk them into a vector database.", score: 2 },
          { text: "Yes, we will implement application-level truncation logic.", score: 3 },
          { text: "Yes, we require explicit Context Caching to eliminate repetitive token costs.", score: 4 },
          { text: "Yes, using Context Caching combined with targeted RAG.", score: 5 }
        ]
      },
      {
        id: 13,
        text: "How will you trace reasoning steps and debug outputs?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Ad-hoc user feedback (thumbs up/down).", score: 1 },
          { text: "Standard application error logs.", score: 2 },
          { text: "Centralized APM (Cloud Logging/Datadog).", score: 3 },
          { text: "Dedicated LLMOps tracking tokens and costs.", score: 4 },
          { text: "OpenTelemetry (OTel) multi-agent trace visualization.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Quality Assurance (EvalOps)",
    questions: [
      {
        id: 14,
        text: "Do you have a \"Golden Dataset\" for evaluation?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "No; relying on manual spot-checking in a chat UI.", score: 1 },
          { text: "Ad-hoc document with 10-20 sample questions.", score: 2 },
          { text: "Static, version-controlled set of 50+ verified QA pairs.", score: 3 },
          { text: "Dynamic matrix mapped to expected backend tool calls.", score: 4 },
          { text: "Continuous feedback loop turning live edge-cases into eval tests.", score: 5 }
        ]
      },
      {
        id: 15,
        text: "How will you benchmark new models or prompt changes before production?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Manual side-by-side spot checking.", score: 1 },
          { text: "Distributed manual review and voting by business users.", score: 2 },
          { text: "Batch scripts checking for application crashes only.", score: 3 },
          { text: "Automated LLM-as-a-Judge frameworks in CI/CD.", score: 4 },
          { text: "Synthetic behavioral stress testing via Agent Simulation.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Security, Risk & Guardrails",
    questions: [
      {
        id: 16,
        text: "How is document-level access controlled?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Flat permissions; users can implicitly query all system docs.", score: 1 },
          { text: "Application-level filtering via hardcoded logic.", score: 2 },
          { text: "Directory-linked RBAC mapping to existing policies.", score: 3 },
          { text: "Granular, natively enforced least-privilege IAM.", score: 4 },
          { text: "Cryptographically attested Workload/Agent Identity (SPIFFE).", score: 5 }
        ]
      },
      {
        id: 17,
        text: "What guards against prompt injection and toxic outputs?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Relying solely on the foundational model's default safety.", score: 1 },
          { text: "Custom regex and string-matching in application code.", score: 2 },
          { text: "Basic model configuration thresholds.", score: 3 },
          { text: "Managed dual-LLM safety layers (Model Armor).", score: 4 },
          { text: "Multi-layered security mesh with real-time AI threat scanning.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Compliance & Regulatory",
    questions: [
      {
        id: 18,
        text: "What are your regulatory and data residency constraints?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Non-sensitive internal data; no strict blockers.", score: 1 },
          { text: "Proprietary IP requiring standard enterprise indemnity.", score: 2 },
          { text: "Regulated financial/consumer data (GDPR/PCI-DSS/SOC 2).", score: 3 },
          { text: "Heavily regulated Federal/Healthcare data (FedRAMP/HIPAA).", score: 4 },
          { text: "Sovereign data requiring air-gapped or strictly localized environments.", score: 5 }
        ]
      },
      {
        id: 19,
        text: "How will you prove the causal path of an agent's decision (e.g., EU AI Act compliance)?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "We cannot; we rely entirely on the final generated text.", score: 1 },
          { text: "Logging the initial prompt and final response only.", score: 2 },
          { text: "Standard Vector RAG (can show retrieved chunks, but not reasoning).", score: 3 },
          { text: "Agentic GraphRAG to map multi-hop structured reasoning.", score: 4 },
          { text: "Immutable, cryptographically signed logs of the complete execution graph.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Exception Handling (HITL)",
    questions: [
      {
        id: 20,
        text: "If the AI hallucinates or hits an edge case, what is the fallback?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Workflow hard-stops; user must manually start over elsewhere.", score: 1 },
          { text: "Generic \"I don't know\" response with a support email link.", score: 2 },
          { text: "Failure logged for engineering; user left unassisted.", score: 3 },
          { text: "AI flags low-confidence answers for mandatory user verification.", score: 4 },
          { text: "Seamless Human-in-the-Loop (HITL) handoff to a live agent via a ticketing system.", score: 5 }
        ]
      },
      {
        id: 21,
        text: "If an agent hallucinates a write-action (e.g., deleting a database record), how is it reversed?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Actions are immediate and destructive; requires manual DB intervention.", score: 1 },
          { text: "Agent is restricted to Read-Only access.", score: 2 },
          { text: "Agent has Append-Only access (can comment, cannot delete).", score: 3 },
          { text: "Asynchronous Approval: Agent stages a \"draft\" requiring human click-to-execute.", score: 4 },
          { text: "Dry-Run & Idempotent Reversibility: Automated snapshots allow 1-click rollbacks.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 9,
    name: "Adoption & UX Form Factors",
    questions: [
      {
        id: 22,
        text: "What is the users' current AI literacy level?",
        type: "Single-Select",
        weight: 1,
        options: [
          { text: "Zero literacy; paralyzed by a blank chat box.", score: 1 },
          { text: "Low literacy; require heavy UI wizards and templates.", score: 2 },
          { text: "Moderate literacy; understand basic chat, lack advanced prompting.", score: 3 },
          { text: "High literacy; formally trained in enterprise prompt engineering.", score: 4 },
          { text: "Expert; prefer code, APIs, or advanced reasoning sandboxes.", score: 5 }
        ]
      },
      {
        id: 23,
        text: "How dynamic must the UI be when the AI returns data?",
        type: "Single-Select",
        weight: 1,
        options: [
          { text: "Standard markdown text and tables only.", score: 1 },
          { text: "Text combined with standard hyperlinks to external dashboards.", score: 2 },
          { text: "Hardcoded UI widgets triggered by API flags.", score: 3 },
          { text: "Dynamically generated adaptive web components (forms/sliders).", score: 4 },
          { text: "Streaming interactive micro-apps via the Agent-to-UI (A2UI) protocol.", score: 5 }
        ]
      },
      {
        id: 24,
        text: "For CX/Omnichannel use cases, how is conversational state maintained?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Single-channel only (e.g., web portal only).", score: 1 },
          { text: "Multi-channel but siloed; switching channels loses history.", score: 2 },
          { text: "User must manually provide a ticket number when switching channels.", score: 3 },
          { text: "Custom backend session mapping across web, mobile, and voice.", score: 4 },
          { text: "Native Omnichannel Gateway preserving exact context seamlessly across all mediums.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 10,
    name: "Hybrid Data & Federation",
    questions: [
      {
        id: 25,
        text: "Where does the primary data reside, and how will it be queried?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "100% On-Premise; locked down with no cloud connectivity.", score: 1 },
          { text: "AWS/Azure; paying egress fees to copy batches into GCP.", score: 2 },
          { text: "AWS/Azure/On-Prem via high-speed Cloud Interconnects.", score: 3 },
          { text: "Federated querying (BigQuery Omni) to read data in-place on AWS/Azure.", score: 4 },
          { text: "100% GCP Native (Cloud Storage, BigQuery, AlloyDB).", score: 5 }
        ]
      },
      {
        id: 26,
        text: "How will the agent securely authenticate to external clouds/systems?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Static, long-lived credentials embedded in code.", score: 1 },
          { text: "Standard API keys routed over the public internet.", score: 2 },
          { text: "Central Identity Provider (Entra ID/Okta) without GCP federation.", score: 3 },
          { text: "Routed through a centralized API Gateway (e.g., Apigee).", score: 4 },
          { text: "Zero-Trust Workload Identity Federation (OIDC/SPIFFE) for short-lived tokens.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 11,
    name: "Private Cloud Networking",
    questions: [
      {
        id: 27,
        text: "How will network traffic route to internal enterprise databases?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "IP allow-listing over the public internet.", score: 1 },
          { text: "Cloud NAT (routes over public Google infrastructure).", score: 2 },
          { text: "Serverless VPC Access connectors from custom compute.", score: 3 },
          { text: "Private Service Connect (PSC) Endpoints.", score: 4 },
          { text: "Bi-directional PSC Interfaces and Explicit Proxies bypassing the internet entirely.", score: 5 }
        ]
      },
      {
        id: 28,
        text: "How are you preventing data exfiltration from the AI environment?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Relying entirely on user login authentication.", score: 1 },
          { text: "Standard IAM read/write restrictions only.", score: 2 },
          { text: "Retrospective alerting via Cloud Logging.", score: 3 },
          { text: "Cloud Next Generation Firewall (NGFW) egress rules.", score: 4 },
          { text: "Strict VPC Service Controls (VPC-SC) perimeters.", score: 5 }
        ]
      },
      {
        id: 29,
        text: "How are encryption keys managed for the AI's data?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Not storing sensitive data.", score: 1 },
          { text: "Google-managed encryption keys (default).", score: 2 },
          { text: "Google default encryption + strict auto-deletion policies.", score: 3 },
          { text: "Customer-Managed Encryption Keys (CMEK) via Cloud KMS.", score: 4 },
          { text: "External Key Management (EKM) backed by physical HSMs outside GCP.", score: 5 }
        ]
      }
    ]
  },
  {
    id: 12,
    name: "Advanced Agentic Vulnerabilities",
    questions: [
      {
        id: 30,
        text: "How are you protecting the agent from Indirect Prompt Injections hidden in retrieved documents?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Trusting the foundational model to ignore malicious text.", score: 1 },
          { text: "Basic keyword sanitization on document ingestion.", score: 2 },
          { text: "Isolating agent permissions to prevent destructive API calls.", score: 3 },
          { text: "Dual-LLM pre-screening of retrieved context (Model Armor).", score: 4 },
          { text: "Mathematical Causal Attribution to verify user-intent dominance.", score: 5 }
        ]
      },
      {
        id: 31,
        text: "How are you securing Model Context Protocol (MCP) tool endpoints?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Open access to the MCP server.", score: 1 },
          { text: "Network perimeter IP allow-listing only.", score: 2 },
          { text: "Static API keys embedded in the agent.", score: 3 },
          { text: "API Gateway enforcing basic OAuth tokens.", score: 4 },
          { text: "Cryptographic Agent Identity with OAuth 2.1 and JSON-RPC payload inspection.", score: 5 }
        ]
      },
      {
        id: 32,
        text: "For multimodal use cases, how are you handling live voice/video privacy?",
        type: "Single-Select",
        weight: 3,
        options: [
          { text: "Passing raw audio/video to the model; fully logged.", score: 1 },
          { text: "Transcribing to text, running legacy DLP, and sending text to LLM.", score: 2 },
          { text: "Ephemeral memory processing; disabling multimodal Cloud Logging.", score: 3 },
          { text: "Client-side edge blurring / opt-out toggles.", score: 4 },
          { text: "Native inline Multimodal DLP sanitizing streams prior to reasoning.", score: 5 }
        ]
      },
      {
        id: 33,
        text: "If a backend database fails during an agent's reasoning loop, what happens?",
        type: "Single-Select",
        weight: 2,
        options: [
          { text: "Complete failure; agent hangs and returns a system error.", score: 1 },
          { text: "Infinite background retries causing endless loading screens.", score: 2 },
          { text: "Hardcoded 5-second timeouts asking the user to try again later.", score: 3 },
          { text: "Transparent orchestration (agent streams its thought process regarding the delay).", score: 4 },
          { text: "Graceful partial degradation with asynchronous Long-Running Tasks queued.", score: 5 }
        ]
      }
    ]
  }
];

// Mock scenarios to quickly load prefilled answers for demo purpose
interface MockScenario {
  name: string;
  description: string;
  answers: Record<number, number | number[]>;
}

const mockScenarios: MockScenario[] = [
  {
    name: "Mayo Clinic - Patient Discharge Summarization",
    description: "Ready-to-go managed framework integration requiring standard security filters and moderate scale.",
    answers: {
      1: 4, 2: 2, 3: 4,
      4: 3, 5: 3, 6: 2, 7: [0, 1],
      8: 3, 9: 3, 10: 2,
      11: 1, 12: 3, 13: 2,
      14: 2, 15: 1,
      16: 2, 17: 2,
      18: 3, 19: 2,
      20: 3, 21: 1,
      22: 2, 23: 1, 24: 0,
      25: 4, 26: 3,
      27: 2, 28: 2, 29: 1,
      30: 1, 31: 1, 32: 2, 33: 2
    }
  },
  {
    name: "Stanford Medicine - Clinical Trial Co-Pilot",
    description: "High compliance requirements, hybrid datasets, and advanced safety vulnerabilities.",
    answers: {
      1: 3, 2: 4, 3: 3,
      4: 2, 5: 2, 6: 1, 7: [0, 2],
      8: 2, 9: 4, 10: 3,
      11: 2, 12: 4, 13: 3,
      14: 1, 15: 2,
      16: 3, 17: 3,
      18: 4, 19: 3,
      20: 2, 21: 3,
      22: 3, 23: 2, 24: 3,
      25: 2, 26: 4,
      27: 3, 28: 3, 29: 3,
      30: 3, 31: 3, 32: 2, 33: 3
    }
  },
  {
    name: "Cleveland Clinic - Custom Agentic Mesh",
    description: "Premium enterprise code-first framework leveraging multi-agent systems, VPC-SC perimeters, and CMEK key chains.",
    answers: {
      1: 4, 2: 4, 3: 4,
      4: 4, 5: 4, 6: 4, 7: [0, 1, 2, 4],
      8: 4, 9: 4, 10: 4,
      11: 4, 12: 4, 13: 4,
      14: 4, 15: 4,
      16: 4, 17: 4,
      18: 4, 19: 4,
      20: 4, 21: 4,
      22: 4, 23: 4, 24: 4,
      25: 4, 26: 4,
      27: 4, 28: 4, 29: 4,
      30: 4, 31: 4, 32: 4, 33: 4
    }
  }
];

const getPillarReportDetails = (pillarId: number) => {
  switch (pillarId) {
    case 1:
      return {
        inFavor: ["Identified primary clinical sponsor", "Strong executive alignment from clinical team"],
        challenges: ["Unrefined quantitative ROI target metrics", "Competing clinical resources in Q3"],
        recommendations: ["Establish a dedicated clinical AI steering committee", "Lock in KPI baselines before pilot launch"],
        nextSteps: ["Conduct stakeholder kickoff workshops", "Approve ROI tracking metrics sheet"]
      };
    case 2:
      return {
        inFavor: ["Rich FHIR store and EHR clinical logs available", "High-quality medical document repositories"],
        challenges: ["Unstructured PDF medical charts require OCR", "Data extraction pipelines lack automated audit"],
        recommendations: ["Utilize Document AI for medical chart extraction", "Deploy Vector Search on GKE clusters"],
        nextSteps: ["Index initial document batch to Vertex AI Search", "Configure metadata schemas for clinical filtering"]
      };
    case 3:
      return {
        inFavor: ["Strong Python development expertise in engineering team", "Existing Dockerized API service stack"],
        challenges: ["Raw LangChain codebase hard to scale in production", "Lack of trace visibility and prompt versioning"],
        recommendations: ["Deploy Vertex AI Agent Builder flow", "Integrate LangSmith or Vertex AI tracing tools"],
        nextSteps: ["Refactor initial orchestration wrapper code", "Set up trace monitoring in development environment"]
      };
    case 4:
      return {
        inFavor: ["Assigned cloud operations budget manager", "Active GCP project console quotas"],
        challenges: ["Potential token scaling cost overrun", "Inefficient prompt token consumption on large context"],
        recommendations: ["Activate Context Caching for large system instructions", "Implement rate limiting on model endpoints"],
        nextSteps: ["Configure token usage monitoring dashboard", "Define monthly cost alert thresholds"]
      };
    case 5:
      return {
        inFavor: ["In-house domain expert clinicians available for QA", "Standard clinical guidelines exist"],
        challenges: ["No automated Golden Dataset for validation", "Clinician review is slow and hard to reproduce"],
        recommendations: ["Curate a golden validation set of 50 test cases", "Deploy Vertex AI Auto-rater evaluation pipeline"],
        nextSteps: ["Collect representative clinical test queries", "Run auto-evaluation on model baseline"]
      };
    case 6:
      return {
        inFavor: ["Strict corporate firewall and security protocols", "Active security audit team"],
        challenges: ["Vulnerability to prompt jailbreaks", "Risk of sensitive data leakage to model logs"],
        recommendations: ["Deploy dual-LLM Model Armor guardrails", "Configure IAM roles for restricted workspace access"],
        nextSteps: ["Integrate Model Armor filtering to UI route", "Perform black-box penetration testing on prompts"]
      };
    case 7:
      return {
        inFavor: ["Established compliance team for EHR systems", "Active HIPAA monitoring tools"],
        challenges: ["LLM generation outputs lack audit tracking", "HIPAA compliance logs not locked down"],
        recommendations: ["Lock sovereign local data residency", "Enable Cloud Logging audit trails for all generations"],
        nextSteps: ["Sign Business Associate Agreement (BAA) for model APIs", "Audit HIPAA data residency logs"]
      };
    case 8:
      return {
        inFavor: ["Dedicated support desk for hospital staff", "Experienced triage team"],
        challenges: ["No automated handoff for hallucinations", "Risk of bad outputs directly shown to users"],
        recommendations: ["Configure a confidence scoring threshold", "Redirect low-confidence outputs to human reviewers"],
        nextSteps: ["Define clinical exception handling flow diagram", "Code fallback error boundaries in UI layout"]
      };
    case 9:
      return {
        inFavor: ["High willingness from clinical staff to adopt AI", "Existing mobile tablet interfaces"],
        challenges: ["Raw text outputs are hard to digest in clinical workflows", "Screen fatigue from long chat conversations"],
        recommendations: ["Replace raw text generation with adaptive card UI tables", "Render structured summaries instead of raw chat logs"],
        nextSteps: ["Mock user interface screens for clinical workflows", "Conduct UX feedback session with doctors"]
      };
    case 10:
      return {
        inFavor: ["Multi-cloud databases in place", "Data catalog index active"],
        challenges: ["High egress costs for migrating EHR logs to cloud", "Data duplication across databases"],
        recommendations: ["Implement BigQuery Omni federated query search", "Establish read-only BigQuery datasets"],
        nextSteps: ["Configure PSC connections to on-prem stores", "Map clinical databases schema targets"]
      };
    case 11:
      return {
        inFavor: ["Secure enterprise network topology", "VPC routing configured"],
        challenges: ["Third-party APIs bypass secure firewalls", "External routing latency issues"],
        recommendations: ["Enable PSC interfaces to Vertex AI endpoints", "Set up Cloud Interconnect for raw database access"],
        nextSteps: ["Lock down public internet egress routing tables", "Verify private VPC DNS entries"]
      };
    case 12:
      return {
        inFavor: ["Existing robust REST APIs for clinical records", "OAuth identity provider active"],
        challenges: ["Untrusted LLM tool calling can cause write side effects", "Security scope of tool execution is too broad"],
        recommendations: ["Use cryptographic identity tokens for tool calling", "Enforce read-only scopes on EHR API keys"],
        nextSteps: ["Audit EHR write permissions on tool routes", "Implement approval checks on tool executions"]
      };
    default:
      return {
        inFavor: ["Existing core infrastructure tools"],
        challenges: ["Resource allocation and scaling limits"],
        recommendations: ["Optimize pipeline stages and monitor logs"],
        nextSteps: ["Execute diagnostic run and verify outputs"]
      };
  }
};

function UsecaseReadinessContent() {
  const { showToast } = useToast();
  const pathname = usePathname() || "";
  const isDemo = pathname.startsWith("/demo");
  const getRoutePath = (path: string) => isDemo ? `/demo${path}` : path;
  const getCustomerParamId = () => {
    if (!customerName) return "mayo-clinic";
    return customerName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  };

  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  const urlPillar = searchParams.get("pillar");

  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Scoping Metadata state
  const [customerName, setCustomerName] = useState("");
  const [segment, setSegment] = useState("Provider (Hospitals & Clinics)");
  const [useCase, setUseCase] = useState("");
  const [assessmentName, setAssessmentName] = useState("Initial Discovery");
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);

  // Scoping Modal State
  const [isScopingModalOpen, setIsScopingModalOpen] = useState(false);
  const [scopingModalMode, setScopingModalMode] = useState<"create" | "edit">("create");
  const [tempCustomerName, setTempCustomerName] = useState("");
  const [tempSegment, setTempSegment] = useState("Provider (Hospitals & Clinics)");
  const [tempUseCase, setTempUseCase] = useState("");
  const [tempAssessmentName, setTempAssessmentName] = useState("Initial Discovery");

  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);

  const [answers, setAnswers] = useState<Record<number, number | number[] | null | undefined>>({});
  const [activePillarId, setActivePillarId] = useState<number>(1);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset active question tab when changing active pillar
  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [activePillarId]);
  
  // Storage Registry State
  const [savedList, setSavedList] = useState<SavedReadinessAssessment[]>([]);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>("");

  const uniqueCustomerNames = Array.from(new Set(savedList.map(item => item.customerName))).filter(Boolean);
  const showCustomerDropdown = uniqueCustomerNames.length > 0 && !isAddingNewCustomer;

  // Seed list with preset scenarios if localStorage is empty
  useEffect(() => {
    const saved = localStorage.getItem("hcls_usecase_readiness_history");
    if (saved) {
      try {
        setSavedList(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved readiness list", e);
      }
    } else {
      // Seed with mock scenarios as starting entries!
      const initialSeed: SavedReadinessAssessment[] = mockScenarios.map((sc, idx) => {
        // Calculate score of mock answers
        let totalEarned = 0;
        let totalMax = 0;
        pillarsData.forEach(p => {
          p.questions.forEach(q => {
            const ans = sc.answers[q.id];
            if (ans === undefined || ans === null) return;
            if (ans === 5) return; // skip
            const weight = q.weight;
            totalMax += 5 * weight;
            let scoreVal = 0;
            if (q.type === "Multi-Select") {
              const selectedIndices = Array.isArray(ans) ? ans.filter(i => i !== 5) : [];
              const rawSum = selectedIndices.reduce((sum, idx) => sum + (q.options[idx]?.score || 0), 0);
              scoreVal = Math.min(rawSum, 5);
            } else {
              scoreVal = typeof ans === "number" ? (q.options[ans]?.score || 0) : 0;
            }
            totalEarned += scoreVal * weight;
          });
        });
        const score = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
        const archTitle = score <= 50 ? "No-Code / Out-of-the-Box Path" : (score <= 75 ? "Managed Framework Path" : "Custom Enterprise Agentic Path");

        return {
          id: `mock-seed-${idx}`,
          customerName: sc.name.split(" - ")[0],
          segment: "Provider (Hospitals & Clinics)",
          useCase: sc.name.split(" - ")[1],
          assessmentName: "Initial Scoping Review",
          answers: sc.answers,
          score,
          archetype: archTitle,
          updatedAt: new Date().toLocaleDateString()
        };
      });
      setSavedList(initialSeed);
      localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(initialSeed));
      initialSeed.forEach(item => {
        localStorage.setItem(`hcls_usecase_readiness_answers_${item.id}`, JSON.stringify(item.answers));
      });
    }
  }, []);

  // Load saved state on mount for the ACTIVE assessment, prioritizing URL query parameter
  useEffect(() => {
    if (urlId) {
      const saved = localStorage.getItem("hcls_usecase_readiness_history");
      if (saved) {
        try {
          const list: SavedReadinessAssessment[] = JSON.parse(saved);
          const match = list.find(item => item.id === urlId);
          if (match) {
            setCustomerName(match.customerName);
            setSegment(match.segment);
            setUseCase(match.useCase);
            setAssessmentName(match.assessmentName);
            setActiveAssessmentId(match.id);
            setAnswers(match.answers);
            if (urlPillar) {
              const pVal = parseInt(urlPillar);
              if (pVal >= 1 && pVal <= 12) {
                setActivePillarId(pVal);
              }
            }
            const shouldShow = activeAssessmentId !== match.id;
            if (shouldShow) {
              setShowResults(true);
            }

            sessionStorage.setItem("hcls_usecase_readiness_answers", JSON.stringify(match.answers));
            sessionStorage.setItem("hcls_usecase_readiness_meta", JSON.stringify({
              customerName: match.customerName,
              segment: match.segment,
              useCase: match.useCase,
              assessmentName: match.assessmentName,
              activeAssessmentId: match.id,
              showResults: shouldShow ? true : showResults
            }));
            setIsInitialized(true);
            return;
          }
        } catch (e) {
          console.error("Error loading assessment from URL id", e);
        }
      }
    } else {
      // If there is no id in the URL, reset active states to show the directory view!
      setCustomerName("");
      setSegment("Provider (Hospitals & Clinics)");
      setUseCase("");
      setAssessmentName("Initial Discovery");
      setActiveAssessmentId("");
      setAnswers({});
      setShowResults(false);
      sessionStorage.removeItem("hcls_usecase_readiness_answers");
      sessionStorage.removeItem("hcls_usecase_readiness_meta");
    }
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId, urlPillar]);

  const saveAnswersState = (newAnswers: Record<number, number | number[] | null | undefined>) => {
    setAnswers(newAnswers);
    sessionStorage.setItem("hcls_usecase_readiness_answers", JSON.stringify(newAnswers));
  };



  // Sync activeAssessmentId to browser URL search parameters for unique link sharing
  useEffect(() => {
    if (!isInitialized) return;
    const url = new URL(window.location.href);
    if (activeAssessmentId) {
      url.searchParams.set("id", activeAssessmentId);
    } else {
      url.searchParams.delete("id");
    }
    window.history.replaceState({}, "", url.toString());
  }, [activeAssessmentId, isInitialized]);

  // Auto-save answers, score, and archetype in history list on change
  useEffect(() => {
    if (!isInitialized || !activeAssessmentId) return;

    // 1. Save client-specific answers
    localStorage.setItem(`hcls_usecase_readiness_answers_${activeAssessmentId}`, JSON.stringify(answers));

    // 2. Calculate dynamic score and archetype
    const { finalScore } = calculateCombinedScore();
    const scoreVal = finalScore;
    const archTitle = scoreVal <= 50 ? "No-Code / Out-of-the-Box Path" : (scoreVal <= 75 ? "Managed Framework Path" : "Custom Enterprise Agentic Path");

    // 3. Update the item in savedList history
    const updatedList = savedList.map(item => {
      if (item.id === activeAssessmentId) {
        return {
          ...item,
          answers: answers,
          score: scoreVal,
          archetype: archTitle,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return item;
    });

    // Only update state & localStorage if it actually changed
    const listString = JSON.stringify(updatedList);
    const oldListString = localStorage.getItem("hcls_usecase_readiness_history");
    if (listString !== oldListString) {
      setSavedList(updatedList);
      localStorage.setItem("hcls_usecase_readiness_history", listString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, activeAssessmentId, isInitialized]);

  const handleSelectOption = (questionId: number, optionIndex: number, isMultiSelect: boolean) => {
    const current = answers[questionId];
    let updated: number | number[] | null | undefined;

    if (isMultiSelect) {
      const prevArray = Array.isArray(current) ? current : [];
      if (optionIndex === 5) {
        updated = prevArray.includes(5) ? [] : [5];
      } else {
        let nextArray = prevArray.filter(idx => idx !== 5);
        if (nextArray.includes(optionIndex)) {
          nextArray = nextArray.filter(idx => idx !== optionIndex);
        } else {
          nextArray = [...nextArray, optionIndex];
        }
        updated = nextArray;
      }
    } else {
      updated = current === optionIndex ? null : optionIndex;
    }

    const nextAnswers = { ...answers, [questionId]: updated };
    saveAnswersState(nextAnswers);
  };

  // Validation Hook: lock results if customerName is cleared
  useEffect(() => {
    if (!isInitialized) return;
    if (!customerName.trim() && showResults) {
      setShowResults(false);
      showToast("Customer Name cleared. Results locked until a name is provided.", "warning");
    }
  }, [customerName, showResults, isInitialized, showToast]);



  const handleSaveAssessment = () => {
    if (!customerName.trim()) {
      showToast("Please enter a Customer Name before saving.", "warning");
      return;
    }

    const id = activeAssessmentId || `${customerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${assessmentName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const newRecord: SavedReadinessAssessment = {
      id,
      customerName,
      segment,
      useCase,
      assessmentName,
      answers,
      score: finalScore,
      archetype: archetype.title,
      updatedAt: new Date().toLocaleDateString()
    };

    const updatedList = [...savedList];
    const existingIdx = savedList.findIndex(item => item.id === id);
    if (existingIdx !== -1) {
      updatedList[existingIdx] = newRecord;
      showToast(`Updated assessment for ${customerName}!`, "success");
    } else {
      updatedList.push(newRecord);
      showToast(`Saved new assessment for ${customerName}!`, "success");
    }

    setSavedList(updatedList);
    localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(updatedList));
    setActiveAssessmentId(id);
  };

  const handleOpenAssessment = (item: SavedReadinessAssessment) => {
    setCustomerName(item.customerName);
    setSegment(item.segment);
    setUseCase(item.useCase);
    setAssessmentName(item.assessmentName);
    setActiveAssessmentId(item.id);
    setAnswers(item.answers);
    setShowResults(true); // Auto reveal report when loaded from portfolio card

    sessionStorage.setItem("hcls_usecase_readiness_answers", JSON.stringify(item.answers));
    sessionStorage.setItem("hcls_usecase_readiness_meta", JSON.stringify({
      customerName: item.customerName,
      segment: item.segment,
      useCase: item.useCase,
      assessmentName: item.assessmentName,
      activeAssessmentId: item.id,
      showResults: true
    }));

    showToast(`Opening assessment for ${item.customerName}...`, "info");
  };

  const handleDeleteAssessment = (id: string, customerName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card loading trigger
    if (confirm(`Are you sure you want to delete the assessment for ${customerName}?`)) {
      const filtered = savedList.filter(item => item.id !== id);
      setSavedList(filtered);
      localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(filtered));
      showToast("Assessment deleted from history.", "success");
    }
  };

  const handleEditAssessmentScoping = (item: SavedReadinessAssessment, e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenAssessment(item);
    setTempCustomerName(item.customerName);
    setTempSegment(item.segment);
    setTempUseCase(item.useCase);
    setTempAssessmentName(item.assessmentName);
    setScopingModalMode("edit");
    setIsScopingModalOpen(true);
  };

  const handleCloneAssessment = (item: SavedReadinessAssessment, e: React.MouseEvent) => {
    e.stopPropagation();
    const clonedId = `${item.id}-cloned-${Date.now().toString().slice(-4)}`;
    const clonedItem: SavedReadinessAssessment = {
      ...item,
      id: clonedId,
      customerName: `${item.customerName} (Cloned)`,
      updatedAt: new Date().toLocaleDateString()
    };
    const updatedList = [clonedItem, ...savedList];
    setSavedList(updatedList);
    localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(updatedList));
    showToast(`Cloned assessment for ${item.customerName}!`, "success");
  };

  const handleDownloadExcel = (item: SavedReadinessAssessment, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Downloaded ${item.customerName} assessment data as Excel sheet!`, "success");
  };

  const handleOpenCreateScoping = () => {
    setScopingModalMode("create");
    setTempCustomerName("");
    setTempSegment("Provider (Hospitals & Clinics)");
    setTempUseCase("");
    setTempAssessmentName("Initial Discovery");
    setIsAddingNewCustomer(uniqueCustomerNames.length === 0);
    setIsScopingModalOpen(true);
  };

  const handleOpenEditScoping = () => {
    setScopingModalMode("edit");
    setTempCustomerName(customerName);
    setTempSegment(segment);
    setTempUseCase(useCase);
    setTempAssessmentName(assessmentName);
    setIsAddingNewCustomer(false);
    setIsScopingModalOpen(true);
  };

  const handleStartScoping = () => {
    if (!tempCustomerName.trim()) {
      showToast("Please enter a Customer Name.", "warning");
      return;
    }

    if (scopingModalMode === "create") {
      // Clear answers for fresh start
      saveAnswersState({});
      const newId = `${tempCustomerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${tempAssessmentName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
      
      const newRecord: SavedReadinessAssessment = {
        id: newId,
        customerName: tempCustomerName,
        segment: tempSegment,
        useCase: tempUseCase,
        assessmentName: tempAssessmentName,
        answers: {},
        score: 0,
        archetype: "No-Code / Out-of-the-Box Path",
        updatedAt: new Date().toLocaleDateString()
      };
      
      const updatedList = [newRecord, ...savedList];
      setSavedList(updatedList);
      localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(updatedList));
      localStorage.setItem(`hcls_usecase_readiness_answers_${newId}`, JSON.stringify({}));

      setActiveAssessmentId(newId);
      setActivePillarId(1);
      setShowResults(false);
      showToast(`Started new assessment for ${tempCustomerName}!`, "success");
    } else {
      showToast(`Updated scoping details for ${tempCustomerName}.`, "success");
      
      // Also update in savedList history if exists
      if (activeAssessmentId) {
        const updatedList = savedList.map(item => {
          if (item.id === activeAssessmentId) {
            return {
              ...item,
              customerName: tempCustomerName,
              segment: tempSegment,
              useCase: tempUseCase,
              assessmentName: tempAssessmentName
            };
          }
          return item;
        });
        setSavedList(updatedList);
        localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(updatedList));
      }
    }

    setCustomerName(tempCustomerName);
    setSegment(tempSegment);
    setUseCase(tempUseCase);
    setAssessmentName(tempAssessmentName);
    setIsScopingModalOpen(false);
  };

  // Check action query param to auto-launch modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "new") {
      handleOpenCreateScoping();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueCustomerNames.length]);



  // Helper checks
  const isQuestionAnswered = (q: Question) => {
    const ans = answers[q.id];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return true;
  };

  const isQuestionSkipped = (q: Question) => {
    const ans = answers[q.id];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.includes(5);
    return ans === 5;
  };

  // Calculations
  const calculatePillarScore = (pillar: Pillar) => {
    const totalQuestions = pillar.questions.length;
    const answeredCount = pillar.questions.filter(isQuestionAnswered).length;
    const skippedCount = pillar.questions.filter(isQuestionSkipped).length;

    if (skippedCount === totalQuestions) {
      return { isUnlocked: true, score: 0, isAllSkipped: true, answeredCount };
    }

    const validAnsweredCount = answeredCount - skippedCount;
    const isUnlocked = validAnsweredCount > 0;

    if (!isUnlocked) {
      return { isUnlocked: false, score: 0, isAllSkipped: false, answeredCount };
    }

    let earnedWeighted = 0;
    let maxWeighted = 0;

    pillar.questions.forEach(q => {
      if (!isQuestionAnswered(q) || isQuestionSkipped(q)) return;

      const weight = q.weight;
      const maxPossibleForQ = 5 * weight;
      maxWeighted += maxPossibleForQ;

      const ans = answers[q.id];
      let scoreVal = 0;
      if (q.type === "Multi-Select") {
        const selectedIndices = Array.isArray(ans) ? ans.filter(i => i !== 5) : [];
        const rawSum = selectedIndices.reduce((sum, idx) => sum + (q.options[idx]?.score || 0), 0);
        scoreVal = Math.min(rawSum, 5);
      } else {
        scoreVal = typeof ans === "number" ? (q.options[ans]?.score || 0) : 0;
      }
      earnedWeighted += scoreVal * weight;
    });

    const scorePct = maxWeighted > 0 ? Math.round((earnedWeighted / maxWeighted) * 100) : 0;

    return {
      isUnlocked: true,
      score: scorePct,
      isAllSkipped: false,
      answeredCount
    };
  };

  const calculateCombinedScore = () => {
    let completedPillarsCount = 0;
    let totalEarnedWeighted = 0;
    let totalMaxWeighted = 0;
    let hasValidCompletedPillars = false;

    pillarsData.forEach(p => {
      const calc = calculatePillarScore(p);
      if (calc.isUnlocked) {
        completedPillarsCount++;
        if (calc.isAllSkipped) return;
        hasValidCompletedPillars = true;
        p.questions.forEach(q => {
          if (!isQuestionAnswered(q) || isQuestionSkipped(q)) return;

          const weight = q.weight;
          totalMaxWeighted += 5 * weight;

          const ans = answers[q.id];
          let scoreVal = 0;
          if (q.type === "Multi-Select") {
            const selectedIndices = Array.isArray(ans) ? ans.filter(i => i !== 5) : [];
            const rawSum = selectedIndices.reduce((sum, idx) => sum + (q.options[idx]?.score || 0), 0);
            scoreVal = Math.min(rawSum, 5);
          } else {
            scoreVal = typeof ans === "number" ? (q.options[ans]?.score || 0) : 0;
          }
          totalEarnedWeighted += scoreVal * weight;
        });
      }
    });

    const finalScore = totalMaxWeighted > 0 ? Math.round((totalEarnedWeighted / totalMaxWeighted) * 100) : 0;

    return {
      completedPillarsCount,
      finalScore,
      hasCompletedPillars: hasValidCompletedPillars,
      totalEarnedWeighted,
      totalMaxWeighted
    };
  };

  const { completedPillarsCount, finalScore, hasCompletedPillars } = calculateCombinedScore();
  const isScopingValid = hasCompletedPillars && customerName.trim() !== "";

  // Sync active metadata to session storage
  useEffect(() => {
    const metaObj = { customerName, segment, useCase, assessmentName, activeAssessmentId, showResults, score: finalScore };
    sessionStorage.setItem("hcls_usecase_readiness_meta", JSON.stringify(metaObj));
  }, [customerName, segment, useCase, assessmentName, activeAssessmentId, showResults, finalScore]);

  const getReadinessArchetype = (score: number) => {
    if (!customerName.trim()) {
      return {
        title: "Missing Scoping Info",
        color: "bg-gray-150 text-gray-500 border-gray-200 border animate-pulse",
        description: "Please click 'Start New Assessment' in the top header toolbar to enter your customer name and activate the assessment cycle."
      };
    }
    if (!hasCompletedPillars) {
      return {
        title: "Incomplete",
        color: "bg-gray-200 text-gray-700",
        description: "Answer all questions in at least one pillar to calculate archetype."
      };
    }
    if (score <= 50) {
      return {
        title: "No-Code / Out-of-the-Box Path",
        color: "bg-red-50 text-red border-red/10 border",
        description: "Optimal path target: NotebookLM or Workspace Studio. Best for low-complexity, read-only use cases with static files."
      };
    } else if (score <= 75) {
      return {
        title: "Managed Framework Path",
        color: "bg-amber-50 text-amber border-amber/10 border",
        description: "Optimal path target: Gemini Deep Research or Vertex AI Search. Suitable for managed orchestration with moderate requirements."
      };
    } else {
      return {
        title: "Custom Enterprise Agentic Path",
        color: "bg-green-50 text-green border-green/10 border",
        description: "Optimal path target: Agent Development Kit (ADK), Agent Engine, or Agent-to-Agent (A2A) Protocol. Designed for high-volume, mission-critical operations."
      };
    }
  };



  const archetype = getReadinessArchetype(finalScore);
  const activePillar = pillarsData.find(p => p.id === activePillarId) || pillarsData[0];
  const activePillarCalc = calculatePillarScore(activePillar);

  return (
    <div className={`flex flex-col gap-4 animate-fade-in select-none ${
      showResults 
        ? "min-h-[calc(100vh-112px)] h-auto overflow-y-auto pb-8" 
        : "h-[calc(100vh-112px)] overflow-hidden"
    }`}>
      




      {/* TWO COLUMN INTERACTIVE INTERFACE */}
      {!showResults && (
        customerName ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-0 mb-1">
        
        {/* LEFT COLUMN: Pillars List */}
        <div className="lg:col-span-3 flex flex-col h-full min-h-0">
          
          {/* Assessment Pillars navigation */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 h-full">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-1 select-none">
              Assessment Pillars
            </h2>

            <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
              {pillarsData.map((p) => {
                const calc = calculatePillarScore(p);
                const isActive = activePillarId === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePillarId(p.id)}
                    className={`w-full text-left rounded-md py-2 px-2.5 btn-transition border flex items-center justify-between gap-3 text-xs ${
                      isActive
                        ? "bg-blue-50/60 border-blue text-blue font-bold shadow-sm"
                        : "bg-white border-gray-150 hover:bg-gray-50 hover:border-gray-250 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`font-mono text-[9px] font-extrabold ${isActive ? "text-blue" : "text-gray-400"}`}>
                        P{p.id.toString().padStart(2, '0')}
                      </span>
                      <span className={`truncate text-xs ${isActive ? "text-gray-950 font-bold" : "text-gray-800 font-semibold"}`}>
                        {p.name}
                      </span>
                    </div>

                    {calc.isUnlocked ? (
                      <span className={`text-[9px] font-extrabold px-1 rounded flex-shrink-0 select-none ${
                        calc.isAllSkipped 
                          ? "bg-gray-100 text-gray-500" 
                          : (calc.score >= 76 ? "bg-green-50 text-green" : calc.score >= 51 ? "bg-amber-50 text-amber" : "bg-red-50 text-red")
                      }`}>
                        {calc.isAllSkipped ? "N/A" : `${calc.score}%`}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-gray-400 flex items-center gap-0.5 uppercase flex-shrink-0 select-none">
                        <i className="fa-solid fa-lock text-[8px]"></i>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {hasCompletedPillars && (
              <button
                onClick={() => {
                  setShowResults(true);
                  showToast("Readiness Report opened!", "success");
                }}
                className="mt-3.5 w-full border border-green text-green hover:bg-green-50/50 text-[11px] font-bold py-2 px-3 rounded-lg btn-transition flex items-center justify-center gap-1.5 shadow-xs"
                title="View the detailed executive readiness report"
              >
                <i className="fa-solid fa-chart-pie"></i>
                <span>View Current Report</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Pillar Details, Questions & Metadata Scoping */}
        <div className="lg:col-span-9 flex flex-col gap-4 h-full min-h-0">
          
          {/* ACTIVE ASSESSMENT METADATA SUMMARY BAR */}
          {customerName && (
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none flex-shrink-0">
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs select-text">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Active Customer</span>
                  <span className="font-bold text-gray-900 text-sm">{customerName}</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200 hidden md:block"></div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Segment</span>
                  <span className="font-semibold text-gray-800">{segment}</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200 hidden md:block"></div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Use Case</span>
                  <span className="font-semibold text-gray-800">{useCase || "Readiness Scoping"}</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200 hidden md:block"></div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Assessment Cycle</span>
                  <span className="font-mono text-gray-850">{assessmentName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleOpenEditScoping}
                  className="border border-gray-250 hover:bg-gray-50 text-gray-700 text-[11px] font-bold px-3 py-2 rounded-md btn-transition shadow-sm flex items-center justify-center gap-1.5 flex-1 md:flex-initial"
                  title="Edit customer or use case scoping parameters"
                >
                  <i className="fa-solid fa-pen-to-square text-blue"></i>
                  <span>Edit Scoping</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAssessment}
                  className="bg-green hover:bg-green/95 text-white text-[11px] font-bold px-3.5 py-2 rounded-md btn-transition shadow-sm flex items-center justify-center gap-1.5 flex-1 md:flex-initial"
                  title="Save all answered questionnaire metrics"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Save Progress</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Question Details Card with integrated Navy Header */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full min-h-0 justify-between overflow-hidden">
            {/* Header section (Navy background for pillar context) */}
            <div className="bg-navy text-white p-4 flex items-center justify-between gap-4 select-none">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-white/60 font-bold uppercase tracking-wider">
                  Active Assessment Pillar {activePillar.id} of 12
                </span>
                <h2 className="text-xs font-extrabold select-text leading-tight">{activePillar.name}</h2>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded border border-white/10 select-none">
                <span className="text-[9px] font-bold text-white/70 uppercase">Pillar Score:</span>
                {activePillarCalc.isUnlocked ? (
                  <span className={`text-[10px] font-extrabold ${activePillarCalc.isAllSkipped ? "text-white/80" : (activePillarCalc.score >= 76 ? "text-green-400" : activePillarCalc.score >= 51 ? "text-amber-200" : "text-red-50/90")}`}>
                    {activePillarCalc.isAllSkipped ? "N/A" : `${activePillarCalc.score}%`}
                  </span>
                ) : (
                  <div className="flex items-center gap-1 text-[9px] text-white/50 font-bold uppercase">
                    <i className="fa-solid fa-lock text-[8px] mt-[1px]"></i>
                    <span>Locked ({activePillarCalc.answeredCount}/{activePillar.questions.length})</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Main content body */}
            <div className="p-4 flex flex-col gap-4 flex-1 min-h-0 justify-between">
              <div className="flex flex-col gap-4 flex-1 min-h-0">
                
                {/* Question Navigation Tabs */}
                <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3 select-none overflow-x-auto">
                {activePillar.questions.map((q, idx) => {
                  const isActive = activeQuestionIndex === idx;
                  const isAnswered = isQuestionAnswered(q);
                  const isSkipped = isQuestionSkipped(q);
                  
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold btn-transition flex items-center gap-1.5 border whitespace-nowrap ${
                        isActive
                          ? "bg-blue border-blue text-white shadow-sm font-semibold"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span>Q{idx + 1}</span>
                      {isAnswered && (
                        <i className={`fa-solid ${isSkipped ? "fa-circle-minus text-amber" : "fa-circle-check text-green"} text-[10px] ${isActive ? "text-white" : ""}`}></i>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Display */}
              {(() => {
                const q = activePillar.questions[activeQuestionIndex];
                if (!q) return null;
                const selectedValue = answers[q.id];

                return (
                  <div className="flex flex-col gap-4 animate-fade-in flex-1 min-h-0 overflow-y-auto pr-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1 leading-snug">
                        <span className="text-xs text-gray-400 font-bold uppercase">
                          Question {q.id} of 33 · {q.type}
                        </span>
                        <h4 className="text-xs font-bold text-gray-950 select-text leading-relaxed">
                          {q.text}
                        </h4>
                      </div>

                      <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded border border-gray-200 flex-shrink-0 select-none">
                        Weight: {q.weight}x
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, idx) => {
                        const isOptionSelected = q.type === "Multi-Select"
                          ? (Array.isArray(selectedValue) && selectedValue.includes(idx))
                          : selectedValue === idx;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(q.id, idx, q.type === "Multi-Select")}
                            className={`w-full text-left p-3 rounded-lg border btn-transition flex items-center justify-between text-xs font-semibold ${
                              isOptionSelected
                                ? "bg-blue-50/50 border-blue text-blue"
                                : "bg-white border-gray-200 hover:border-gray-350 text-gray-700"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5">
                                {q.type === "Multi-Select" ? (
                                  <i className={`fa-regular ${isOptionSelected ? "fa-square-check text-blue" : "fa-square text-gray-300"} text-sm`}></i>
                                ) : (
                                  <i className={`fa-solid ${isOptionSelected ? "fa-circle-dot text-blue" : "fa-circle text-gray-200"} text-sm`}></i>
                                )}
                              </span>
                              <span>{opt.text}</span>
                            </div>

                            <span className={`text-[10px] font-mono px-1 rounded flex-shrink-0 ml-3 ${
                              isOptionSelected ? "bg-blue-50 text-blue font-bold" : "bg-gray-50 text-gray-400"
                            }`}>
                              +{opt.score} Pt{opt.score !== 1 && "s"}
                            </span>
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handleSelectOption(q.id, 5, q.type === "Multi-Select")}
                        className={`w-full text-left p-3 rounded-lg border border-dashed btn-transition flex items-center justify-between text-xs font-semibold ${
                          (q.type === "Multi-Select" ? (Array.isArray(selectedValue) && selectedValue.includes(5)) : selectedValue === 5)
                            ? "bg-amber-50/30 border-amber text-amber"
                            : "bg-white border-gray-200 hover:border-gray-350 text-gray-505"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5">
                            {q.type === "Multi-Select" ? (
                              <i className={`fa-regular ${(Array.isArray(selectedValue) && selectedValue.includes(5)) ? "fa-square-check text-amber" : "fa-square text-gray-300"} text-sm`}></i>
                            ) : (
                              <i className={`fa-solid ${(selectedValue === 5) ? "fa-circle-dot text-amber" : "fa-circle text-gray-200"} text-sm`}></i>
                            )}
                          </span>
                          <span className="italic">Skip / Not Applicable</span>
                        </div>

                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ml-3 uppercase ${
                          (q.type === "Multi-Select" ? (Array.isArray(selectedValue) && selectedValue.includes(5)) : selectedValue === 5)
                            ? "bg-amber-50 text-amber"
                            : "bg-gray-50 text-gray-450"
                        }`}>
                          Excludes Weight
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer Navigation Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4 select-none">
              <button
                type="button"
                onClick={() => {
                  if (activeQuestionIndex > 0) setActiveQuestionIndex(activeQuestionIndex - 1);
                }}
                disabled={activeQuestionIndex === 0}
                className={`border text-[11px] font-bold px-3 py-1.5 rounded btn-transition flex items-center gap-1 shadow-sm ${
                  activeQuestionIndex === 0
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white border-gray-250 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className="fa-solid fa-chevron-left text-[9px]"></i>
                <span>Prev Question</span>
              </button>

              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Question {activeQuestionIndex + 1} / {activePillar.questions.length}
              </span>

              {activeQuestionIndex < activePillar.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveQuestionIndex(activeQuestionIndex + 1);
                  }}
                  className="bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded btn-transition shadow-sm flex items-center gap-1"
                >
                  <span>Next Question</span>
                  <i className="fa-solid fa-chevron-right text-[9px]"></i>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {activePillarCalc.isUnlocked && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!customerName.trim()) {
                          showToast("Please enter a customer name first.", "warning");
                          handleOpenCreateScoping();
                          return;
                        }
                        setShowResults(true);
                        showToast("Detailed Readiness Report opened!", "success");
                      }}
                      className="bg-green hover:bg-green/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded btn-transition shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
                      title="Directly view the detailed executive readiness report"
                    >
                      <i className="fa-solid fa-chart-pie text-[10px]"></i>
                      <span>View Report</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (activePillarCalc.isUnlocked) {
                        setIsPillarModalOpen(true);
                      } else {
                        showToast(`Please answer all ${activePillar.questions.length} questions in this pillar first.`, "info");
                      }
                    }}
                    className={`text-[11px] font-bold px-3.5 py-1.5 rounded btn-transition shadow-sm flex items-center gap-1 uppercase tracking-wider ${
                      activePillarCalc.isUnlocked
                        ? "bg-blue hover:bg-blue-dk text-white cursor-pointer"
                        : "bg-gray-150 text-gray-400 cursor-not-allowed border border-gray-200/50"
                    }`}
                  >
                    <span>{activePillarId === 12 ? "Finish Scoping" : "Continue / Submit"}</span>
                    <i className="fa-solid fa-circle-check text-[10px]"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-8">
      {/* HEADER ROW FOR DIRECTORY */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 pb-4 flex-shrink-0 select-none">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base sm:text-lg font-bold text-gray-950">Saved Discovery Portfolio</h2>
          <p className="text-xs sm:text-sm text-gray-500">Select a client below to review discovery findings or launch a new scoping cycle.</p>
        </div>
        <button
          onClick={handleOpenCreateScoping}
          className="bg-blue hover:bg-blue-dk text-white text-xs font-bold px-3.5 py-2.5 rounded-md btn-transition shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
        >
          <i className="fa-solid fa-plus text-[10px]"></i>
          <span>New Assessment</span>
        </button>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white border border-gray-250 rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center select-text shadow-sm my-auto">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue flex items-center justify-center text-xl shadow-inner">
            <i className="fa-solid fa-folder-open"></i>
          </div>
          <div className="flex flex-col gap-1 max-w-xs items-center mx-auto">
            <h3 className="text-sm font-bold text-gray-900">No Assessments Saved Yet</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              You haven&apos;t saved any usecase readiness assessments. Click the button below to launch your first scoping cycle.
            </p>
          </div>
          <button
            onClick={handleOpenCreateScoping}
            className="bg-blue hover:bg-blue-dk text-white text-xs font-bold py-2.5 px-4 rounded-md btn-transition shadow-sm mt-1 uppercase tracking-wider"
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-1 text-[10px]"></i>
            <span>Launch First Assessment</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-text">
          {savedList.map((item) => {
            const getScoreBadgeStyles = (score: number) => {
              if (score >= 76) return "bg-green-50 text-green border-green-200";
              if (score >= 51) return "bg-amber-50 text-amber border-amber-200";
              return "bg-red-50 text-red border-red-200";
            };

            return (
              <div
                key={item.id}
                onClick={() => handleOpenAssessment(item)}
                className="bg-white border border-gray-200 hover:border-blue rounded-xl p-4 shadow-xs hover:shadow-md btn-transition cursor-pointer flex flex-col justify-between gap-4 relative group"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-start gap-3 pr-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.segment}</span>
                      <span className="text-sm sm:text-base font-extrabold text-gray-950 mt-0.5 truncate max-w-[240px]">{item.customerName}</span>
                    </div>
                    <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border flex-shrink-0 select-none ${getScoreBadgeStyles(item.score)}`}>
                      {item.score}%
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Use Case</span>
                    <span className="font-semibold text-gray-700 text-xs sm:text-sm line-clamp-2 leading-relaxed min-h-[36px]">
                      {item.useCase || "No use case description provided."}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-bold select-none">
                  <div className="flex items-center gap-1">
                    <i className="fa-regular fa-calendar"></i>
                    <span>{item.updatedAt}</span>
                  </div>
                  <div className="truncate max-w-[120px] italic font-semibold text-right">{item.assessmentName}</div>
                </div>

                <div className="absolute right-3.5 bottom-[40px] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 btn-transition select-none">
                  <button
                    onClick={(e) => handleEditAssessmentScoping(item, e)}
                    className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-500 hover:bg-blue-50/50 hover:text-blue hover:border-blue/20 flex items-center justify-center btn-transition shadow-xs"
                    title="Edit scoping parameters"
                  >
                    <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                  </button>
                  <button
                    onClick={(e) => handleCloneAssessment(item, e)}
                    className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-500 hover:bg-green-50/50 hover:text-green hover:border-green/20 flex items-center justify-center btn-transition shadow-xs"
                    title="Clone assessment"
                  >
                    <i className="fa-solid fa-copy text-[10px]"></i>
                  </button>
                  <button
                    onClick={(e) => handleDownloadExcel(item, e)}
                    className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-500 hover:bg-amber-50/50 hover:text-amber hover:border-amber/20 flex items-center justify-center btn-transition shadow-xs"
                    title="Download as Excel"
                  >
                    <i className="fa-solid fa-file-excel text-[10px]"></i>
                  </button>
                  <button
                    onClick={(e) => handleDeleteAssessment(item.id, item.customerName, e)}
                    className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red hover:border-red/10 flex items-center justify-center btn-transition shadow-xs"
                    title="Delete assessment"
                  >
                    <i className="fa-solid fa-trash text-[10px]"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
)}

      {/* DETAILED READINESS REPORT DASHBOARD */}
      {showResults && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-4 mt-2 print:border-0 print:shadow-none select-text">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3 select-none gap-3">

            {/* Inline Badges Scoping Summary */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-150 rounded-lg px-4 py-2 flex-1">
              <div><span className="font-bold text-gray-400 mr-1 text-[10px] uppercase tracking-wider">Client:</span> <span className="font-extrabold text-gray-900 text-xs">{customerName || "N/A"}</span></div>
              <div className="text-gray-250 font-light text-[11px]">|</div>
              <div><span className="font-bold text-gray-400 mr-1 text-[10px] uppercase tracking-wider">Cycle:</span> <span className="font-mono text-gray-800 text-xs font-bold">{assessmentName}</span></div>
              <div className="text-gray-250 font-light text-[11px]">|</div>
              <div><span className="font-bold text-gray-400 mr-1 text-[10px] uppercase tracking-wider">Overall Score:</span> <span className="font-extrabold text-blue text-xs">{finalScore}%</span></div>
              <div className="text-gray-250 font-light text-[11px]">|</div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Archetype:</span> 
                <span 
                  onClick={() => setIsBlueprintModalOpen(true)}
                  className={`font-extrabold px-2 py-1 rounded text-[10px] uppercase tracking-wider cursor-pointer hover:opacity-90 ${archetype.color}`}
                  title="Click to view recommendation blueprint details"
                >
                  {archetype.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 print:hidden">
              <button
                onClick={() => {
                  setShowResults(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="border border-gray-250 hover:bg-gray-50 text-gray-705 text-[10px] font-bold px-3 py-1.5 rounded shadow-sm btn-transition flex items-center gap-1.5 uppercase tracking-wider"
                title="Return to the interactive questionnaire wizard to edit answers"
              >
                <i className="fa-solid fa-pen-to-square text-blue"></i>
                <span>Edit Assessment</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue hover:bg-blue-dk text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-sm btn-transition flex items-center gap-1.5 uppercase tracking-wider"
              >
                <i className="fa-solid fa-print"></i>
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* Consolidated Executive Business & ROI Alignment Summary */}
          <div className="bg-gradient-to-r from-blue-50/40 to-indigo-50/20 border border-blue-150 rounded-xl p-3 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs select-none">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="bg-blue/10 text-blue font-bold px-1.5 py-0.5 rounded">ROI / KPI Summary</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium text-gray-500">Est. Savings: <strong>$1.2M/yr</strong> (9-mo payback period)</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Strategic path projection for <span className="font-bold text-gray-900">{customerName}</span> on the <span className="text-blue font-semibold">{archetype.title}</span>.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center flex-shrink-0">
              <Link
                href={getRoutePath(`/strategic-plan/${getCustomerParamId()}`)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-2.5 py-1.5 rounded text-[11px] btn-transition flex items-center gap-1 shadow-xs"
              >
                <i className="fa-solid fa-file-invoice text-blue text-[10px]"></i>
                <span>Strategic Plan</span>
              </Link>
              <Link
                href={isDemo ? "/demo/bv" : "/bv-command"}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-2.5 py-1.5 rounded text-[11px] btn-transition flex items-center gap-1 shadow-xs"
              >
                <i className="fa-solid fa-chart-line text-green text-[10px] animate-pulse"></i>
                <span>Business Value</span>
              </Link>
              <Link
                href={getRoutePath(`/timeline/${getCustomerParamId()}`)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-2.5 py-1.5 rounded text-[11px] btn-transition flex items-center gap-1 shadow-xs"
              >
                <i className="fa-solid fa-timeline text-purple-650 text-[10px]"></i>
                <span>Timeline</span>
              </Link>
            </div>
          </div>

          {/* Pillars Analysis Grid */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-850 uppercase tracking-wider select-none">Pillar Executive Analysis (2x2 Matrix)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pillarsData.map(p => {
                const calc = calculatePillarScore(p);
                if (!calc.isUnlocked) return null;
                const details = getPillarReportDetails(p.id);

                return (
                  <div key={p.id} className="border border-gray-200 rounded-xl p-4 flex flex-col gap-4 bg-white shadow-xs">
                    {/* Pillar Title Banner */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 select-none">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-blue bg-blue-50 px-2 py-0.5 rounded">
                          P{p.id.toString().padStart(2, '0')}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 select-text">
                          {p.name}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        calc.isAllSkipped 
                          ? "bg-gray-100 text-gray-500" 
                          : (calc.score >= 76 ? "bg-green-50 text-green" : calc.score >= 51 ? "bg-amber-50 text-amber" : "bg-red-50 text-red")
                      }`}>
                        {calc.isAllSkipped ? "N/A" : `${calc.score}%`}
                      </span>
                    </div>

                    {/* 2x2 Cards Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* What's in Favor */}
                      <div className="bg-green-50/10 border border-green-100/70 rounded-lg p-3 flex flex-col gap-2">
                        <span className="font-bold text-[10px] text-green-700 uppercase tracking-wider flex items-center gap-1.5 select-none">
                          <i className="fa-solid fa-circle-check text-green text-xs"></i>
                          <span>What&apos;s in Favor</span>
                        </span>
                        <ul className="list-disc pl-4 text-[11px] text-gray-650 flex flex-col gap-1 select-text font-medium leading-relaxed">
                          {details.inFavor.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Challenges */}
                      <div className="bg-red-50/10 border border-red-100/60 rounded-lg p-3 flex flex-col gap-2">
                        <span className="font-bold text-[10px] text-red-750 uppercase tracking-wider flex items-center gap-1.5 select-none">
                          <i className="fa-solid fa-circle-exclamation text-red text-xs"></i>
                          <span>Challenges & Risks</span>
                        </span>
                        <ul className="list-disc pl-4 text-[11px] text-gray-650 flex flex-col gap-1 select-text font-medium leading-relaxed">
                          {details.challenges.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-blue-50/10 border border-blue-100/70 rounded-lg p-3 flex flex-col gap-2">
                        <span className="font-bold text-[10px] text-blue uppercase tracking-wider flex items-center gap-1.5 select-none">
                          <i className="fa-solid fa-wand-magic-sparkles text-blue text-xs"></i>
                          <span>Recommendations</span>
                        </span>
                        <ul className="list-disc pl-4 text-[11px] text-gray-650 flex flex-col gap-1 select-text font-medium leading-relaxed">
                          {details.recommendations.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Next Steps */}
                      <div className="bg-purple-50/10 border border-purple-100/70 rounded-lg p-3 flex flex-col gap-2">
                        <span className="font-bold text-[10px] text-purple-750 uppercase tracking-wider flex items-center gap-1.5 select-none">
                          <i className="fa-solid fa-circle-right text-purple text-xs"></i>
                          <span>Next Steps</span>
                        </span>
                        <ul className="list-disc pl-4 text-[11px] text-gray-650 flex flex-col gap-1 select-text font-medium leading-relaxed">
                          {details.nextSteps.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* PILLAR COMPLETED SUBMISSION MODAL */}
      <Modal
        isOpen={isPillarModalOpen}
        onClose={() => setIsPillarModalOpen(false)}
        width="440px"
        title="Pillar Completed"
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="flex flex-col leading-tight">
              <h4 className="font-bold text-gray-900 text-sm">Pillar {activePillarId} Scoped Successfully</h4>
              <span className="text-[10px] text-gray-400 mt-0.5 font-semibold">Calculated Pillar Score: {activePillarCalc.isAllSkipped ? "N/A" : `${activePillarCalc.score}%`}</span>
            </div>
          </div>

          <p className="text-gray-500 leading-relaxed select-text">
            You have completed all questions in <strong>{activePillar.name}</strong>. 
            Would you like to submit and view the current overall readiness archetype, or continue to the next pillar to scope more parameters?
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-3 border-t border-gray-150 mt-2 select-none">
            <button
              onClick={() => {
                if (!customerName.trim()) {
                  showToast("Please enter a Customer Name to launch your assessment discovery.", "warning");
                  handleOpenCreateScoping();
                  setIsPillarModalOpen(false);
                  return;
                }
                setShowResults(true);
                setIsPillarModalOpen(false);
                showToast("Readiness results revealed!", "success");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="border border-blue text-blue hover:bg-blue-50/50 px-3.5 py-2 rounded text-xs font-semibold btn-transition flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <i className="fa-solid fa-chart-simple"></i>
              <span>Submit & View Results</span>
            </button>
            
            <button
              onClick={() => {
                setIsPillarModalOpen(false);
                if (activePillarId < 12) {
                  setActivePillarId(activePillarId + 1);
                  showToast(`Proceeding to Pillar ${activePillarId + 1}`, "info");
                } else {
                  if (!customerName.trim()) {
                    showToast("Please enter a Customer Name to launch your assessment discovery.", "warning");
                    handleOpenCreateScoping();
                    return;
                  }
                  setShowResults(true);
                  showToast("Assessment complete! Overall results revealed.", "success");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="bg-blue hover:bg-blue-dk text-white px-3.5 py-2 rounded text-xs font-semibold btn-transition shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <span>{activePillarId === 12 ? "Finish" : "Continue to Next Pillar"}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </Modal>

      {/* SCOPING DETAILS POPUP MODAL */}
      <Modal
        isOpen={isScopingModalOpen}
        onClose={() => setIsScopingModalOpen(false)}
        width="480px"
        title={scopingModalMode === "create" ? "Start New Scoping Cycle" : "Edit Scoping Details"}
      >
        <div className="flex flex-col gap-4 text-xs select-text">
          <p className="text-gray-500 leading-relaxed select-none">
            Configure the customer and use case details below to define the parameters of the readiness assessment matrix.
          </p>

          <div className="flex flex-col gap-3.5 mt-1">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between select-none">
                <label className="font-semibold text-gray-700">Customer Name</label>
                {uniqueCustomerNames.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCustomer(!isAddingNewCustomer);
                      if (!isAddingNewCustomer) {
                        setTempCustomerName("");
                      }
                    }}
                    className="text-[10px] text-blue hover:underline font-bold focus:outline-none"
                  >
                    {showCustomerDropdown ? "+ Add New" : "Select Existing"}
                  </button>
                )}
              </div>

              {showCustomerDropdown ? (
                <select
                  value={tempCustomerName}
                  onChange={(e) => {
                    if (e.target.value === "ADD_NEW_CUSTOMER_VALUE") {
                      setIsAddingNewCustomer(true);
                      setTempCustomerName("");
                    } else {
                      setTempCustomerName(e.target.value);
                    }
                  }}
                  className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none bg-gray-50/30 text-gray-955 font-semibold cursor-pointer text-xs"
                >
                  <option value="">-- Select Customer --</option>
                  {uniqueCustomerNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value="ADD_NEW_CUSTOMER_VALUE" className="text-blue font-bold">
                    + Add New Customer...
                  </option>
                </select>
              ) : (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g., Mayo Clinic, Northside Payer"
                    value={tempCustomerName}
                    onChange={(e) => setTempCustomerName(e.target.value)}
                    className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none bg-gray-50/30 text-gray-900 text-xs w-full pr-8"
                  />
                  {uniqueCustomerNames.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewCustomer(false);
                        setTempCustomerName("");
                      }}
                      className="absolute right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      title="Cancel adding new customer"
                    >
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 select-none">Industry Segment</label>
              <select
                value={tempSegment}
                onChange={(e) => setTempSegment(e.target.value)}
                className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none bg-gray-50/30 text-gray-955 font-semibold cursor-pointer text-xs"
              >
                <option>Provider (Hospitals & Clinics)</option>
                <option>Payer (Insurance & Finance)</option>
                <option>Life Sciences (Pharmaceuticals)</option>
                <option>MedTech & Devices</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 select-none">Use Case Description</label>
              <input
                type="text"
                placeholder="e.g., Clinical trial participant screening"
                value={tempUseCase}
                onChange={(e) => setTempUseCase(e.target.value)}
                className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none bg-gray-50/30 text-gray-900 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 select-none">Assessment Name / Cycle</label>
              <input
                type="text"
                placeholder="e.g., Initial discovery, Q3 Security Review"
                value={tempAssessmentName}
                onChange={(e) => setTempAssessmentName(e.target.value)}
                className="border border-gray-200 rounded p-2 focus:border-blue focus:outline-none bg-gray-50/30 text-gray-900 text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-gray-150 mt-3 select-none">
            {scopingModalMode === "create" && (
              <button
                type="button"
                onClick={() => {
                  const demoPool = [
                    {
                      customer: "Johns Hopkins Medicine",
                      segment: "Provider (Hospitals & Clinics)",
                      useCase: "Clinical Oncology Prognosis AI Model",
                      cycle: "AI Scoping Discovery",
                      scoresOffset: 1
                    },
                    {
                      customer: "Mass General Brigham",
                      segment: "Provider (Hospitals & Clinics)",
                      useCase: "Cardiology Patient Risk Stratification",
                      cycle: "Q3 Clinical Pilot",
                      scoresOffset: 2
                    },
                    {
                      customer: "Kaiser Permanente",
                      segment: "Payer (Health Insurance)",
                      useCase: "Automated Prior Authorization Co-Pilot",
                      cycle: "Enterprise AI Assessment",
                      scoresOffset: 3
                    },
                    {
                      customer: "Stanford Medicine",
                      segment: "Provider (Hospitals & Clinics)",
                      useCase: "Clinical Trial Eligibility Matching Co-Pilot",
                      cycle: "Initial Scoping Review",
                      scoresOffset: 0
                    }
                  ];
                  // Pick demo based on current list length to ensure rotation
                  const selectedDemo = demoPool[savedList.length % demoPool.length];

                  let finalCustomerName = selectedDemo.customer;
                  const combinationExists = savedList.some(item => 
                    item.customerName.toLowerCase() === finalCustomerName.toLowerCase() &&
                    item.assessmentName.toLowerCase() === selectedDemo.cycle.toLowerCase()
                  );

                  if (combinationExists) {
                    finalCustomerName = `${finalCustomerName} #${Math.floor(Math.random() * 900 + 100)}`;
                  }

                  setCustomerName(finalCustomerName);
                  setSegment(selectedDemo.segment);
                  setUseCase(selectedDemo.useCase);
                  setAssessmentName(selectedDemo.cycle);
                  
                  const slug = finalCustomerName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const cycleSlug = selectedDemo.cycle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const newId = `${slug}-${cycleSlug}-${Date.now().toString().slice(-4)}`;
                  setActiveAssessmentId(newId);
                  setActivePillarId(1);
                  setShowResults(false);

                  // Generate realistic answers for all questions (different choices for a different report output)
                  const mockAnswers: Record<number, number | number[]> = {};
                  pillarsData.forEach(p => {
                    p.questions.forEach(q => {
                      if (q.type === "Multi-Select") {
                        mockAnswers[q.id] = [ (q.id + selectedDemo.scoresOffset) % 4, (q.id + selectedDemo.scoresOffset + 2) % 4 ];
                      } else {
                        const choices = [1, 2, 3];
                        mockAnswers[q.id] = choices[(q.id + selectedDemo.scoresOffset) % 3];
                      }
                    });
                  });
                  saveAnswersState(mockAnswers);
                  localStorage.setItem(`hcls_usecase_readiness_answers_${newId}`, JSON.stringify(mockAnswers));

                  // Auto-save the scoping metadata to saved history in local storage
                  const score = Math.round((Math.random() * 20) + 60); // mock a realistic score for preview
                  const archTitle = score <= 50 ? "No-Code / Out-of-the-Box Path" : (score <= 75 ? "Managed Framework Path" : "Custom Enterprise Agentic Path");
                  const newDemoAssessment: SavedReadinessAssessment = {
                    id: newId,
                    customerName: finalCustomerName,
                    segment: selectedDemo.segment,
                    useCase: selectedDemo.useCase,
                    assessmentName: selectedDemo.cycle,
                    answers: mockAnswers,
                    score,
                    archetype: archTitle,
                    updatedAt: new Date().toLocaleDateString()
                  };
                  const updatedList = [newDemoAssessment, ...savedList.filter(item => item.customerName !== finalCustomerName)];
                  setSavedList(updatedList);
                  localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(updatedList));
                  
                  setIsScopingModalOpen(false);
                  showToast(`Launched assessment with prefilled demo data for ${selectedDemo.customer}!`, "success");
                }}
                className="border border-amber text-amber-700 hover:bg-amber-50/50 px-3 py-2 rounded text-xs font-semibold btn-transition mr-auto"
                title="Automatically prefill mockup customer name, segment, use case description, and complete all questions"
              >
                <i className="fa-solid fa-wand-magic-sparkles mr-1 text-[10px]"></i>
                <span>Prefill Demo Data</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsScopingModalOpen(false)}
              className="border border-gray-250 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded text-xs font-semibold btn-transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartScoping}
              className="bg-blue hover:bg-blue-dk text-white px-4 py-2 rounded text-xs font-semibold btn-transition shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>{scopingModalMode === "create" ? "Launch Assessment" : "Save Details"}</span>
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </Modal>

      {/* RECOMMENDATION BLUEPRINT MODAL */}
      <Modal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
        width="600px"
        title="Optimal Architecture Blueprint Recommendation"
      >
        <div className="bg-white p-2 grid grid-cols-1 md:grid-cols-12 gap-6 items-center select-text">
          <div className="md:col-span-4 flex flex-col items-center justify-center py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E8EAED" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={isScopingValid ? (finalScore >= 75 ? "#3B6D11" : finalScore >= 40 ? "#854F0B" : "#A32D2D") : "#9AA0A6"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * (isScopingValid ? finalScore : 0)) / 100}
                  className="transition-all duration-700 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col items-center leading-none z-10 select-none">
                <span className="text-4xl font-extrabold text-gray-900">
                  {isScopingValid ? `${finalScore}%` : "--"}
                </span>
                <span className="text-[10px] text-gray-400 font-bold mt-1 tracking-wide">OVERALL</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Calculated Archetype:</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${archetype.color}`}>
                {archetype.title}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              {isScopingValid ? "Recommended Architectural Blueprint" : "Scoping In-Progress"}
            </h3>
            <p className="text-xs text-gray-550 leading-relaxed font-medium">
              {archetype.description}
            </p>
            
            <div className="bg-gray-50 border border-gray-150 rounded-lg p-3 flex flex-col gap-2 text-xs mt-1">
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Completed Pillars:</span>
                <span className="font-bold text-gray-950">{completedPillarsCount} of 12</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue h-full transition-all duration-300"
                  style={{ width: `${(completedPillarsCount / 12) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-150 mt-4 select-none">
          <button
            onClick={() => setIsBlueprintModalOpen(false)}
            className="bg-blue hover:bg-blue-dk text-white px-4 py-2.5 rounded text-xs font-bold btn-transition shadow-sm uppercase tracking-wider"
          >
            Close Blueprint
          </button>
        </div>
      </Modal>

    </div>
  );
}

export default function UsecaseReadinessPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-gray-500 font-bold select-none">Loading readiness discovery...</div>}>
      <UsecaseReadinessContent />
    </React.Suspense>
  );
}


