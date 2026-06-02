import React from "react";

interface BenchmarkBarProps {
  score: number;
  peerAvg?: number;
  topQuartile?: number;
  className?: string;
}

export default function BenchmarkBar({
  score,
  peerAvg = 68,
  topQuartile = 84,
  className = "",
}: BenchmarkBarProps) {
  // Clamp values
  const userPct = Math.max(0, Math.min(100, score));
  const peerPct = Math.max(0, Math.min(100, peerAvg));
  const quartPct = Math.max(0, Math.min(100, topQuartile));

  return (
    <div className={`flex flex-col gap-6 w-full select-none font-sans ${className}`}>
      {/* Top Row: Benchmark Labels */}
      <div className="relative h-4 text-[10px] font-semibold text-gray-500 select-none uppercase tracking-wider">
        {/* User Score Label */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500"
          style={{ left: `${userPct}%` }}
        >
          <span className="text-blue font-bold text-xs">You</span>
        </div>

        {/* Peer Avg Label */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${peerPct}%` }}
        >
          <span>Peer Avg ({peerAvg}%)</span>
        </div>

        {/* Top Quartile Label */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${quartPct}%` }}
        >
          <span>Top Quartile ({topQuartile}%)</span>
        </div>
      </div>

      {/* Main Track Container */}
      <div className="relative h-[6px] w-full bg-gray-200 rounded-[3px] bench-row">
        {/* Track filled in blue up to user's score */}
        <div
          className="absolute top-0 left-0 h-full bg-blue rounded-[3px] transition-all duration-500 ease-out bench-track"
          style={{ width: `${userPct}%` }}
        />

        {/* Peer Average Vertical Dotted Line */}
        <div
          className="absolute top-[-6px] h-[18px] w-[1px] border-l border-dashed border-gray-500 z-10"
          style={{ left: `${peerPct}%` }}
        />

        {/* Top Quartile Vertical Dotted Line */}
        <div
          className="absolute top-[-6px] h-[18px] w-[1px] border-l border-dashed border-gray-500 z-10"
          style={{ left: `${quartPct}%` }}
        />

        {/* User "You" Marker - 2px vertical line */}
        <div
          className="absolute top-[-4px] h-[14px] w-[2px] bg-blue z-20 transition-all duration-500 ease-out bench-marker shadow-sm"
          style={{ left: `${userPct}%` }}
        />
      </div>
    </div>
  );
}
