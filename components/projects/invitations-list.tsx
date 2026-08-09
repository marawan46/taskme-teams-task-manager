import { MailIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";
import { getInitials } from "@/lib/helpers";

type Invitation = Database["public"]["Tables"]["project_invitations"]["Row"];

const statusStyles: Record<Invitation["status"], string> = {
	PENDING: "bg-amber-100 text-amber-700 border-amber-200",
	ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
	EXPIRED: "bg-muted text-muted-foreground border-border",
};

interface InvitationsListProps {
	invitations: Invitation[];
	inviterNames: Record<string, string | null>;
}

export function InvitationsList({
	invitations,
	inviterNames,
}: InvitationsListProps) {
	if (invitations.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
				<MailIcon className="size-8 text-muted-foreground/50 mb-3" />
				<p className="text-sm text-muted-foreground">
					No invitations yet. Invite someone to get started.
				</p>
			</div>
		);
	}

	return (
		<ul className="divide-y divide-border rounded-xl border border-border bg-card">
			{invitations.map((invitation) => {
				const inviterName = inviterNames[invitation.invited_by] ?? null;

				return (
					<li
						key={invitation.id}
						className="flex items-center gap-4 px-5 py-4"
					>
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
							{getInitials(invitation.email.split("@")[0])}
						</div>

						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-foreground">
								{invitation.email}
							</p>
							<p className="truncate text-xs text-muted-foreground">
								{inviterName
									? `Invited by ${inviterName}`
									: "Invited by a team member"}
							</p>
						</div>

						<div className="flex flex-col items-end gap-1">
							<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								{invitation.role.toLowerCase()}
							</span>
							<span
								className={cn(
									"inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
									statusStyles[invitation.status],
								)}
							>
								{invitation.status}
							</span>
							<span className="text-[11px] text-muted-foreground/70">
								expires{" "}
								{new Date(
									invitation.expires_at,
								).toLocaleDateString()}
							</span>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
