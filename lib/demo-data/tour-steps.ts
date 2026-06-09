export interface TourStep {
  title: string;
  screen: string;
  say: string;
  click: string;
  point: string;
}

export const quickSteps: TourStep[] = [
  {
    title: "Dashboard Overview",
    screen: "/demo/dashboard",
    say: "This is what a Google CE sees every morning. Every account, every risk, every next action in one place. See this flag here — this is a renewal at risk. The system caught it 47 days before renewal. No spreadsheet does this.",
    click: "Point to the Renewal at Risk flag. Click the account card to go deeper.",
    point: "The platform doesn't just store data. It tells you what to do next."
  },
  {
    title: "Account Intelligence",
    screen: "/demo/accounts/northside",
    say: "Before your CE even walks in the door, the platform has read the customer's last earnings call, found the new CTO's LinkedIn, and flagged that their CFO mentioned AI costs publicly. This is not a CRM. This is competitive intelligence.",
    click: "Click the Intelligence tab. Point to the earnings call signal card.",
    point: "Your rep knows more about the customer than the customer expects. That changes the first conversation completely."
  },
  {
    title: "Assessment Flow",
    screen: "/demo/assessments/northside/C",
    say: "This is Assessment C — Technical Readiness. The CE is running this live in the meeting. Watch what happens when I answer this question.",
    click: "Select 'Not started — ready to begin' on the Epic App Orchard question. Point to the blocker alert. Click 'Generate Checklist' button.",
    point: "The platform doesn't just record the answer. It detects the blocker, tells you exactly what it means for your timeline, and generates the fix in one click."
  },
  {
    title: "Report View",
    screen: "/demo/reports/northside/C",
    say: "In the time it took to finish the assessment, Gemini generated this report. Financial model, human story, benchmark against 47 comparable deployments, and one specific next step. The CE didn't write any of this.",
    click: "Scroll to the Human Story section. Point to the closing paragraph. Read the final line aloud.",
    point: "The closing line is always: 'The next chapter starts here.' That is intentional. Every report ends with momentum, not a summary."
  }
];

export const standardSteps: TourStep[] = [
  {
    title: "Dashboard Overview",
    screen: "/demo/dashboard",
    say: "This is what a Google CE sees every morning. Every account, every risk, every next action in one place. See this flag here — this is a renewal at risk. The system caught it 47 days before renewal. No spreadsheet does this.",
    click: "Point to the Renewal at Risk flag. Click the account card to go deeper.",
    point: "This is $8.4M in confirmed annual value across the portfolio. Not projected. Confirmed. With receipts."
  },
  {
    title: "Account Detail & Intel",
    screen: "/demo/accounts/northside",
    say: "Before your CE even walks in the door, the platform has read the customer's last earnings call, found the new CTO's LinkedIn, and flagged that their CFO mentioned AI costs publicly. This is not a CRM. This is competitive intelligence.",
    click: "Click the Intelligence tab. Open the Pre-Meeting Brief modal.",
    point: "The system generates a pre-meeting brief before every customer call. Situation in 30 seconds. What to open with. What to watch for."
  },
  {
    title: "Document Intake",
    screen: "/demo/intake/northside",
    say: "The customer sends us their IT strategy deck before the meeting. We upload it here. In 30 seconds Gemini extracts 34 data points — cloud infrastructure, EHR system, data quality, org structure — and pre-fills the assessments.",
    click: "Click on the RMC_IT_Strategy PDF in the upload list. Show the extraction results panel. Point to a HIGH confidence item. Click 'Apply Accepted Items'.",
    point: "60 percent of the assessment is pre-filled before the CE asks a single question. The meeting becomes a conversation."
  },
  {
    title: "Assessment Flow",
    screen: "/demo/assessments/northside/C",
    say: "This is Assessment C — Technical Readiness. The CE is running this live in the meeting. Watch what happens when I answer this question.",
    click: "Select 'Not started — ready to begin' on the Epic App Orchard question. Point to the blocker alert. Toggle Presenter Mode ON. Observe that coaching tips are hidden.",
    point: "Presenter Mode. Clean. Large. No internal data. Safe to share your screen right now."
  },
  {
    title: "Assessment Complete & FDE Gate",
    screen: "/demo/assessments/northside/C/complete",
    say: "YELLOW gate. Two blockers to resolve before we can nominate for an FDE engagement. The system tells you exactly what they are and generates the fix for each one.",
    click: "Click 'Generate BAA Email'. Show the pre-filled email modal.",
    point: "One click. Legal email drafted, formatted, ready to send."
  },
  {
    title: "Report & Strategic Plan",
    screen: "/demo/reports/northside/C",
    say: "The strategic plan is generated automatically from the assessment scores. Current state, target state, gap analysis with severity. Every gap has a Fix Now button that generates the artifact to close it. Terraform template. Checklist. Sprint plan. One click each.",
    click: "Navigate to Strategic Plan. Click 'Fix Now' on the Epic App Orchard gap. Show the toast confirming checklist generated.",
    point: "The closing line of the report is always: 'The next chapter starts here.' That is intentional. Every report ends with momentum, not a summary."
  },
  {
    title: "Journey Timeline",
    screen: "/demo/timeline/northside",
    say: "This is the Gantt chart. Three scenarios — aggressive, base case, conservative. The critical path is Epic App Orchard — it controls the FDE date. Every customer asks 'how long will this take?' This answers it in 10 seconds.",
    click: "Toggle between the three scenario buttons. Point to the FDE Day 1 date changing. Point to the critical path label on App Orchard bar.",
    point: "Three scenario parameters allow showing clients a realistic timeline instantly."
  },
  {
    title: "Customer Portal",
    screen: "/demo/customer-portal/northside",
    say: "This is what the customer sees. No CE data. No internal scores. Plain language. Their milestones. Their value confirmed. Their next step. You share this link with the CFO after every quarterly review. They see progress. They see value. They renew.",
    click: "Click 'Read Full Report'. Show the simplified customer report view. Point to the milestone checklist.",
    point: "The customer has a portal. They log in. They see their journey. They feel ownership. That is how you reduce churn."
  }
];

