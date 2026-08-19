import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ProjectTaskList } from "@/components/dashboard/project-task-list";
import { PrivateTaskList } from "@/components/dashboard/private-task-list";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { TaskProgress } from "@/components/dashboard/task-progress";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { fetchProjectTasks, fetchMyTasks } from "@/lib/data";
import { computeDashboardStats } from "@/lib/dashboard-stats";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: tasks, error: tasksError },
    { data: myTasks, error: myTasksError },
  ] = await Promise.all([
    fetchProjectTasks(supabase),
    fetchMyTasks(supabase),
  ]);

  if (tasksError) {
    console.error("[dashboard] failed to fetch project tasks:", tasksError);
  }
  if (myTasksError) {
    console.error("[dashboard] failed to fetch my tasks:", myTasksError);
  }

  const stats = computeDashboardStats(tasks, myTasks);

  return (
    <div className="flex min-h-screen flex-col bg-primary-foreground p-8">
      <div className="mb-8">
        <DashboardGreeting userName={user?.user_metadata?.full_name.split(" ")[0]} />
      </div>

      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <ProjectTaskList tasks={tasks} />
          <PrivateTaskList tasks={myTasks} />
        </div>

        <div className="space-y-8 lg:col-span-4">
          <TaskProgress stats={stats} />
          <UpcomingDeadlines
            projectTasks={tasks ?? []}
            privateTasks={myTasks ?? []}
          />
        </div>
      </div>
    </div>
  );
}
