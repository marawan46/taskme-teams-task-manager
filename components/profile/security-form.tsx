"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { updatePassword } from "@/lib/actions/profile";
import { CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export function SecurityForm() {
     const [isPending, startTransition] = useTransition();
     const [password, setPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");
     const [statusMessage, setStatusMessage] = useState<{
          type: "success" | "error";
          text: string;
     } | null>(null);

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setStatusMessage(null);

          if (password.length < 6) {
               setStatusMessage({
                    type: "error",
                    text: "Password must be at least 6 characters long.",
               });
               return;
          }

          if (password !== confirmPassword) {
               setStatusMessage({
                    type: "error",
                    text: "Passwords do not match.",
               });
               return;
          }

          startTransition(async () => {
               const res = await updatePassword({ password });

               if (res.status === "error") {
                    setStatusMessage({
                         type: "error",
                         text: res.error?.message || "Failed to update password",
                    });
               } else {
                    setStatusMessage({
                         type: "success",
                         text: "Password changed successfully!",
                    });
                    setPassword("");
                    setConfirmPassword("");
               }
          });
     };

     return (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs">
               <div className="mb-6 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-2">
                         <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <KeyRound className="size-4" />
                         </div>
                         <h2 className="text-lg font-bold text-foreground font-heading">
                              Security & Password
                         </h2>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                         Update your account credentials to keep your profile secure.
                    </p>
               </div>

               {statusMessage && (
                    <div
                         className={`mb-6 flex items-center gap-3 rounded-xl p-3.5 text-sm transition-all ${
                              statusMessage.type === "success"
                                   ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                   : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                         }`}
                    >
                         {statusMessage.type === "success" ? (
                              <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                         ) : (
                              <AlertCircle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
                         )}
                         <span className="font-medium">{statusMessage.text}</span>
                    </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup className="space-y-4">
                         <Field>
                              <FieldLabel htmlFor="new_password" className="text-sm font-medium">
                                   New Password
                              </FieldLabel>
                              <Input
                                   id="new_password"
                                   type="password"
                                   required
                                   minLength={6}
                                   placeholder="••••••••"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className="h-10"
                              />
                         </Field>

                         <Field>
                              <FieldLabel htmlFor="confirm_password" className="text-sm font-medium">
                                   Confirm New Password
                              </FieldLabel>
                              <Input
                                   id="confirm_password"
                                   type="password"
                                   required
                                   minLength={6}
                                   placeholder="••••••••"
                                   value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                   className="h-10"
                              />
                         </Field>
                    </FieldGroup>

                    <div className="flex justify-end pt-2">
                         <Button
                              type="submit"
                              disabled={isPending || !password}
                              variant="outline"
                              className="px-6 h-10 font-semibold cursor-pointer min-w-32"
                         >
                              {isPending ? (
                                   <>
                                        <Spinner className="size-4 mr-2" />
                                        Updating...
                                   </>
                              ) : (
                                   "Update Password"
                              )}
                         </Button>
                    </div>
               </form>
          </div>
     );
}
