"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteSubject } from "@/lib/actions/subjects";
import { SubjectFormDialog } from "./subject-form-dialog";
import { Button } from "@/components/ui/button";
import type { Subject } from "@/types";

interface SubjectGridProps {
  subjects: Subject[];
}

export function SubjectGrid({ subjects }: SubjectGridProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(s: Subject) {
    setEditing(s);
    setDialogOpen(true);
  }

  function handleDelete(s: Subject) {
    if (!confirm(`「${s.name}」を削除しますか？\n関連するタスクも削除されます。`)) return;
    startTransition(() => deleteSubject(s.id));
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <div
            key={s.id}
            className="relative group rounded-xl border p-5 transition-shadow hover:shadow-md"
          >
            {/* カラーバー */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
              style={{ backgroundColor: s.color }}
            />

            <div className="flex items-start justify-between mt-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString("ja-JP")} 追加
                  </p>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => openEdit(s)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(s)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* 追加カード */}
        <button
          onClick={openCreate}
          className="rounded-xl border-2 border-dashed p-5 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">科目を追加</span>
        </button>
      </div>

      <SubjectFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        subject={editing}
      />
    </>
  );
}
