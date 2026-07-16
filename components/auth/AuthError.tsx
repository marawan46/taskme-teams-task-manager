import { AlertCircle } from "@/components/ui/icons";

/** Inline error banner for the auth screens. */
export function AuthError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-md border border-error/30 bg-error-soft px-3.5 py-3 text-sm text-error"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
