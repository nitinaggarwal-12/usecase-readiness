"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface SavedReadinessAssessment {
  id: string;
  customerName: string;
  segment: string;
  useCase: string;
  assessmentName: string;
  answers: Record<number, number | number[] | null | undefined>;
  score: number;
  archetype: string;
  updatedAt: string;
}

export default function AllAssessmentsPage() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { showToast } = useToast();
  const [savedList, setSavedList] = useState<SavedReadinessAssessment[]>([]);

  const isDemo = pathname.startsWith("/demo");

  const getRoutePath = (path: string) => {
    return isDemo ? `/demo${path}` : path;
  };

  useEffect(() => {
    const saved = localStorage.getItem("hcls_usecase_readiness_history");
    if (saved) {
      try {
        setSavedList(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved readiness list", e);
      }
    }
  }, []);

  const handleOpenAssessment = (item: SavedReadinessAssessment) => {
    // Populate session storage so the wizard picks it up on mount
    const metaObj = {
      customerName: item.customerName,
      segment: item.segment,
      useCase: item.useCase,
      assessmentName: item.assessmentName,
      activeAssessmentId: item.id,
      showResults: true,
    };
    sessionStorage.setItem("hcls_usecase_readiness_meta", JSON.stringify(metaObj));
    sessionStorage.setItem("hcls_usecase_readiness_answers", JSON.stringify(item.answers));

    showToast(`Opening assessment for ${item.customerName}...`, "info");
    router.push(getRoutePath(`/usecase-readiness?id=${item.id}`));
  };

  const handleDeleteAssessment = (id: string, customerName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop card click from triggering load
    if (confirm(`Are you sure you want to delete the assessment for ${customerName}?`)) {
      const filtered = savedList.filter((item) => item.id !== id);
      setSavedList(filtered);
      localStorage.setItem("hcls_usecase_readiness_history", JSON.stringify(filtered));
      showToast("Assessment deleted from history.", "success");
    }
  };

  const handleStartNew = () => {
    router.push(getRoutePath("/usecase-readiness?action=new"));
  };

  // Helper score color
  const getScoreBadgeStyles = (score: number) => {
    if (score >= 76) return "bg-green-50 text-green border-green-200";
    if (score >= 51) return "bg-amber-50 text-amber border-amber-200";
    return "bg-red-50 text-red border-red-200";
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in select-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
        <div className="flex flex-col gap-1 page-header">
          <h1 className="text-gray-900">Usecase Readiness Portfolio</h1>
          <p className="text-xs text-gray-500">
            View, open, or delete saved AI architecture readiness scoping assessments across clinical and business initiatives.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="bg-blue hover:bg-blue-dk text-white text-xs font-bold px-4 py-2.5 rounded-md btn-transition shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
          title="Configure details and launch a new readiness scoping cycle"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Start New Assessment</span>
        </button>
      </div>

      {/* TILES CONTAINER */}
      {savedList.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center select-text">
          <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center text-2xl shadow-inner">
            <i className="fa-solid fa-folder-open"></i>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-gray-900">No Assessments Saved Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              You haven&apos;t saved any usecase readiness assessments. Click the button below to configure parameters and launch your first one.
            </p>
          </div>
          <button
            onClick={handleStartNew}
            className="bg-blue hover:bg-blue-dk text-white text-xs font-bold py-2 px-4 rounded btn-transition shadow-sm mt-2"
          >
            Launch First Assessment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 select-text">
          {savedList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenAssessment(item)}
              className="bg-white border border-gray-200 hover:border-blue rounded-xl p-5 shadow-sm hover:shadow-md btn-transition cursor-pointer flex flex-col justify-between gap-5 relative group"
            >
              <div className="flex flex-col gap-2.5">
                {/* Top Row: Customer & Score Badge */}
                <div className="flex justify-between items-start gap-4 pr-6">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.segment}</h3>
                    <h2 className="text-sm font-extrabold text-gray-900 mt-0.5 truncate max-w-[180px]">{item.customerName}</h2>
                  </div>
                  <div className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded border flex-shrink-0 select-none ${getScoreBadgeStyles(item.score)}`}>
                    {item.score}%
                  </div>
                </div>

                {/* Middle Info */}
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Use Case</span>
                  <span className="font-semibold text-gray-800 line-clamp-2 leading-relaxed min-h-[36px]">{item.useCase || "No use case description provided."}</span>
                </div>
              </div>

              {/* Bottom Metadata & Delete Action */}
              <div className="border-t border-gray-100 pt-3.5 flex items-center justify-between text-[10px] text-gray-400 font-bold select-none">
                <div className="flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar"></i>
                  <span>{item.updatedAt}</span>
                </div>
                <div className="truncate max-w-[120px] italic font-semibold">{item.assessmentName}</div>
              </div>

              {/* Trash/Delete Action Overlay */}
              <button
                onClick={(e) => handleDeleteAssessment(item.id, item.customerName, e)}
                className="absolute right-4 bottom-[48px] w-8 h-8 rounded bg-gray-50 border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red hover:border-red/10 flex items-center justify-center opacity-0 group-hover:opacity-100 btn-transition shadow-sm"
                title="Delete saved assessment"
              >
                <i className="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
