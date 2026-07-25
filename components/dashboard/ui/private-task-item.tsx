import { cn } from "@/lib/utils";

type DotColor = "destructive" | "primary" | "muted-foreground";

interface PrivateTaskItemProps {
  title: string;
  dueDate: string | null;
  priority: number;
  isLast?: boolean;
}

const dotColorMap: Record<number, DotColor> = {
  0: "muted-foreground",
  1: "primary",
  2: "destructive",
};

const dotStyles: Record<DotColor, string> = {
  destructive: "bg-destructive",
  primary: "bg-primary",
  "muted-foreground": "bg-muted-foreground",
};

function formatDueDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PrivateTaskItem({
  title,
  dueDate,
  priority,
  isLast = false,
}: PrivateTaskItemProps) {
  const dotColor = dotColorMap[priority] ?? "muted-foreground";

  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/20",
        !isLast && "border-b border-border"
      )}
    >
      <input
        type="checkbox"
        className="size-4 rounded border-border accent-primary"
      />
      <span className="grow text-sm font-medium text-foreground">
        {title}
      </span>
      <div className="flex items-center gap-6">
        {dueDate && (
          <span className="text-xs font-medium text-muted-foreground">
            {formatDueDate(dueDate)}
          </span>
        )}
        <div className={cn("size-2 rounded-full", dotStyles[dotColor])} />
      </div>
    </div>
  );
}
