import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const COLUMNS = [
  { title: "Product", links: ["Features", "Board view", "List view", "Calendar"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Resources", links: ["Docs", "Help center", "Changelog", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-soft">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo href="/" />
            <p className="mt-3 max-w-[16rem] text-sm text-muted">
              The calm, fast task manager for teams that ship.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/"
                      className="text-sm text-body transition-colors hover:text-ink"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 sm:flex-row">
          <p className="text-sm text-muted">© 2026 TaskMe. All rights reserved.</p>
          <p className="font-mono text-xs text-muted-soft">Built with Next.js &amp; Supabase</p>
        </div>
      </div>
    </footer>
  );
}
