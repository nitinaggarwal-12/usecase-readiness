import React from "react";
import Badge from "./Badge";

// Represents the status of each of the 10 assessments (A through J)
// 'done' = completed (blue), 'prog' = in progress (light blue), 'blk' = blocked (red), 'todo' = locked/unstarted (gray)
export type AssessmentStatus = "done" | "prog" | "blk" | "todo";

interface AccountCardProps {
  orgName: string;
  useCase: string;
  stage: "Pre-Sales" | "Production" | "At-Risk" | "FDE Nominated";
  score: number;
  isAtRisk?: boolean;
  // Array of 10 statuses representing assessments A-E and F-J
  assessments?: AssessmentStatus[]; 
  onClick?: () => void;
  assessmentName?: string;
}

export default function AccountCard({
  orgName,
  useCase,
  stage,
  score,
  isAtRisk = false,
  assessments = ["todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo", "todo"],
  onClick,
  assessmentName,
}: AccountCardProps) {
  
  // Helper for initials avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Determine Score Dot color class matching .sd-* specs
  const getScoreDotClass = (scoreVal: number) => {
    if (scoreVal >= 90) return "border-blue text-blue bg-blue-50/40";
    if (scoreVal >= 75) return "border-green text-green bg-green-50/40";
    if (scoreVal >= 50) return "border-amber text-amber bg-amber-50/40";
    return "border-red text-red bg-red-50/40";
  };

  // Render the 11-dot progress tracker (5 pre-sales, gap spacer, 5 post-sales)
  const renderProgressDots = () => {
    const dotStyles = {
      done: "bg-blue border border-blue/10",
      prog: "bg-blue-100 border border-blue/10",
      blk: "bg-red border border-red/10 animate-pulse",
      todo: "bg-gray-200 border border-gray-300/50",
    };

    const dotElements = [];

    // Pre-sales dots (A to E)
    for (let i = 0; i < 5; i++) {
      const status = assessments[i] || "todo";
      dotElements.push(
        <div
          key={`pre-${i}`}
          className={`w-[24px] h-[8px] rounded-[4px] ${dotStyles[status]}`}
          title={`Assessment ${String.fromCharCode(65 + i)}: ${status}`}
        />
      );
    }

    // Gap spacer (6th element)
    dotElements.push(
      <div key="gap" className="w-[10px] h-[8px] bg-transparent" />
    );

    // Post-sales dots (F to J)
    for (let i = 5; i < 10; i++) {
      const status = assessments[i] || "todo";
      dotElements.push(
        <div
          key={`post-${i}`}
          className={`w-[24px] h-[8px] rounded-[4px] ${dotStyles[status]}`}
          title={`Assessment ${String.fromCharCode(65 + i)}: ${status}`}
        />
      );
    }

    return <div className="flex items-center gap-1 a-dots">{dotElements}</div>;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-lg p-5 hover-card-lift flex flex-col justify-between gap-4 cursor-pointer select-none h-[148px] ac-card ${
        isAtRisk || stage === "At-Risk" ? "border-red/30 ring-1 ring-red/5" : "border-gray-200"
      }`}
    >
      {/* Top Row: Avatar, Org Name, Score Dot */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar circle */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold select-none flex-shrink-0 ${
            isAtRisk || stage === "At-Risk" 
              ? "bg-red-50 text-red border border-red/10" 
              : "bg-blue-50 text-blue border border-blue/10"
          }`}>
            {getInitials(orgName)}
          </div>
          
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-extrabold text-gray-900 truncate">
              {orgName}
              {assessmentName && (
                <span className="text-xs font-normal text-gray-400 ml-1">
                  ({assessmentName})
                </span>
              )}
            </span>
            <span className="text-xs text-gray-500 truncate mt-0.5">{useCase}</span>
          </div>
        </div>

        {/* Compact Score Dot (36px circle) */}
        <div
          className={`w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center text-xs font-bold score-dot flex-shrink-0 ${getScoreDotClass(
            score
          )}`}
          title={`Account overall readiness score: ${score}`}
        >
          {score}
        </div>
      </div>

      {/* Bottom Row: Progress Tracker Dots & Stage Badge */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-50">
        {/* 11-dot Progress Indicator */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 select-none">
            Readiness Journey (A-J)
          </span>
          {renderProgressDots()}
        </div>

        {/* Stage Badge */}
        <Badge
          label={stage}
          variant={
            stage === "Production"
              ? "success"
              : stage === "At-Risk"
              ? "critical"
              : "info"
          }
          className="flex-shrink-0"
        />
      </div>
    </div>
  );
}
