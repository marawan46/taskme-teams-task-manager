"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ModalWrapper } from "@/components/modal-wrapper";
import { PencilIcon } from "lucide-react";
import { Can } from "@casl/react";
import { updateMemberInfo } from "@/lib/actions/projects";
import type { ApiResponse } from "@/types/index.types";
import type { Database } from "@/types/database.types";

type ProjectRole = Database["public"]["Enums"]["project_role"];

interface EditMemberInfo {
	user_id: string;
	role: ProjectRole;
	role_tag: string | null;
	full_name: string | null;
	avatar_url: string | null;
}

interface EditMemberDialogProps {
	member: EditMemberInfo;
	projectId: string;
	onSuccess?: () => void;
}

type FormState = ApiResponse;

export function EditMemberDialog({
	member,
	projectId,
	onSuccess,
}: EditMemberDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const calledRef = useRef(false);

	const [state, formAction, isPending] = useActionState(
		async (_prev: FormState, formData: FormData): Promise<FormState> => {
			return updateMemberInfo({
				projectId,
				userId: member.user_id,
				roleTag: formData.get("role_tag") as string || null,
			});
		},
		{ status: "error", data: null, error: null } as FormState,
	);

	useEffect(() => {
		if (state?.status === "success" && !calledRef.current) {
			calledRef.current = true;
			setOpen(false);
			onSuccess?.();
			router.refresh();
		}
	}, [state, onSuccess, router]);

	useEffect(() => {
		if (!open) {
			calledRef.current = false;
		}
	}, [open]);

	return (
		<Can I="update" a="Member">
			<Button
				variant="ghost"
				size="icon"
				className="size-8 text-muted-foreground hover:text-foreground"
				onClick={() => setOpen(true)}
			>
				<PencilIcon className="size-3.5" />
			</Button>

			<ModalWrapper
				open={open}
				onOpenChange={setOpen}
				title="Edit Member Info"
				description={`Update info for ${member.full_name ?? "this member"}.`}
				className="sm:max-w-md"
			>
				<form action={formAction}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="role_tag">Role Tag</FieldLabel>
							<Input
								id="role_tag"
								name="role_tag"
								placeholder="e.g. Frontend, UI/UX, Backend"
								defaultValue={member.role_tag ?? ""}
								maxLength={50}
							/>
							<p className="text-xs text-muted-foreground mt-1">
								A descriptive label for this member's role in the project.
							</p>
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
										Saving...
										<Spinner data-icon="inline-start" />
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</ModalWrapper>
		</Can>
	);
}
