"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

const POS: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: Side;
  className?: string;
}

/** Hover tooltip with a short delay; ink surface inverts cleanly in dark mode. */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => {
        timer.current = setTimeout(() => setShow(true), 400);
      }}
      onMouseLeave={() => {
        clearTimeout(timer.current);
        setShow(false);
      }}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-sm bg-ink px-2 py-1 " +
              "text-xs font-medium text-canvas shadow-md animate-fade-in",
            POS[side],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
