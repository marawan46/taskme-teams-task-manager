"use client";

import { useTransition } from "react";
import { signInWithGoogle } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { GoogleLogo } from "@/components/ui/icons";

/** Kicks off Google OAuth via the server action; shows a pending state. */
export function GoogleSignInButton({
  redirectTo,
  label = "Continue with Google",
}: {
  redirectTo?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
      loading={pending}
      leftIcon={!pending ? <GoogleLogo size={18} /> : undefined}
      onClick={() =>
        startTransition(async () => {
          await signInWithGoogle(redirectTo);
        })
      }
    >
      {label}
    </Button>
  );
}
