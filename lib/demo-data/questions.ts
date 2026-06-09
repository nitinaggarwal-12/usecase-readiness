export interface QuestionOption {
  text: string;
  score: number;
  triggersBlocker?: boolean;
  blockerTitle?: string;
  blockerMsg?: string;
}

export interface Question {
  id: number;
  text: string;
  context?: string;
  options: QuestionOption[];
  coachingTip: string;
}

export const questionsMap: Record<string, Question[]> = {
  A: [
    {
      id: 1,
      text: "How is the clinical AI use case aligned with the health system's executive goals?",
      context: "Aligning AI objectives with C-suite pain points is crucial to secure long-term capital approval.",
      options: [
        { text: "Option A: Fully aligned with the system's board-mandated priority to reduce physician clinical burnout.", score: 100 },
        { text: "Option B: Aligned with local department-level productivity and optimization goals.", score: 80 },
        { text: "Option C: General pilot explorer project with limited executive visibility.", score: 50 },
        { text: "Option D: Tactical exploration with no executive sponsor or clinical leadership alignment.", score: 20, triggersBlocker: true, blockerTitle: "Alignment Blocker: Missing Executive Sponsor", blockerMsg: "Without executive C-suite alignment, deployments lack capital backing and fail to transition from pilot to production." }
      ],
      coachingTip: "Focus discussions on nurse/physician burnout metrics. Avoid presenting AI as a tool to replace staff; frame it as a support mechanism."
    },
    {
      id: 2,
      text: "What is the level of engagement from the primary clinical sponsor?",
      context: "Active clinical champions ensure user adoption and validation of model outputs.",
      options: [
        { text: "Option A: Chief Medical Officer or Chief Informatics Officer is actively leading weekly scoping meetings.", score: 100 },
        { text: "Option B: Clinical director is assigned as primary contact with moderate meeting availability.", score: 75 },
        { text: "Option C: Informal support from individual attending physicians with no formal scoping role.", score: 50 },
        { text: "Option D: No clinical sponsor has been identified or involved in scoping discussions.", score: 10, triggersBlocker: true, blockerTitle: "Clinical Blocker: Missing Clinical Sponsor", blockerMsg: "Scoping clinical workflows without direct clinical guidance represents a patient safety risk and prevents FDE gating." }
      ],
      coachingTip: "Establish a weekly joint steering sync. Get written confirmation of their clinical lead's participation prior to nomination."
    },
    {
      id: 3,
      text: "How are the success metrics and clinical KPIs defined for this deployment?",
      options: [
        { text: "Option A: Explicit, quantitative KPIs (e.g. prior auth processing time reduced by 50%) signed off by leadership.", score: 100 },
        { text: "Option B: General operational target metrics identified but not formally signed off.", score: 75 },
        { text: "Option C: Qualitative success criteria defined only (e.g. improved staff satisfaction survey scores).", score: 50 },
        { text: "Option D: Success metrics have not been discussed or defined.", score: 20 }
      ],
      coachingTip: "Anchor business value discussions on hard baselines (e.g. time-to-treatment, charting duration). Refer to the standard HCLS Value Calculator."
    }
  ],
  B: [
    {
      id: 1,
      text: "What are the primary value drivers identified for the business model?",
      context: "Quantifying value drivers determines the projected ROI and pay-back period.",
      options: [
        { text: "Option A: Multiple validated drivers (e.g., $180/hr physician charting time saved, 20% appeal cycle reduction).", score: 100 },
        { text: "Option B: Single primary value driver identified and mapped to departmental budgets.", score: 80 },
        { text: "Option C: Indirect or soft value metrics mapped (e.g. general patient experience score improvements).", score: 50 },
        { text: "Option D: Value model is completely unquantified or missing.", score: 20 }
      ],
      coachingTip: "Use the predefined business value calculator template. Ensure the territory AE signs off on baseline calculations."
    },
    {
      id: 2,
      text: "Is historical baseline data available to measure performance variance?",
      options: [
        { text: "Option A: Yes, verified historical baseline datasets are ready and structured in GCP BigQuery.", score: 100 },
        { text: "Option B: Baseline data exists but requires manual data extraction or audit logs.", score: 70 },
        { text: "Option C: Baseline data must be estimated from industry benchmarks.", score: 50 },
        { text: "Option D: No historical baseline data exists or is accessible.", score: 30 }
      ],
      coachingTip: "Offer GCP architecture support for database migration if baseline records are siloed inside their legacy EHR reporting modules."
    },
    {
      id: 3,
      text: "What is the projected ROI payback timeline approved by the customer's CFO?",
      options: [
        { text: "Option A: CFO requires positive ROI payback in under 12 months, which is fully feasible.", score: 100 },
        { text: "Option B: Expected payback horizon is 12 to 24 months.", score: 80 },
        { text: "Option C: Payback horizon exceeds 2 years or is not key to current pilot decisions.", score: 50 },
        { text: "Option D: CFO has explicitly rejected the current financial projection model.", score: 10, triggersBlocker: true, blockerTitle: "Financial Blocker: CFO Rejection", blockerMsg: "CFO rejection of the ROI payback model halts the pre-sales process and prevents transition to post-sales FDE engineering." }
      ],
      coachingTip: "Re-run the value model using conservative volume and staff savings assumptions. Focus on direct time reclaimed per physician."
    }
  ],
  C: [
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
  ],
  D: [
    {
      id: 1,
      text: "What is the status of the HIPAA Business Associate Agreement (BAA) with Google Cloud?",
      context: "BAA is the absolute legal gate. Without it, zero clinical data can touch Google Cloud APIs.",
      options: [
        { text: "Option A: HIPAA BAA is fully signed and executed for all targeted GCP project billing accounts.", score: 100 },
        { text: "Option B: BAA is in active legal review with standard clauses accepted by customer counsel.", score: 75 },
        { text: "Option C: BAA draft has been submitted to the customer's legal team but review is not started.", score: 50 },
        { text: "Option D: No BAA discussion or draft is currently in progress or planned.", score: 0, triggersBlocker: true, blockerTitle: "Legal Blocker: Missing HIPAA BAA", blockerMsg: "Failure to execute a BAA prevents processing of any protected health information (PHI) on Google Cloud services." }
      ],
      coachingTip: "Provide the customer's legal team with our pre-negotiated corporate BAA template to expedite standard compliance approvals."
    },
    {
      id: 2,
      text: "Are patient data consent policy models configured for generative AI use?",
      options: [
        { text: "Option A: Clear opt-out or opt-in patient consent checkboxes are configured inside their patient portal.", score: 100 },
        { text: "Option B: Standard data use policies cover analytics, but specific gen-AI clauses are under review.", score: 80 },
        { text: "Option C: General data policies exist but have not been audited for AI systems.", score: 60 },
        { text: "Option D: No patient consent mechanism or policy is established for this deployment.", score: 20, triggersBlocker: true, blockerTitle: "Consent Blocker: Missing AI Data Policy", blockerMsg: "Processing clinical transcripts without updated patient data use consents violates regional healthcare compliance guidelines." }
      ],
      coachingTip: "Reference the standard HIPAA 'Secondary Use of Data' guidelines. Share sample patient-facing consent notices used by Mayo Clinic."
    },
    {
      id: 3,
      text: "What IAM and Role-Based Access Control (RBAC) schemas are applied?",
      options: [
        { text: "Option A: Row-level database security with fine-grained IAM roles and full access audit logs.", score: 100 },
        { text: "Option B: Standard IAM resource roles applied without row-level database filters.", score: 80 },
        { text: "Option C: Shared service accounts used across deployment groups with standard logging.", score: 50 },
        { text: "Option D: Open project access with no active IAM restrictions configured.", score: 20 }
      ],
      coachingTip: "Apply the principle of least privilege. Do not grant developers or engineers direct access to BigQuery clinical datasets."
    }
  ],
  E: [
    {
      id: 1,
      text: "Has the customer assigned dedicated technical and project management resources?",
      context: "FDE engagements require active, dedicated counterparts on the customer side to succeed.",
      options: [
        { text: "Option A: Dedicated EHR integration lead and lead cloud architect assigned with 50%+ time allocation.", score: 100 },
        { text: "Option B: Shared IT support resources allocated to the project team on a part-time basis.", score: 75 },
        { text: "Option C: Ad-hoc engineering support available on request without dedicated leads.", score: 40 },
        { text: "Option D: No engineering resources allocated or available for the integration sprint.", score: 15, triggersBlocker: true, blockerTitle: "Resource Blocker: Zero Dedicated Staff", blockerMsg: "Engaging post-sales FDE engineering without dedicated customer technical contacts results in project stalling and is disqualified." }
      ],
      coachingTip: "Ask the CIO to formally designate their lead Epic analyst to be the primary point of contact for the incoming Google FDE."
    },
    {
      id: 2,
      text: "Is there a signed agreement on the joint implementation roadmap?",
      options: [
        { text: "Option A: Yes, joint project plan with explicit dates, milestones, and deliverables signed off by both PMs.", score: 100 },
        { text: "Option B: Core milestones agreed but detail timelines are still being drafted.", score: 80 },
        { text: "Option C: High-level target launch dates exist without individual phase milestones mapped.", score: 50 },
        { text: "Option D: No project timeline or roadmap has been drafted or discussed.", score: 20 }
      ],
      coachingTip: "Draft a shared Gantt chart showing dependencies on sandbox access, VPC tunnels, and clinical testing groups."
    },
    {
      id: 3,
      text: "How aligned is the proposed architecture with Google Cloud's reference model?",
      options: [
        { text: "Option A: Fully aligned, utilizing native Vertex AI APIs, CMEK, and standard GCS landing zones.", score: 100 },
        { text: "Option B: Hybrid setup requiring minor adaptations (e.g. third-party database caching or logging).", score: 75 },
        { text: "Option C: High level of custom development required, deviating significantly from standard reference designs.", score: 50 },
        { text: "Option D: Architecture is completely unresolved or relies on unapproved third-party routing.", score: 20 }
      ],
      coachingTip: "Keep the deployment simple by using pre-packaged Terraform templates from the HCLS architecture catalog."
    }
  ],
  F: [
    {
      id: 1,
      text: "Is the active EHR version compatible with modern API integration patterns?",
      context: "Legacy EHR versions require custom database triggers instead of HL7 interface pipelines.",
      options: [
        { text: "Option A: EHR system runs the latest production-supported version and native US Core FHIR profiles.", score: 100 },
        { text: "Option B: EHR is 1-2 releases behind, requiring custom API endpoints or minor connector updates.", score: 75 },
        { text: "Option C: Legacy EHR version requiring high customization or proprietary middleware.", score: 45 }
      ],
      coachingTip: "Encourage customer to complete their pending EHR patch cycles before executing production sandbox routes."
    },
    {
      id: 2,
      text: "What is the average latency of Vertex AI model orchestration calls?",
      options: [
        { text: "Option A: Under 800ms per transaction, fully compliant with clinical workflow limits.", score: 100 },
        { text: "Option B: Between 800ms and 1500ms, acceptable for batch or back-office tasks.", score: 80 },
        { text: "Option C: Exceeds 1500ms, causing delays in real-time user-facing applications.", score: 40 }
      ],
      coachingTip: "Use Vertex AI endpoint caching and keep model weights warm to prevent initial transaction cold starts."
    }
  ],
  G: [
    {
      id: 1,
      text: "What is the validated daily clinical time savings per physician?",
      context: "Operational time saved is the single most important metric for clinical value confirmation.",
      options: [
        { text: "Option A: Confirmed saving of over 1.5 hours per shift on clinical documentation.", score: 100 },
        { text: "Option B: Average saving of 0.5 to 1.5 hours per shift.", score: 80 },
        { text: "Option C: Negligible charting time reduction (under 30 minutes).", score: 40 }
      ],
      coachingTip: "Conduct direct user surveys and time-motion studies to back up system logs with qualitative user inputs."
    },
    {
      id: 2,
      text: "Is the financial value model tracking to initial pre-sales forecasts?",
      options: [
        { text: "Option A: Value realized matches or exceeds original business case targets.", score: 100 },
        { text: "Option B: Value realized is within 10-20% of target projections.", score: 80 },
        { text: "Option C: Realized value is delayed due to slower physician adoption curves.", score: 55 }
      ],
      coachingTip: "Work with the customer's finance analyst to convert hours saved into direct FTE cost reclamation numbers."
    }
  ],
  H: [
    {
      id: 1,
      text: "What is the active user adoption rate among eligible clinicians?",
      options: [
        { text: "Option A: Over 80% daily active utilization among clinical pilot groups.", score: 100 },
        { text: "Option B: Between 50% and 80% utilization with moderate weekly growth.", score: 75 },
        { text: "Option C: Under 50% utilization due to onboarding friction or training gaps.", score: 40 }
      ],
      coachingTip: "Run dedicated lunch-and-learn training sessions to address initial software usability concerns."
    },
    {
      id: 2,
      text: "What is the Net Promoter Score (NPS) from clinician surveys?",
      options: [
        { text: "Option A: Clinician NPS is high (9 or 10 out of 10), indicating strong satisfaction.", score: 100 },
        { text: "Option B: Neutral NPS (7 or 8 out of 10) with minor feedback on UX.", score: 80 },
        { text: "Option C: Detractor NPS (under 7) due to slow load times or incorrect outputs.", score: 45 }
      ],
      coachingTip: "Fix detached prompt templates or pipeline latencies immediately if users report low scores."
    }
  ],
  I: [
    {
      id: 1,
      text: "Can the current GCP VPC network configuration scale to secondary clinical use cases?",
      options: [
        { text: "Option A: Yes, existing subnets and BAA fully cover expansion use cases.", score: 100 },
        { text: "Option B: Requires minor routing updates or new VPC endpoints.", score: 80 },
        { text: "Option C: Requires a separate network zone setup and distinct security review.", score: 50 }
      ],
      coachingTip: "Design shared VPC subnets from day one to accommodate multiple regional clinic connections."
    },
    {
      id: 2,
      text: "How prioritized is the expansion pipeline by the clinical steering committee?",
      options: [
        { text: "Option A: Clear ranked list of expansion use cases approved by executive sponsors.", score: 100 },
        { text: "Option B: Pipeline proposed but not formally prioritized.", score: 75 },
        { text: "Option C: Expansion is discussed informally without formal committee backing.", score: 45 }
      ],
      coachingTip: "Frame the expansion use cases around the reuse of their existing data integration foundation to save costs."
    }
  ],
  J: [
    {
      id: 1,
      text: "Is the platform recognized as the clinical AI standard across the enterprise?",
      options: [
        { text: "Option A: Fully adopted as the standard clinical AI orchestrator across all network facilities.", score: 100 },
        { text: "Option B: Adopted in primary care facilities with secondary sites scheduled.", score: 80 },
        { text: "Option C: Regional deployment only with no enterprise-wide standard mandate.", score: 55 }
      ],
      coachingTip: "Help the customer set up an internal Center of Excellence (CoE) to build operational scaling guides."
    },
    {
      id: 2,
      text: "Is there an active AI safety and clinical governance board established?",
      options: [
        { text: "Option A: Yes, active clinical safety board meeting monthly with formal review loops.", score: 100 },
        { text: "Option B: Safety board meets quarterly with standard review templates.", score: 75 },
        { text: "Option C: Oversight is handled ad-hoc by general IT security committees.", score: 45 }
      ],
      coachingTip: "Share Google's Responsible AI guidelines to help them draft standard auditing checklists."
    }
  ]
};
