import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

/** Capability card — lifts on hover per DESIGN.md feature-card spec. */
export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div
      className="group rounded-xl border border-hairline bg-surface-card p-6 shadow-sm
        transition-[transform,box-shadow] duration-[180ms] ease-standard
        hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
    </div>
  );
}
