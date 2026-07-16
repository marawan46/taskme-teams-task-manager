<!-- BEGIN:nextjs-agent-rules -->
# Team Task Manager

Stack:
- Next.js 15
- Supabase
- TypeScript

Architecture:
- Authorization is enforced by RLS.
- has_permission() is the central permission function.
- Server Actions are the only backend layer.
- No service layer.
- Database functions are used only for security-sensitive state transitions.

Testing:
- tests/db for SQL, RLS and functions.
- tests/actions for Server Actions.

Rules:
- Never bypass RLS.
- Use Zod for validation.
- Don't duplicate permission logic in Server Actions.
<!-- END:nextjs-agent-rules -->
