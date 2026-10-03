import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IBM_Plex_Sans_Arabic, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';

import { AIConciergeLauncher } from '@/components/ai/AIConciergeLauncher';
import { EditorialFooter } from '@/components/layout/EditorialFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { StickyMobileActions } from '@/components/layout/StickyMobileActions';
import { AnalyticsProvider } from '@/lib/AnalyticsProvider';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { DEFAULT_THEME, THEME_BOOTSTRAP_SCRIPT } from '@/lib/theme';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { isLocale, localeHtmlLang, routing, type Locale } from '@/i18n/routing';

/**
 * Typography.
 * Arabic uses IBM Plex Sans Arabic (a production-grade Arabic face).
 * English uses Manrope (a modern grotesk).
 */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-arabic',
  preload: true,
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
  preload: true,
});

/**
 * Vercel injects `NEXT_PUBLIC_VERCEL_ENV` at build time. Anywhere else the
 * analytics beacons would request a script the host does not serve.
 */
const isVercelDeployment = Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = hasLocale(routing.locales, raw) ? raw : 'ar';
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return buildRouteMetadata({ locale, slug: '', title: t('title'), description: t('description') });
}

export const viewport: Viewport = {
  themeColor: '#03131f',
  colorScheme: 'dark',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale: Locale = raw;
  setRequestLocale(locale);

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <html
      lang={localeHtmlLang[locale]}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      data-theme={DEFAULT_THEME}
      className={`${plexArabic.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint: no flash, no shift. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-svh antialiased">
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Dubai">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-pool-400 focus:px-4 focus:py-2.5 focus:text-[0.85rem] focus:font-semibold focus:text-ocean-950"
          >
            {t('skipToContent')}
          </a>

          <SiteHeader />

          <main id="main" tabIndex={-1} className="relative focus:outline-none">
            {children}
          </main>

          <EditorialFooter />
          <StickyMobileActions />
          <AIConciergeLauncher />
          <AnalyticsProvider />
          {/* Mounted only on Vercel: the beacon scripts 404 on any other host. */}
          {isVercelDeployment ? <Analytics /> : null}
          {isVercelDeployment ? <SpeedInsights /> : null}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}