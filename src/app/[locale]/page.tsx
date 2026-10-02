import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HeroScene } from '@/components/sections/HeroScene';
import { TrustRail } from '@/components/sections/TrustRail';
import { BrandStatement } from '@/components/sections/BrandStatement';
import { ProgramsSection } from '@/components/sections/ProgramsSection';
import { MethodSection } from '@/components/sections/MethodSection';
import { ProgressSection } from '@/components/sections/ProgressSection';
import { LocationsSection } from '@/components/sections/LocationsSection';
import { FaqTeaserSection } from '@/components/sections/FaqTeaserSection';
import { AiInviteSection } from '@/components/sections/AiInviteSection';
import { StructuredData } from '@/components/seo/StructuredData';
import { PosterBlock } from '@/components/sections/PosterBlock';
import { isLocale, routing, type Locale } from '@/i18n/routing';

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
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return buildRouteMetadata({
    locale,
    slug: '',
    title: t('title'),
    description: t('description'),
  });
}

/**
 * Homepage sequence.
 *
 * 01 Hero · 02 Trust rail · 03 Brand statement · 04 Poster 01 · 05 Programs ·
 * 06 Poster 02 · 07 Method · 08 Poster 03 · 09 Progress framework ·
 * 10 Poster 04 · 11 Abu Dhabi · 12 Poster 05 · 13 FAQ teaser · 14 AI invite ·
 * 15 Poster 06 conversion · 16 Editorial footer (rendered by the layout)
 *
 * Visual intensity alternates: dense moments (hero, posters, cards, method,
 * AI) and quiet moments (brand statement, location honesty, FAQ teaser).
 */
export default async function HomePage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);


  return (
    <>
      <StructuredData locale={locale} />

      {/* 01 — Hero */}
      <HeroScene locale={locale} />

      {/* 02 — Quick contact / trust rail */}
      <TrustRail />

      {/* 03 — Brand statement (quiet moment) */}
      <BrandStatement />

      {/* 04 — Wide poster 01: brand */}
      <PosterBlock id="brand" />

      {/* 05 — Programs */}
      <ProgramsSection locale={locale} />

      {/* 06 — Wide poster 02: technique */}
      <PosterBlock id="technique" />

      {/* 07 — Training method */}
      <MethodSection />

      {/* 08 — Wide poster 03: progress */}
      <PosterBlock id="progress" />

      {/* 09 — Progress framework */}
      <ProgressSection />

      {/* 10 — Wide poster 04: all levels */}
      <PosterBlock id="levels" program="start" />

      {/* 11 — Abu Dhabi / location truth */}
      <LocationsSection locale={locale} />

      {/* 12 — Wide poster 05: Abu Dhabi */}
      <PosterBlock id="abu-dhabi" />

      {/* 13 — FAQ teaser */}
      <FaqTeaserSection locale={locale} />

      {/* 14 — AI concierge invitation */}
      <AiInviteSection />

      {/* 15 — Wide poster 06: conversion CTA */}
      <PosterBlock id="conversion" />
    </>
  );
}