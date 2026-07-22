import { ProjectTaskItem } from "./ui/project-task-item";

type Priority = "high" | "medium" | "low";
type Status = "active" | "review";

interface ProjectTask {
  id: string;
  title: string;
  project: string;
  deadline: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  priority: Priority;
  status: Status;
}

interface ProjectTaskListProps {
  tasks?: ProjectTask[];
  count?: number;
}

const defaultTasks: ProjectTask[] = [
  {
    id: "1",
    title: "Update API documentation for v2.4",
    project: "Core Platform",
    deadline: "2 days left",
    assignee: { name: "Sarah L." },
    priority: "high",
    status: "active",
  },
  {
    id: "2",
    title: "Q4 Productivity Report Draft",
    project: "Operations",
    deadline: "5 days left",
    assignee: { name: "Marcus W." },
    priority: "low",
    status: "review",
  },
  {
    id: "3",
    title: "Marketing Assets Review",
    project: "Growth",
    deadline: "8 days left",
    assignee: { name: "Alex Chen" },
    priority: "medium",
    status: "active",
  },
];

export function ProjectTaskList({
  tasks = defaultTasks,
  count = 3,
}: ProjectTaskListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-foreground font-heading">
          Project Tasks
        </h3>
        <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          {count}
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {tasks.map((task, i) => (
          <ProjectTaskItem
            key={task.id}
            title={task.title}
            project={task.project}
            deadline={task.deadline}
            assignee={task.assignee}
            priority={task.priority}
            status={task.status}
            isLast={i === tasks.length - 1}
          />
        ))}
      </div>
      <div className="flex justify-center pt-2">
        <span className="cursor-pointer text-xs font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-80">
          View All Project Tasks
        </span>
      </div>
    </section>
  );
}
