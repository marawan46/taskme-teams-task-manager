"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderOpen, ClipboardCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getGreeting, formatDate,formatTime } from "@/lib/helpers";

interface DashboardGreetingProps {
  userName?: string;
}







export function DashboardGreeting({
  userName = "Alex",
}: DashboardGreetingProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-heading">
          {getGreeting()}, {userName}
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {formatDate(time)} &mdash; {formatTime(time)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/my-tasks"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5"
          )}
        >
          <ClipboardCheck className="size-4" />
          My Tasks
        </Link>
        <Link
          href="/projects"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5"
          )}
        >
          <FolderOpen className="size-4" />
          Projects
        </Link>
        <Link
          href="/projects"
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          <Plus className="size-4" />
          New Project
        </Link>
      </div>
    </section>
  );
}
