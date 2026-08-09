import { Resend } from "resend";

let _resend: Resend | null = null;

const FROM_EMAIL =
     process.env.EMAIL_FROM ??
     "TaskTeam <onboarding@resend.dev>";

function getResend(): Resend | null {
     const key = process.env.RESEND_API_KEY;
     if (!key) {
          console.warn(
               "RESEND_API_KEY is not set — invitation emails will not be sent.",
          );
          return null;
     }

     if (!_resend) {
          _resend = new Resend(key);
     }

     return _resend;
}

export interface InvitationEmailProps {
     to: string;
     projectName: string;
     inviterName: string | null;
     token: string;
     expiresAt: string;
}

function escapeHtml(value: string): string {
     return value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#39;");
}

/**
 * Sends a project invitation email containing the raw acceptance token.
 * The raw token is only used to build the link — it is never stored.
 *
 * When RESEND_API_KEY is unset (local dev), the send is skipped and the
 * invite is still created so the flow can be exercised end-to-end.
 */
export async function sendInvitationEmail(
     props: InvitationEmailProps,
): Promise<{ ok: boolean; error?: string }> {
     const resend = getResend();
     if (!resend) {
          return { ok: true };
     }

     const appUrl =
          process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
     const acceptUrl = `${appUrl}/invitations/${props.token}`;
     const expires = new Date(props.expiresAt).toLocaleDateString();
     const inviter = props.inviterName ?? "A team member";

     const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: props.to,
          subject: `You're invited to join "${props.projectName}" on TaskTeam`,
          text: [
               `Hello,`,
               ``,
               `${inviter} invited you to join the project "${props.projectName}" on TaskTeam.`,
               ``,
               `Accept the invitation here: ${acceptUrl}`,
               ``,
               `This invitation expires on ${expires}.`,
          ].join("\n"),
          html: `<p>Hello,</p><p>${escapeHtml(inviter)} invited you to join the project "<strong>${escapeHtml(props.projectName)}</strong>" on TaskTeam.</p><p><a href="${acceptUrl}">Accept the invitation</a></p><p>This invitation expires on ${expires}.</p>`,
     });

     if (error) {
          return { ok: false, error: error.message };
     }

     return { ok: true };
}
