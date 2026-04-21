"use client";

import { useState } from "react";
import { useTimerSettings } from "@/hooks/use-timer-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function TimerSettingsForm() {
  const { settings, save } = useTimerSettings();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  function set(key: keyof typeof form, value: string) {
    const num = parseInt(value);
    if (isNaN(num) || num <= 0) return;
    setForm((prev) => ({ ...prev, [key]: num }));
  }

  function handleSave() {
    save(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields = [
    { key: "workMinutes" as const, label: "作業時間", unit: "分" },
    { key: "shortBreakMinutes" as const, label: "短い休憩", unit: "分" },
    { key: "longBreakMinutes" as const, label: "長い休憩", unit: "分" },
    { key: "longBreakInterval" as const, label: "長い休憩の間隔", unit: "セット" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ポモドーロタイマー</CardTitle>
        <CardDescription>タイマーの時間を設定します（タイマーページに反映されます）</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ key, label, unit }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key}>{label}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={key}
                  type="number"
                  min={1}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleSave}>
          {saved ? "✓ 保存しました" : "保存"}
        </Button>
      </CardContent>
    </Card>
  );
}
