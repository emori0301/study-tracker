"use client";

import type { TimerMode } from "@/types";

const SIZE = 280;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

const modeColor: Record<TimerMode, string> = {
  work: "stroke-primary",
  shortBreak: "stroke-green-500",
  longBreak: "stroke-blue-500",
};

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

interface TimerRingProps {
  timeLeft: number;
  progress: number;
  mode: TimerMode;
  isRunning: boolean;
}

export function TimerRing({ timeLeft, progress, mode, isRunning }: TimerRingProps) {
  const offset = CIRC * (1 - progress);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        {/* track */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none" stroke="currentColor"
          strokeWidth={STROKE}
          className="text-muted/30"
        />
        {/* progress */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          className={`${modeColor[mode]} transition-[stroke-dashoffset] duration-1000 ease-linear`}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-mono font-bold tabular-nums tracking-tight">
          {fmt(timeLeft)}
        </span>
        {isRunning && (
          <span className="mt-1 text-xs text-muted-foreground animate-pulse">集中中...</span>
        )}
      </div>
    </div>
  );
}
