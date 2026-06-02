"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();

  // Profile Configuration State
  const [fullName, setFullName] = useState("Nitin Aggarwal");
  const [email, setEmail] = useState("nitinagga@google.com");
  const [role, setRole] = useState("Lead Healthcare Customer Engineer (CE)");
  const [region, setRegion] = useState("North America - Central (Chicago Hub)");

  // Interactive Toggle preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [realtimeSync, setRealtimeSync] = useState(true);
  const [autoGrounding, setAutoGrounding] = useState(false);

  // Saving Action
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile changes saved successfully!", "success");
  };

  const handleSignOut = () => {
    showToast("Sign out request initiated. Redirecting...", "info");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-gray-900 text-lg font-semibold">Portal Settings</h1>
        <p className="text-xs text-gray-500">
          Configure your HCLS AI Navigator profile preferences, notifications sync, and system alerts.
        </p>
      </div>

      {/* 2-Column Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Settings & Forms (7/12 width) */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-7 flex flex-col gap-6">
          
          {/* 1. Personal Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-50 pb-2 flex items-center gap-1.5 select-none">
              <i className="fa-solid fa-user text-blue"></i>
              <span>CE Account Profile</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-xs">
                <label className="font-semibold text-gray-700 select-none">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none select-text font-medium text-gray-800"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <label className="font-semibold text-gray-700 select-none">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-200 rounded p-2.5 w-full bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none font-mono"
                  disabled
                  required
                />
              </div>

              <div className="flex flex-col gap-1 text-xs sm:col-span-2">
                <label className="font-semibold text-gray-700 select-none">Primary Cloud Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none select-text font-medium text-gray-800"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 text-xs sm:col-span-2">
                <label className="font-semibold text-gray-700 select-none">Assigned Business Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="border border-gray-200 rounded p-2.5 w-full focus:border-blue focus:outline-none text-gray-800 font-semibold"
                >
                  <option>North America - Central (Chicago Hub)</option>
                  <option>North America - East (New York Hub)</option>
                  <option>North America - West (Sunnyvale HQ)</option>
                  <option>EMEA - West (London Hub)</option>
                  <option>APAC - South (Singapore Hub)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-50 select-none">
              <button
                type="submit"
                className="bg-blue hover:bg-blue-dk text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm btn-transition"
              >
                Save Profile Changes
              </button>
            </div>
          </div>

          {/* 2. Functional Preferences Switchboard */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-sliders text-purple"></i>
              <span>Functional Preferences</span>
            </h2>

            <div className="flex flex-col gap-4">
              {/* Item 1 */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col leading-snug gap-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-gray-800">Critical Email Alerts</span>
                  <p className="text-[10px] text-gray-500 leading-relaxed select-text">
                    Deliver priority alerts to your Google Inbox immediately upon detection of high-risk legal BAA blocks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-9 h-5 rounded-full p-0.5 btn-transition focus:outline-none ${
                    emailAlerts ? "bg-blue" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    emailAlerts ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Item 2 */}
              <div className="flex items-start justify-between gap-4 border-t border-gray-50 pt-3">
                <div className="flex flex-col leading-snug gap-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-gray-800">Real-Time FHIR Syncing</span>
                  <p className="text-[10px] text-gray-500 leading-relaxed select-text">
                    Permit active background polling of connected Epic EHR Sandboxes endpoints to query recent clinical trial signups.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRealtimeSync(!realtimeSync)}
                  className={`w-9 h-5 rounded-full p-0.5 btn-transition focus:outline-none ${
                    realtimeSync ? "bg-blue" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    realtimeSync ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Item 3 */}
              <div className="flex items-start justify-between gap-4 border-t border-gray-50 pt-3">
                <div className="flex flex-col leading-snug gap-0.5 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">Gemini Real-time Medical Grounding</span>
                    <Badge label="Preview" variant="gemini" />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed select-text">
                    Enforce search-grounding check using medical literature schemas prior to building strategic alignment plans.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoGrounding(!autoGrounding)}
                  className={`w-9 h-5 rounded-full p-0.5 btn-transition focus:outline-none ${
                    autoGrounding ? "bg-purple text-purple" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    autoGrounding ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

        </form>

        {/* Right Column: Security Credentials & Sign Out (5/12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-6 select-none">
          
          {/* API Key Monospace Reference block */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-code-branch text-amber"></i>
              <span>Monospace Credentials block</span>
            </h2>

            <p className="text-[10px] text-gray-500 leading-relaxed select-text">
              For custom deployments, link your client dashboard tools using the authenticated HCLS workspace API key:
            </p>

            <div className="bg-gray-950 rounded-md p-3 font-mono text-[11px] text-gray-50 border border-gray-850 select-all break-all">
              <span>hcls_live_ce_d9a012bf8e2ac</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 select-none">
              <i className="fa-solid fa-circle-info text-blue text-xs mt-0.5"></i>
              <span>Workspace API keys can be revoked and refreshed inside the Integration Marketplace.</span>
            </div>
          </div>

          {/* Session Security Control */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-shield-halved text-red"></i>
              <span>Portal Access & Security</span>
            </h2>

            <p className="text-[10px] text-gray-500 leading-relaxed select-text">
              Your active session is validated by Google Internal OAuth credentials. Ensure proper screen locks are active when handling sensitive PHI.
            </p>

            <div className="flex flex-col gap-2 border-t border-gray-50 pt-3">
              <button
                onClick={handleSignOut}
                className="bg-red hover:bg-red/95 text-white text-xs font-semibold py-2 rounded w-full text-center btn-transition shadow-sm focus:outline-none"
              >
                Sign Out & Terminate Session
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
