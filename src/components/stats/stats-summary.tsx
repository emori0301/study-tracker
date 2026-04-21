import { Clock, Flame, CalendarDays, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function fmt(minutes: number) {
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

interface StatsSummaryProps {
  todayMinutes: number;
  weekMinutes: number;
  totalMinutes: number;
  totalSessions: number;
  streak: number;
}

export function StatsSummary({ todayMinutes, weekMinutes, totalMinutes, totalSessions, streak }: StatsSummaryProps) {
  const cards = [
    { label: "今日", value: fmt(todayMinutes), icon: Clock, color: "text-blue-500" },
    { label: "今週", value: fmt(weekMinutes), icon: CalendarDays, color: "text-violet-500" },
    { label: "累計", value: fmt(totalMinutes), icon: Trophy, color: "text-amber-500" },
    { label: "連続日数", value: `${streak}日`, icon: Flame, color: "text-orange-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
