'use client'
import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth-actions";
import { LogOut } from "lucide-react";

export default function page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
        This is the Dashboard Welcome user
        <Button onClick={() => signout()}>Log out <LogOut/></Button>
    </div>
  )
}
