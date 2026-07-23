"use client";

import { useEffect, useState } from "react";

interface DashboardGreetingProps {
     userName?: string;
}

function getGreeting(): string {
     const hour = new Date().getHours();
     if (hour < 12) return "Good morning";
     if (hour < 18) return "Good afternoon";
     return "Good evening";
}

function formatDate(date: Date): string {
     return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
     });
}

function formatTime(date: Date): string {
     return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
     });
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
          <section>
               <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-heading">
                    {getGreeting()}, {userName}
               </h2>
               <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {formatDate(time)} — {formatTime(time)}
               </p>
          </section>
     );
}
