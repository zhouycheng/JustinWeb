"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";

import {
  getHtmlLang,
  getNextLocale,
  type Locale,
  localeCookieMaxAge,
  localeCookieName,
} from "@/lib/i18n/config";
import {
  THEME_DARK_MEDIA_QUERY,
  applyThemeWithTransition,
  readStoredTheme,
  readThemeFromDom,
  resolveTheme,
  toggleTheme,
  writeStoredTheme,
} from "@/lib/theme/theme";
import type { FloatingActionsCopy } from "@/lib/site/content";

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23L5.46 5.46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.75 12h14.5M12 3.75c2.2 2.34 3.4 5.33 3.4 8.25S14.2 17.91 12 20.25M12 3.75C9.8 6.09 8.6 9.08 8.6 12s1.2 5.91 3.4 8.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function getSystemPreferredTheme() {
  return window.matchMedia(THEME_DARK_MEDIA_QUERY).matches;
}

type ThemeToggleFabProps = {
  locale: Locale;
  copy: FloatingActionsCopy;
};

export function ThemeToggleFab({ locale, copy }: ThemeToggleFabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const currentTheme =
      readThemeFromDom() ?? resolveTheme(readStoredTheme(), getSystemPreferredTheme());
    const nextTheme = toggleTheme(currentTheme);

    applyThemeWithTransition(nextTheme, {
      fromTheme: currentTheme,
      trigger: themeButtonRef.current,
    });
    writeStoredTheme(nextTheme);
  };

  const nextLocale = getNextLocale(locale);
  const localeButtonLabel =
    nextLocale === "en" ? copy.switchToEnglishLabel : copy.switchToChineseLabel;

  const handleLocaleToggle = () => {
    document.cookie = [
      `${localeCookieName}=${nextLocale}`,
      "Path=/",
      `Max-Age=${localeCookieMaxAge}`,
      "SameSite=Lax",
    ].join("; ");

    document.documentElement.lang = getHtmlLang(nextLocale);

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="site-floating-actions" aria-label={copy.groupAriaLabel}>
      <div className="site-floating-actions-shell">
        <div className="site-floating-control">
          <button
            type="button"
            aria-label={localeButtonLabel}
            className="site-floating-action-button site-floating-action-button--locale"
            disabled={isPending}
            onClick={handleLocaleToggle}
          >
            <span aria-hidden="true" className="site-floating-action-icon">
              <GlobeIcon />
            </span>
            <span aria-hidden="true" className="site-floating-action-label">
              {nextLocale === "en" ? "EN" : "中"}
            </span>
          </button>

          <button
            type="button"
            aria-label={copy.themeToggleLabel}
            className="site-floating-action-button site-floating-action-button--theme"
            onClick={handleClick}
            ref={themeButtonRef}
          >
            <span aria-hidden="true" className="site-theme-toggle-icon site-theme-toggle-icon--sun">
              <SunIcon />
            </span>
            <span
              aria-hidden="true"
              className="site-theme-toggle-icon site-theme-toggle-icon--moon"
            >
              <MoonIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
