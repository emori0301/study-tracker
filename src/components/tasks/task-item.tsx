"use client";

import { useTransition } from "react";
import { Pencil, Trash2, CalendarClock } from "lucide-react";
import { deleteTask, updateTask } from "@/lib/actions/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Subject, Task } from "@/types";

interface TaskItemProps {
  task: Task & { subject: Subject };
  onEdit: (task: Task) => void;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

function isOverdue(date: Date) {
  return new Date(date) < new Date(new Date().toDateString());
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  function toggleComplete() {
    startTransition(() => updateTask(task.id, { completed: !task.completed }));
  }

  function handleDelete() {
    if (!confirm("このタスクを削除しますか？")) return;
    startTransition(() => deleteTask(task.id));
  }

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
      task.completed ? "bg-muted/40" : "bg-background hover:bg-muted/20"
    } ${isPending ? "opacity-60" : ""}`}>

      <Checkbox
        checked={task.completed}
        onCheckedChange={toggleComplete}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-tight ${task.completed ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: task.subject.color }}
          >
            {task.subject.icon} {task.subject.name}
          </span>
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${
              !task.completed && isOverdue(task.dueDate)
                ? "text-destructive"
                : "text-muted-foreground"
            }`}>
              <CalendarClock className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost" size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
