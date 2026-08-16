"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
     createMyTaskGroup,
     deleteMyTaskGroup,
     updateMyTaskGroup,
} from "@/lib/actions/my-tasks";
import type { ApiResponse, MyTaskGroup } from "@/types/index.types";

interface MyTaskGroupFormProps {
     group?: MyTaskGroup | null;
     onSuccess?: () => void;
}

type FormState = ApiResponse;

export function MyTaskGroupForm({
     group = null,
     onSuccess,
}: MyTaskGroupFormProps) {
     const router = useRouter();
     const calledRef = useRef(false);
     const isEdit = Boolean(group);

     const [state, formAction, isPending] = useActionState(
          async (_prev: FormState, formData: FormData): Promise<FormState> => {
               const payload = {
                    name: formData.get("name") as string,
               };

               if (group) {
                    return updateMyTaskGroup({ id: group.id, ...payload });
               }

               return createMyTaskGroup(payload);
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

     const handleDelete = async () => {
          if (!group) return;
          if (!confirm(`Delete "${group.name}" and all its tasks?`)) return;
          const res = await deleteMyTaskGroup({ id: group.id });
          if (res.status === "success") {
               onSuccess?.();
               router.refresh();
          }
     };

     return (
          <form action={formAction}>
               <FieldGroup>
                    <Field>
                         <FieldLabel htmlFor="name">Group Name</FieldLabel>
                         <Input
                              id="name"
                              name="name"
                              placeholder="e.g. Groceries, Work, Fitness"
                              required
                              maxLength={100}
                              defaultValue={group?.name ?? ""}
                         />
                    </Field>

                    {state?.error && (
                         <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                              {state.error.message}
                         </div>
                    )}

                    <div className="flex items-center gap-2">
                         {isEdit && (
                              <Button
                                   type="button"
                                   variant="destructive"
                                   onClick={handleDelete}
                                   disabled={isPending}
                              >
                                   Delete
                              </Button>
                         )}
                         <Button type="submit" disabled={isPending}>
                              {isPending ? (
                                   <>
                                        {isEdit ? "Saving..." : "Creating..."}
                                        <Spinner data-icon="inline-start" />
                                   </>
                              ) : isEdit ? (
                                   "Save Group"
                              ) : (
                                   "Create Group"
                              )}
                         </Button>
                    </div>
               </FieldGroup>
          </form>
     );
}
