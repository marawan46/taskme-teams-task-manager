"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { inviteMember, InvitationRole } from "@/lib/actions/invitaions";
import type { ApiResponse } from "@/types/index.types";

interface InviteMemberFormProps {
     projectId: string;
     onSuccess?: () => void;
}

type FormState = ApiResponse;

export function InviteMemberForm({
     projectId,
     onSuccess,
}: InviteMemberFormProps) {
     const router = useRouter();
     const calledRef = useRef(false);

     const [state, formAction, isPending] = useActionState(
          async (_prev: FormState, formData: FormData): Promise<FormState> => {
               return inviteMember({
                    projectId,
                    role_tag: (formData.get("role_tag") as string) || null,
                    email: formData.get("email") as string,
                    role: formData.get("role") as InvitationRole,
               });
          },
          { status: "error", data: null, error: null } as FormState,
     );

     useEffect(() => {
          if (state?.status === "success" && !calledRef.current) {
               calledRef.current = true;
               onSuccess?.();
               router.refresh();
          }
     }, [state, onSuccess, router]);

     return (
          <form action={formAction}>
               <FieldGroup>
                    <Field>
                         <FieldLabel htmlFor="email">Email</FieldLabel>
                         <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="teammate@example.com"
                              required
                         />
                    </Field>
                    <Field>
                         <FieldLabel htmlFor="role_tag">Role Tag</FieldLabel>
                         <Input
                              id="role_tag"
                              name="role_tag"
                              type="text"
                              placeholder="e.g.,FrontEnd, Developer, Designer"
                         />
                    </Field>
                    <Field>
                         <FieldLabel htmlFor="role">Role</FieldLabel>
                         <select
                              id="role"
                              name="role"
                              defaultValue="collaborator"
                              className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30"
                         >
                              <option value="collaborator">Collaborator</option>
                              <option value="manager">Manager</option>
                         </select>
                    </Field>

                    {state?.error && (
                         <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                              {state.error.message}
                         </div>
                    )}

                    <Field>
                         <Button type="submit" disabled={isPending}>
                              {isPending ? (
                                   <>
                                        Sending invite...
                                        <Spinner data-icon="inline-start" />
                                   </>
                              ) : (
                                   "Send Invitation"
                              )}
                         </Button>
                    </Field>
               </FieldGroup>
          </form>
     );
}
