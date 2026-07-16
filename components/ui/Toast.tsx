"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, X } from "./icons";

type ToastVariant = "default" | "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, opts?: { variant?: ToastVariant; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    (message, opts) => {
      const id = ++counter;
      setToasts((t) => [...t, { id, message, variant: opts?.variant ?? "default" }]);
      window.setTimeout(() => dismiss(id), opts?.duration ?? 3800);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
            {toasts.map((t) => (
              <Toast key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>");
  return ctx;
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-lg bg-ink px-4 py-3 text-canvas " +
          "shadow-lg animate-scale-in",
      )}
      role="status"
    >
      {item.variant === "success" && <CheckCircle size={18} className="text-success" />}
      {item.variant === "error" && <AlertCircle size={18} className="text-error" />}
      <span className="flex-1 text-sm">{item.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-canvas/60 transition-colors hover:text-canvas focus-visible:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
}
