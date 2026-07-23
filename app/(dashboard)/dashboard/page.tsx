import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ProjectTaskList } from "@/components/dashboard/project-task-list";
import { PrivateTaskList } from "@/components/dashboard/private-task-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);
     const {
          data: { user },
     } = await supabase.auth.getUser();
     
  return (
    <div className="flex bg-primary-foreground min-h-screen flex-col p-8">
      <div className="mb-8">
        <DashboardGreeting userName={user?.user_metadata?.full_name.split(" ")[0]} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <ProjectTaskList />
          <PrivateTaskList />
        </div>

        <div className="lg:col-span-4">
          <DashboardStats />
        </div>
      </div>
    </div>
  );
}
