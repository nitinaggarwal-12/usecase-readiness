"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

export default function StrategicPlanPage() {
  const router = useRouter();
  const { id: accountId } = useParams() as { id: string };
  const { showToast } = useToast();

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Dynamic mock details
  const isStanford = accountId === "stanford-medicine";
  const accountName = isStanford ? "Stanford Medicine" : "Mayo Clinic";

  // Mock gap items list (color-coded by severity)
  const gapItems = [
    {
      title: "HIPAA Business Associate Agreement (BAA) Execution",
      msg: "No signed BAA on file for active patient payloads. legal clearance is outstanding.",
      severity: "red" as const,
      actionText: "Escalate BAA",
      modalTrigger: "baa-action",
    },
    {
      title: "OAuth 2.0 EHR App credentials provisioning",
      msg: "Epic App Orchard credentials are set to DEC (sandbox) only. Production credentials pending approval.",
      severity: "amber" as const,
      actionText: "Generate TF Scripts",
      modalTrigger: "terraform-action",
    },
    {
      title: "GCloud KMS Customer-Managed Encryption Keys (CMEK)",
      msg: "Clinical database is using default service keys. KMS CMEK setups are recommended for HIPAA safety compliance.",
      severity: "blue" as const,
      actionText: "Deploy Keys",
      modalTrigger: "kms-action",
    },
  ];

  // Numbered action steps
  const actionSteps = [
    {
      num: 1,
      title: "Initiate legal BAA Fast-Track Review",
      desc: "Dispatch the pre-filled HIPAA compliance draft to legal-hcls@google.com. Target resolution: 7 business days.",
      artifact: "legal_baa_esc_draft.txt",
      btnText: "Fast-Track BAA",
    },
    {
      num: 2,
      title: "Provision secure GCloud Key Management service",
      desc: "Generate KMS CMEK keys in the healthcare analytics VPC project using standard Terraform configurations.",
      artifact: "kms_cmek_main.tf",
      btnText: "Deploy KMS Infra",
    },
    {
      num: 3,
      title: "Map HL7/FHIR US Core profiles for discharges",
      desc: "Deploy standard Med-LM preprocessing schemas to align discharge details to standard Epic resources.",
      artifact: "fhir_uscore_mapper.py",
      btnText: "Load FHIR Mapper",
    },
  ];

  const handleFixNow = (btnText: string, artifact: string) => {
    showToast(`Vibe Action: Provisioning '${artifact}'...`, "info", "fa-wand-magic-sparkles");
    setTimeout(() => {
      showToast(`Artifact '${artifact}' successfully generated! Check your workspace.`, "success");
    }, 1500);
  };

  const openModal = (id: string) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* STICKY TOP ACTIONS BAR */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-[52px] z-10 flex items-center justify-between gap-4">
        <button
          onClick={() => router.push(`/accounts/${accountId}`)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-semibold btn-transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Account</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push(`/timeline/${accountId}`)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-750 text-xs font-semibold px-3 py-1.5 rounded btn-transition"
          >
            <i className="fa-solid fa-calendar-days mr-1.5"></i>
            <span>View Timeline / Gantt</span>
          </button>

          <button
            onClick={() => showToast("Exporting Strategic Plan to PDF...", "info", "fa-file-pdf")}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-755 text-xs font-semibold px-3 py-1.5 rounded btn-transition"
          >
            <i className="fa-solid fa-file-pdf mr-1.5 text-red"></i>
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => openModal("share")}
            className="bg-blue hover:bg-blue-dk text-white text-xs font-semibold px-3.5 py-1.5 rounded btn-transition shadow-sm"
          >
            <i className="fa-solid fa-share-nodes mr-1.5"></i>
            <span>Share Plan</span>
          </button>
        </div>
      </div>

      {/* HEADER TITLE SECTION */}
      <div className="page-header select-none">
        <h1 className="text-gray-900">AI Strategic Ingestion Roadmap</h1>
        <p className="text-xs text-gray-500">
          Gemini-generated strategic alignment and gap remediation roadmap for {accountName}.
        </p>
      </div>

      {/* SECTION 1: 2-COL CURRENT VS TARGET STATE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
        {/* Current State Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-50 text-red flex items-center justify-center text-xs flex-shrink-0">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Current Integration Baseline
            </h3>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed select-text pt-1">
            EHR credentials configured solely inside standard sandboxes. Ingestion mechanisms use manual CSV extracts with zero active FHIR real-time listeners. outstanding HIPAA BAA signatures prevent production payloads.
          </p>
        </div>

        {/* Target State Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-50 text-green flex items-center justify-center text-xs flex-shrink-0">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Target Ingestion Deployment
            </h3>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed select-text pt-1">
            Fully automated discharge summaries pipelines feeding directly into Epic US Core endpoints. Fully encrypted payloads using customer-managed KMS keys, protected under active HIPAA BAA structures.
          </p>
        </div>
      </div>

      {/* 2-COLUMN DETAIL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 width): Numbered Action sequence */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Sequential Remediation Roadmap
          </h3>

          {/* Flowchart sequential steps with thin connecting vertical line */}
          <div className="flex flex-col">
            {actionSteps.map((step, idx) => {
              const isLast = idx === actionSteps.length - 1;
              return (
                <div key={step.num} className="flex items-start gap-4">
                  {/* Number Bubble & Connecting vertical line */}
                  <div className="flex flex-col items-center flex-shrink-0 h-full">
                    {/* Number Circle */}
                    <div className="w-8 h-8 rounded-full bg-blue text-white font-bold text-xs flex items-center justify-center shadow-sm select-none">
                      {step.num}
                    </div>
                    
                    {/* Thin connector line */}
                    {!isLast && (
                      <div className="w-[1.5px] h-24 bg-gray-200 my-1.5" />
                    )}
                  </div>

                  {/* Step Info Details */}
                  <div className="flex flex-col gap-2 pt-1 select-text">
                    <span className="text-xs font-bold text-gray-900">{step.title}</span>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{step.desc}</p>
                    
                    <div className="pt-1 select-none">
                      <button
                        onClick={() => handleFixNow(step.btnText, step.artifact)}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-md btn-transition flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <i className="fa-solid fa-screwdriver-wrench"></i>
                        <span>{step.btnText}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width): Gap Analysis Cards */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 select-none">
            <i className="fa-solid fa-circle-exclamation text-amber"></i>
            <span>Remediation Gaps</span>
          </h3>

          {/* Gap list cards color coded by severity */}
          <div className="flex flex-col gap-3">
            {gapItems.map((gap, idx) => {
              const borderColors = {
                red: "border-l-red border-red/15 bg-red-50/30",
                amber: "border-l-amber border-amber/15 bg-amber-50/30",
                blue: "border-l-blue border-blue/15 bg-blue-50/30",
              };

              const severityDots = {
                red: "bg-red",
                amber: "bg-amber",
                blue: "bg-blue",
              };

              return (
                <div
                  key={idx}
                  className={`border rounded-r-md p-4 border-l-[3px] flex flex-col gap-3 select-text ${borderColors[gap.severity]}`}
                >
                  {/* Title & Dot */}
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${severityDots[gap.severity]}`} />
                    <span className="text-xs font-bold text-gray-900 leading-tight">{gap.title}</span>
                  </div>

                  {/* Message */}
                  <p className="text-[11px] text-gray-700 leading-relaxed pl-4">
                    {gap.msg}
                  </p>

                  {/* Actions */}
                  <div className="pl-4 pt-1 select-none">
                    <button
                      onClick={() => {
                        if (gap.modalTrigger === "baa-action") {
                          openModal("baa");
                        } else {
                          handleFixNow(gap.actionText, `${gap.modalTrigger}.json`);
                        }
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded btn-transition shadow-sm uppercase tracking-wider ${
                        gap.severity === "red"
                          ? "bg-red text-white hover:bg-red/90"
                          : gap.severity === "amber"
                          ? "bg-amber text-white hover:bg-amber/90"
                          : "bg-blue text-white hover:bg-blue-dk"
                      }`}
                    >
                      {gap.actionText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* MODALS WIRING                              */}
      {/* ========================================== */}

      {/* A. Share Modal */}
      <Modal
        isOpen={activeModal === "share"}
        onClose={closeModal}
        width="440px"
        title="Generate Secure Share Link"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Create a secure read-only roadmap link that can be shared directly with customer sponsors:
          </p>

          <div className="flex items-center gap-2 border border-gray-200 rounded p-2 bg-white mt-1">
            <input
              type="text"
              readOnly
              value={`https://hcls-navigator.google.com/share/roadmap-${accountId}`}
              className="text-[11px] text-gray-500 focus:outline-none select-all w-full truncate bg-transparent"
            />
            <button
              onClick={() => {
                closeModal();
                showToast("Secure link copied to clipboard!", "success");
              }}
              className="bg-blue hover:bg-blue-dk text-white text-[10px] font-bold px-2.5 py-1.5 rounded flex-shrink-0 uppercase tracking-wider"
            >
              Copy
            </button>
          </div>
        </div>
      </Modal>

      {/* B. BAA Escalate Modal */}
      <Modal
        isOpen={activeModal === "baa"}
        onClose={closeModal}
        width="440px"
        title="Escalate BAA Contract Setup"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            This action will dispatch a pre-filled escalation alert to Google Cloud Legal to prioritize BAA review:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-[11px] font-mono text-gray-700 leading-normal select-all whitespace-pre-wrap">
{`To: legal-hcls@google.com
CC: nitinagga@google.com
Subject: URGENT: HIPAA BAA Escalation - ${accountName}

Dear Legal,
Please expedite the review of outstanding HIPAA BAA amendments for ${accountName}. 
Our technical sandbox pipelines are fully configured.

Regards,
Nitin Aggarwal (HCLS CE)`}
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-gray-50">
            <button
              onClick={closeModal}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold btn-transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                closeModal();
                showToast("BAA Escalation email dispatched successfully!", "success");
              }}
              className="bg-red hover:bg-red/90 text-white px-3.5 py-1.5 rounded text-xs font-semibold btn-transition shadow-sm uppercase tracking-wider"
            >
              Send Email
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
