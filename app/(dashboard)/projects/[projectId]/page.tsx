import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MilestoneCard } from "@/components/projects/milestone-card";
import { CreateMilestoneDialog } from "@/components/milestones/create-milestone-dialog";
import { getProjectDetails } from "@/lib/actions/projects";
import { notFound } from "next/navigation";
import { formatTimeRemaining } from "@/lib/helpers";
import {
     Avatar,
     AvatarFallback,
     AvatarImage,
     AvatarGroup,
     AvatarGroupCount,
} from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UsersIcon } from "lucide-react";

export default async function ProjectDetailPage({
     params,
}: {
     params: Promise<{ projectId: string }>;
}) {
     const { projectId } = await params;
     const response = await getProjectDetails(projectId);

     if (response.status === "error" || !response.data) {
          notFound();
     }

     const {
          project,
          milestones,
          activeTasks,
          progress,
          members,
          memberCount,
     } = response.data;

     const timeRemaining = formatTimeRemaining(project.due_date);

     const displayMembers = members.slice(0, 3);
     const overflowCount = Math.max(0, memberCount - 3);

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
                                   <BreadcrumbPage>
                                        {project.name}
                                   </BreadcrumbPage>
                              </BreadcrumbItem>
                         </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex justify-between items-end mt-4 mb-8">
                         <div>
                              <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-heading">
                                   {project.name}
                              </h1>
                              {project.description && (
                                   <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                                        {project.description}
                                   </p>
                              )}
                         </div>
                         <div className="flex items-end gap-6">
                              <Button
                                   nativeButton={false}
                                   variant="outline"
                                   render={
                                        <Link
                                             href={`/projects/${projectId}/members`}
                                        />
                                   }
                              >
                                   <UsersIcon data-icon="inline-start" />
                                   Members
                              </Button>
                              <div className="text-right">
                                   <span className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                                        Overall Progress
                                   </span>
                                   <p className="text-3xl font-heading font-bold text-primary">
                                        {progress}%
                                   </p>
                              </div>
                         </div>
                    </div>

                    {/* Progress card */}
                    <div className="bg-card p-8 rounded-xl shadow-sm border border-border relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                              <div
                                   className="h-full bg-primary transition-all"
                                   style={{ width: `${progress}%` }}
                              />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="flex flex-col">
                                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Time Remaining
                                   </span>
                                   <span className="text-xl font-heading font-bold text-foreground">
                                        {timeRemaining}
                                   </span>
                              </div>
                              <div className="flex flex-col">
                                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Active Tasks
                                   </span>
                                   <span className="text-xl font-heading font-bold text-foreground">
                                        {activeTasks}{" "}
                                        {activeTasks === 1 ? "Task" : "Tasks"}
                                   </span>
                              </div>
                              <div className="flex flex-col">
                                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Collaborators
                                   </span>
                                   <div className="flex items-center gap-2 mt-1">
                                        {memberCount > 0 && (
                                             <AvatarGroup>
                                                  {displayMembers.map(
                                                       (m: any, i: number) => (
                                                            <Avatar
                                                                 key={i}
                                                                 size="sm"
                                                            >
                                                                 <AvatarImage
                                                                      src={
                                                                           m.avatar_url ??
                                                                           undefined
                                                                      }
                                                                      alt={
                                                                           m.full_name ??
                                                                           ""
                                                                      }
                                                                 />
                                                                 <AvatarFallback>
                                                                      {getInitials(
                                                                           m.full_name,
                                                                      )}
                                                                 </AvatarFallback>
                                                            </Avatar>
                                                       ),
                                                  )}
                                                  {overflowCount > 0 && (
                                                       <AvatarGroupCount>
                                                            +{overflowCount}
                                                       </AvatarGroupCount>
                                                  )}
                                             </AvatarGroup>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Milestones list */}
               <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h2 className="text-2xl font-heading font-bold text-foreground">
                              Milestones
                         </h2>
                         <CreateMilestoneDialog projectId={projectId} />
                    </div>
                    {milestones.length === 0 ? (
                         <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
                              <p className="text-sm text-muted-foreground">
                                   No milestones yet. Create one to get started.
                              </p>
                         </div>
                    ) : (
                         milestones.map((milestone: any) => (
                              <MilestoneCard
                                   key={milestone.id}
                                   milestone={milestone}
                                   projectId={projectId}
                                   members={members.map((m: any) => ({
                                        id: m.user_id,
                                        full_name: m.full_name,
                                   }))}
                                   status={milestone.status}
                                   taskCount={milestone.taskCount}
                                   progress={milestone.progress}
                              />
                         ))
                    )}
               </div>
          </div>
     );
}
