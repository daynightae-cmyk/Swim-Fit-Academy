import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/sections/PageHero';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { StructuredData } from '@/components/seo/StructuredData';
import { Section } from '@/components/ui/Section';
import { WhatsAppButton, PhoneButton } from '@/components/ui/ContactActions';
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
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return buildRouteMetadata({
    locale,
    slug: 'faq',
    title: t('title'),
    description: t('description'),
  });
}

export default async function FaqPage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);

  const t = await getTranslations('faq');
  const nav = await getTranslations('nav');

  return (
    <>
      <StructuredData locale={locale} />

      <PageHero marker="01" kicker={t('kicker')} title={t('title')} body={t('body')} />

      <Section labelledBy="faq-heading" spacing="loose">
        <h2 id="faq-heading" className="sr-only">
          {t('title')}
        </h2>
        <FAQAccordion />

        <MotionReveal className="mt-16 flex flex-col gap-5 rounded-[1.5rem] border border-pool-300/14 bg-ocean-900/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-[42ch]">
            <p className="text-[1.05rem] font-semibold text-ice-50">{t('confirmTitle')}</p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-400">{t('confirmBody')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton label={t('confirmCta')} surface="faq_bottom" size="md" />
            <PhoneButton label={t('contactShortcut')} surface="faq_bottom" size="md" />
            <Link href={localizedPath(locale, 'contact')} className="btn btn-quiet">
              {nav('contact')}
            </Link>
          </div>
        </MotionReveal>

        <p className="mt-8 text-[0.8rem] leading-relaxed text-slate-600">{t('schemaNote')}</p>
      </Section>
    </>
  );
}