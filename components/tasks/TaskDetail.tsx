"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { LabelChip } from "@/components/ui/LabelChip";
import { Trash } from "@/components/ui/icons";
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "@/lib/design/tokens";
import { formatTaskId } from "@/lib/utils";
import type { Priority, TaskStatus, TaskWithRelations } from "@/lib/types";

export interface TaskDetailMember {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface TaskPatch {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  assignee_id: string | null;
}

interface TaskDetailProps {
  open: boolean;
  onClose: () => void;
  task: TaskWithRelations | null;
  members: TaskDetailMember[];
  onSave: (id: string, patch: TaskPatch) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

const FIELD_LABEL = "text-xs font-semibold uppercase tracking-wider text-muted";

export function TaskDetail({ open, onClose, task, members, onSave, onDelete }: TaskDetailProps) {
  const [form, setForm] = useState<TaskPatch | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? task.due_date.slice(0, 10) : null,
        assignee_id: task.assignee_id,
      });
    }
  }, [task]);

  if (!task || !form) return null;

  async function handleSave() {
    if (!task || !form) return;
    setSaving(true);
    try {
      await onSave(task.id, form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="mb-5 flex items-center gap-3">
        <span className="font-mono text-[13px] text-muted-soft">
          {formatTaskId(task.project.key, task.seq)}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: "var(--c-surface-sunken)" }}
        >
          {task.project.name}
        </span>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className={FIELD_LABEL}>Title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className={FIELD_LABEL}>Description</label>
          <Textarea
            value={form.description ?? ""}
            placeholder="Add more detail…"
            onChange={(e) => setForm({ ...form, description: e.target.value || null })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Status</label>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Priority</label>
            <Select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
            >
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_META[p].label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Due date</label>
            <Input
              type="date"
              value={form.due_date ?? ""}
              onChange={(e) => setForm({ ...form, due_date: e.target.value || null })}
            />
          </div>
          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Assignee</label>
            <Select
              value={form.assignee_id ?? ""}
              onChange={(e) => setForm({ ...form, assignee_id: e.target.value || null })}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name ?? "Member"}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {task.labels.length > 0 && (
          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Labels</label>
            <div className="flex flex-wrap gap-1.5">
              {task.labels.map((l) => (
                <LabelChip key={l.id} name={l.name} color={l.color} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-hairline pt-5">
        <Button
          variant="ghost"
          leftIcon={<Trash size={16} />}
          className="text-error hover:bg-error-soft"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
