import { cn } from "@/lib/utils";

type DotColor = "destructive" | "primary" | "muted-foreground";

interface PrivateTaskItemProps {
  title: string;
  dueDate: string;
  dotColor?: DotColor;
  isLast?: boolean;
}

const dotColorMap: Record<DotColor, string> = {
  destructive: "bg-destructive",
  primary: "bg-primary",
  "muted-foreground": "bg-muted-foreground",
};

export function PrivateTaskItem({
  title,
  dueDate,
  dotColor = "muted-foreground",
  isLast = false,
}: PrivateTaskItemProps) {
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
        <span className="text-xs font-medium text-muted-foreground">
          {dueDate}
        </span>
        <div className={cn("size-2 rounded-full", dotColorMap[dotColor])} />
      </div>
    </div>
  );
}
