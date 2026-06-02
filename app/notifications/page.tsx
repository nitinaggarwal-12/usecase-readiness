"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface NotificationLog {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "critical" | "warning" | "info" | "success";
  isUnread: boolean;
  actionLabel?: string;
  actionPath?: string;
}

export default function NotificationsPage() {
  const { showToast } = useToast();

  // Mock Notifications Logs
  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: "notif-1",
      title: "Critical Blocker: HIPAA BAA Delay",
      message: "Ascension Health outpatient discharge summarization launch blocked due to pending HIPAA BAA signature.",
      time: "10 mins ago",
      type: "critical",
      isUnread: true,
      actionLabel: "Acknowledge Blocker",
    },
    {
      id: "notif-2",
      title: "New FDA SaMD Regulatory Signal",
      message: "New enforcement signal detected for Clinical Decision Support AI software models. Review alignment parameters.",
      time: "2 hours ago",
      type: "warning",
      isUnread: true,
      actionLabel: "Review Signal",
    },
    {
      id: "notif-3",
      title: "Strategic Plan Generated",
      message: "Gemini 1.5 Pro successfully built the 5-page Strategic Alignment Plan for Stanford Medicine.",
      time: "Yesterday",
      type: "success",
      isUnread: false,
      actionLabel: "View Plan",
    },
    {
      id: "notif-4",
      title: "EHR Sandbox Connection Verified",
      message: "Stanford Medicine sandboxes credentials successfully connected to the Google FHIR store.",
      time: "3 days ago",
      type: "success",
      isUnread: false,
    },
    {
      id: "notif-5",
      title: "Value Target Escalation",
      message: "Cleveland Clinic bed-management value metrics dropped by 8% compared to top-quartile peers.",
      time: "4 days ago",
      type: "info",
      isUnread: false,
      actionLabel: "Command Center",
    },
  ]);

  // Filters State
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Quick Actions
  const handleMarkAllRead = () => {
    setLogs((prev) => prev.map((log) => ({ ...log, isUnread: false })));
    showToast("All alerts marked as read successfully.", "success");
  };

  const handleToggleRead = (id: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === id ? { ...log, isUnread: !log.isUnread } : log
      )
    );
  };

  const handleNotificationAction = (id: string, label: string) => {
    // Mark read automatically
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, isUnread: false } : log))
    );
    showToast(`Action triggered: ${label}`, "info");
  };

  // Filter notifications
  const filteredLogs = logs.filter((log) => {
    if (filter === "unread") return log.isUnread;
    if (filter === "read") return !log.isUnread;
    return true;
  });

  const unreadCount = logs.filter((log) => log.isUnread).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Header controls */}
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
            <span>System Alerts Ledger</span>
            {unreadCount > 0 && (
              <span className="bg-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500">
            Track priority clinical compliance updates, sandboxes alerts, and regulatory signals.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className={`text-xs font-semibold px-3 py-2 rounded border shadow-sm btn-transition focus:outline-none ${
            unreadCount === 0
              ? "bg-gray-50 text-gray-400 border-gray-150 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          }`}
        >
          Mark All as Read
        </button>
      </div>

      {/* Filters & Stats Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-1 select-none">
        <div className="flex items-center gap-2">
          {(["all", "unread", "read"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`text-xs font-bold capitalize px-3 py-1.5 rounded-md btn-transition focus:outline-none ${
                filter === opt
                  ? "bg-white border border-gray-200 text-blue shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {opt} Alerts
            </button>
          ))}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Displaying {filteredLogs.length} logs
        </span>
      </div>

      {/* Notifications Main list */}
      <div className="flex flex-col gap-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-xs select-none">
            No alerts found matching criteria.
          </div>
        ) : (
          filteredLogs.map((log) => {
            // Map type to custom colors
            const typeColors = {
              critical: { ring: "ring-red/25", dot: "bg-red", border: "border-l-red" },
              warning: { ring: "ring-amber/25", dot: "bg-amber", border: "border-l-amber" },
              info: { ring: "ring-blue/25", dot: "bg-blue", border: "border-l-blue" },
              success: { ring: "ring-green/25", dot: "bg-green", border: "border-l-green" },
            };

            const colors = typeColors[log.type] || typeColors.info;

            return (
              <div
                key={log.id}
                className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex gap-4 items-start justify-between border-l-[3px] transition-all ${
                  colors.border
                } ${log.isUnread ? "bg-white ring-1 ring-blue/10 shadow-md" : "opacity-90"}`}
              >
                
                {/* Left indicator and info */}
                <div className="flex gap-3 items-start min-w-0">
                  {/* Urgency Ring Dot */}
                  <button
                    onClick={() => handleToggleRead(log.id)}
                    className={`w-3.5 h-3.5 rounded-full ring-4 mt-1 flex-shrink-0 focus:outline-none btn-transition ${
                      colors.ring
                    } ${log.isUnread ? colors.dot : "bg-gray-300 ring-gray-100"}`}
                    title={log.isUnread ? "Mark as Read" : "Mark as Unread"}
                  />

                  <div className="flex flex-col gap-0.5 leading-snug min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate select-all ${
                        log.isUnread ? "text-gray-900" : "text-gray-600"
                      }`}>
                        {log.title}
                      </span>
                      
                      {log.type === "critical" && <Badge label="Critical" variant="critical" />}
                      {log.type === "warning" && <Badge label="Action Need" variant="warning" />}
                    </div>
                    
                    <p className="text-[11px] text-gray-500 leading-relaxed select-text">
                      {log.message}
                    </p>
                    
                    <span className="text-[10px] font-mono font-medium text-gray-400 mt-1 select-none">
                      {log.time}
                    </span>
                  </div>
                </div>

                {/* Inline CTA Action */}
                {log.actionLabel && (
                  <div className="flex-shrink-0 select-none">
                    <button
                      onClick={() => handleNotificationAction(log.id, log.actionLabel!)}
                      className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded border btn-transition shadow-sm focus:outline-none ${
                        log.type === "critical"
                          ? "bg-red hover:bg-red/95 text-white border-red"
                          : log.type === "warning"
                          ? "bg-amber hover:bg-amber/95 text-white border-amber"
                          : "bg-gray-950 hover:bg-gray-900 text-white border-gray-950"
                      }`}
                    >
                      {log.actionLabel}
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
