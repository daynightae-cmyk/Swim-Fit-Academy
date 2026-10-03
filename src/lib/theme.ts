'use client';

/**
 * Day / Night identity.
 *
 * First visit follows the system preference. An explicit user choice is stored in
 * localStorage and always wins. The inline bootstrap script in the layout applies
 * the stored theme before first paint, so there is never a flash of the wrong
 * identity — no logo swap, no background flip, no hydration mismatch.
 */

export type ThemeMode = 'day' | 'night';

export const THEME_STORAGE_KEY = 'sfa-theme';
export const DEFAULT_THEME: ThemeMode = 'night';

/**
 * Runs before paint. Must stay tiny, dependency-free and defensive: any failure
 * leaves the server-rendered default in place rather than breaking the page.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{
var k='${THEME_STORAGE_KEY}';
var s=localStorage.getItem(k);
var t=(s==='day'||s==='night')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'day':'${DEFAULT_THEME}');
var r=document.documentElement;
r.dataset.theme=t;
r.style.colorScheme=t;
}catch(e){}})();`;

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

function readStoredTheme(): ThemeMode | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'day' || stored === 'night' ? stored : null;
  } catch {
    return null;
  }
}

function systemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : DEFAULT_THEME;
}

/** Resolves the active theme, preferring an explicit stored choice. */
export function resolveInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  return readStoredTheme() ?? systemTheme();
}

export interface ThemeController {
  readonly theme: ThemeMode;
  readonly setTheme: (next: ThemeMode) => void;
  readonly toggleTheme: () => void;
}

export type ThemeListener = (theme: ThemeMode) => void;

const listeners = new Set<ThemeListener>();
let currentTheme: ThemeMode | null = null;

/**
 * Theme store.
 *
 * Reads are synchronous so components can pick the correct logo on first render.
 * Writes broadcast to every subscriber, including components that mounted before
 * the toggle was interacted with.
 */
export const themeStore = {
  get(): ThemeMode {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    if (!currentTheme) {
      currentTheme =
        (document.documentElement.dataset.theme as ThemeMode | undefined) ??
        readStoredTheme() ??
        DEFAULT_THEME;
    }
    return currentTheme;
  },

  set(next: ThemeMode): void {
    if (typeof window === 'undefined') return;
    currentTheme = next;
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // A blocked storage API must not stop the theme from applying.
    }
    for (const listener of listeners) listener(next);
  },

  toggle(): void {
    themeStore.set(themeStore.get() === 'day' ? 'night' : 'day');
  },

  subscribe(listener: ThemeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Applies the system preference only when the user has not chosen. */
  syncWithSystem(): void {
    if (readStoredTheme() !== null) return;
    themeStore.set(systemTheme());
  },
};