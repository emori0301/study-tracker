"use client";

import { useCallback, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "@/hooks/use-timer";
import { TimerRing } from "./timer-ring";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSession } from "@/lib/actions/sessions";
import type { Subject, TimerSettings } from "@/types";
import type { TimerMode } from "@/types";

const modeLabel: Record<TimerMode, string> = {
  work:       "作業",
  shortBreak: "休憩",
  longBreak:  "長い休憩",
};

const modeTabActive: Record<TimerMode, string> = {
  work:       "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40",
  shortBreak: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  longBreak:  "bg-sky-500/20 text-sky-300 border border-sky-500/40",
};

const modeDotActive: Record<TimerMode, string> = {
  work:       "bg-indigo-400",
  shortBreak: "bg-emerald-400",
  longBreak:  "bg-sky-400",
};

interface TimerContainerProps {
  subjects: Subject[];
  settings: TimerSettings;
}

export function TimerContainer({ subjects, settings }: TimerContainerProps) {
  const [subjectId, setSubjectId] = useState<string>("");
  const timer = useTimer(settings);

  const handleComplete = useCallback(async () => {
    if (timer.mode === "work" && subjectId) {
      await createSession({ subjectId, duration: settings.workMinutes });
    }
  }, [timer.mode, subjectId, settings.workMinutes]);

  timer.setOnComplete(handleComplete);

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/8 bg-card/60 backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center gap-6">

        {/* モード切替タブ */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/8">
          {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => timer.switchMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timer.mode === m
                  ? modeTabActive[m]
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              }`}
            >
              {modeLabel[m]}
            </button>
          ))}
        </div>

        {/* タイマーリング */}
        <TimerRing
          timeLeft={timer.timeLeft}
          progress={timer.progress}
          mode={timer.mode}
          isRunning={timer.isRunning}
        />

        {/* セッションドット */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {Array.from({ length: settings.longBreakInterval }, (_, i) => (
              <span
                key={i}
                className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
                  i < timer.sessionCount % settings.longBreakInterval
                    ? modeDotActive[timer.mode]
                    : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {timer.sessionCount} セッション完了
          </span>
        </div>

        {/* 科目選択 */}
        <Select value={subjectId} onValueChange={(v) => setSubjectId(v ?? "")}>
          <SelectTrigger className="w-60 cursor-pointer">
            <SelectValue placeholder="科目を選択（任意）" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id} className="cursor-pointer">
                <span className="mr-2">{s.icon}</span>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* コントロール */}
        <div className="flex items-center gap-4">
          <button
            onClick={timer.reset}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {timer.isRunning ? (
            <button
              onClick={timer.pause}
              className="flex h-14 w-36 items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 text-foreground font-medium transition-all hover:bg-white/15 cursor-pointer"
            >
              <Pause className="h-5 w-5" />
              一時停止
            </button>
          ) : (
            <button
              onClick={timer.start}
              className="flex h-14 w-36 items-center justify-center gap-2 rounded-full font-medium transition-all cursor-pointer text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                boxShadow: "0 0 24px rgba(99,102,241,0.4)",
              }}
            >
              <Play className="h-5 w-5" />
              スタート
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
