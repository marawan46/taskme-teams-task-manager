# TaskMe — Full UI Build (spec)

Date: 2026-07-16
Status: approved

## Goal

Build the complete UI for **TaskMe**, a premium team task manager, backed by real
(local) Supabase. Reorganize the repo into a clean, well-named structure with a
reusable component library. Visual design is fully specified in `DESIGN.md`
(indigo→violet, Geist, Linear/Height/Vercel dialect) — this spec covers
architecture, data, routing, and scope.

Stack: Next.js 16 (App Router), React 19, Tailwind v4, `@supabase/ssr`.

## Non-negotiable Next.js 16 facts (verified in `node_modules/next/dist/docs`)

- `middleware.ts` is deprecated → **`proxy.ts`** (Node runtime). Supabase session
  refresh lives here.
- `params` / `searchParams` are **Promises** — always `await`.
- Mutations use **Server Actions** (`'use server'`) + `revalidatePath` / `refresh`.
- **Route groups** `(name)` organize routes without affecting the URL. One root
  layout (`app/layout.tsx`); group layouts are nested (no full reload).
- Tailwind v4: `@import "tailwindcss"` + `@theme` tokens; class-based dark via
  `@custom-variant dark`.

## Folder structure (root-level)

```
app/
  layout.tsx                 root: <html>, Geist fonts, theme bootstrap
  globals.css                DESIGN.md tokens (light+dark) + Tailwind theme
  (marketing)/{layout,page}  landing at /
  (auth)/{layout, login, signup}
  auth/callback/route.ts     OAuth code exchange
  (app)/                     auth-guarded shell (sidebar + top bar)
    layout.tsx
    tasks/page.tsx           My Tasks (post-login home)
    inbox/page.tsx
    projects/page.tsx
    projects/[projectId]/page.tsx   Board / List / Calendar (?view=)
    settings/page.tsx
proxy.ts                     Supabase session refresh
components/{ui,layout,tasks,marketing}/
lib/{supabase,actions,queries,design,types.ts,utils.ts}
supabase/migrations/
```

`utils/supabase/*` → `lib/supabase/*`.

### Routes (no `/` conflict)

`/` marketing · `/login` `/signup` · `/auth/callback` · `/tasks` `/inbox`
`/projects` `/projects/[id]` `/settings`. After login → redirect `/tasks`.

## Data model (Supabase + RLS)

- **profiles** — id (=auth.users.id), full_name, avatar_url, email. Auto-created
  by a signup trigger.
- **teams** — id, name, slug, owner_id. Each new user gets a personal team.
- **team_members** — team_id, user_id, role (owner|admin|member).
- **projects** — id, team_id, name, key (e.g. `TSK`), color, description.
- **tasks** — id, project_id, seq (→ `TSK-142`), title, description,
  status (backlog|todo|in_progress|in_review|done), priority
  (urgent|high|medium|low), due_date, assignee_id, created_by, position.
- **labels** — id, team_id, name, color · **task_labels** join.
- **comments** — id, task_id, author_id, body.

RLS: a user reads/writes rows only for teams they belong to. Board columns = the
`status` enum. Project progress = done/total. Signup trigger seeds profile +
personal team + a starter project with sample tasks so the app is never empty.

## Auth

Google OAuth only (real client ID/secret in `.env.local`; wired into
`supabase/config.toml` via `env(...)`). `proxy.ts` refreshes the session on every
matched request; `(app)/layout.tsx` redirects unauthenticated users to `/login`.
`/auth/callback` exchanges the code for a session.

## Data flow

Server Components read through `lib/queries` (server client). Mutations are Server
Actions in `lib/actions` that `revalidatePath`/`refresh`. Interactive surfaces
(board drag, view switch, filters, modals) are client components hydrated with
server data.

## Components (reusable, token-driven, dark + reduced-motion aware)

- **ui/**: Button, Input, Textarea, Select, Checkbox, Badge, StatusBadge, Avatar,
  AvatarGroup, Chip, LabelChip, FilterChip, PriorityFlag, Dropdown, Modal, Toast,
  Tooltip, ProgressBar, Skeleton, EmptyState.
- **layout/**: Sidebar, TopBar, SearchInput, UserMenu, ThemeToggle, ViewSwitcher.
- **tasks/**: TaskCard, BoardColumn, Board, TaskList, ListRow, CalendarView,
  FilterBar, TaskDetail, CreateTaskDialog.
- **marketing/**: MarketingNav, Hero, FeatureCard, CtaBand, Footer.

Every interactive component defines rest + hover (lift | tint | spring) + focus,
mapping to a `DESIGN.md` component key. `prefers-reduced-motion` degrades
transforms to fades.

## Build order (verifiable vertical slices)

1. Tokens + `globals.css` + utils.
2. Schema + RLS + triggers + config.toml + `lib` layer (supabase/proxy/types/
   queries/actions).
3. UI component library.
4. Auth pages + app shell + guard.
5. App pages + Board/List/Calendar + task CRUD + empty/loading/error states.
6. Marketing landing, then run typecheck/lint/build and boot the stack to verify.

## Scope / YAGNI

In: all pages above, Board+List+Calendar, task CRUD, Google auth, dark mode.
Deferred: real-time collaboration, notifications backend (Inbox reads assigned
tasks), file attachments, drag-reorder persistence beyond status changes.
