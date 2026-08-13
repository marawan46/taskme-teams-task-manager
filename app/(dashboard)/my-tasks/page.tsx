import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ClipboardCheck, ListTodo, UserCheck } from "lucide-react";
import { getAssignedTasks, getMyTasks } from "@/lib/actions/my-tasks";
import { MyTaskDialog } from "@/components/my-tasks/my-task-dialog";
import { MyTaskItem } from "@/components/my-tasks/my-task-item";
import {
     AssignedTaskItem,
     type AssignedTask,
} from "@/components/my-tasks/assigned-task-item";
import type { MyTask } from "@/types/index.types";

export default async function MyTasksPage() {
     const [myTasksResponse, assignedTasksResponse] = await Promise.all([
          getMyTasks(),
          getAssignedTasks(),
     ]);

     const myTasks =
          myTasksResponse.status === "success" && Array.isArray(myTasksResponse.data)
               ? (myTasksResponse.data as MyTask[])
               : [];

     const assignedTasks =
          assignedTasksResponse.status === "success" &&
          Array.isArray(assignedTasksResponse.data)
               ? (assignedTasksResponse.data as AssignedTask[])
               : [];

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
                                   <BreadcrumbPage>My Tasks</BreadcrumbPage>
                              </BreadcrumbItem>
                         </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center justify-between mt-4">
                         <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                   <ClipboardCheck className="size-5 text-primary" />
                              </div>
                              <div>
                                   <h1 className="text-3xl font-extrabold text-foreground font-heading">
                                        My Tasks
                                   </h1>
                                   <p className="text-sm text-muted-foreground">
                                        Manage your personal and assigned tasks
                                   </p>
                              </div>
                         </div>
                         <MyTaskDialog />
                    </div>
               </div>

               <section className="space-y-4">
                    <div className="flex items-center gap-2">
                         <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground font-heading">
                              <ListTodo className="size-4 text-muted-foreground" />
                              Personal Tasks
                         </h2>
                         {myTasks.length > 0 && (
                              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                                   {myTasks.length}
                              </span>
                         )}
                    </div>

                    {myTasks.length === 0 ? (
                         <div className="rounded-xl border border-dashed border-border py-16 text-center">
                              <p className="text-sm text-muted-foreground">
                                   No personal tasks yet. Add one to keep track
                                   of your to-dos.
                              </p>
                         </div>
                    ) : (
                         <div className="overflow-hidden rounded-xl border border-border bg-card">
                              {myTasks.map((task, i) => (
                                   <MyTaskItem
                                        key={task.id}
                                        task={task}
                                        isLast={i === myTasks.length - 1}
                                   />
                              ))}
                         </div>
                    )}
               </section>

               <section className="mt-10 space-y-4">
                    <div className="flex items-center gap-2">
                         <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground font-heading">
                              <UserCheck className="size-4 text-muted-foreground" />
                              Assigned to Me
                         </h2>
                         {assignedTasks.length > 0 && (
                              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                   {assignedTasks.length}
                              </span>
                         )}
                    </div>

                    {assignedTasks.length === 0 ? (
                         <div className="rounded-xl border border-dashed border-border py-16 text-center">
                              <p className="text-sm text-muted-foreground">
                                   No tasks assigned to you yet.
                              </p>
                         </div>
                    ) : (
                         <div className="overflow-hidden rounded-xl border border-border bg-card">
                              {assignedTasks.map((task, i) => (
                                   <AssignedTaskItem
                                        key={task.id}
                                        task={task}
                                        isLast={i === assignedTasks.length - 1}
                                   />
                              ))}
                         </div>
                    )}
               </section>
          </div>
     );
}
