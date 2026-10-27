import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, ArrowRight, Tag, Calendar } from "lucide-react";

export interface MemberProjectItem {
     role: string;
     role_tag: string | null;
     joined_at: string | null;
     projects: {
          id: string;
          name: string;
          description: string | null;
          due_date: string | null;
     } | null;
}

interface ProfileProjectsProps {
     memberships: MemberProjectItem[];
}

export function ProfileProjects({ memberships }: ProfileProjectsProps) {
     const roleVariant = (role: string) => {
          switch (role.toUpperCase()) {
               case "OWNER":
                    return "primary";
               case "ADMIN":
                    return "secondary";
               default:
                    return "default";
          }
     };

     return (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs">
               <div className="mb-6 pb-4 border-b border-border/60 flex items-center justify-between">
                    <div>
                         <h2 className="text-lg font-bold text-foreground font-heading">
                              Project Memberships
                         </h2>
                         <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                              Projects you are currently collaborating in and your assigned roles.
                         </p>
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                         {memberships.length} {memberships.length === 1 ? "Project" : "Projects"}
                    </Badge>
               </div>

               {memberships.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border/70">
                         <FolderKanban className="size-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                         <p className="text-sm font-medium text-foreground">
                              No project memberships yet
                         </p>
                         <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                              You haven&apos;t joined or created any projects. Start by creating a new project or accepting an invitation.
                         </p>
                         <div className="mt-4">
                              <Link
                                   href="/projects"
                                   className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                              >
                                   Browse Projects <ArrowRight className="size-3" />
                              </Link>
                         </div>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {memberships.map((item, idx) => {
                              const project = item.projects;
                              if (!project) return null;

                              const joinedDate = item.joined_at
                                   ? new Date(item.joined_at).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                     })
                                   : null;

                              return (
                                   <Link
                                        key={project.id || idx}
                                        href={`/projects/${project.id}`}
                                        className="group flex flex-col justify-between p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/40 hover:border-primary/30 transition-all shadow-xs"
                                   >
                                        <div className="space-y-2">
                                             <div className="flex items-start justify-between gap-2">
                                                  <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1 font-heading">
                                                       {project.name}
                                                  </h3>
                                                  <Badge
                                                       variant={roleVariant(item.role)}
                                                       className="shrink-0 text-[10px]"
                                                  >
                                                       {item.role}
                                                  </Badge>
                                             </div>

                                             {project.description && (
                                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                                       {project.description}
                                                  </p>
                                             )}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                                             <div className="flex items-center gap-2">
                                                  {item.role_tag && (
                                                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-[11px]">
                                                            <Tag className="size-3" />
                                                            {item.role_tag}
                                                       </span>
                                                  )}
                                                  {joinedDate && (
                                                       <span className="flex items-center gap-1 text-[11px]">
                                                            <Calendar className="size-3" />
                                                            Joined {joinedDate}
                                                       </span>
                                                  )}
                                             </div>

                                             <span className="text-xs font-semibold text-primary inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  View <ArrowRight className="size-3" />
                                             </span>
                                        </div>
                                   </Link>
                              );
                         })}
                    </div>
               )}
          </div>
     );
}
