"use client";

import React from "react";
import { useDemo } from "@/context/DemoContext";

export default function DemoBanner() {
  const { demoState, exitDemo } = useDemo();

  if (!demoState.isActive) return null;

  return (
    <div className="h-[36px] bg-amber-50 border-b border-amber-200 flex items-center justify-between px-6 select-none z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-wand-magic-sparkles text-amber text-xs animate-pulse"></i>
        <span className="text-[12px] font-bold text-amber leading-none">
          DEMO MODE — Synthetic data only. No real customer information is displayed.
        </span>
      </div>

      <button
        onClick={exitDemo}
        className="border border-amber text-amber text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded hover:bg-amber hover:text-white btn-transition focus:outline-none"
        title="Exit Showcase Demonstration Mode"
      >
        Exit Demo
      </button>
    </div>
  );
}
