import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "@/components/ui/icons";
import { ProductPreview } from "./ProductPreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-brand-soft pb-8">
      <div className="mx-auto max-w-4xl px-6 pt-20 text-center sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-body shadow-xs">
          <Sparkles size={14} className="text-primary" />
          Board, List &amp; Calendar — all in one place
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl">
          Where teams turn plans into{" "}
          <span className="text-gradient-brand">shipped work</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body">
          TaskMe is the calm, fast task manager for teams. Organize work across boards,
          lists, and calendars — with priorities, labels, and assignees that keep everyone
          aligned.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Start for free
            <ArrowRight size={18} />
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Log in
          </Link>
        </div>
      </div>
      <ProductPreview />
    </section>
  );
}
