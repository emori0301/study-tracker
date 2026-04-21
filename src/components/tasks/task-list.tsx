"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskItem } from "./task-item";
import { TaskFormDialog } from "./task-form-dialog";
import { Button } from "@/components/ui/button";
import type { Subject, Task } from "@/types";

interface TaskListProps {
  tasks: (Task & { subject: Subject })[];
  subjects: Subject[];
}

export function TaskList({ tasks, subjects }: TaskListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterSubjectId, setFilterSubjectId] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(false);

  const filtered = tasks.filter((t) => {
    if (!showCompleted && t.completed) return false;
    if (filterSubjectId !== "all" && t.subjectId !== filterSubjectId) return false;
    return true;
  });

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  function openCreate() {
    setEditingTask(undefined);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  return (
    <>
      {/* ツールバー */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterSubjectId("all")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterSubjectId === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            すべて
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterSubjectId(s.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filterSubjectId === s.id
                  ? "text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              style={filterSubjectId === s.id ? { backgroundColor: s.color } : {}}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          タスクを追加
        </Button>
      </div>

      {/* 未完了 */}
      {pending.length > 0 ? (
        <div className="space-y-2">
          {pending.map((t) => (
            <TaskItem key={t.id} task={t} onEdit={openEdit} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8 text-sm">
          {tasks.length === 0 ? "タスクがありません。追加してみましょう！" : "未完了のタスクはありません 🎉"}
        </p>
      )}

      {/* 完了済み */}
      {tasks.some((t) => t.completed) && (
        <div className="mt-6">
          <button
            className="text-sm text-muted-foreground hover:text-foreground mb-2"
            onClick={() => setShowCompleted((v) => !v)}
          >
            {showCompleted ? "▲" : "▶"} 完了済み ({tasks.filter((t) => t.completed).length})
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completed.map((t) => (
                <TaskItem key={t.id} task={t} onEdit={openEdit} />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        subjects={subjects}
        task={editingTask}
      />
    </>
  );
}
