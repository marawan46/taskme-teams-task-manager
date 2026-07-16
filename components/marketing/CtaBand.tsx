import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

export function CtaBand() {
  return (
    <section id="cta" className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-brand px-8 py-16 text-center sm:px-16">
        <h2 className="text-3xl font-bold tracking-[-0.015em] text-white sm:text-4xl">
          Ready to ship faster with your team?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
          Set up your first board in minutes. No credit card required.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-6
            text-sm font-semibold text-primary shadow-md transition-[transform,box-shadow] duration-[180ms]
            ease-standard hover:-translate-y-px hover:shadow-lg"
        >
          Get started free
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
