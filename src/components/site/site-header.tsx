"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";
import type { SiteNavigationItem } from "@/lib/site/content";

import { ActivityStatusBadge } from "@/components/home/activity-status-badge";

type SiteHeaderProps = {
  brandLabel: string;
  avatarLabel: string;
  locale: Locale;
  navItems: SiteNavigationItem[];
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ brandLabel, avatarLabel, locale, navItems }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="site-header-shell relative z-20 px-6 pb-4 pt-5 md:px-10 md:pb-0 lg:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 md:grid-cols-[1fr_auto_1fr] md:gap-y-6">
        <Link
          href="/"
          className="justify-self-start font-home-system text-[22px] font-semibold tracking-[-0.03em] text-[var(--page-heading)] md:col-start-1 md:row-start-1"
        >
          {brandLabel}
        </Link>

        <div className="flex items-center justify-self-end gap-3 md:col-start-3 md:row-start-1">
          <ActivityStatusBadge locale={locale} />

          <div
            aria-label={avatarLabel}
            className="site-avatar h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat md:h-11 md:w-11"
            style={{ backgroundImage: "url('/avatar/my.jpg')" }}
          />
        </div>

        <nav className="col-span-2 row-start-2 flex items-center gap-2 overflow-x-auto font-home-system text-[13px] text-[var(--page-heading)] md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-center md:text-[14px]">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "site-nav-link shrink-0 rounded-xl px-4 py-3 leading-none",
                  active ? "site-nav-link--active font-medium" : "site-nav-link--idle font-normal",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
