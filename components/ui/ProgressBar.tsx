import React from "react";

interface ProgressBarProps {
  percentage: number;
  variant?: "default" | "blue" | "green" | "amber" | "red" | "auto";
  className?: string;
}

export default function ProgressBar({
  percentage,
  variant = "default",
  className = "",
}: ProgressBarProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Determine color variant based on value if "auto" is selected
  const getVariantColor = () => {
    if (variant !== "auto") return variant;
    if (clampedPercentage >= 75) return "green";
    if (clampedPercentage >= 50) return "amber";
    return "red";
  };

  const activeColor = getVariantColor();

  // Map variants to tailwind background colors
  const colorStyles = {
    default: "bg-blue",
    blue: "bg-blue",
    green: "bg-green-400",
    amber: "bg-amber",
    red: "bg-red",
  };

  return (
    <div
      className={`w-full h-[6px] bg-gray-200 rounded-[3px] overflow-hidden select-none progress-bar ${className}`}
    >
      <div
        className={`h-full rounded-[3px] transition-all duration-500 ease-out progress-fill ${
          colorStyles[activeColor] || colorStyles.default
        }`}
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
}
