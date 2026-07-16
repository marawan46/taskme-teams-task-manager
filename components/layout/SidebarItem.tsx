import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  count?: number;
  colorDot?: string;
  onClick?: () => void;
}

export function SidebarItem({
  href,
  label,
  icon,
  active,
  count,
  colorDot,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-[120ms]",
        active
          ? "bg-primary-soft text-primary-active"
          : "text-body hover:bg-surface-sunken hover:text-ink",
      )}
    >
      {colorDot ? (
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: colorDot }}
        />
      ) : (
        <span className="shrink-0 text-current opacity-90">{icon}</span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {count != null && (
        <span className="text-xs font-normal text-muted">{count}</span>
      )}
    </Link>
  );
}
