"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckCircle } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { deleteTask, toggleTaskComplete, updateTask } from "@/lib/actions/tasks";
import type { SimpleMember } from "@/lib/queries/members";
import type { TaskWithRelations } from "@/lib/types";
import { TaskDetail, type TaskPatch } from "./TaskDetail";
import { TaskList } from "./TaskList";

interface TaskListViewProps {
  tasks: TaskWithRelations[];
  members: SimpleMember[];
  emptyTitle?: string;
  emptyDescription?: string;
}

/** List of tasks with an editable detail modal — used by My Tasks and Inbox. */
export function TaskListView({
  tasks,
  members,
  emptyTitle = "No tasks",
  emptyDescription,
}: TaskListViewProps) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<TaskWithRelations | null>(null);
  const [open, setOpen] = useState(false);

  async function handleToggle(id: string, done: boolean) {
    try {
      await toggleTaskComplete(id, done);
    } catch {
      toast("Couldn't update task", { variant: "error" });
    }
  }

  async function handleSave(id: string, patch: TaskPatch) {
    try {
      await updateTask(id, patch);
      toast("Task updated", { variant: "success" });
    } catch {
      toast("Couldn't save changes", { variant: "error" });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask(id);
      setOpen(false);
      toast("Task deleted");
    } catch {
      toast("Couldn't delete task", { variant: "error" });
    }
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle size={22} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <>
      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggle}
        onRowClick={(t) => {
          setSelected(t);
          setOpen(true);
        }}
      />
      <TaskDetail
        open={open}
        onClose={() => setOpen(false)}
        task={selected}
        members={members}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
