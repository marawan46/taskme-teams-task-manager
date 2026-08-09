import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { InviteMemberDialog } from "@/components/projects/invite-member-dialog";
import { InvitationsList } from "@/components/projects/invitations-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserPermissions } from "@/lib/auth/permissions";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getInitials } from "@/lib/helpers";
import type { Database } from "@/types/database.types";

type Invitation = Database["public"]["Tables"]["project_invitations"]["Row"];

type MemberRow = {
     user_id: string;
     role: Database["public"]["Enums"]["project_role"];
     profiles: {
          full_name: string | null;
          avatar_url: string | null;
     } | null;
};

const roleStyles: Record<string, string> = {
     OWNER: "bg-primary/10 text-primary border-primary/20",
     MANAGER: "bg-purple-100 text-purple-700 border-purple-200",
     COLLABORATOR: "bg-muted text-muted-foreground border-border",
};

export default async function ProjectMembersPage({
     params,
}: {
     params: Promise<{ projectId: string }>;
}) {
     const { projectId } = await params;
     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);

     const permissions = await getUserPermissions(supabase, projectId);

     const [projectResult, membersResult, invitationsResult] =
          await Promise.all([
               supabase
                    .from("projects")
                    .select("name")
                    .eq("id", projectId)
                    .single(),
               supabase
                    .from("project_members")
                    .select("user_id, role, profiles(full_name, avatar_url)")
                    .eq("project_id", projectId),
               supabase
                    .from("project_invitations")
                    .select("*")
                    .eq("project_id", projectId)
                    .order("created_at", { ascending: false }),
          ]);

     if (projectResult.error || !projectResult.data) {
          notFound();
     }

     const members = (membersResult.data ?? []) as unknown as MemberRow[];
     const invitations = (invitationsResult.data ?? []) as Invitation[];

     const inviterIds = [
          ...new Set(invitations.map((invitation) => invitation.invited_by)),
     ];
     const inviterNames: Record<string, string | null> = {};
     if (inviterIds.length > 0) {
          const { data: inviters } = await supabase
               .from("profiles")
               .select("id, full_name")
               .in("id", inviterIds);
          for (const profile of inviters ?? []) {
               inviterNames[profile.id] = profile.full_name;
          }
     }

     return (
          <div className="flex bg-primary-foreground min-h-screen flex-col p-8">
               <div className="mb-8">
                    <Breadcrumb>
                         <BreadcrumbList>
                              <BreadcrumbItem>
                                   <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                   </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator />
                              <BreadcrumbItem>
                                   <BreadcrumbLink href="/projects">
                                        Projects
                                   </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator />
                              <BreadcrumbItem>
                                   <BreadcrumbLink
                                        href={`/projects/${projectId}`}
                                   >
                                        {projectResult.data.name}
                                   </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator />
                              <BreadcrumbItem>
                                   <BreadcrumbPage>Members</BreadcrumbPage>
                              </BreadcrumbItem>
                         </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex justify-between items-end mt-4 mb-8">
                         <div>
                              <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-heading">
                                   Members
                              </h1>
                              <p className="text-sm text-muted-foreground mt-1">
                                   Manage who has access to this project.
                              </p>
                         </div>
                         <InviteMemberDialog projectId={projectId} />
                    </div>
               </div>

               <div className="space-y-10">
                    <section className="space-y-4">
                         <h2 className="text-lg font-heading font-bold text-foreground">
                              Current Members ({members.length})
                         </h2>
                         <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                              {members.map((member: MemberRow) => (
                                   <li
                                        key={member.user_id}
                                        className="flex items-center gap-4 px-5 py-4"
                                   >
                                        <Avatar size="sm">
                                             <AvatarImage
                                                  src={
                                                       member.profiles
                                                            ?.avatar_url ??
                                                       undefined
                                                  }
                                                  alt={
                                                       member.profiles
                                                            ?.full_name ?? ""
                                                  }
                                             />
                                             <AvatarFallback>
                                                  {getInitials(
                                                       member.profiles
                                                            ?.full_name ?? null,
                                                  )}
                                             </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                             <p className="truncate text-sm font-medium text-foreground">
                                                  {member.profiles?.full_name ??
                                                       "Unnamed member"}
                                             </p>
                                        </div>
                                        <span
                                             className={
                                                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " +
                                                  (roleStyles[member.role] ??
                                                       "")
                                             }
                                        >
                                             {member.role}
                                        </span>
                                   </li>
                              ))}
                         </ul>
                    </section>
                   { (permissions.includes("invite:members") &&
                    <section className="space-y-4">
                         <h2 className="text-lg font-heading font-bold text-foreground">
                              Invitations ({invitations.length})
                         </h2>
                         <InvitationsList
                              invitations={invitations}
                              inviterNames={inviterNames}
                         />
                    </section>
                    )
               }
               </div>
          </div>
     );
}
