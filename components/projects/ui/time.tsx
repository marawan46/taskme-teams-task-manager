import { formatDueDate, formatTimeRemaining } from "@/lib/helpers";
import { cn } from "@/lib/utils";

const DAY_MS = 1000 * 60 * 60 * 24;

type TimeColor = "primary" | "warning" | "danger";

export function getTimeColor(dueDate: string | Date | null | undefined): TimeColor {
     if (!dueDate) return "primary";

     const now = Date.now();
     const diffDays = (new Date(dueDate).getTime() - now) / DAY_MS;

     if (diffDays < 0) return "danger";
     if (diffDays <= 3) return "warning";
     return "primary";
}

export const timeColorClasses: Record<TimeColor, string> = {
     primary: "text-primary",
     warning: "text-orange-500",
     danger: "text-destructive",
};

export function TimeRemaining({
     dueDate,
     className,
}: {
     dueDate: string | Date | null | undefined;
     className?: string;
}) {
     return (
          <span
               className={cn(
                    "text-xl font-heading font-bold",
                    timeColorClasses[getTimeColor(dueDate)],
                    className,
               )}
          >
               {formatDueDate(dueDate)}
          </span>
     );
}
