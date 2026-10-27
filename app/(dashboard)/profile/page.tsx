import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { SecurityForm } from "@/components/profile/security-form";
import { ProfileStats } from "@/components/profile/profile-stats";
import {
     ProfileProjects,
     type MemberProjectItem,
} from "@/components/profile/profile-projects";
import type { Profile } from "@/types/index.types";

export const metadata = {
     title: "User Profile | TaskMe",
     description: "Manage your personal profile, credentials, and project roles.",
};

export default async function ProfilePage() {
     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);

     const {
          data: { user },
     } = await supabase.auth.getUser();

     if (!user) {
          redirect("/login");
     }

     const [
          { data: profile },
          { data: rawMemberships },
          { data: assignedTasks },
          { data: personalTasks },
     ] = await Promise.all([
          supabase
               .from("profiles")
               .select("*")
               .eq("id", user.id)
               .maybeSingle(),
          supabase
               .from("project_members")
               .select(`
                    role,
                    role_tag,
                    joined_at,
                    projects (
                         id,
                         name,
                         description,
                         due_date
                    )
               `)
               .eq("user_id", user.id),
          supabase
               .from("tasks")
               .select("id, status")
               .eq("assigned_to", user.id),
          supabase
               .from("my_tasks")
               .select("id, status")
               .eq("user_id", user.id),
     ]);

     const memberships = (rawMemberships as unknown as MemberProjectItem[]) ?? [];
     const assignedList = assignedTasks ?? [];
     const personalList = personalTasks ?? [];

     const assignedTasksCount = assignedList.length;
     const completedAssignedCount = assignedList.filter(
          (t) => t.status === "DONE",
     ).length;
     const personalTasksCount = personalList.length;

     return (
          <div className="flex bg-primary-foreground min-h-screen flex-col p-6 md:p-8 space-y-8">
               {/* Breadcrumbs */}
               <div>
                    <Breadcrumb>
                         <BreadcrumbList>
                              <BreadcrumbItem>
                                   <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                   </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator />
                              <BreadcrumbItem>
                                   <BreadcrumbPage>User Profile</BreadcrumbPage>
                              </BreadcrumbItem>
                         </BreadcrumbList>
                    </Breadcrumb>
               </div>

               {/* Top Profile Banner */}
               <ProfileHeader
                    profile={profile as Profile | null}
                    email={profile?.email || user.email || ""}
                    createdAt={user.created_at}
               />

               {/* Workspace Statistics */}
               <ProfileStats
                    projectCount={memberships.length}
                    assignedTasksCount={assignedTasksCount}
                    completedAssignedCount={completedAssignedCount}
                    personalTasksCount={personalTasksCount}
               />

               {/* Profile Forms and Details */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-8">
                         <ProfileForm
                              profile={profile as Profile | null}
                              email={profile?.email || user.email || ""}
                         />
                         <ProfileProjects memberships={memberships} />
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                         <SecurityForm />
                    </div>
               </div>
          </div>
     );
}
