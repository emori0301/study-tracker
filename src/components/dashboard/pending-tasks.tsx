import Link from "next/link";
import { CheckSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject, Task } from "@/types";

interface PendingTasksProps {
  tasks: (Task & { subject: Subject })[];
}

export function PendingTasks({ tasks }: PendingTasksProps) {
  const pending = tasks.filter((t) => !t.completed).slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>未完了タスク</span>
          <Link href="/tasks" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            すべて見る <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            未完了のタスクはありません 🎉
          </p>
        ) : (
          <ul className="space-y-2">
            {pending.map((t) => (
              <li key={t.id} className="flex items-center gap-2.5 text-sm">
                <CheckSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{t.title}</span>
                <span
                  className="shrink-0 text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: t.subject.color }}
                >
                  {t.subject.icon}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
