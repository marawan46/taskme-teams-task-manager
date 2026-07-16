"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "./icons";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: ModalSize;
  className?: string;
}

/** Centered dialog: overlay fades in, panel springs in. Escape / overlay close. */
export function Modal({ open, onClose, children, title, size = "md", className }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div
        className="fixed inset-0 bg-[var(--modal-overlay)] animate-fade-in"
        onClick={onClose}
      />
      <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative z-10 mt-[6vh] w-full rounded-xl border border-hairline bg-canvas p-6 " +
              "shadow-xl animate-scale-in",
            SIZE[size],
            className,
          )}
        >
          {title ? (
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink">{title}</h2>
              <CloseButton onClose={onClose} />
            </div>
          ) : (
            <div className="absolute right-4 top-4">
              <CloseButton onClose={onClose} />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-none"
    >
      <X size={18} />
    </button>
  );
}
