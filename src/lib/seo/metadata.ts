import 'server-only';

import type { Metadata } from 'next';

import { business, publicValue } from '@/content/business';
import {
  localeOgLocale,
  localizedPath,
  otherLocale,
  routing,
  type AppRouteSlug,
  type Locale,
} from '@/i18n/routing';

/**
 * Shared metadata factory.
 *
 * Every route composes canonical, hreflang alternates, Open Graph and Twitter
 * cards from the same function, so a page-level override can never accidentally
 * drop the alternates or the social image that the layout declares.
 */

function origin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

export interface RouteMetadataInput {
  readonly locale: Locale;
  readonly slug: AppRouteSlug;
  readonly title: string;
  readonly description: string;
}

export function buildRouteMetadata({ locale, slug, title, description }: RouteMetadataInput): Metadata {
  const base = origin();
  const canonical = `${base}${localizedPath(locale, slug)}`;

  // Alternates describe *this* route in both locales. Cross-route language
  // discovery belongs in the sitemap, where each entry carries its own
  // alternates, rather than in every page head.
  const languages: Record<string, string> = {
    [locale]: canonical,
    [otherLocale(locale)]: `${base}${localizedPath(otherLocale(locale), slug)}`,
    'x-default': `${base}${localizedPath('ar', '')}`,
  };

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: publicValue(business.name) ?? 'Swim Fit Academy',
      title,
      description,
      url: canonical,
      locale: localeOgLocale[locale],
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => localeOgLocale[code]),
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Swim Fit Academy — Abu Dhabi. Learn. Progress. Shine.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
    other: {
      'provisional-site-mark': business.mark.label,
    },
  };
}
