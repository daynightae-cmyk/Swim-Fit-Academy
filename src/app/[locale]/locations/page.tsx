import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/sections/PageHero';
import { AbuDhabiLocationPanel } from '@/components/sections/AbuDhabiLocationPanel';
import { PosterBlock } from '@/components/sections/PosterBlock';
import { StructuredData } from '@/components/seo/StructuredData';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PhoneButton, WhatsAppButton } from '@/components/ui/ContactActions';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { isLocale, localizedPath, routing, type Locale } from '@/i18n/routing';

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
  const t = await getTranslations({ locale, namespace: 'meta.locations' });
  return buildRouteMetadata({
    locale,
    slug: 'locations',
    title: t('title'),
    description: t('description'),
  });
}

export default async function LocationsPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);

  const t = await getTranslations('locations');
  const nav = await getTranslations('nav');
  const faq = await getTranslations('faq');

  return (
    <>
      <StructuredData locale={locale} />

      <PageHero
        marker="01"
        kicker={t('kicker')}
        title={t('title')}
        body={t('body')}
        supportLine={t('supportLine')}
      >
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton label={t('whatsappCta')} surface="locations_hero" size="md" />
          <PhoneButton label={t('phoneCta')} surface="locations_hero" size="md" />
        </div>
      </PageHero>

      <Section labelledBy="locations-panel" spacing="loose">
        <SectionHeading
          kicker={t('kicker')}
          title={t('cardTitle')}
          body={t('cardBody')}
          id="locations-panel"
        />
        <MotionReveal className="mt-10">
          <AbuDhabiLocationPanel />
        </MotionReveal>
      </Section>

      <Section labelledBy="locations-next" tone="light" spacing="loose">
        <SectionHeading
          kicker={faq('kicker')}
          title={faq('confirmTitle')}
          body={faq('confirmBody')}
          id="locations-next"
          tone="light"
        />
        <MotionReveal className="mt-9 flex flex-wrap gap-3">
          <WhatsAppButton label={t('whatsappCta')} surface="locations_bottom" size="lg" />
          <PhoneButton label={t('phoneCta')} surface="locations_bottom" size="lg" />
          <Link href={localizedPath(locale, 'faq')} className="btn btn-quiet text-ocean-800">
            {nav('faq')}
          </Link>
        </MotionReveal>
      </Section>

      <div className="mx-auto w-full max-w-[86rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <PosterBlock id="abu-dhabi" tone="tight" />
      </div>
    </>
  );
}