export interface DemoAccount {
  name: string;
  type: string;
  beds?: string;
  physicians?: string;
  members?: string;
  cloud: string;
  ehr: string;
  useCase: string;
  stage: "Pre-Sales" | "Production" | "At-Risk" | "FDE Nominated";
  ce: string;
  ae?: string;
  sa?: string;
  daysToRenewal?: number;
  description?: string;
}

export interface DemoContact {
  name: string;
  role: string;
  quote?: string;
  details?: string;
}

export interface Blocker {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  message: string;
  owner: string;
  timeline: string;
}

export interface FinancialModel {
  volumeLabel: string;
  volume: string;
  currentCostLabel: string;
  currentCost: string;
  projectedCostLabel: string;
  projectedCost: string;
  currentMetricLabel: string;
  currentMetric: string;
  projectedMetricLabel: string;
  projectedMetric: string;
  timeLabel: string;
  currentTime: string;
  projectedTime: string;
  baseValue: string;
  highValue: string;
  payback: string;
}

export interface MarketSignal {
  id: string;
  title: string;
  source: string;
  date: string;
  urgency: "High" | "Medium" | "Low";
  description: string;
}

export interface TimelineMilestone {
  name: string;
  duration: string;
  status: "done" | "prog" | "todo" | "blocked";
  isCriticalPath?: boolean;
}

export interface ExpansionUseCase {
  rank: number;
  useCase: string;
  value: string;
  savings?: string;
}

export interface DemoScenario {
  id: string;
  assessmentName?: string;
  account: DemoAccount;
  contacts: DemoContact[];
  scores: Record<string, number | "prog" | "todo" | "done" | "blk">;
  assignedAssessments?: string[];
  blockers: Blocker[];
  financialModel: FinancialModel;
  marketIntelligence: MarketSignal[];
  timeline: TimelineMilestone[];
  regulatorySignals: string[];
  humanStory?: string;
  closingParagraph?: string;
  expansionUseCases?: ExpansionUseCase[];
}

