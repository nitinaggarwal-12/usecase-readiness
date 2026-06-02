import React from "react";

interface BlockerAlertProps {
  title: string;
  message: string;
  onFix: () => void;
  className?: string;
}

export default function BlockerAlert({
  title,
  message,
  onFix,
  className = "",
}: BlockerAlertProps) {
  return (
    <div
      className={`bg-amber-50 border border-amber-100 border-l-[3px] border-l-amber rounded-r-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm select-none blocker-alert ${className}`}
    >
      {/* Icon + Text */}
      <div className="flex gap-3 items-start">
        <div className="text-amber mt-0.5 flex-shrink-0">
          <i className="fa-solid fa-circle-xmark text-sm"></i>
        </div>
        <div className="flex flex-col leading-tight text-xs">
          <span className="font-bold text-gray-900 mb-0.5 select-text">{title}</span>
          <span className="text-gray-700 leading-relaxed select-text">{message}</span>
        </div>
      </div>

      {/* Action button (Fix Now is required) */}
      <button
        onClick={onFix}
        className="bg-amber hover:bg-amber/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md btn-transition shadow-sm flex-shrink-0 flex items-center gap-1.5 uppercase tracking-wider"
      >
        <i className="fa-solid fa-screwdriver-wrench"></i>
        <span>Fix Now</span>
      </button>
    </div>
  );
}
