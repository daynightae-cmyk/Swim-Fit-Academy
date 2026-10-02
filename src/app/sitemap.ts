import type { MetadataRoute } from 'next';

import { appRoutes, localizedPath } from '@/i18n/routing';

function origin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

/**
 * Sitemap.
 * Every locale and route is declared once in `src/i18n/routing.ts`, so this file
 * cannot drift from the navigation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = origin();
  const lastModified = new Date();

  return appRoutes.flatMap((route) => [
    {
      url: `${base}${localizedPath('ar', route.slug)}`,
      lastModified,
      changeFrequency: route.key === 'home' ? ('weekly' as const) : ('monthly' as const),
      priority: route.key === 'home' ? 1 : route.key === 'programs' || route.key === 'contact' ? 0.9 : 0.7,
      alternates: {
        languages: {
          ar: `${base}${localizedPath('ar', route.slug)}`,
          en: `${base}${localizedPath('en', route.slug)}`,
        },
      },
    },
    {
      url: `${base}${localizedPath('en', route.slug)}`,
      lastModified,
      changeFrequency: route.key === 'home' ? ('weekly' as const) : ('monthly' as const),
      priority: route.key === 'home' ? 1 : route.key === 'programs' || route.key === 'contact' ? 0.9 : 0.7,
      alternates: {
        languages: {
          ar: `${base}${localizedPath('ar', route.slug)}`,
          en: `${base}${localizedPath('en', route.slug)}`,
        },
      },
    },
  ]);
}