export const deepSteps: TourStep[] = [
  ...standardSteps,
  {
    title: "BV Command Center",
    screen: "/demo/bv",
    say: "This is what the BV leader sees. $42M in projected pipeline. $8.4M confirmed. 73% prediction accuracy — meaning when we say a customer will get X value, we're right 73% of the time. That number goes up every time we run an assessment.",
    click: "Point to the value at risk section. Click the escalation button on the at-risk account. Show the escalation modal.",
    point: "Pipeline mapping and risk indicators show leadership value dashboards."
  },
  {
    title: "Regulatory Intelligence",
    screen: "/demo/regulatory",
    say: "The platform scans regulatory signals every day using Gemini and Google Search. CMS Prior Auth Rule. Colorado AI Act. FDA SaMD guidance. Each signal is matched to the accounts it affects. The CE doesn't have to track this. The platform does.",
    click: "Click on the CMS Prior Auth Rule signal. Show the 8 affected accounts. Click 'Generate Checklist'.",
    point: "Real-time compliance alerts help engineers advise clinics immediately."
  },
  {
    title: "POC Generator",
    screen: "/demo/poc",
    say: "The customer wants to see it work before they commit. The CE configures the use case, clicks Generate, and downloads a ZIP file with Terraform code, Gemini prompts, 50 synthetic test cases, a Python demo script, and a stakeholder presentation. In 30 seconds. No engineering team required for the POC.",
    click: "Set the config: Northside, Prior Auth, Epic, GCP. Click Generate Demo Package. Show the artifact list populating.",
    point: "No engineering team required for the POC."
  },
  {
    title: "FDE Nomination Flow",
    screen: "/demo/assessments/pacific/E",
    say: "Pacific Coast Medical Group hit GREEN on Assessment E. That means they qualify for a Fully Dedicated Engineer engagement. This is the moment the sale closes and the real deployment begins.",
    click: "Show the GREEN gate on the completion screen. Click 'Nominate for FDE'. Show the nomination form pre-filled. Show the confirmation toast.",
    point: "The milestone of moving from pre-sales to dedicated engineering."
  },
  {
    title: "Value Confirmation Report G",
    screen: "/demo/reports/raphael/G",
    say: "St. Raphael is 180 days in production. $2.4 million in confirmed annual value. 14% above projection. Read this line — 'Maria leaves at 5pm.' That is not a metric. That is the story that gets shared in board meetings. Gemini wrote it. The CE approved it. The CFO remembered it.",
    click: "Scroll to the Human Story section. Read it slowly. Scroll to the closing paragraph. Read the final line aloud.",
    point: "The closing line is always: 'The next chapter starts here.' That is intentional."
  },
  {
    title: "Expansion Planning",
    screen: "/demo/assessments/raphael/I",
    say: "180 days in, the platform automatically recommends running Assessment I — Expansion Readiness. It has already ranked the next 3 use cases by ROI and foundation reuse. Clinical Documentation is first — $2.1M projected, 8 weeks faster because the GCP infrastructure is already built.",
    click: "Show the use case ranking list. Point to the foundation reuse savings callout.",
    point: "Identify further upselling options dynamically."
  },
  {
    title: "Full Circle Report J",
    screen: "/demo/reports/raphael/J",
    say: "This is the Full Circle Report. Assessment J. The flagship. It opens with the exact words the customer used in Assessment A Question 7 when we asked them about their vision. Their own words. At the top. And it closes with the full story of everything that happened since that first conversation.",
    click: "Scroll slowly from top to bottom. Point to the journey timeline at the top. Point to the opening quote in the hero band. Scroll to the closing paragraph. Read 'The next chapter starts here.' aloud.",
    point: "Every platform generates reports. Only this one tells the story the customer wants to tell their board."
  }
];

export function getStepsForDuration(duration: "quick" | "standard" | "deep"): TourStep[] {
  if (duration === "quick") return quickSteps;
  if (duration === "standard") return standardSteps;
  return deepSteps;
}
