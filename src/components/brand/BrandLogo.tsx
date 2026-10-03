import Image from 'next/image';
import { useEffect, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';

import { badgeForTheme, logoForTheme, type MediaAsset } from '@/content/media';
import { DEFAULT_THEME, themeStore, type ThemeMode } from '@/lib/theme';

/* -------------------------------------------------------------------------- */
/* Logo                                                                      */
/* -------------------------------------------------------------------------- */

export interface BrandLogoProps {
  readonly asset?: MediaAsset;
  /** Height in px. Width follows the asset ratio. */
  readonly height?: number;
  readonly priority?: boolean;
  readonly className?: string;
  readonly useBadge?: boolean;
}

/**
 * The real supplied Swim Fit Academy logo.
 *
 * Only the day or the night asset is ever mounted, so the hidden variant cannot
 * contribute a duplicate accessible name. The theme is read through
 * `useSyncExternalStore`, which keeps the server snapshot and the first client
 * render in agreement — the inline bootstrap script then applies the stored
 * choice before paint, so there is no flash and no hydration mismatch.
 */
export function BrandLogo({
  asset,
  height = 44,
  priority = false,
  className,
  useBadge = false,
}: BrandLogoProps) {
  const t = useTranslations('brand');
  const theme = useSyncExternalStore<ThemeMode>(
    themeStore.subscribe,
    themeStore.get,
    () => DEFAULT_THEME,
  );

  const resolved = asset ?? (useBadge ? badgeForTheme(theme) : logoForTheme(theme));
  const width = Math.round((height * resolved.width) / resolved.height);

  return (
    <Image
      key={resolved.id}
      src={resolved.src}
      alt={theme === 'day' ? t('logoAltDay') : t('logoAltNight')}
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={className}
      data-logo={resolved.role}
      data-theme={theme}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Theme toggle                                                               */
/* -------------------------------------------------------------------------- */

function SunGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.5 6.5 5 5M19 19l-1.5-1.5M17.5 6.5 19 5M5 19l1.5-1.5" />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5a8.6 8.6 0 1 0 10.9 10.9Z" />
    </svg>
  );
}

/**
 * Day / Night switch.
 *
 * A single button whose label always names the action it performs, so the
 * accessible name can never describe the current state instead of the outcome.
 */
export function ThemeToggle({ className }: { readonly className?: string }) {
  const t = useTranslations('theme');
  const theme = useSyncExternalStore<ThemeMode>(
    themeStore.subscribe,
    themeStore.get,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    // The system preference is followed only while no explicit choice is stored.
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => themeStore.syncWithSystem();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const next: ThemeMode = theme === 'day' ? 'night' : 'day';
  const label = next === 'night' ? t('toNight') : t('toDay');

  return (
    <button
      type="button"
      data-testid="theme-toggle"
      data-theme-state={theme}
      onClick={() => themeStore.toggle()}
      aria-label={label}
      title={label}
      className={[
        'relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:bg-accent-soft',
        className ?? '',
      ].join(' ')}
    >
      <span aria-hidden="true" className="flex items-center justify-center">
        {theme === 'day' ? <SunGlyph /> : <MoonGlyph />}
      </span>
    </button>
  );
}