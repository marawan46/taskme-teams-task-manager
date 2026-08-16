import type { Database } from "./database.types";

export type ApiResponse = {
     status: "success" | "error";
     data: any | null;
     error: {
          code: number;
          message: string;
     } | null;
};

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type MyTask = Database["public"]["Tables"]["my_tasks"]["Row"];
export type MyTaskGroup = Database["public"]["Tables"]["my_task_groups"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Milestone = Database["public"]["Tables"]["milestones"]["Row"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];
