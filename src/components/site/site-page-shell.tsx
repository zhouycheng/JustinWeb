import type { ReactNode } from "react";

type SitePageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SitePageShell({
  eyebrow,
  title,
  description,
  children,
}: SitePageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--page-background)] text-[var(--page-foreground)]">
      <main className="site-readable px-6 pb-20 pt-44 md:px-10 md:pt-32 lg:px-12">
        <section className="mx-auto max-w-6xl">
          <div className="max-w-3xl border-b border-[var(--page-line)] pb-10">
            <p className="font-home-mono text-[12px] uppercase tracking-[0.24em] text-[var(--page-muted)]">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-home-mono text-[40px] font-semibold tracking-[-0.06em] text-[var(--page-heading)] md:text-[52px]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--page-muted)] md:text-[16px]">
              {description}
            </p>
          </div>

          <div className="pt-10">{children}</div>
        </section>
      </main>
    </div>
  );
}
