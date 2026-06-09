"use client";

import React, { useState } from "react";
import { useDemo } from "@/context/DemoContext";
import { getStepsForDuration } from "@/lib/demo-data/tour-steps";
import { useRouter } from "next/navigation";

export default function DemoGuideOverlay() {
  const router = useRouter();
  const { demoState, nextStep, prevStep, jumpToStep, setMinimized } = useDemo();

  // Active guide context details
  const [isVisible, setIsVisible] = useState(true);

  // Keyboard shortcut listener to reopen (D key)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!demoState.isActive) return;

      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "SELECT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key.toLowerCase() === "d") {
        setIsVisible(true);
        setMinimized(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [demoState.isActive, setMinimized]);

  if (!demoState.isActive || !isVisible) return null;

  const steps = getStepsForDuration(demoState.duration);
  const currentStep = steps[demoState.currentStepIndex] || steps[0];
  const progressPercent = Math.round(((demoState.currentStepIndex + 1) / steps.length) * 100);

  const handleNext = () => {
    if (demoState.currentStepIndex < steps.length - 1) {
      nextStep();
      const nextStepObj = steps[demoState.currentStepIndex + 1];
      if (nextStepObj) {
        router.push(nextStepObj.screen);
      }
    }
  };

  const handlePrev = () => {
    if (demoState.currentStepIndex > 0) {
      prevStep();
      const prevStepObj = steps[demoState.currentStepIndex - 1];
      if (prevStepObj) {
        router.push(prevStepObj.screen);
      }
    }
  };

  const handleStepSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    jumpToStep(idx);
    const targetStep = steps[idx];
    if (targetStep) {
      router.push(targetStep.screen);
    }
  };

  const handleCloseGuide = () => {
    setIsVisible(false);
  };

  if (demoState.isTourMinimized) {
    return (
      <div 
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 bg-navy text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-navy/20 cursor-pointer hover:bg-navy-lt btn-transition z-[400] flex items-center gap-2 select-none animate-bounce"
      >
        <i className="fa-solid fa-graduation-cap"></i>
        <span>Demo Guide • Step {demoState.currentStepIndex + 1}/{steps.length}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[300px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[400] flex flex-col overflow-hidden select-none animate-fadeIn">
      
      {/* Header banner */}
      <div className="bg-navy text-white px-4 py-3 flex items-center justify-between">
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">Showcase Advisor</span>
          <span className="text-xs font-bold mt-1 truncate max-w-[200px]">{demoState.selectedScenario?.account.name}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMinimized(true)}
            className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 btn-transition"
            title="Minimize Guide Overlay"
          >
            <i className="fa-solid fa-minus text-[10px]"></i>
          </button>
          <button
            onClick={handleCloseGuide}
            className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 btn-transition"
            title="Close Guide Overlay (Press 'D' to reopen)"
          >
            <i className="fa-solid fa-xmark text-[10px]"></i>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full bg-blue transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Selector dropdown */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <select
          value={demoState.currentStepIndex}
          onChange={handleStepSelect}
          className="w-full border border-gray-200 rounded p-1.5 text-[11px] font-semibold text-gray-700 focus:outline-none"
        >
          {steps.map((step, idx) => (
            <option key={idx} value={idx}>
              Step {idx + 1}: {step.title}
            </option>
          ))}
        </select>
      </div>

      {/* Body content */}
      <div className="p-4 flex flex-col gap-3.5 max-h-[320px] overflow-y-auto">
        
        {/* Step Name */}
        <div className="flex flex-col gap-0.5 leading-snug">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Showcase Step</span>
          <span className="text-xs font-bold text-navy select-text">{currentStep.title}</span>
        </div>

        {/* What to Say (Italic talking points) */}
        <div className="flex flex-col gap-1 bg-purple-50/40 border border-purple/10 rounded p-3 select-text text-[11px] leading-relaxed italic text-gray-700">
          <span className="text-[9px] font-bold text-purple uppercase tracking-wider not-italic">CE Talking Point</span>
          &ldquo;{currentStep.say}&rdquo;
        </div>

        {/* What to Click next */}
        <div className="flex flex-col gap-1 select-text text-[10px] leading-normal text-blue font-semibold">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Interactive Showcase Action</span>
          <div className="flex items-start gap-1.5 mt-0.5">
            <i className="fa-solid fa-arrow-pointer mt-0.5 text-xs"></i>
            <span>{currentStep.click}</span>
          </div>
        </div>

      </div>

      {/* Footer navigation */}
      <div className="bg-gray-50 border-t border-gray-150 px-4 py-2.5 flex items-center justify-between text-xs">
        <button
          onClick={handlePrev}
          disabled={demoState.currentStepIndex === 0}
          className={`font-semibold btn-transition px-2.5 py-1.5 rounded border focus:outline-none ${
            demoState.currentStepIndex === 0
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "text-gray-600 hover:bg-white border-gray-200"
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={demoState.currentStepIndex === steps.length - 1}
          className={`font-bold btn-transition px-3.5 py-1.5 rounded focus:outline-none ${
            demoState.currentStepIndex === steps.length - 1
              ? "text-gray-300 border-transparent cursor-not-allowed bg-gray-200"
              : "bg-blue hover:bg-blue-dk text-white shadow-sm"
          }`}
        >
          Next Step
        </button>
      </div>

    </div>
  );
}
