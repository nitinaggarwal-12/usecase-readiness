"use client";

import React from "react";
import { useParams } from "next/navigation";
import ReportViewContent from "@/components/demo/ReportViewContent";
import { useDemo } from "@/context/DemoContext";

export default function ReportViewPageWrapper() {
  const { id } = useParams() as { id: string };
  const { scenarios } = useDemo();

  // Find resolved scenario
  const sc = scenarios.find(
    (s) => s.id === id || s.id.startsWith(id) || id.startsWith(s.id)
  );

  // Default code based on highest completed scenario phase
  let defaultCode = "A";
  if (sc) {
    const baseCodes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for (let i = baseCodes.length - 1; i >= 0; i--) {
      const code = baseCodes[i];
      const score = sc.scores[code];
      if (score && typeof score === "number" && score > 0) {
        defaultCode = code;
        break;
      }
    }
  } else {
    if (id === "northside" || id === "northside-health") {
      defaultCode = "C";
    } else if (id === "pacific" || id === "pacific-medical") {
      defaultCode = "E";
    } else if (id === "midamerica" || id === "midamerica-payer") {
      defaultCode = "F";
    } else {
      defaultCode = "J";
    }
  }
  
  return <ReportViewContent overrideParams={{ id, code: defaultCode }} />;
}
