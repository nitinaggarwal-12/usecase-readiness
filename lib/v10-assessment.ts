export interface V10Option {
  id: number;
  text: string;
  score: number;
  blockerTrigger?: string;
  recommendationTrigger?: string;
  architectureImplication?: string;
  impactTag?: string;
}

export interface V10Question {
  questionId: string;
  dimension: string;
  question: string;
  persona: "Business" | "Technical" | "System";
  weightWithinPillar: number;
  responseType: "Single Select" | "Multi Select" | "Auto";
  notes: string;
  options: V10Option[];
}

export interface V10Pillar {
  pillarId: string;
  pillar: string;
  overallWeightPoints: number;
  primaryPersona: "Business" | "Technical" | "System";
  purpose: string;
  questions: V10Question[];
}

export interface V10ScoringLogic {
  priorityScoreFormula: string;
  bands: {
    launchNow: string;
    validate: string;
    incubate: string;
    hold: string;
  };
  hardBlockers: string[];
  evidenceMode: string;
}

export const v10ScoringRules: V10ScoringLogic = {
  priorityScoreFormula: "0.25*Business Value + 0.20*Gemini Activation + 0.15*Technical Readiness + 0.15*Strategic + 0.15*Opportunity Cost + 0.10*Change Readiness",
  bands: {
    launchNow: "Overall Priority Score 85-100 and no hard blockers.",
    validate: "Overall Priority Score 70-84 or high value with manageable blockers.",
    incubate: "Overall Priority Score 50-69 or promising but immature / needs discovery.",
    hold: "Overall Priority Score below 50 or unresolved hard blocker."
  },
  hardBlockers: [
    "No KPI",
    "No sponsor",
    "Unknown compliance",
    "No source ownership",
    "No viable connector path",
    "Mission-critical decisioning without controls"
  ],
  evidenceMode: "For Phase 1, evidence optional. For future funding/governance gate, require owner, KPI baseline, source inventory, compliance path, architecture option, and rollout plan."
};

