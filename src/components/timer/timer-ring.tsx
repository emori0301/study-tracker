"use client";

import type { TimerMode } from "@/types";

const SIZE = 320;
const STROKE = 16;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

const modeConfig: Record<TimerMode, { stroke: string; glow: string; label: string; labelColor: string }> = {
  work:       { stroke: "#818cf8", glow: "rgba(129,140,248,0.6)", label: "集中中",   labelColor: "#818cf8" },
  shortBreak: { stroke: "#34d399", glow: "rgba(52,211,153,0.6)",  label: "休憩中",   labelColor: "#34d399" },
  longBreak:  { stroke: "#38bdf8", glow: "rgba(56,189,248,0.6)",  label: "長い休憩", labelColor: "#38bdf8" },
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
  const cfg = modeConfig[mode];
  const filterId = `glow-${mode}`;

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width={SIZE} height={SIZE} className="-rotate-90" style={{ overflow: "visible" }}>
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* outer decorative ring */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R + STROKE / 2 + 6}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />

        {/* track */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />

        {/* progress arc */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke={cfg.stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          filter={`url(#${filterId})`}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s ease" }}
        />
      </svg>

      <div className="absolute flex flex-col items-center gap-1">
        <span
          className="text-7xl font-mono font-bold tabular-nums tracking-tight text-white"
          style={{ textShadow: `0 0 40px ${cfg.glow}` }}
        >
          {fmt(timeLeft)}
        </span>
        <span
          className="text-sm font-medium tracking-widest uppercase"
          style={{
            color: cfg.labelColor,
            opacity: isRunning ? 1 : 0.4,
            transition: "opacity 0.3s",
          }}
        >
          {isRunning ? cfg.label : "待機中"}
        </span>
      </div>
    </div>
  );
}
