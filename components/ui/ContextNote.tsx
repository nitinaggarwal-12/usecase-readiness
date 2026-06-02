import React from "react";

interface ContextNoteProps {
  text: string;
  className?: string;
}

export default function ContextNote({ text, className = "" }: ContextNoteProps) {
  if (!text) return null;

  return (
    <div
      className={`bg-blue-50 border-l-[3px] border-l-blue rounded-r-md p-3 text-xs text-blue-800 leading-relaxed select-none ctx-note ${className}`}
    >
      <div className="flex items-start gap-2">
        <i className="fa-solid fa-circle-info text-blue mt-0.5 flex-shrink-0"></i>
        <span>{text}</span>
      </div>
    </div>
  );
}
