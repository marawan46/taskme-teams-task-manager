"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { acceptInvitation, AcceptResult } from "@/lib/actions/invitaions";

export function AcceptInvitation({ token }: { token: string }) {
	const router = useRouter();
	const [pending, setPending] = useState(true);
	const [result, setResult] = useState<AcceptResult | null>(null);

	useEffect(() => {
		let cancelled = false;

		acceptInvitation(token).then((res) => {
			if (cancelled) return;
			setResult(res);
			setPending(false);
			if (res.status === "success") {
				router.refresh();
			}
		});

		return () => {
			cancelled = true;
		};
	}, [token, router]);

	if (pending) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<Spinner />
				<p className="text-sm text-muted-foreground">
					Accepting your invitation...
				</p>
			</div>
		);
	}

	if (result?.status === "success") {
		return (
			<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
				<h2 className="text-xl font-heading font-bold text-emerald-800">
					Invitation accepted!
				</h2>
				<p className="mt-2 text-sm text-emerald-700">
					You are now a member of this project.
				</p>
				<Button nativeButton={false} render={<Link href="/projects" />} className="mt-6">
					Go to Projects
				</Button>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
			<h2 className="text-xl font-heading font-bold text-destructive">
				Could not accept the invitation
			</h2>
			<p className="mt-2 text-sm text-muted-foreground">
				{result?.error?.message ??
					"This invitation may be expired, already used, or sent to a different email address."}
			</p>
			<Button
			nativeButton={false}
				variant="outline"
				render={<Link href="/dashboard" />}
				className="mt-6"
			>
				Back to Dashboard
			</Button>
		</div>
	);
}
