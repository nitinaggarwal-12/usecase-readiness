"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface ConnectedSystem {
  id: string;
  name: string;
  type: string;
  status: "Connected" | "Syncing" | "Idle" | "Blocked";
  endpoint: string;
  lastSync: string;
  icon: string;
}

interface AvailableNetwork {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  status: "Active" | "Suspended";
}

export default function IntegrationMarketplacePage() {
  const { showToast } = useToast();

  // Active tab for networks
  const [activeTab, setActiveTab] = useState<"connected" | "available">("connected");

  // Connected systems
  const [connectedSystems, setConnectedSystems] = useState<ConnectedSystem[]>([
    {
      id: "sys-1",
      name: "Epic Systems (Sandbox Core)",
      type: "Electronic Health Record (EHR)",
      status: "Connected",
      endpoint: "https://fhir.epic.sandbox.google/r4/v1",
      lastSync: "12 mins ago",
      icon: "fa-hospital",
    },
    {
      id: "sys-2",
      name: "Cloud Healthcare API Store",
      type: "Google FHIR Database",
      status: "Syncing",
      endpoint: "https://healthcare.googleapis.com/v1/projects/hcls-ce-hub",
      lastSync: "Just now",
      icon: "fa-cloud",
    },
    {
      id: "sys-3",
      name: "FDA regulatory Feed",
      type: "Regulatory Signal Service",
      status: "Idle",
      endpoint: "https://api.fda.gov/device/enforcement/v1",
      lastSync: "6 hours ago",
      icon: "fa-scale-balanced",
    },
    {
      id: "sys-4",
      name: "Cerner Millennium (FHIR Core)",
      type: "Electronic Health Record (EHR)",
      status: "Blocked",
      endpoint: "https://fhir.cerner.sandbox.google/dstu2",
      lastSync: "2 days ago",
      icon: "fa-triangle-exclamation",
    },
  ]);

  // Available networks
  const [availableNetworks] = useState<AvailableNetwork[]>([
    {
      id: "avail-1",
      name: "Meditech EHR Gateway",
      type: "Electronic Health Record",
      description: "Integrate clinical workflows directly with Meditech systems using standard RESTful FHIR APIs.",
      icon: "fa-hospital-user",
    },
    {
      id: "avail-2",
      name: "Athenahealth API Hub",
      type: "Clinical Scheduling & Billing",
      description: "Real-time schedules, patient demographic updates, and billing sync pipelines.",
      icon: "fa-file-invoice-dollar",
    },
    {
      id: "avail-3",
      name: "Redox Engine Integration",
      type: "Health Data Middleware",
      description: "Unified healthcare API connecting to over 80+ unique EHR brands with low-latency translation.",
      icon: "fa-network-wired",
    },
    {
      id: "avail-4",
      name: "Salesforce Health Cloud Feed",
      type: "Care Management & CRM",
      description: "Synchronize Google AI-generated patient discharge summaries directly into Health Cloud profiles.",
      icon: "fa-users-gear",
    },
  ]);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key-1",
      name: "CE Portal Auto-Ingestion",
      prefix: "hcls_live_a8d3...",
      created: "2026-05-10",
      status: "Active",
    },
    {
      id: "key-2",
      name: "Gemini Clinical Grounder Script",
      prefix: "hcls_live_bc51...",
      created: "2026-05-22",
      status: "Active",
    },
    {
      id: "key-3",
      name: "Local FDA Checker Cron",
      prefix: "hcls_live_7fe0...",
      created: "2026-04-01",
      status: "Suspended",
    },
  ]);

  // Create Key Modal State
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyRole, setNewKeyRole] = useState("Read-Only CE Analyst");
  const [generatedKeyString, setGeneratedKeyString] = useState("");
  const [isKeyCreatedView, setIsKeyCreatedView] = useState(false);

  // Actions
  const handleDisconnect = (id: string, name: string) => {
    setConnectedSystems((prev) =>
      prev.filter((sys) => sys.id !== id)
    );
    showToast(`Disconnected system: ${name}`, "warning");
  };

  const handleRequestAccess = (name: string) => {
    showToast(`Access request sent for ${name}. Pending review.`, "info");
  };

  const handleRevokeKey = (id: string, name: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    showToast(`Revoked API Key: '${name}'`, "error");
  };

  const handleCreateKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      showToast("Key Name is required", "warning");
      return;
    }

    // Generate dummy secure-looking HCLS key
    const randomHex = Array.from({ length: 28 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const fullKey = `hcls_live_${randomHex}`;
    const prefix = `hcls_live_${randomHex.substring(0, 4)}...`;

    setGeneratedKeyString(fullKey);
    setIsKeyCreatedView(true);

    // Add to table
    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(2, 9),
      name: newKeyName,
      prefix,
      created: new Date().toISOString().split("T")[0],
      status: "Active",
    };

    setApiKeys((prev) => [newKey, ...prev]);
    showToast(`API Key '${newKeyName}' created successfully!`, "success");
  };

  const handleCloseCreateKeyModal = () => {
    setIsCreateKeyOpen(false);
    setNewKeyName("");
    setGeneratedKeyString("");
    setIsKeyCreatedView(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKeyString);
    showToast("API Key copied to clipboard!", "success");
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title */}
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-lg font-semibold">Integration Marketplace & APIs</h1>
          <p className="text-xs text-gray-500">
            Provision secure connections to active EHRs and manage programmatic credentials.
          </p>
        </div>
      </div>

      {/* MAIN GRID: Left (Marketplace), Right (API Credentials) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7/12): Integration Networks */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Tabs header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-1 select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("connected")}
                className={`text-xs font-bold px-3 py-2 border-b-2 transition-all focus:outline-none ${
                  activeTab === "connected"
                    ? "border-blue text-blue"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Connected Systems ({connectedSystems.length})
              </button>
              <button
                onClick={() => setActiveTab("available")}
                className={`text-xs font-bold px-3 py-2 border-b-2 transition-all focus:outline-none ${
                  activeTab === "available"
                    ? "border-blue text-blue"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Available Networks ({availableNetworks.length})
              </button>
            </div>
          </div>

          {/* Connected Systems Tab Content */}
          {activeTab === "connected" && (
            <div className="flex flex-col gap-3">
              {connectedSystems.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-xs select-none">
                  No connected systems found. Use the Available Networks tab to establish integrations.
                </div>
              ) : (
                connectedSystems.map((sys) => (
                  <div 
                    key={sys.id}
                    className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 shadow-sm flex items-start justify-between gap-4 btn-transition"
                  >
                    <div className="flex items-start gap-3 flex-grow min-w-0">
                      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        sys.status === "Connected" ? "bg-green-50 text-green" :
                        sys.status === "Syncing" ? "bg-blue-50 text-blue animate-pulse" :
                        sys.status === "Blocked" ? "bg-red-50 text-red" : "bg-gray-150 text-gray-500"
                      }`}>
                        <i className={`fa-solid ${sys.icon} text-sm`}></i>
                      </div>

                      <div className="flex flex-col leading-snug min-w-0 w-full gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 truncate select-all">{sys.name}</span>
                          
                          {sys.status === "Connected" && <Badge label="Connected" variant="success" />}
                          {sys.status === "Syncing" && <Badge label="Syncing" variant="info" />}
                          {sys.status === "Idle" && <Badge label="Idle" variant="info" />}
                          {sys.status === "Blocked" && <Badge label="Blocked" variant="critical" />}
                        </div>
                        
                        <span className="text-[10px] text-gray-400 font-medium select-none">{sys.type}</span>
                        
                        {/* Monospace endpoint path */}
                        <div className="bg-gray-50 border border-gray-200/65 rounded px-2 py-1 mt-1 select-text w-full overflow-x-auto">
                          <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap leading-none">
                            {sys.endpoint}
                          </span>
                        </div>
                        
                        <span className="text-[10px] text-gray-400 mt-1 select-none">
                          Last synchronized: <strong className="text-gray-500 font-semibold">{sys.lastSync}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 select-none">
                      <button
                        onClick={() => handleDisconnect(sys.id, sys.name)}
                        className="text-gray-400 hover:text-red text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-gray-200 hover:border-red/20 hover:bg-red-50/30 rounded btn-transition focus:outline-none"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Available Networks Tab Content */}
          {activeTab === "available" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableNetworks.map((net) => (
                <div 
                  key={net.id}
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 shadow-sm flex flex-col justify-between gap-4 btn-transition"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center">
                        <i className={`fa-solid ${net.icon} text-xs`}></i>
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-gray-900 select-all">{net.name}</span>
                        <span className="text-[10px] text-gray-400 select-none">{net.type}</span>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-gray-500 leading-relaxed select-text">
                      {net.description}
                    </p>
                  </div>

                  <div className="select-none pt-1">
                    <button
                      onClick={() => handleRequestAccess(net.name)}
                      className="bg-blue hover:bg-blue-dk text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded w-full btn-transition shadow-sm text-center focus:outline-none"
                    >
                      Request Access Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (5/12): API Credentials Manager */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <i className="fa-solid fa-key text-amber"></i>
              <span>Portal API Credentials</span>
            </h2>
            
            <button
              onClick={() => setIsCreateKeyOpen(true)}
              className="bg-amber hover:bg-amber/95 text-white text-[10px] font-bold uppercase px-2.5 py-1.5 rounded btn-transition shadow-sm flex items-center gap-1 focus:outline-none"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Create Key</span>
            </button>
          </div>

          {/* API Keys container */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            
            {/* Key items */}
            <div className="flex flex-col divide-y divide-gray-100">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 leading-snug min-w-0">
                    <span className="text-xs font-bold text-gray-800 truncate select-all">
                      {key.name}
                    </span>
                    
                    {/* Monospace key prefix */}
                    <span className="text-[11px] font-mono text-gray-500 bg-gray-50 border border-gray-150 rounded px-1.5 py-0.5 self-start select-text">
                      {key.prefix}
                    </span>
                    
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 select-none">
                      <span>Created {key.created}</span>
                      <span>•</span>
                      {key.status === "Active" ? (
                        <span className="text-green font-semibold">Active</span>
                      ) : (
                        <span className="text-red font-semibold">Suspended</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 select-none">
                    <button
                      onClick={() => handleRevokeKey(key.id, key.name)}
                      className="text-gray-400 hover:text-red p-1 rounded hover:bg-red-50/30 btn-transition"
                      title="Revoke API Key"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Documentation note */}
            <div className="bg-gray-50 border-t border-gray-100 p-4">
              <h3 className="text-[11px] font-bold text-gray-700 flex items-center gap-1 select-none">
                <i className="fa-solid fa-circle-info text-blue"></i>
                <span>Need CE API integration help?</span>
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed mt-1 select-text">
                Consult our Healthcare Integration Playbook inside the Learning Center to map HL7 clinical pipelines using secure gateway credentials.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* MODAL FOR CREATING NEW API KEY                     */}
      {/* ================================================== */}
      <Modal
        isOpen={isCreateKeyOpen}
        onClose={handleCloseCreateKeyModal}
        width="440px"
        title="Generate Developer API Key"
      >
        {!isKeyCreatedView ? (
          /* STEP 1: Form inputs */
          <form onSubmit={handleCreateKeySubmit} className="flex flex-col gap-4">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Create a credential key enabling your background clinical pipelines to fetch real-time assessment logs and FDA enforcement feeds.
            </p>

            <div className="flex flex-col gap-1 text-xs">
              <label className="font-semibold text-gray-700">API Key Name</label>
              <input
                type="text"
                placeholder="e.g., Production EHR Sync Daemon"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <label className="font-semibold text-gray-700">Assigned Portal Role</label>
              <select 
                value={newKeyRole}
                onChange={(e) => setNewKeyRole(e.target.value)}
                className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none"
              >
                <option>Read-Only CE Analyst</option>
                <option>Full Read/Write CE Administrator</option>
                <option>Integration Sync Webhook Daemon</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-gray-50 mt-1">
              <button
                type="button"
                onClick={handleCloseCreateKeyModal}
                className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded text-xs font-semibold btn-transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber hover:bg-amber/95 text-white px-3.5 py-2 rounded text-xs font-semibold btn-transition shadow-sm"
              >
                Generate Secret Key
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: Reveal secret key (only shown once!) */
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="bg-amber-50/50 border border-amber/15 rounded p-3.5 flex items-start gap-2.5">
              <i className="fa-solid fa-triangle-exclamation text-amber text-sm mt-0.5"></i>
              <div className="flex flex-col leading-snug">
                <span className="text-xs font-bold text-amber-950">Save this secret token!</span>
                <span className="text-[10px] text-amber-800 mt-0.5">For patient data security, this key will NOT be displayed again. Copy it to a secure vault now.</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide select-none">
                Generated API Key
              </span>
              
              <div className="bg-gray-950 text-gray-50 rounded-md p-3 font-mono text-[11px] flex items-center justify-between gap-4 select-all break-all">
                <span>{generatedKeyString}</span>
                
                <button
                  onClick={handleCopyKey}
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors focus:outline-none"
                  title="Copy Key to Clipboard"
                >
                  <i className="fa-solid fa-copy"></i>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-50 mt-1 select-none">
              <button
                onClick={handleCloseCreateKeyModal}
                className="bg-gray-900 hover:bg-gray-950 text-white px-4 py-2 rounded text-xs font-semibold btn-transition shadow-sm"
              >
                I Have Stored the Key
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