export const v10Pillars: V10Pillar[] = [
  {
    pillarId: "BV",
    pillar: "Business Value",
    overallWeightPoints: 20,
    primaryPersona: "Business",
    purpose: "Should we do it? Value and measurable outcome.",
    questions: [
      {
        questionId: "Q1",
        dimension: "Business Outcome",
        question: "Which outcome best describes the expected benefit?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Primary value type for the use case.",
        options: [
          { id: 1, text: "Revenue Growth / New Business Capability", score: 100, impactTag: "Business Value" },
          { id: 2, text: "Major Productivity Improvement", score: 85, impactTag: "Business Value" },
          { id: 3, text: "Cost Avoidance / Compliance", score: 70, impactTag: "Risk Avoidance" },
          { id: 4, text: "Employee Experience Improvement", score: 50, impactTag: "Experience" },
          { 
            id: 5, 
            text: "Convenience Only", 
            score: 25, 
            blockerTrigger: "Potential low-value use case", 
            recommendationTrigger: "Validate if it drives meaningful Gemini activation.", 
            impactTag: "Low Value" 
          },
          { 
            id: 6, 
            text: "Unclear", 
            score: 0, 
            blockerTrigger: "Value not defined", 
            recommendationTrigger: "Require business outcome before prioritization.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q2",
        dimension: "Impact Magnitude",
        question: "Estimated annual impact?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Use directional bands; not CFO-grade ROI.",
        options: [
          { id: 1, text: "Transformational", score: 100 },
          { id: 2, text: "Significant", score: 80 },
          { id: 3, text: "Moderate", score: 50 },
          { id: 4, text: "Minor", score: 25 },
          { 
            id: 5, 
            text: "Unknown", 
            score: 0, 
            blockerTrigger: "Impact unknown", 
            recommendationTrigger: "Estimate expected value range before prioritization.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q3",
        dimension: "KPI Definition",
        question: "Is there a measurable KPI with baseline?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Examples: cycle time, cost, errors, throughput.",
        options: [
          { id: 1, text: "KPI defined with baseline", score: 100 },
          { id: 2, text: "KPI defined, baseline pending", score: 75 },
          { id: 3, text: "KPI identified but not documented", score: 50 },
          { id: 4, text: "KPI being discussed", score: 25 },
          { 
            id: 5, 
            text: "No KPI", 
            score: 0, 
            blockerTrigger: "No measurable success metric", 
            recommendationTrigger: "Define KPI and baseline before moving beyond discovery.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q4",
        dimension: "Manual Work Reduction",
        question: "Does this replace or reduce manual work?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Productivity signal.",
        options: [
          { id: 1, text: "Eliminates substantial manual effort", score: 100 },
          { id: 2, text: "Reduces manual effort significantly", score: 75 },
          { id: 3, text: "Some efficiency improvement", score: 50 },
          { id: 4, text: "Minimal impact", score: 25 },
          { id: 5, text: "No impact", score: 0 }
        ]
      }
    ]
  },
  {
    pillarId: "UI",
    pillar: "User Impact & Gemini Activation",
    overallWeightPoints: 15,
    primaryPersona: "Business",
    purpose: "How many users and how often will Gemini Enterprise be used?",
    questions: [
      {
        questionId: "Q5",
        dimension: "User Population",
        question: "Potential user population?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Estimate impacted Gemini Enterprise users.",
        options: [
          { id: 1, text: ">25,000 users", score: 100 },
          { id: 2, text: "10,000-25,000 users", score: 85 },
          { id: 3, text: "5,000-10,000 users", score: 70 },
          { id: 4, text: "1,000-5,000 users", score: 50 },
          { id: 5, text: "100-1,000 users", score: 30 },
          { id: 6, text: "<100 users", score: 10 }
        ]
      },
      {
        questionId: "Q6",
        dimension: "Usage Frequency",
        question: "Expected usage frequency?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Activation depends on repeat usage.",
        options: [
          { id: 1, text: "Multiple times per day", score: 100 },
          { id: 2, text: "Daily", score: 80 },
          { id: 3, text: "Weekly", score: 50 },
          { id: 4, text: "Monthly", score: 30 },
          { id: 5, text: "Rarely", score: 10 }
        ]
      },
      {
        questionId: "Q7",
        dimension: "Workflow Criticality",
        question: "Where does it sit in the user workflow?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Higher if embedded in daily work.",
        options: [
          { id: 1, text: "Mission-critical workflow", score: 100 },
          { id: 2, text: "Important operational workflow", score: 75 },
          { id: 3, text: "Supporting workflow", score: 50 },
          { id: 4, text: "Nice to have", score: 25 },
          { id: 5, text: "Experimental", score: 10 }
        ]
      },
      {
        questionId: "Q8",
        dimension: "Gemini Adoption Impact",
        question: "Will this drive Gemini Enterprise adoption?",
        persona: "Business",
        weightWithinPillar: 25,
        responseType: "Single Select",
        notes: "Measures visible end-user value.",
        options: [
          { id: 1, text: "Major Gemini adoption driver", score: 100 },
          { id: 2, text: "Strong adoption driver", score: 80 },
          { id: 3, text: "Moderate adoption driver", score: 50 },
          { id: 4, text: "Low adoption impact", score: 25 },
          { 
            id: 5, 
            text: "No adoption impact", 
            score: 0, 
            blockerTrigger: "Low activation impact", 
            recommendationTrigger: "Confirm why this should be delivered via Gemini Enterprise.", 
            impactTag: "Activation Risk" 
          }
        ]
      }
    ]
  },
  {
    pillarId: "SI",
    pillar: "Strategic Importance",
    overallWeightPoints: 10,
    primaryPersona: "Business",
    purpose: "Alignment to Merck priorities and executive sponsorship.",
    questions: [
      {
        questionId: "Q9",
        dimension: "Executive Sponsorship",
        question: "Executive sponsorship level?",
        persona: "Business",
        weightWithinPillar: 50,
        responseType: "Single Select",
        notes: "Sponsor seniority and commitment.",
        options: [
          { id: 1, text: "C-level sponsor committed", score: 100 },
          { id: 2, text: "VP sponsor committed", score: 75 },
          { id: 3, text: "Director sponsor committed", score: 50 },
          { id: 4, text: "Manager sponsor", score: 25 },
          { 
            id: 5, 
            text: "No sponsor", 
            score: 0, 
            blockerTrigger: "No accountable sponsor", 
            recommendationTrigger: "Identify business sponsor before prioritizing.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q10",
        dimension: "Strategic Alignment",
        question: "Alignment to Merck strategic priorities?",
        persona: "Business",
        weightWithinPillar: 50,
        responseType: "Single Select",
        notes: "Tie to enterprise initiatives.",
        options: [
          { id: 1, text: "Directly supports corporate strategy", score: 100 },
          { id: 2, text: "Strong alignment", score: 75 },
          { id: 3, text: "Partial alignment", score: 50 },
          { id: 4, text: "Weak alignment", score: 25 },
          { id: 5, text: "No alignment", score: 0 }
        ]
      }
    ]
  },
  {
    pillarId: "OC",
    pillar: "Opportunity Cost",
    overallWeightPoints: 10,
    primaryPersona: "Business",
    purpose: "What Merck loses if the use case is not done.",
    questions: [
      {
        questionId: "Q11",
        dimension: "Impact if Not Implemented",
        question: "If this is never implemented, what is the impact?",
        persona: "Business",
        weightWithinPillar: 50,
        responseType: "Single Select",
        notes: "Loss / risk / delay created by inaction.",
        options: [
          { id: 1, text: "Major business impact", score: 100 },
          { id: 2, text: "Competitive disadvantage", score: 85 },
          { id: 3, text: "Significant productivity loss", score: 70 },
          { id: 4, text: "Moderate inefficiency", score: 50 },
          { id: 5, text: "Minor inconvenience", score: 25 },
          { id: 6, text: "No material impact", score: 0 }
        ]
      },
      {
        questionId: "Q12",
        dimension: "Competing Solution",
        question: "Is a competing solution emerging outside Gemini Enterprise?",
        persona: "Business",
        weightWithinPillar: 50,
        responseType: "Single Select",
        notes: "Shadow IT / alternative platform risk.",
        options: [
          { 
            id: 1, 
            text: "Already deployed elsewhere / shadow IT active", 
            score: 100, 
            blockerTrigger: "Platform leakage risk", 
            recommendationTrigger: "Prioritize Gemini Enterprise positioning and migration path.", 
            impactTag: "Competitive Risk" 
          },
          { id: 2, text: "Planned elsewhere", score: 75 },
          { id: 3, text: "Under discussion", score: 50 },
          { id: 4, text: "Possible but not active", score: 25 },
          { id: 5, text: "No known alternatives", score: 0 }
        ]
      }
    ]
  },
  {
    pillarId: "DK",
    pillar: "Data & Knowledge Sources",
    overallWeightPoints: 10,
    primaryPersona: "Technical",
    purpose: "Source availability, connector readiness, data quality, ownership.",
    questions: [
      {
        questionId: "Q13",
        dimension: "Source Systems",
        question: "Primary knowledge/data sources?",
        persona: "Technical",
        weightWithinPillar: 40,
        responseType: "Multi Select",
        notes: "Score is system-calculated from connector readiness.",
        options: [
          { id: 1, text: "SharePoint", score: 100, architectureImplication: "Gemini Enterprise + SharePoint connector", impactTag: "Connector" },
          { id: 2, text: "OneDrive", score: 100, architectureImplication: "Gemini Enterprise + OneDrive connector", impactTag: "Connector" },
          { id: 3, text: "Teams", score: 100, architectureImplication: "Gemini Enterprise + Microsoft connectors where supported", impactTag: "Connector" },
          { id: 4, text: "ServiceNow", score: 85, architectureImplication: "Gemini Enterprise connector or API/MCP", impactTag: "Connector" },
          { id: 5, text: "Salesforce", score: 85, architectureImplication: "Connector/API/MCP depending on availability", impactTag: "Connector" },
          { id: 6, text: "BigQuery", score: 100, architectureImplication: "Gemini Enterprise + BigQuery grounding / BigQuery data canvas", impactTag: "Native GCP" },
          { id: 7, text: "SQL Database", score: 70, architectureImplication: "Database connector / Data Canvas / BigQuery federation", impactTag: "Database" },
          { id: 8, text: "Custom API", score: 60, architectureImplication: "MCP server or custom API tool", impactTag: "MCP" },
          { 
            id: 9, 
            text: "SAP", 
            score: 50, 
            blockerTrigger: "Connector may need alternative path", 
            recommendationTrigger: "Use API/MCP or bring-your-own layer if native connector not available.", 
            architectureImplication: "MCP/API", 
            impactTag: "Connector Risk" 
          },
          { 
            id: 10, 
            text: "Veeva", 
            score: 50, 
            blockerTrigger: "Likely connector gap", 
            recommendationTrigger: "Use API export, MCP server, or governed ingestion pattern.", 
            architectureImplication: "MCP/API/BigQuery", 
            impactTag: "Connector Risk" 
          },
          { 
            id: 11, 
            text: "File Shares", 
            score: 30, 
            blockerTrigger: "Source governance may be weak", 
            recommendationTrigger: "Move to governed repository or indexed corpus.", 
            architectureImplication: "Connector/Ingestion", 
            impactTag: "Data Risk" 
          },
          { 
            id: 12, 
            text: "Email", 
            score: 20, 
            blockerTrigger: "Email grounding may have privacy and consent constraints", 
            recommendationTrigger: "Validate Microsoft mail source support and governance.", 
            architectureImplication: "Connector/API", 
            impactTag: "Security Risk" 
          },
          { 
            id: 13, 
            text: "Other", 
            score: 20, 
            blockerTrigger: "Unknown source readiness", 
            recommendationTrigger: "Assess source access, API, ownership, security.", 
            architectureImplication: "TBD", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q14",
        dimension: "Data Quality",
        question: "Data quality level?",
        persona: "Technical",
        weightWithinPillar: 30,
        responseType: "Single Select",
        notes: "Quality and reliability of source content.",
        options: [
          { id: 1, text: "High confidence", score: 100 },
          { id: 2, text: "Good quality", score: 75 },
          { id: 3, text: "Mixed quality", score: 50 },
          { 
            id: 4, 
            text: "Poor quality", 
            score: 25, 
            blockerTrigger: "Data quality risk", 
            recommendationTrigger: "Add cleansing, source stewardship, and evaluation plan.", 
            impactTag: "Data Risk" 
          },
          { 
            id: 5, 
            text: "Unknown", 
            score: 0, 
            blockerTrigger: "Data quality unknown", 
            recommendationTrigger: "Profile data before prioritization.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q15",
        dimension: "Source Ownership",
        question: "Knowledge source ownership?",
        persona: "Technical",
        weightWithinPillar: 30,
        responseType: "Single Select",
        notes: "Who owns source content and access approvals?",
        options: [
          { id: 1, text: "Clear owner and process", score: 100 },
          { id: 2, text: "Clear owner only", score: 75 },
          { id: 3, text: "Shared ownership", score: 50 },
          { 
            id: 4, 
            text: "Ownership unclear", 
            score: 25, 
            blockerTrigger: "Source owner unclear", 
            recommendationTrigger: "Identify data/context owner and approval path.", 
            impactTag: "Ownership Risk" 
          },
          { 
            id: 5, 
            text: "Unknown", 
            score: 0, 
            blockerTrigger: "No source ownership", 
            recommendationTrigger: "Require owner before production path.", 
            impactTag: "Blocker" 
          }
        ]
      }
    ]
  },
  {
    pillarId: "SC",
    pillar: "Security / Compliance / GxP",
    overallWeightPoints: 10,
    primaryPersona: "Technical",
    purpose: "Data sensitivity, regulatory impact, human review needs.",
    questions: [
      {
        questionId: "Q16",
        dimension: "Data Classification",
        question: "Data classification?",
        persona: "Technical",
        weightWithinPillar: 30,
        responseType: "Single Select",
        notes: "Used for readiness and complexity. Lower score means more controls required, not lower value.",
        options: [
          { id: 1, text: "Public", score: 100 },
          { id: 2, text: "Internal", score: 80 },
          { id: 3, text: "Confidential", score: 60 },
          { 
            id: 4, 
            text: "PII", 
            score: 40, 
            blockerTrigger: "Sensitive data controls required", 
            recommendationTrigger: "Confirm PII controls, audit, access, retention.", 
            architectureImplication: "Gemini Enterprise + governance controls", 
            impactTag: "Compliance" 
          },
          { 
            id: 5, 
            text: "GxP", 
            score: 20, 
            blockerTrigger: "GxP controls required", 
            recommendationTrigger: "Assess validation, SOP, audit, and human review requirements.", 
            architectureImplication: "Gemini + ADE + validation", 
            impactTag: "GxP" 
          },
          { 
            id: 6, 
            text: "Regulatory forbidden", 
            score: 0, 
            blockerTrigger: "High regulatory impact", 
            recommendationTrigger: "Require compliance/legal review, validation, evidence trail.", 
            architectureImplication: "Gemini + ADE/HITL + audit", 
            impactTag: "High Control" 
          }
        ]
      },
      {
        questionId: "Q17",
        dimension: "Regulatory Clarity",
        question: "Regulatory / compliance requirements understood?",
        persona: "Technical",
        weightWithinPillar: 35,
        responseType: "Single Select",
        notes: "GxP, audit, legal, retention, validation needs.",
        options: [
          { id: 1, text: "Fully documented", score: 100 },
          { id: 2, text: "Mostly understood", score: 75 },
          { id: 3, text: "Partially understood", score: 50 },
          { 
            id: 4, 
            text: "Unknown", 
            score: 0, 
            blockerTrigger: "Compliance requirements unknown", 
            recommendationTrigger: "Clarify regulatory requirements before prioritization.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q18",
        dimension: "Human Review",
        question: "Human review requirements defined?",
        persona: "Technical",
        weightWithinPillar: 35,
        responseType: "Single Select",
        notes: "Human-in-the-loop clarity.",
        options: [
          { id: 1, text: "Clearly defined", score: 100 },
          { id: 2, text: "Mostly defined", score: 75 },
          { id: 3, text: "Likely required", score: 50 },
          { 
            id: 4, 
            text: "Undefined", 
            score: 0, 
            blockerTrigger: "Human review path unknown", 
            recommendationTrigger: "Define HITL and escalation model.", 
            architectureImplication: "ADE + human review", 
            impactTag: "Blocker" 
          }
        ]
      }
    ]
  },
  {
    pillarId: "TF",
    pillar: "Technical Feasibility",
    overallWeightPoints: 10,
    primaryPersona: "Technical",
    purpose: "Fit of use-case pattern, accuracy, integration complexity.",
    questions: [
      {
        questionId: "Q19",
        dimension: "Use Case Pattern",
        question: "Primary use case pattern?",
        persona: "Technical",
        weightWithinPillar: 40,
        responseType: "Single Select",
        notes: "Used to infer architecture.",
        options: [
          { id: 1, text: "Search", score: 100, architectureImplication: "Gemini Enterprise + connector", impactTag: "Low Complexity" },
          { id: 2, text: "Summarization", score: 85, architectureImplication: "Gemini Enterprise + connector", impactTag: "Low Complexity" },
          { id: 3, text: "Content Generation", score: 70, architectureImplication: "Gemini Enterprise + connector / RAG", impactTag: "Medium Complexity" },
          { id: 4, text: "Workflow Automation", score: 50, architectureImplication: "Gemini + ADE + tools / MCP", impactTag: "Medium Complexity" },
          { 
            id: 5, 
            text: "Decision Support", 
            score: 35, 
            blockerTrigger: "Requires evaluation and controls", 
            recommendationTrigger: "Define accuracy, evidence, and human review.", 
            architectureImplication: "Gemini + ADE + HITL", 
            impactTag: "Control Risk" 
          },
          { id: 6, text: "Single Agent", score: 65, architectureImplication: "Gemini + ADE + tools / MCP", impactTag: "Medium Complexity" },
          { 
            id: 7, 
            text: "Multi-Agent", 
            score: 50, 
            blockerTrigger: "Higher architecture complexity", 
            recommendationTrigger: "Validate whether multi-agent is necessary; start simple.", 
            architectureImplication: "Gemini + ADE + Agent + MCP", 
            impactTag: "High Complexity" 
          }
        ]
      },
      {
        questionId: "Q20",
        dimension: "Accuracy Requirement",
        question: "Expected accuracy / consequence level?",
        persona: "Technical",
        weightWithinPillar: 30,
        responseType: "Single Select",
        notes: "High consequence requires more controls and evaluation.",
        options: [
          { id: 1, text: "Advisory only", score: 100 },
          { id: 2, text: "Business important", score: 80 },
          { 
            id: 3, 
            text: "High consequence", 
            score: 50, 
            blockerTrigger: "High consequence output", 
            recommendationTrigger: "Add evaluation, controls, and human review.", 
            impactTag: "Risk" 
          },
          { 
            id: 4, 
            text: "Mission-critical decisioning", 
            score: 0, 
            blockerTrigger: "Mission-critical decision risk", 
            recommendationTrigger: "Require HITL, testing, auditability, and formal approval path.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q21",
        dimension: "Integration Complexity",
        question: "Integration complexity?",
        persona: "Technical",
        weightWithinPillar: 30,
        responseType: "Single Select",
        notes: "Number of systems / tools involved.",
        options: [
          { id: 1, text: "1-2 systems", score: 100 },
          { id: 2, text: "3-5 systems", score: 75 },
          { 
            id: 3, 
            text: "6-10 systems", 
            score: 50, 
            blockerTrigger: "High integration complexity", 
            recommendationTrigger: "Phase scope; prioritize high-value sources first.", 
            impactTag: "Complexity Risk" 
          },
          { 
            id: 4, 
            text: ">10 systems", 
            score: 0, 
            blockerTrigger: "Very high integration complexity", 
            recommendationTrigger: "Split into smaller use cases or platform program.", 
            impactTag: "Blocker" 
          }
        ]
      }
    ]
  },
  {
    pillarId: "AC",
    pillar: "Architecture Complexity",
    overallWeightPoints: 5,
    primaryPersona: "Technical",
    purpose: "Complexity of orchestration, agents, latency.",
    questions: [
      {
        questionId: "Q22",
        dimension: "Workflow Complexity",
        question: "Workflow / orchestration complexity?",
        persona: "Technical",
        weightWithinPillar: 50,
        responseType: "Single Select",
        notes: "Prompt -> RAG -> agent -> multi-agent.",
        options: [
          { id: 1, text: "Prompt only", score: 100, architectureImplication: "Gemini Enterprise only", impactTag: "Low Complexity" },
          { id: 2, text: "Grounded Gemini", score: 85, architectureImplication: "Gemini Enterprise + connector", impactTag: "Low Complexity" },
          { id: 3, text: "RAG", score: 70, architectureImplication: "Gemini + connectors / Vertex AI Search or Vector Search", impactTag: "Medium Complexity" },
          { id: 4, text: "Single Agent", score: 50, architectureImplication: "Gemini + ADE + tools", impactTag: "Medium Complexity" },
          { 
            id: 5, 
            text: "Multi-Agent", 
            score: 30, 
            blockerTrigger: "Multi-agent orchestration required", 
            recommendationTrigger: "Validate orchestration needs; design agent contracts.", 
            architectureImplication: "Gemini + ADE + MCP", 
            impactTag: "High Complexity" 
          },
          { 
            id: 6, 
            text: "Multi-Agent + Human Review", 
            score: 10, 
            blockerTrigger: "High-control orchestration required", 
            recommendationTrigger: "Define HITL, audit, failure modes, and validation.", 
            architectureImplication: "Gemini + ADE + Agent + HITL", 
            impactTag: "High Risk" 
          }
        ]
      },
      {
        questionId: "Q23",
        dimension: "Latency Requirement",
        question: "Latency / response-time requirement?",
        persona: "Technical",
        weightWithinPillar: 50,
        responseType: "Single Select",
        notes: "Sub-second indicates potential mismatch.",
        options: [
          { id: 1, text: "Minutes", score: 100 },
          { id: 2, text: "Seconds", score: 80 },
          { id: 3, text: "Near real-time", score: 50 },
          { 
            id: 4, 
            text: "Sub-second", 
            score: 0, 
            blockerTrigger: "Sub-second requirement may not fit Gemini app pattern", 
            recommendationTrigger: "Clarify whether sub-second is truly required; consider specialized architecture.", 
            impactTag: "Architecture Risk" 
          }
        ]
      }
    ]
  },
  {
    pillarId: "PR",
    pillar: "Platform Readiness",
    overallWeightPoints: 5,
    primaryPersona: "System",
    purpose: "Auto-calculated from connector catalog and architecture patterns.",
    questions: [
      {
        questionId: "Q24",
        dimension: "Connector Availability",
        question: "Connector availability?",
        persona: "System",
        weightWithinPillar: 50,
        responseType: "Auto",
        notes: "Calculated from Connector_Catalog and selected sources.",
        options: [
          { id: 1, text: "Native connector available", score: 100 },
          { id: 2, text: "Alternative available", score: 75 },
          { 
            id: 3, 
            text: "Custom build required", 
            score: 10, 
            blockerTrigger: "Custom connector effort", 
            recommendationTrigger: "Estimate MCP/API build effort and ownership.", 
            architectureImplication: "MCP/API", 
            impactTag: "Connector Risk" 
          },
          { 
            id: 4, 
            text: "No viable path", 
            score: 0, 
            blockerTrigger: "No connector or viable access path", 
            recommendationTrigger: "Do not prioritize until source access path exists.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q25",
        dimension: "Pattern Availability",
        question: "Existing architecture pattern exists?",
        persona: "System",
        weightWithinPillar: 50,
        responseType: "Auto",
        notes: "Calculated from Architecture_Rules.",
        options: [
          { id: 1, text: "Proven pattern exists", score: 100 },
          { id: 2, text: "Similar pattern exists", score: 75 },
          { 
            id: 3, 
            text: "New / custom pattern", 
            score: 50, 
            blockerTrigger: "Architecture pattern unproven", 
            recommendationTrigger: "Run discovery / spike / prototype.", 
            impactTag: "Incubate" 
          },
          { 
            id: 4, 
            text: "No known pattern", 
            score: 0, 
            blockerTrigger: "No known pattern", 
            recommendationTrigger: "Treat as research / innovation candidate.", 
            impactTag: "Research" 
          }
        ]
      }
    ]
  },
  {
    pillarId: "CM",
    pillar: "Change Management",
    overallWeightPoints: 5,
    primaryPersona: "Business",
    purpose: "Training, process change, champions, rollout, success measurement.",
    questions: [
      {
        questionId: "Q26",
        dimension: "Training Effort",
        question: "User training effort?",
        persona: "Business",
        weightWithinPillar: 20,
        responseType: "Single Select",
        notes: "Lower effort improves rollout readiness.",
        options: [
          { id: 1, text: "Low training effort", score: 100 },
          { id: 2, text: "Moderate training effort", score: 75 },
          { id: 3, text: "High training effort", score: 40 },
          { 
            id: 4, 
            text: "Unknown", 
            score: 0, 
            blockerTrigger: "Training effort unknown", 
            recommendationTrigger: "Define enablement plan before scale rollout.", 
            impactTag: "Adoption Risk" 
          }
        ]
      },
      {
        questionId: "Q27",
        dimension: "Process Change",
        question: "Process change required?",
        persona: "Business",
        weightWithinPillar: 20,
        responseType: "Single Select",
        notes: "Lower change burden improves adoption.",
        options: [
          { id: 1, text: "Minimal process change", score: 100 },
          { id: 2, text: "Moderate process change", score: 75 },
          { 
            id: 3, 
            text: "Major process change", 
            score: 40, 
            blockerTrigger: "Significant process change", 
            recommendationTrigger: "Add change plan and business process owner.", 
            impactTag: "Change Risk" 
          },
          { 
            id: 4, 
            text: "Process impact unknown", 
            score: 0, 
            blockerTrigger: "Process impact unknown", 
            recommendationTrigger: "Map current and future workflow.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q28",
        dimension: "Champion Network",
        question: "Champion network available?",
        persona: "Business",
        weightWithinPillar: 20,
        responseType: "Single Select",
        notes: "Department AI champions / super users.",
        options: [
          { id: 1, text: "Active champion network available", score: 100 },
          { id: 2, text: "Some champions available", score: 75 },
          { id: 3, text: "Champions need to be recruited", score: 40 },
          { 
            id: 4, 
            text: "No champion network", 
            score: 0, 
            blockerTrigger: "No champion network", 
            recommendationTrigger: "Identify champions for pilot and rollout.", 
            impactTag: "Adoption Risk" 
          }
        ]
      },
      {
        questionId: "Q29",
        dimension: "Rollout Strategy",
        question: "Rollout strategy defined?",
        persona: "Business",
        weightWithinPillar: 20,
        responseType: "Single Select",
        notes: "Pilot, phased rollout, comms.",
        options: [
          { id: 1, text: "Rollout strategy defined", score: 100 },
          { id: 2, text: "Pilot plan defined", score: 70 },
          { id: 3, text: "Rollout approach being discussed", score: 40 },
          { 
            id: 4, 
            text: "No rollout strategy", 
            score: 0, 
            blockerTrigger: "No rollout strategy", 
            recommendationTrigger: "Define pilot, phased rollout, and communications plan.", 
            impactTag: "Blocker" 
          }
        ]
      },
      {
        questionId: "Q30",
        dimension: "Success Measurement",
        question: "Success measurement plan defined?",
        persona: "Business",
        weightWithinPillar: 20,
        responseType: "Single Select",
        notes: "KPIs, telemetry, survey, adoption metrics.",
        options: [
          { id: 1, text: "Success measurement plan defined", score: 100 },
          { id: 2, text: "Metrics identified but plan pending", score: 70 },
          { id: 3, text: "Metrics being discussed", score: 40 },
          { 
            id: 4, 
            text: "No measurement plan", 
            score: 0, 
            blockerTrigger: "No measurement plan", 
            recommendationTrigger: "Define adoption, value, quality, and satisfaction metrics.", 
            impactTag: "Blocker" 
          }
        ]
      }
    ]
  }
];