export const demoScenarios: DemoScenario[] = [
  {
    id: "northside-health",
    account: {
      name: "Northside Health Systems",
      type: "Healthcare Provider · Large",
      beds: "12,000 across 8 facilities",
      cloud: "AWS Primary (70% workload)",
      ehr: "Epic (2023.1)",
      useCase: "Prior Authorization Agent",
      stage: "Pre-Sales",
      ce: "Nitin Chandra",
      ae: "Raj Kumar",
      sa: "Sara Patel"
    },
    contacts: [
      { name: "Dr. James Park", role: "Chief Technology Officer", quote: "Cloud-first mandate. AI in everything." },
      { name: "Lisa Rodriguez", role: "Chief Financial Officer", quote: "Requires payback under 12 months." },
      { name: "Dr. Priya Nair", role: "Chief Medical Officer", quote: "Physician burnout champion." }
    ],
    scores: {
      A: 76,
      B: 68,
      C: 58, // In Progress
      D: 0,  // Not started
      E: 0   // Locked
    },
    blockers: [
      {
        id: "b-1",
        title: "HIPAA BAA Setup Pending Sign-off",
        severity: "critical",
        message: "Clinical scoping completed but patient payloads are blocked pending legal BAA execution.",
        owner: "Legal + CE",
        timeline: "3–4 weeks"
      },
      {
        id: "b-2",
        title: "Epic App Orchard Sandbox not started",
        severity: "critical",
        message: "Epic App Orchard developer sandbox credentials set to DEC only. Production credentials pending approval.",
        owner: "Customer IT",
        timeline: "8–10 weeks"
      },
      {
        id: "b-3",
        title: "GCP project not provisioned",
        severity: "warning",
        message: "Secure Google Cloud landing zones and VPC subnets not mapped to regional EHR gateways.",
        owner: "Customer IT",
        timeline: "1–2 weeks"
      }
    ],
    financialModel: {
      volumeLabel: "Annual Prior Auth Volume",
      volume: "280,000 cases",
      currentCostLabel: "Current Cost per Case",
      currentCost: "$284",
      projectedCostLabel: "Projected AI Cost per Case",
      projectedCost: "$12",
      currentMetricLabel: "Current Denial Rate",
      currentMetric: "18%",
      projectedMetricLabel: "Projected Denial Rate",
      projectedMetric: "11%",
      timeLabel: "Prior Auth Processing Time",
      currentTime: "18 days",
      projectedTime: "4 hours",
      baseValue: "$1.6M",
      highValue: "$2.4M",
      payback: "8.4 months"
    },
    marketIntelligence: [
      {
        id: "sig-1",
        title: "Q3 Earnings Call: Prior Auth Costs +23% YoY",
        source: "Earnings Transcript",
        date: "Oct 2024",
        urgency: "High",
        description: "CFO highlighted administrative prior authorization bottlenecks as a key driver of outpatient cost increases."
      },
      {
        id: "sig-2",
        title: "New CTO Dr. James Park Appointed",
        source: "Press Release",
        date: "Nov 2024",
        urgency: "Medium",
        description: "Dr. Park's former cloud modernization work at Amazon Health suggests a strong affinity for automated AI agents."
      },
      {
        id: "sig-3",
        title: "AI-First Health System by 2027 Board Mandate",
        source: "Annual Report 2024",
        date: "Jan 2024",
        urgency: "Medium",
        description: "Board approved a $40M dedicated budget over 3 years to implement generative clinical co-pilots."
      }
    ],
    timeline: [
      { name: "HIPAA BAA Agreement Signature", duration: "4 weeks", status: "blocked" },
      { name: "Epic App Orchard Integration Scopes", duration: "10 weeks", status: "prog", isCriticalPath: true },
      { name: "GCP Staging Environment Provisioning", duration: "2 weeks", status: "todo" },
      { name: "EHR Sandbox Telemetry Data Prep", duration: "4 weeks", status: "todo" },
      { name: "Security Compliance Review Gate", duration: "7 weeks", status: "todo" },
      { name: "Nomination for FDE Engagement", duration: "6 weeks", status: "todo" }
    ],
    regulatorySignals: [
      "CMS Prior Auth Interoperability Rule",
      "Colorado AI Act Compliance Review"
    ]
  },
  {
    id: "pacific-medical",
    account: {
      name: "Pacific Coast Medical Group",
      type: "Healthcare Provider · Medium",
      physicians: "800 across 12 clinics",
      cloud: "GCP Native",
      ehr: "Epic (2024.1)",
      useCase: "Clinical Documentation Assistant",
      stage: "FDE Nominated",
      ce: "Nitin Chandra"
    },
    contacts: [
      { name: "Dr. Priya Nair", role: "Chief Medical Officer", quote: "Physician burnout driving urgency. Need documentation assist." }
    ],
    scores: {
      A: 88,
      B: 82,
      C: 86,
      D: 84,
      E: 89 // GREEN Gate
    },
    blockers: [],
    financialModel: {
      volumeLabel: "Physicians Staff Count",
      volume: "800 doctors",
      currentCostLabel: "Hourly Physician Cost",
      currentCost: "$180",
      projectedCostLabel: "AI Ingestion Cost",
      projectedCost: "$8/hr",
      currentMetricLabel: "Documentation Burnout Rate",
      currentMetric: "High",
      projectedMetricLabel: "Documentation Burnout Rate",
      projectedMetric: "Low",
      timeLabel: "Documentation Time saved/doctor/day",
      currentTime: "0 hrs saved",
      projectedTime: "1.8 hrs saved",
      baseValue: "$1.89M",
      highValue: "$2.8M",
      payback: "6.2 months"
    },
    marketIntelligence: [],
    timeline: [
      { name: "HIPAA BAA Agreement Signature", duration: "Completed", status: "done" },
      { name: "GCP landing zone setup", duration: "Completed", status: "done" },
      { name: "Epic App Orchard configuration", duration: "Completed", status: "done" },
      { name: "Data quality validation sprint", duration: "Completed", status: "done" }
    ],
    regulatorySignals: [
      "Colorado AI Act Compliance Review"
    ]
  },
  {
    id: "midamerica-payer",
    account: {
      name: "MidAmerica Health Payer",
      type: "Healthcare Payer · Enterprise",
      members: "2.1 million covered lives",
      cloud: "Azure Primary",
      ehr: "N/A (claims system)",
      useCase: "Claims Denial AI + Prior Auth Automation",
      stage: "At-Risk",
      ce: "Nitin Chandra",
      daysToRenewal: 47
    },
    contacts: [],
    scores: {
      A: 78,
      B: 74,
      C: 80,
      D: 82,
      E: 85,
      F: 48 // Concerning
    },
    blockers: [
      {
        id: "risk-1",
        title: "Extreme Member Portal Adoption Gap",
        severity: "critical",
        message: "Claims adoption rate is at 22% compared to target 70%. Value realization gap of $800k outstanding.",
        owner: "Territory AE",
        timeline: "Immediate action"
      }
    ],
    financialModel: {
      volumeLabel: "Covered Lives",
      volume: "2.1M members",
      currentCostLabel: "Manual Denial Costs",
      currentCost: "$42 / claim",
      projectedCostLabel: "AI Denial Costs",
      projectedCost: "$4.50 / claim",
      currentMetricLabel: "Current Adoption",
      currentMetric: "22%",
      projectedMetricLabel: "Target Adoption",
      projectedMetric: "70%",
      timeLabel: "Claims adjudication cycle time",
      currentTime: "14 days",
      projectedTime: "24 hours",
      baseValue: "$1.1M",
      highValue: "$1.9M",
      payback: "14 months"
    },
    marketIntelligence: [],
    timeline: [],
    regulatorySignals: [
      "CMS Prior Auth Rule (Deadline Jan 2027)"
    ]
  },
  {
    id: "raphael-academic",
    account: {
      name: "St. Raphael Academic Medical Center",
      type: "Academic Medical Center · Large",
      cloud: "GCP Native",
      ehr: "Epic (2023.2)",
      useCase: "Prior Authorization Agent (Production)",
      stage: "Production",
      ce: "Nitin Chandra"
    },
    contacts: [
      {
        name: "Prior Auth Program Director",
        role: "Program Chair",
        quote: "Before this system, Dr. Chen used to spend his Sunday evenings reviewing prior auth denials for Monday morning. Every single Sunday for 11 years. Last month he told me he went hiking for the first time since medical school. He said he forgot what weekends were for. We did not plan for that in the ROI model. It turned out to be the most important outcome."
      }
    ],
    scores: {
      A: 84,
      B: 80,
      C: 88,
      D: 82,
      E: 90,
      F: 82,
      G: 88,
      H: 79,
      I: 84,
      J: 91
    },
    blockers: [],
    financialModel: {
      volumeLabel: "Daily Cases Processed by AI",
      volume: "342 cases",
      currentCostLabel: "Pre-sales cost projection",
      currentCost: "$2.1M",
      projectedCostLabel: "Confirmed annual value",
      projectedCost: "$2.4M",
      currentMetricLabel: "Adoption NPS Score",
      currentMetric: "74",
      projectedMetricLabel: "Physician Adoption Rate",
      projectedMetric: "81%",
      timeLabel: "Prior Auth Processing Time",
      currentTime: "18 days",
      projectedTime: "3.8 hours",
      baseValue: "$2.1M",
      highValue: "$2.4M",
      payback: "180 days live"
    },
    marketIntelligence: [],
    timeline: [],
    regulatorySignals: [],
    humanStory: "Before this system, Dr. Chen used to spend his Sunday evenings reviewing prior auth denials for Monday morning. Every single Sunday for 11 years. Last month he told me he went hiking for the first time since medical school. He said he forgot what weekends were for. We did not plan for that in the ROI model. It turned out to be the most important outcome.",
    closingParagraph: `St. Raphael began this journey in September 2023 with one question asked in a conference room: "What would it look like if our physicians never had to think about prior auth again?"

Today, 180 days later, that question has an answer.

$2.4M confirmed annual value.
342 cases processed by AI every single day.
Dr. Chen went hiking on Sunday.

The foundation is real.
The value is proven.
The capability is theirs.

The next chapter starts here.`,
    expansionUseCases: [
      { rank: 1, useCase: "Clinical Documentation Assistant", value: "$2.1M", savings: "8 weeks saved" },
      { rank: 2, useCase: "Radiology AI Worklist", value: "$1.4M" },
      { rank: 3, useCase: "Care Gap Closure", value: "$0.9M" }
    ]
  }
];
