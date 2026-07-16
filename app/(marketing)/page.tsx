import { Hero } from "@/components/marketing/Hero";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import {
  Board,
  Calendar,
  Flag,
  ListIcon,
  Tag,
  Users,
} from "@/components/ui/icons";

const FEATURES = [
  {
    icon: <Flag size={20} />,
    title: "Priorities that pop",
    description:
      "Urgent to low, each task wears a color-coded flag and a leading edge so the important work is obvious at a glance.",
  },
  {
    icon: <Tag size={20} />,
    title: "Labels & filters",
    description:
      "Tag tasks by type, then slice any board or list down to exactly what you need to see right now.",
  },
  {
    icon: <Users size={20} />,
    title: "Built for teams",
    description:
      "Assign owners, share workspaces, and keep everyone pointed at the same finish line.",
  },
];

const VIEWS = [
  {
    icon: <Board size={22} />,
    title: "Board",
    description: "A Kanban board where work flows from backlog to done, one drag at a time.",
  },
  {
    icon: <ListIcon size={22} />,
    title: "List",
    description: "A dense, sortable list for when you just want to scan and check things off.",
  },
  {
    icon: <Calendar size={22} />,
    title: "Calendar",
    description: "See due dates laid out across the month so nothing slips through.",
  },
];

export default function LandingPage() {
  return (
    <>
      <Hero />

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.015em] text-ink sm:text-4xl">
            Everything your team needs to stay in flow
          </h2>
          <p className="mt-4 text-lg text-body">
            Thoughtful defaults, zero clutter. TaskMe gets out of the way so the work gets done.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <section id="views" className="border-y border-hairline bg-surface-soft">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-[-0.015em] text-ink sm:text-4xl">
              Three views, one source of truth
            </h2>
            <p className="mt-4 text-lg text-body">
              Switch how you look at work without ever losing your place.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {VIEWS.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
                  {v.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.01em] text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
