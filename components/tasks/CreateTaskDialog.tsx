"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "@/lib/design/tokens";
import type { Priority, TaskStatus } from "@/lib/types";
import type { TaskDetailMember } from "./TaskDetail";

export interface NewTaskValues {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  assignee_id: string | null;
}

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  members: TaskDetailMember[];
  defaultStatus?: TaskStatus;
  onCreate: (values: NewTaskValues) => void | Promise<void>;
}

const FIELD_LABEL = "text-xs font-semibold uppercase tracking-wider text-muted";

function emptyValues(status: TaskStatus): NewTaskValues {
  return {
    title: "",
    description: null,
    status,
    priority: "medium",
    due_date: null,
    assignee_id: null,
  };
}

export function CreateTaskDialog({
  open,
  onClose,
  members,
  defaultStatus = "todo",
  onCreate,
}: CreateTaskDialogProps) {
  const [values, setValues] = useState<NewTaskValues>(() => emptyValues(defaultStatus));
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!values.title.trim()) return;
    setSaving(true);
    try {
      await onCreate(values);
      setValues(emptyValues(defaultStatus));
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New task" size="md">
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className={FIELD_LABEL}>Title</label>
          <Input
            autoFocus
            placeholder="What needs to be done?"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate();
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label className={FIELD_LABEL}>Description</label>
          <Textarea
            rows={3}
            placeholder="Add more detail…"
            value={values.description ?? ""}
            onChange={(e) => setValues({ ...values, description: e.target.value || null })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Status</label>
            <Select
              value={values.status}
              onChange={(e) => setValues({ ...values, status: e.target.value as TaskStatus })}
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
              value={values.priority}
              onChange={(e) => setValues({ ...values, priority: e.target.value as Priority })}
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
              value={values.due_date ?? ""}
              onChange={(e) => setValues({ ...values, due_date: e.target.value || null })}
            />
          </div>
          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Assignee</label>
            <Select
              value={values.assignee_id ?? ""}
              onChange={(e) => setValues({ ...values, assignee_id: e.target.value || null })}
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
      </div>

      <div className="mt-7 flex items-center justify-end gap-2 border-t border-hairline pt-5">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleCreate} loading={saving} disabled={!values.title.trim()}>
          Create task
        </Button>
      </div>
    </Modal>
  );
}
