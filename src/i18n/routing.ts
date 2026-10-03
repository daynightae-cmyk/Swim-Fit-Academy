import { defineRouting } from 'next-intl/routing';

export const locales = ['ar', 'en'] as const;

export type Locale = (typeof locales)[number];

/** Arabic is the default experience for the academy. */
export const defaultLocale: Locale = 'ar';

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};

export const localeLabel: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
};

/** Short BCP-47 tags used for `lang`, `hreflang` and Open Graph. */
export const localeHtmlLang: Record<Locale, string> = {
  ar: 'ar-AE',
  en: 'en-AE',
};

export const localeOgLocale: Record<Locale, string> = {
  ar: 'ar_AE',
  en: 'en_AE',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function dirForLocale(locale: Locale): 'rtl' | 'ltr' {
  return localeDirection[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar';
}

/**
 * Routes are declared once so navigation, sitemap generation and the language
 * switcher can never drift apart.
 */
export const appRoutes = [
  { slug: '', key: 'home' },
  { slug: 'programs', key: 'programs' },
  { slug: 'coach', key: 'coach' },
  { slug: 'locations', key: 'locations' },
  { slug: 'results', key: 'results' },
  { slug: 'faq', key: 'faq' },
  { slug: 'contact', key: 'contact' },
] as const;

export type AppRouteKey = (typeof appRoutes)[number]['key'];
export type AppRouteSlug = (typeof appRoutes)[number]['slug'];

export function isAppRouteSlug(value: unknown): value is AppRouteSlug {
  return appRoutes.some((route) => route.slug === value);
}

/** Builds a localized path such as `/ar/programs`. */
export function localizedPath(locale: Locale, slug: AppRouteSlug = ''): string {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/**
 * Swaps only the locale segment and preserves the rest of the pathname,
 * including any nested segment. Used by the language switcher.
 */
export function swapLocaleInPath(pathname: string, next: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = next;
  } else {
    segments.unshift(next);
  }
  return `/${segments.join('/')}`;
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // Arabic is the academy's default experience, so `/` always resolves to `/ar`
  // regardless of the visitor's Accept-Language header.
  localeDetection: false,
});

export type AppLocaleParam = Promise<{ locale: string }>;