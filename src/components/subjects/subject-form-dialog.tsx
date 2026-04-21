"use client";

import { useEffect, useState, useTransition } from "react";
import { createSubject, updateSubject } from "@/lib/actions/subjects";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Subject } from "@/types";

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#64748b", "#78716c",
];

const PRESET_ICONS = [
  "📚", "📖", "✏️", "🔬", "🧮", "💻", "🎨", "🎵",
  "🌍", "📐", "🧪", "📝", "🏋️", "🎯", "💡", "🔭",
];

interface SubjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  subject?: Subject;
}

export function SubjectFormDialog({ open, onClose, subject }: SubjectFormDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setColor(subject.color);
      setIcon(subject.icon);
    } else {
      setName("");
      setColor(PRESET_COLORS[0]);
      setIcon(PRESET_ICONS[0]);
    }
  }, [subject, open]);

  function handleSubmit() {
    if (!name.trim()) return;
    startTransition(async () => {
      if (subject) {
        await updateSubject(subject.id, { name, color, icon });
      } else {
        await createSubject({ name, color, icon });
      }
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{subject ? "科目を編集" : "科目を追加"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* プレビュー */}
          <div className="flex justify-center">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-sm"
              style={{ backgroundColor: color }}
            >
              <span className="text-lg">{icon}</span>
              <span>{name || "科目名"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">科目名</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：数学"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="space-y-2">
            <Label>アイコン</Label>
            <div className="grid grid-cols-8 gap-1.5">
              {PRESET_ICONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setIcon(e)}
                  className={`text-xl p-1.5 rounded-lg transition-colors ${
                    icon === e ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>カラー</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>キャンセル</Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
            {isPending ? "保存中..." : subject ? "更新" : "追加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
