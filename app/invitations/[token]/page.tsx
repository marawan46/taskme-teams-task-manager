import { AcceptInvitation } from "@/components/invitations/accept-invitation";

export default async function AcceptInvitationPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;

	return (
		<div className="flex min-h-screen items-center justify-center bg-primary-foreground p-8">
			<div className="w-full max-w-md">
				<AcceptInvitation token={token} />
			</div>
		</div>
	);
}
