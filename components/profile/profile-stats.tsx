import { FolderKanban, CheckCircle, Clock, ListTodo } from "lucide-react";

interface ProfileStatsProps {
     projectCount: number;
     assignedTasksCount: number;
     completedAssignedCount: number;
     personalTasksCount: number;
}

export function ProfileStats({
     projectCount,
     assignedTasksCount,
     completedAssignedCount,
     personalTasksCount,
}: ProfileStatsProps) {
     return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/20">
                    <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                              <FolderKanban className="size-5" />
                         </div>
                         <div>
                              <p className="text-2xl font-bold font-heading text-foreground">
                                   {projectCount}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">
                                   Projects Joined
                              </p>
                         </div>
                    </div>
               </div>

               <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/20">
                    <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <Clock className="size-5" />
                         </div>
                         <div>
                              <p className="text-2xl font-bold font-heading text-foreground">
                                   {assignedTasksCount}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">
                                   Assigned Tasks
                              </p>
                         </div>
                    </div>
               </div>

               <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/20">
                    <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="size-5" />
                         </div>
                         <div>
                              <p className="text-2xl font-bold font-heading text-foreground">
                                   {completedAssignedCount}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">
                                   Tasks Completed
                              </p>
                         </div>
                    </div>
               </div>

               <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/20">
                    <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                              <ListTodo className="size-5" />
                         </div>
                         <div>
                              <p className="text-2xl font-bold font-heading text-foreground">
                                   {personalTasksCount}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">
                                   Personal Tasks
                              </p>
                         </div>
                    </div>
               </div>
          </div>
     );
}
