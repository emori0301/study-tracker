import Link from "next/link";
import { Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function fmt(min: number) {
  if (min < 60) return `${min}分`;
  return `${Math.floor(min / 60)}時間${min % 60 > 0 ? `${min % 60}分` : ""}`;
}

interface DailyProgressProps {
  todayMinutes: number;
  goalMinutes: number;
}

export function DailyProgress({ todayMinutes, goalMinutes }: DailyProgressProps) {
  const pct = goalMinutes > 0 ? Math.min(100, Math.round(todayMinutes / goalMinutes * 100)) : 0;
  const done = pct >= 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>今日の進捗</span>
          {done && <span className="text-sm font-normal text-green-500">🎉 目標達成！</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-2xl">{fmt(todayMinutes)}</span>
            <span className="text-muted-foreground self-end">目標: {fmt(goalMinutes)}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${done ? "bg-green-500" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">{pct}%</p>
        </div>
        <Link href="/timer" className={cn(buttonVariants(), "w-full")}>
          <Timer className="h-4 w-4 mr-2" />
          タイマーを開始
        </Link>
      </CardContent>
    </Card>
  );
}
