import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  icon?: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  trend,
  trendType = "neutral",
  icon,
  className = "",
}: MetricCardProps) {
  // Determine trend text styling
  const trendStyles = {
    up: "text-green bg-green-50",
    down: "text-red bg-red-50",
    neutral: "text-gray-700 bg-gray-50",
  };

  const trendIcons = {
    up: "fa-arrow-trend-up",
    down: "fa-arrow-trend-down",
    neutral: "fa-minus",
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover-card-lift select-none h-[108px] ${className}`}
    >
      {/* Top Row: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="section-title truncate">{title}</span>
        {icon && (
          <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0">
            <i className={`fa-solid ${icon} text-xs`}></i>
          </div>
        )}
      </div>

      {/* Bottom Row: Metric Value & Trend */}
      <div className="flex items-end justify-between gap-2 mt-2">
        <span className="metric-value truncate select-all">{value}</span>
        
        {trend && (
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold select-none ${trendStyles[trendType]}`}
          >
            <i className={`fa-solid ${trendIcons[trendType]} text-[9px]`}></i>
            <span>{trend}</span>
          </span>
        )}
      </div>
    </div>
  );
}
