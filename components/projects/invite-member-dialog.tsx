"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal-wrapper";
import { InviteMemberForm } from "./invite-member-form";
import { UserPlusIcon } from "lucide-react";
import { Can } from "@casl/react";

interface InviteMemberDialogProps {
	projectId: string;
}

export function InviteMemberDialog({ projectId }: InviteMemberDialogProps) {
	const [open, setOpen] = useState(false);

	return (
		<Can I="invite" a="Member">
			<Button onClick={() => setOpen(true)}>
				<UserPlusIcon data-icon="inline-start" />
				Invite Member
			</Button>

			<ModalWrapper
				open={open}
				onOpenChange={setOpen}
				title="Invite a Member"
				description="Send an email invitation to join this project."
				className="sm:max-w-md"
			>
				<InviteMemberForm
					projectId={projectId}
					onSuccess={() => setOpen(false)}
				/>
			</ModalWrapper>
		</Can>
	);
}
