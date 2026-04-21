"use client";

import { useState, useTransition } from "react";
import { upsertGoal } from "@/lib/actions/goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GoalSettingsFormProps {
  currentMinutes: number;
}

export function GoalSettingsForm({ currentMinutes }: GoalSettingsFormProps) {
  const [hours, setHours] = useState(Math.floor(currentMinutes / 60).toString());
  const [minutes, setMinutes] = useState((currentMinutes % 60).toString());
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const total = parseInt(hours || "0") * 60 + parseInt(minutes || "0");
    if (total <= 0) return;
    startTransition(async () => {
      await upsertGoal(total);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">1日の学習目標</CardTitle>
        <CardDescription>毎日の目標学習時間を設定します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="goal-hours">時間</Label>
            <Input
              id="goal-hours"
              type="number"
              min={0} max={23}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-20"
            />
          </div>
          <span className="pb-2 text-muted-foreground">時間</span>
          <div className="space-y-1.5">
            <Label htmlFor="goal-minutes">分</Label>
            <Input
              id="goal-minutes"
              type="number"
              min={0} max={59}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-20"
            />
          </div>
          <span className="pb-2 text-muted-foreground">分</span>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {saved ? "✓ 保存しました" : isPending ? "保存中..." : "保存"}
        </Button>
      </CardContent>
    </Card>
  );
}
