import { Lock } from "lucide-react";
import { PrivateTaskItem } from "./ui/private-task-item";

type DotColor = "destructive" | "primary" | "muted-foreground";

interface PrivateTask {
  id: string;
  title: string;
  dueDate: string;
  dotColor?: DotColor;
}

interface PrivateTaskListProps {
  tasks?: PrivateTask[];
  count?: number;
}

const defaultTasks: PrivateTask[] = [
  {
    id: "1",
    title: "Review quarterly budget goals",
    dueDate: "Oct 14",
    dotColor: "destructive",
  },
  {
    id: "2",
    title: "Update personal portfolio cases",
    dueDate: "Oct 18",
    dotColor: "primary",
  },
  {
    id: "3",
    title: "Weekly deep-work sync setup",
    dueDate: "Oct 22",
    dotColor: "muted-foreground",
  },
];

export function PrivateTaskList({
  tasks = defaultTasks,
  count = 4,
}: PrivateTaskListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground font-heading">
            My Private Tasks
            <Lock className="size-4 text-muted-foreground" />
          </h3>
          <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
            {count}
          </span>
        </div>
        <span className="cursor-pointer text-xs font-semibold text-muted-foreground transition-colors hover:text-secondary-foreground">
          View all
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {tasks.map((task, i) => (
          <PrivateTaskItem
            key={task.id}
            title={task.title}
            dueDate={task.dueDate}
            dotColor={task.dotColor}
            isLast={i === tasks.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
