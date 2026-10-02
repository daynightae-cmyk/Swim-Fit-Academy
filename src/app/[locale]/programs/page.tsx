import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/sections/PageHero';
import { ProgramsSection } from '@/components/sections/ProgramsSection';
import { SkillPathSelector } from '@/components/sections/SkillPathSelector';
import { WidePoster } from '@/components/posters/WidePoster';
import { StructuredData } from '@/components/seo/StructuredData';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { posterById } from '@/content/posters';
import { appRoutes, isLocale, localizedPath, routing, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'ar';
  const t = await getTranslations({ locale, namespace: 'meta.programs' });
  return buildRouteMetadata({
    locale,
    slug: 'programs',
    title: t('title'),
    description: t('description'),
  });
}

export default async function ProgramsPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);

  const t = await getTranslations('programsSection');
  const nav = await getTranslations('nav');

  return (
    <>
      <StructuredData locale={locale} />

      <PageHero
        marker="01"
        kicker={t('kicker')}
        title={t('title')}
        body={t('body')}
      />

      <ProgramsSection locale={locale} tone="light" withCloser={false} />

      <Section labelledBy="skill-path-heading" spacing="loose">
        <SectionHeading
          kicker={t('kicker')}
          title={t('title')}
          body={t('body')}
          id="skill-path-heading"
        />
        <div className="mt-10">
          <SkillPathSelector />
        </div>
      </Section>

      <div className="mx-auto w-full max-w-[86rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <WidePoster poster={posterById('levels')} />
      </div>

      {/* Clean internal linking to the remaining journey. */}
      <Section labelledBy="programs-next" tone="light" spacing="tight">
        <h2 id="programs-next" className="sr-only">
          {nav('primary')}
        </h2>
        <nav aria-label={nav('primary')}>
          <ul className="grid gap-4 sm:grid-cols-3">
            {appRoutes
              .filter((route) => ['coach', 'locations', 'contact'].includes(route.key))
              .map((route) => (
                <li key={route.key}>
                  <Link
                    href={localizedPath(locale, route.slug)}
                    className="block rounded-2xl border border-ocean-500/10 bg-white/70 p-5 transition-colors hover:border-pool-500/40"
                  >
                    <span className="text-[0.95rem] font-semibold text-ocean-950">{nav(route.key)}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </Section>
    </>
  );
}