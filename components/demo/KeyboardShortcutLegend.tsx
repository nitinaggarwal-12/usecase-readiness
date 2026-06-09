"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useDemo } from "@/context/DemoContext";
import { useRouter } from "next/navigation";
import { getStepsForDuration } from "@/lib/demo-data/tour-steps";

export default function KeyboardShortcutLegend() {
  const router = useRouter();
  const { demoState, nextStep, prevStep, jumpToStep, setPresenterMode } = useDemo();
  const [isOpen, setIsOpen] = useState(false);

  // Keybindings listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing shortcuts when typing in inputs/selects
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "SELECT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Toggle Legend (? key)
      if (e.key === "?") {
        setIsOpen((prev) => !prev);
        e.preventDefault();
        return;
      }

      if (!demoState.isActive) return;

      const steps = getStepsForDuration(demoState.duration);

      const handleJump = (targetPath: string) => {
        const idx = steps.findIndex(
          (s) => s.screen === targetPath || targetPath.startsWith(s.screen) || s.screen.startsWith(targetPath)
        );
        if (idx !== -1) {
          jumpToStep(idx);
        }
        router.push(targetPath);
      };

      switch (key) {
        case "p":
          setPresenterMode(!demoState.isPresenterMode);
          break;
        case "n": {
          if (demoState.currentStepIndex < steps.length - 1) {
            nextStep();
            const nextStepObj = steps[demoState.currentStepIndex + 1];
            if (nextStepObj) {
              router.push(nextStepObj.screen);
            }
          }
          break;
        }
        case "b": {
          if (demoState.currentStepIndex > 0) {
            prevStep();
            const prevStepObj = steps[demoState.currentStepIndex - 1];
            if (prevStepObj) {
              router.push(prevStepObj.screen);
            }
          }
          break;
        }
        case "1":
          handleJump("/demo/dashboard");
          break;
        case "2":
          handleJump("/demo/accounts/northside-health");
          break;
        case "3":
          handleJump("/demo/assessments/northside-health/C");
          break;
        case "4":
          handleJump("/demo/reports/northside-health/C");
          break;
        case "5":
          handleJump("/demo/strategic-plan/northside-health");
          break;
        case "6":
          handleJump("/demo/timeline/northside-health");
          break;
        case "7":
          handleJump("/demo/bv");
          break;
        case "8":
          handleJump("/demo/regulatory");
          break;
        case "9":
          handleJump("/demo/customer-portal/northside-health");
          break;
        case "0":
          handleJump("/demo/full-circle/northside-health");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [demoState, nextStep, prevStep, jumpToStep, setPresenterMode, router]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      width="480px"
      title="Demo Keyboard Shortcuts"
    >
      <div className="flex flex-col gap-4 text-xs select-none">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Use the following physical keyboard shortcuts to navigate during live showcase presentations:
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 border border-gray-150 rounded bg-gray-50/50 p-4">
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Toggle Guide</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">D</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Presenter Mode</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">P</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Next Tour Step</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">N</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Prev Tour Step</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">B</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Dashboard</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">1</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Account Detail</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">2</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Assessment Flow</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">3</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Report View</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">4</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Strategic Plan</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">5</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Timeline / Gantt</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">6</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">BV CommandCenter</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">7</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Regulatory Intel</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">8</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Customer Portal</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">9</kbd>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-semibold">Full Circle Rep</span>
            <kbd className="bg-white border border-gray-200 shadow-sm rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">0</kbd>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-50 mt-1">
          <span className="text-[10px] text-gray-400 font-medium">Press ? again to close legend</span>
        </div>
      </div>
    </Modal>
  );
}
