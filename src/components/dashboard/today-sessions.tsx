import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject, Session } from "@/types";

interface TodaySessionsProps {
  sessions: (Session & { subject: Subject })[];
}

export function TodaySessions({ sessions }: TodaySessionsProps) {
  const today = sessions.slice(0, 6);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>今日の学習記録</span>
          <Link href="/stats" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            統計を見る <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {today.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            まだ学習記録がありません
          </p>
        ) : (
          <ul className="space-y-2">
            {today.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5 text-sm">
                <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span
                  className="shrink-0 text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: s.subject.color }}
                >
                  {s.subject.icon} {s.subject.name}
                </span>
                <span className="flex-1 text-muted-foreground">
                  {new Date(s.date).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="font-medium">{s.duration}分</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
