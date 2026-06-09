import React from "react";

interface ScoreRingProps {
  score: number;
  variant?: "default" | "blue" | "green" | "amber" | "red";
  size?: "default" | "lg";
  className?: string;
}

export default function ScoreRing({
  score,
  variant = "default",
  size = "default",
  className = "",
}: ScoreRingProps) {
  // Determine color variant dynamically if "default" is selected
  const getVariantColor = () => {
    if (variant !== "default") return variant;
    if (score >= 90) return "blue";
    if (score >= 75) return "green";
    if (score >= 50) return "amber";
    return "red";
  };

  const activeColor = getVariantColor();

  // Map variants to CSS class styles
  const colorStyles = {
    blue: "border-blue text-blue",
    green: "border-green text-green",
    amber: "border-amber text-amber",
    red: "border-red text-red",
  };

  const sizeStyles = {
    default: "w-[84px] h-[84px] border-[5px]",
    lg: "w-[104px] h-[104px] border-[7px]",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-transparent font-sans font-bold select-none ${
        sizeStyles[size]
      } ${colorStyles[activeColor] || colorStyles.blue} ${className}`}
    >
      <div className="flex flex-col items-center justify-center leading-none">
        <span className={size === "lg" ? "text-2xl" : "text-lg"}>{score}</span>
        <span className="text-[10px] text-gray-500 font-semibold mt-0.5 opacity-85">/100</span>
      </div>
    </div>
  );
}
