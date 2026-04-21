"use client";

import { useCallback, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "@/hooks/use-timer";
import { TimerRing } from "./timer-ring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  work: "作業",
  shortBreak: "休憩",
  longBreak: "長い休憩",
};

const modeBadgeVariant: Record<TimerMode, "default" | "secondary" | "outline"> = {
  work: "default",
  shortBreak: "secondary",
  longBreak: "outline",
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

  const dots = Array.from({ length: settings.longBreakInterval }, (_, i) => (
    <span
      key={i}
      className={`inline-block h-2 w-2 rounded-full ${
        i < timer.sessionCount % settings.longBreakInterval
          ? "bg-primary"
          : "bg-muted"
      }`}
    />
  ));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* モード切替 */}
      <div className="flex gap-2">
        {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => timer.switchMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              timer.mode === m
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {modeLabel[m]}
          </button>
        ))}
      </div>

      {/* リング */}
      <TimerRing
        timeLeft={timer.timeLeft}
        progress={timer.progress}
        mode={timer.mode}
        isRunning={timer.isRunning}
      />

      {/* セッションドット */}
      <div className="flex items-center gap-2">
        <Badge variant={modeBadgeVariant[timer.mode]}>{modeLabel[timer.mode]}</Badge>
        <div className="flex gap-1">{dots}</div>
        <span className="text-xs text-muted-foreground">
          {timer.sessionCount} セッション完了
        </span>
      </div>

      {/* 科目選択 */}
      <Select value={subjectId} onValueChange={(v) => setSubjectId(v ?? "")}>
        <SelectTrigger className="w-60">
          <SelectValue placeholder="科目を選択（任意）" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              <span className="mr-2">{s.icon}</span>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* コントロール */}
      <div className="flex gap-3">
        <Button variant="outline" size="icon" onClick={timer.reset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        {timer.isRunning ? (
          <Button size="lg" className="w-32" onClick={timer.pause}>
            <Pause className="h-5 w-5 mr-2" />
            一時停止
          </Button>
        ) : (
          <Button size="lg" className="w-32" onClick={timer.start}>
            <Play className="h-5 w-5 mr-2" />
            スタート
          </Button>
        )}
      </div>
    </div>
  );
}
