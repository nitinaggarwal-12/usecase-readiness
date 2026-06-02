import React from "react";

interface OptionCardProps {
  text: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export default function OptionCard({
  text,
  selected,
  onClick,
  className = "",
}: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full border rounded-md p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 select-none opt-card ${
        selected
          ? "border-[1.5px] border-blue bg-blue-50/50 sel"
          : "border-gray-200 hover:bg-gray-50 bg-white"
      } ${className}`}
    >
      {/* Custom Radio Circle */}
      <div
        className={`w-[16px] h-[16px] rounded-full border flex items-center justify-center flex-shrink-0 opt-radio ${
          selected ? "border-blue bg-blue" : "border-gray-400 bg-white"
        }`}
      >
        {selected && (
          <div className="w-[6px] h-[6px] rounded-full bg-white" />
        )}
      </div>

      {/* Option Text */}
      <span
        className={`text-xs select-none transition-colors duration-200 ${
          selected ? "font-medium text-blue" : "text-gray-700"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
