export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "justinview-theme";
export const THEME_DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const THEME_REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

const THEME_TRANSITION_ATTRIBUTE = "data-theme-transition";
const THEME_TRANSITION_FROM_ATTRIBUTE = "data-theme-transition-from";
const THEME_TRANSITION_LOCK_ATTRIBUTE = "data-theme-motion-lock";
const THEME_TRANSITION_DURATION_MS = 720;
const THEME_TRANSITION_ORIGIN_X_PROPERTY = "--theme-transition-origin-x";
const THEME_TRANSITION_ORIGIN_Y_PROPERTY = "--theme-transition-origin-y";
const THEME_TRANSITION_END_RADIUS_PROPERTY = "--theme-transition-end-radius";

const themeTransitionTimers = new WeakMap<HTMLElement, number>();

type ThemeTransitionGeometry = {
  x: number;
  y: number;
  endRadius: number;
};

type ThemeTransitionOptions = {
  fromTheme?: Theme;
  root?: HTMLElement;
  trigger?: HTMLElement | null;
};

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(
  storedTheme: string | null | undefined,
  systemPrefersDark: boolean
): Theme {
  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return systemPrefersDark ? "dark" : "light";
}

export function toggleTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function isThemeTransitionLocked(root: HTMLElement = document.documentElement) {
  return root.getAttribute(THEME_TRANSITION_LOCK_ATTRIBUTE) === "active";
}

function setThemeTransitionLock(root: HTMLElement, active: boolean) {
  if (active) {
    root.setAttribute(THEME_TRANSITION_LOCK_ATTRIBUTE, "active");
    return;
  }

  root.removeAttribute(THEME_TRANSITION_LOCK_ATTRIBUTE);
}

function setThemeTransitionFrom(root: HTMLElement, theme: Theme) {
  root.setAttribute(THEME_TRANSITION_FROM_ATTRIBUTE, theme);
}

function setThemeTransitionGeometry(root: HTMLElement, geometry: ThemeTransitionGeometry) {
  root.style.setProperty(THEME_TRANSITION_ORIGIN_X_PROPERTY, `${geometry.x}px`);
  root.style.setProperty(THEME_TRANSITION_ORIGIN_Y_PROPERTY, `${geometry.y}px`);
  root.style.setProperty(THEME_TRANSITION_END_RADIUS_PROPERTY, `${geometry.endRadius}px`);
}

function clearThemeTransitionGeometry(root: HTMLElement) {
  root.style.removeProperty(THEME_TRANSITION_ORIGIN_X_PROPERTY);
  root.style.removeProperty(THEME_TRANSITION_ORIGIN_Y_PROPERTY);
  root.style.removeProperty(THEME_TRANSITION_END_RADIUS_PROPERTY);
}

function getThemeTransitionGeometry(
  root: HTMLElement,
  trigger?: HTMLElement | null
): ThemeTransitionGeometry {
  const ownerWindow = root.ownerDocument.defaultView ?? window;
  const triggerRect = trigger?.getBoundingClientRect();
  const x = triggerRect
    ? triggerRect.left + triggerRect.width / 2
    : ownerWindow.innerWidth - 40;
  const y = triggerRect
    ? triggerRect.top + triggerRect.height / 2
    : ownerWindow.innerHeight - 40;
  const endRadius = Math.max(
    Math.hypot(x, y),
    Math.hypot(ownerWindow.innerWidth - x, y),
    Math.hypot(x, ownerWindow.innerHeight - y),
    Math.hypot(ownerWindow.innerWidth - x, ownerWindow.innerHeight - y)
  );

  return {
    x,
    y,
    endRadius,
  };
}

function clearThemeTransitionState(root: HTMLElement) {
  const activeTimer = themeTransitionTimers.get(root);

  if (activeTimer !== undefined) {
    window.clearTimeout(activeTimer);
    themeTransitionTimers.delete(root);
  }

  setThemeTransitionLock(root, false);
  root.removeAttribute(THEME_TRANSITION_FROM_ATTRIBUTE);
  root.removeAttribute(THEME_TRANSITION_ATTRIBUTE);
  clearThemeTransitionGeometry(root);
}

function runThemeTransition(theme: Theme, root: HTMLElement, fromTheme: Theme, geometry: ThemeTransitionGeometry) {
  clearThemeTransitionState(root);
  setThemeTransitionGeometry(root, geometry);
  setThemeTransitionFrom(root, fromTheme);
  setThemeTransitionLock(root, true);
  root.setAttribute(THEME_TRANSITION_ATTRIBUTE, "active");

  // Apply the new theme after the transition state is committed so CSS can
  // animate the old backdrop layer away while the new theme is already active.
  root.getBoundingClientRect();
  applyTheme(theme, root);

  const cleanupTimer = window.setTimeout(() => {
    clearThemeTransitionState(root);
  }, THEME_TRANSITION_DURATION_MS);

  themeTransitionTimers.set(root, cleanupTimer);
}

function prefersReducedMotion() {
  return window.matchMedia(THEME_REDUCED_MOTION_MEDIA_QUERY).matches;
}

export function applyThemeWithTransition(
  theme: Theme,
  options: ThemeTransitionOptions = {}
) {
  const root = options.root ?? document.documentElement;
  const fromTheme = options.fromTheme ?? readThemeFromDom(root);

  if (fromTheme === theme) {
    clearThemeTransitionState(root);
    applyTheme(theme, root);
    return;
  }

  if (prefersReducedMotion() || !fromTheme) {
    clearThemeTransitionState(root);
    applyTheme(theme, root);
    return;
  }

  clearThemeTransitionState(root);
  const geometry = getThemeTransitionGeometry(root, options.trigger);
  runThemeTransition(theme, root, fromTheme, geometry);
}

export function readThemeFromDom(root: HTMLElement = document.documentElement): Theme | null {
  return isTheme(root.dataset.theme) ? root.dataset.theme : null;
}

export function readStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

export function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
}

export function getThemeBootstrapScript() {
  return `
    (function () {
      var fallbackTheme = "light";
      var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      var mediaQuery = ${JSON.stringify(THEME_DARK_MEDIA_QUERY)};
      var root = document.documentElement;

      try {
        var storedTheme = window.localStorage.getItem(storageKey);
        var theme =
          storedTheme === "light" || storedTheme === "dark"
            ? storedTheme
            : window.matchMedia(mediaQuery).matches
              ? "dark"
              : fallbackTheme;

        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      } catch (error) {
        root.dataset.theme = fallbackTheme;
        root.style.colorScheme = fallbackTheme;
      }
    })();
  `;
}
