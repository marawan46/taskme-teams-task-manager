import { cn, initials } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

const SIZE: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
};

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, src, size = "sm", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full " +
          "bg-surface-strong font-medium text-body-strong",
        SIZE[size],
        className,
      )}
      title={name ?? undefined}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- external provider avatars, provider-agnostic
        <img src={src} alt={name ?? "User"} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </span>
  );
}

export interface AvatarGroupUser {
  id?: string;
  name?: string | null;
  src?: string | null;
}

interface AvatarGroupProps {
  users: AvatarGroupUser[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

/** Overlapping avatars with a canvas ring and a +N overflow chip. */
export function AvatarGroup({ users, max = 3, size = "sm", className }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {shown.map((u, i) => (
        <Avatar
          key={u.id ?? i}
          name={u.name}
          src={u.src}
          size={size}
          className="ring-2 ring-canvas"
        />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center rounded-full bg-surface-sunken " +
              "font-medium text-muted ring-2 ring-canvas",
            SIZE[size],
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
