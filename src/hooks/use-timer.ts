"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerMode, TimerSettings } from "@/types";

const DEFAULT_SETTINGS: TimerSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

function getMinutes(mode: TimerMode, settings: TimerSettings) {
  if (mode === "work") return settings.workMinutes;
  if (mode === "shortBreak") return settings.shortBreakMinutes;
  return settings.longBreakMinutes;
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {}
}

export function useTimer(settings: TimerSettings = DEFAULT_SETTINGS) {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const totalSeconds = getMinutes(mode, settings) * 60;
  const progress = (totalSeconds - timeLeft) / totalSeconds;

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const advance = useCallback(() => {
    playBeep();
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(mode === "work" ? "作業終了！休憩しましょう" : "休憩終了！作業を始めましょう");
    }
    onCompleteRef.current?.();

    setIsRunning(false);
    setSessionCount((prev) => {
      const next = mode === "work" ? prev + 1 : prev;
      if (mode === "work") {
        const nextMode = next % settings.longBreakInterval === 0 ? "longBreak" : "shortBreak";
        setMode(nextMode);
        setTimeLeft(getMinutes(nextMode, settings) * 60);
      } else {
        setMode("work");
        setTimeLeft(settings.workMinutes * 60);
      }
      return next;
    });
  }, [mode, settings]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clear();
            advance();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clear();
    }
    return clear;
  }, [isRunning, advance]);

  // settings変更時にタイマーリセット
  useEffect(() => {
    setTimeLeft(getMinutes(mode, settings) * 60);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.workMinutes, settings.shortBreakMinutes, settings.longBreakMinutes]);

  const start = () => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = useCallback(() => {
    clear();
    setIsRunning(false);
    setTimeLeft(getMinutes(mode, settings) * 60);
  }, [mode, settings]);

  const switchMode = useCallback((next: TimerMode) => {
    clear();
    setIsRunning(false);
    setMode(next);
    setTimeLeft(getMinutes(next, settings) * 60);
  }, [settings]);

  const setOnComplete = (fn: () => void) => {
    onCompleteRef.current = fn;
  };

  return {
    mode,
    timeLeft,
    isRunning,
    sessionCount,
    progress,
    totalSeconds,
    start,
    pause,
    reset,
    switchMode,
    setOnComplete,
  };
}
