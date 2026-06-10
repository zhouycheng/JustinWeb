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

import { GlobeIcon, MoonIcon, SunIcon } from "./icons";

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
