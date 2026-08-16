import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ClipboardCheck, FolderKanban, ListTodo, UserCheck } from "lucide-react";
import {
     getAssignedTasks,
     getMyTaskGroups,
     getMyTasks,
} from "@/lib/actions/my-tasks";
import { MyTaskDialog } from "@/components/my-tasks/my-task-dialog";
import { MyTaskGroupDialog } from "@/components/my-tasks/my-task-group-dialog";
import { MyTaskItem } from "@/components/my-tasks/my-task-item";
import {
     AssignedTaskItem,
     type AssignedTask,
} from "@/components/my-tasks/assigned-task-item";
import type { MyTask, MyTaskGroup } from "@/types/index.types";

export default async function MyTasksPage() {
     const [myTasksResponse, assignedTasksResponse, groupsResponse] =
          await Promise.all([
               getMyTasks(),
               getAssignedTasks(),
               getMyTaskGroups(),
          ]);

     const myTasks =
          myTasksResponse.status === "success" && Array.isArray(myTasksResponse.data)
               ? (myTasksResponse.data as MyTask[])
               : [];

     const groups =
          groupsResponse.status === "success" && Array.isArray(groupsResponse.data)
               ? (groupsResponse.data as MyTaskGroup[])
               : [];

     const tasksByGroup = groups.reduce<Record<string, MyTask[]>>(
          (acc, group) => {
               acc[group.id] = myTasks.filter((t) => t.group_id === group.id);
               return acc;
          },
          {},
     );

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
                         <div className="flex items-center gap-2">
                              <MyTaskGroupDialog />
                              {groups.length > 0 && <MyTaskDialog groups={groups} />}
                         </div>
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

                    {groups.length === 0 ? (
                         <div className="rounded-xl border border-dashed border-border py-16 text-center">
                              <FolderKanban className="mx-auto mb-4 size-8 text-muted-foreground" />
                              <p className="text-sm font-semibold text-foreground">
                                   No task groups yet
                              </p>
                              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                                   Create a task group first, then add tasks to
                                   it to keep your to-dos organized.
                              </p>
                              <div className="mt-4 flex justify-center">
                                   <MyTaskGroupDialog />
                              </div>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {groups.map((group) => {
                                   const groupTasks =
                                        tasksByGroup[group.id] ?? [];
                                   return (
                                        <div
                                             key={group.id}
                                             className="overflow-hidden rounded-xl border border-border bg-card"
                                        >
                                             <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-3">
                                                  <div className="flex min-w-0 items-center gap-2">
                                                       <span className="truncate text-sm font-bold text-foreground">
                                                            {group.name}
                                                       </span>
                                                       <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                                                            {groupTasks.length}
                                                       </span>
                                                  </div>
                                                  <MyTaskGroupDialog
                                                       group={group}
                                                       trigger="icon"
                                                  />
                                             </div>

                                             {groupTasks.length === 0 ? (
                                                  <div className="px-6 py-10 text-center">
                                                       <p className="text-sm text-muted-foreground">
                                                            No tasks in this group
                                                            yet.
                                                       </p>
                                                  </div>
                                             ) : (
                                                  groupTasks.map((task, i) => (
                                                       <MyTaskItem
                                                            key={task.id}
                                                            task={task}
                                                            groups={groups}
                                                            isLast={
                                                                 i ===
                                                                 groupTasks.length -
                                                                      1
                                                            }
                                                       />
                                                  ))
                                             )}
                                        </div>
                                   );
                              })}
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
