"use client";

import { useTimerSettings } from "@/hooks/use-timer-settings";
import { TimerContainer } from "./timer-container";
import type { Subject } from "@/types";

export function TimerPageClient({ subjects }: { subjects: Subject[] }) {
  const { settings } = useTimerSettings();
  return <TimerContainer subjects={subjects} settings={settings} />;
}
