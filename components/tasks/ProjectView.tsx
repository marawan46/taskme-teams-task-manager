"use client";

import { useState } from "react";
import { ViewSwitcher, type BoardView } from "@/components/layout/ViewSwitcher";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListIcon, Plus } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import {
  createTask,
  deleteTask,
  setTaskStatus,
  toggleTaskComplete,
  updateTask,
} from "@/lib/actions/tasks";
import type { SimpleMember } from "@/lib/queries/members";
import type { TaskStatus, TaskWithRelations } from "@/lib/types";
import { Board } from "./Board";
import { CalendarView } from "./CalendarView";
import { CreateTaskDialog, type NewTaskValues } from "./CreateTaskDialog";
import { applyFilters, EMPTY_FILTERS, FilterBar, type TaskFilters } from "./FilterBar";
import { TaskDetail, type TaskPatch } from "./TaskDetail";
import { TaskList } from "./TaskList";

interface ProjectViewProps {
  projectId: string;
  tasks: TaskWithRelations[];
  members: SimpleMember[];
  view: BoardView;
}

export function ProjectView({ projectId, tasks, members, view }: ProjectViewProps) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<TaskWithRelations | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);

  const visible = applyFilters(tasks, filters);

  function openTask(task: TaskWithRelations) {
    setSelected(task);
    setDetailOpen(true);
  }

  async function handleToggle(id: string, done: boolean) {
    try {
      await toggleTaskComplete(id, done);
    } catch {
      toast("Couldn't update task", { variant: "error" });
    }
  }

  async function handleMove(id: string, status: TaskStatus) {
    try {
      await setTaskStatus(id, status);
    } catch {
      toast("Couldn't move task", { variant: "error" });
    }
  }

  async function handleCreate(values: NewTaskValues) {
    try {
      await createTask({
        projectId,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        dueDate: values.due_date,
        assigneeId: values.assignee_id,
      });
      toast("Task created", { variant: "success" });
    } catch {
      toast("Couldn't create task", { variant: "error" });
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
      setDetailOpen(false);
      toast("Task deleted");
    } catch {
      toast("Couldn't delete task", { variant: "error" });
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-hairline bg-canvas px-4 py-3 sm:px-6">
        <ViewSwitcher value={view} />
        <div className="hidden lg:block">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
        <Button
          className="ml-auto"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => setCreateOpen(true)}
        >
          New task
        </Button>
      </div>

      <div className="border-b border-hairline px-4 py-2 lg:hidden">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="min-h-0 flex-1">
        {visible.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<ListIcon size={22} />}
              title="No tasks here yet"
              description="Create your first task, or adjust your filters."
              action={
                <Button leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
                  New task
                </Button>
              }
            />
          </div>
        ) : view === "list" ? (
          <div className="p-4 sm:p-6">
            <TaskList tasks={visible} onToggleComplete={handleToggle} onRowClick={openTask} />
          </div>
        ) : view === "calendar" ? (
          <CalendarView tasks={visible} onTaskClick={openTask} />
        ) : (
          <Board
            tasks={visible}
            onMove={handleMove}
            onToggleComplete={handleToggle}
            onCardClick={openTask}
          />
        )}
      </div>

      <TaskDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={selected}
        members={members}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        members={members}
        onCreate={handleCreate}
      />
    </div>
  );
}
