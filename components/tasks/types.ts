import type { TaskStatus } from "@/lib/types";

/**
 * Mutation callbacks injected into the task views. Pages bind these to Server
 * Actions, keeping the view components free of any data-layer dependency.
 */
export type ToggleTaskFn = (taskId: string, done: boolean) => void | Promise<void>;
export type MoveTaskFn = (taskId: string, status: TaskStatus) => void | Promise<void>;
