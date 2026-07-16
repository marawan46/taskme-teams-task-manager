"use client";

import { Button } from "@/components/ui/Button";
import { AlertCircle } from "@/components/ui/icons";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-soft text-error">
        <AlertCircle size={24} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-ink">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
