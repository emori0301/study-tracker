"use client";

import { useEffect, useState, useTransition } from "react";
import { createTask, updateTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subject, Task } from "@/types";

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  subjects: Subject[];
  task?: Task;
}

export function TaskFormDialog({ open, onClose, subjects, task }: TaskFormDialogProps) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSubjectId(task.subjectId);
      setDueDate(task.dueDate ? task.dueDate.toISOString().split("T")[0] : "");
    } else {
      setTitle("");
      setSubjectId(subjects[0]?.id ?? "");
      setDueDate("");
    }
  }, [task, subjects, open]);

  function handleSubmit() {
    if (!title.trim() || !subjectId) return;
    startTransition(async () => {
      if (task) {
        await updateTask(task.id, { title, subjectId, dueDate: dueDate || null });
      } else {
        await createTask({ title, subjectId, dueDate: dueDate || undefined });
      }
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "タスクを編集" : "タスクを追加"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">タスク名</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：第3章を読む"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="space-y-2">
            <Label>科目</Label>
            <Select value={subjectId} onValueChange={(v) => setSubjectId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="科目を選択" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <span className="mr-2">{s.icon}</span>{s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">期限（任意）</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>キャンセル</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !subjectId || isPending}>
            {isPending ? "保存中..." : task ? "更新" : "追加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
