import React from "react";

export type FlagVariant = "crit" | "warn" | "info" | "ok";

interface FlagCardProps {
  title: string;
  message: string;
  variant: FlagVariant;
  actions: React.ReactNode;
  className?: string;
}

export default function FlagCard({
  title,
  message,
  variant,
  actions,
  className = "",
}: FlagCardProps) {
  // Map variants to styles
  const styles = {
    crit: {
      border: "border-l-[3px] border-l-red border-red/10 bg-red-50/60",
      icon: "fa-circle-exclamation text-red",
    },
    warn: {
      border: "border-l-[3px] border-l-amber border-amber/10 bg-amber-50/60",
      icon: "fa-triangle-exclamation text-amber",
    },
    info: {
      border: "border-l-[3px] border-l-blue border-blue/10 bg-blue-50/60",
      icon: "fa-circle-info text-blue",
    },
    ok: {
      border: "border-l-[3px] border-l-green border-green/10 bg-green-50/60",
      icon: "fa-circle-check text-green",
    },
  };

  const activeStyle = styles[variant] || styles.info;

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-r-lg ${activeStyle.border} ${className}`}
    >
      {/* Left section: Icon + Text */}
      <div className="flex gap-3 items-start">
        <div className="mt-0.5 text-base flex-shrink-0">
          <i className={`fa-solid ${activeStyle.icon}`}></i>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-gray-900 mb-0.5">{title}</span>
          <span className="text-xs text-gray-700">{message}</span>
        </div>
      </div>

      {/* Right section: Buttons / Actions */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 flag-actions">
          {actions}
        </div>
      )}
    </div>
  );
}
