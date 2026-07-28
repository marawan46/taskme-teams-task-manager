"use client"

import { ModalWrapper } from "@/components/modal-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users } from "lucide-react"

interface ProjectInfoMember {
  full_name: string | null
  avatar_url: string | null
  role: string
}

interface ProjectInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: {
    id: string
    name: string
    description: string | null
    created_at: string | null
    due_date: string | null
  }
  members?: ProjectInfoMember[]
  memberCount?: number
}

function formatDate(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-primary/10 text-primary",
  MANAGER: "bg-blue-500/10 text-blue-600",
  COLLABORATOR: "bg-green-500/10 text-green-600",
}

export function ProjectInfoDialog({
  open,
  onOpenChange,
  project,
  members = [],
  memberCount = 0,
}: ProjectInfoDialogProps) {
  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={project.name}
      className="sm:max-w-lg"
    >
      <div className="space-y-5">
        {project.description && (
          <p className="text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>Created: {formatDate(project.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>Due: {formatDate(project.due_date)}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Members ({memberCount})
            </span>
          </div>

          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            <div className="space-y-2">
              {members.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      <AvatarImage
                        src={member.avatar_url ?? undefined}
                        alt={member.full_name ?? ""}
                      />
                      <AvatarFallback>
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {member.full_name ?? "Unknown"}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ROLE_STYLES[member.role] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  )
}
