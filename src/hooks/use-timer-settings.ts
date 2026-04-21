"use client";

import { useEffect, useState } from "react";
import type { TimerSettings } from "@/types";

const KEY = "timer-settings";

const DEFAULT: TimerSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

export function useTimerSettings() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  function save(next: TimerSettings) {
    setSettings(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return { settings, save };
}
