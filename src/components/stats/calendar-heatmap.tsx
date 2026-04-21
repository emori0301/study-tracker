"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarHeatmapProps {
  data: Record<string, number>;
}

function getLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

const levelColor = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary",
];

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  // 過去53週分のデータを生成
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - 52 * 7 - today.getDay());

  const weeks: { date: Date; minutes: number }[][] = [];
  const cursor = new Date(startDay);

  while (cursor <= today) {
    const week: { date: Date; minutes: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const key = new Date(cursor).toISOString();
      week.push({ date: new Date(cursor), minutes: data[key] ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  const months: { label: string; col: number }[] = [];
  weeks.forEach((week, i) => {
    const firstDay = week[0].date;
    if (firstDay.getDate() <= 7) {
      months.push({
        label: `${firstDay.getMonth() + 1}月`,
        col: i,
      });
    }
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">学習カレンダー（過去1年）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* 月ラベル */}
            <div className="flex mb-1 ml-6">
              {weeks.map((_, i) => {
                const m = months.find((m) => m.col === i);
                return (
                  <div key={i} className="w-3.5 shrink-0 text-[10px] text-muted-foreground">
                    {m?.label ?? ""}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-0.5">
              {/* 曜日ラベル */}
              <div className="flex flex-col gap-0.5 mr-1">
                {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
                  <div key={d} className={`h-3.5 w-4 text-[10px] text-muted-foreground ${i % 2 === 0 ? "" : "invisible"}`}>
                    {d}
                  </div>
                ))}
              </div>

              {/* セル */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map(({ date, minutes }, di) => (
                    <div
                      key={di}
                      title={`${date.toLocaleDateString("ja-JP")} ${minutes}分`}
                      className={`h-3.5 w-3.5 rounded-sm ${levelColor[getLevel(minutes)]} ${
                        date > today ? "opacity-0" : ""
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* 凡例 */}
            <div className="flex items-center gap-1.5 mt-2 justify-end">
              <span className="text-[10px] text-muted-foreground">少</span>
              {levelColor.map((c, i) => (
                <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] text-muted-foreground">多</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
