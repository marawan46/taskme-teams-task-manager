"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Folder, Plus } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { PROJECT_COLORS } from "@/lib/design/tokens";
import { createProject } from "@/lib/actions/projects";
import { cn, slugify } from "@/lib/utils";
import type { ProjectWithStats } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

const FIELD_LABEL = "text-xs font-semibold uppercase tracking-wider text-muted";

function deriveKey(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const letters =
    words.length === 1 ? words[0].slice(0, 3) : words.map((w) => w[0]).join("").slice(0, 4);
  return letters.toUpperCase();
}

export function ProjectsView({
  projects,
  teamId,
}: {
  projects: ProjectWithStats[];
  teamId: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [keyText, setKeyText] = useState("");
  const [keyTouched, setKeyTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<string>(PROJECT_COLORS[0]);
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setKeyText("");
    setKeyTouched(false);
    setDescription("");
    setColor(PROJECT_COLORS[0]);
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createProject({
        teamId,
        name,
        key: keyText || deriveKey(name) || slugify(name).slice(0, 4).toUpperCase(),
        color,
        description: description || null,
      });
      // createProject redirects to the new project on success.
    } catch {
      toast("Couldn't create project", { variant: "error" });
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-ink">Projects</h1>
          <p className="text-sm text-muted">Everything your workspace is working on.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setOpen(true)}>
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<Folder size={22} />}
          title="No projects yet"
          description="Create a project to start organizing tasks into boards."
          action={
            <Button leftIcon={<Plus size={16} />} onClick={() => setOpen(true)}>
              New project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="New project"
        size="md"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className={FIELD_LABEL}>Name</label>
              <Input
                autoFocus
                placeholder="Marketing site"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!keyTouched) setKeyText(deriveKey(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className={FIELD_LABEL}>Key</label>
              <Input
                placeholder="MKT"
                value={keyText}
                maxLength={5}
                onChange={(e) => {
                  setKeyTouched(true);
                  setKeyText(e.target.value.toUpperCase());
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Description</label>
            <Textarea
              rows={2}
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className={FIELD_LABEL}>Color</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-7 w-7 rounded-full transition-transform focus-visible:outline-none",
                    color === c ? "ring-2 ring-offset-2 ring-offset-canvas" : "hover:scale-110",
                  )}
                  style={{ background: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-end gap-2 border-t border-hairline pt-5">
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} loading={saving} disabled={!name.trim()}>
            Create project
          </Button>
        </div>
      </Modal>
    </>
  );
}
