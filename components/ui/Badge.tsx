import React from "react";

export type BadgeVariant = "success" | "warning" | "critical" | "info" | "gemini";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ label, variant = "info", className = "" }: BadgeProps) {
  // Base class styles
  const baseStyle = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider select-none";

  // Variant specific styles
  const variantStyles = {
    success: "bg-green-50 text-green border border-green/10",
    warning: "bg-amber-50 text-amber border border-amber/10",
    critical: "bg-red-50 text-red border border-red/10",
    info: "bg-blue-50 text-blue border border-blue/10",
    gemini: "bg-purple-50 text-purple border border-purple/10 font-sans normal-case py-0.5 px-2 rounded-full",
  };

  if (variant === "gemini") {
    return (
      <span className={`${baseStyle} ${variantStyles.gemini} ${className}`}>
        <i className="fa-solid fa-wand-magic-sparkles mr-1.5 text-[10px]"></i>
        <span>{label || "Gemini"}</span>
      </span>
    );
  }

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  );
}
