import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { TrialRequestForm } from '@/components/forms/TrialRequestForm';
import { ContactShortcuts, SocialLinks } from '@/components/sections/SocialLinks';
import { StructuredData } from '@/components/seo/StructuredData';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { PhoneButton, WhatsAppButton } from '@/components/ui/ContactActions';
import { business, publicValue } from '@/content/business';
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
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return buildRouteMetadata({
    locale,
    slug: 'contact',
    title: t('title'),
    description: t('description'),
  });
}

export default async function ContactPage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);

  const t = await getTranslations('contact');
  const phoneDisplay = publicValue(business.phone.local) ?? '056 969 8628';
  const phoneInternational = publicValue(business.phone.international) ?? '+971 56 969 8628';

  return (
    <>
      <StructuredData locale={locale} />

      <PageHero
        marker="01"
        kicker={t('kicker')}
        title={t('title')}
        body={t('sub')}
        supportLine={t('supportLine')}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppButton label={t('whatsappCta')} surface="contact_hero" size="lg" />
            <PhoneButton label={t('phoneCta')} surface="contact_hero" size="lg" />
          </div>
          <p className="flex flex-col gap-1">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink-4">
              {t('phoneLabel')}
            </span>
            <a
              href="tel:+971569698628"
              dir="ltr"
              data-testid="contact-phone-display"
              className="font-latin text-[1.65rem] font-semibold tracking-tight text-ink transition-colors hover:text-accent sm:text-[2rem]"
            >
              {phoneDisplay}
            </a>
            <span dir="ltr" className="font-latin text-[0.86rem] text-ink-3">
              {phoneInternational}
            </span>
          </p>
        </div>
      </PageHero>

      <Section labelledBy="contact-form-heading" spacing="loose">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <SectionHeading
              kicker={t('formTitleKicker')}
              title={t('formTitle')}
              body={t('formTitleBody')}
              id="contact-form-heading"
            />
            <div className="mt-9">
              <TrialRequestForm surface="contact_page" />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="rounded-[1.5rem] border border-line bg-raised/75 p-6 shadow-card backdrop-blur-sm sm:p-7">
              <SocialLinks />
              <div className="mt-7 border-t border-line pt-5">
                <ContactShortcuts />
              </div>
            </div>

            {/* Facts that management has not approved stay unpublished. */}
            <div
              data-testid="contact-unpublished"
              className="rounded-[1.5rem] border border-dashed border-line bg-raised/40 p-6"
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ink-4">
                {t('notPublished')}
              </p>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-3">
                {t('notPublishedBody')}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="contact-closing" tone="light" spacing="loose">
        <MotionReveal className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[46ch]">
            <h2
              id="contact-closing"
              className="text-balance text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-[1.18] text-alt-ink"
            >
              {t('title')}
            </h2>
            <p className="mt-4 text-[0.94rem] leading-relaxed text-alt-ink-2">{t('supportLine')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton label={t('whatsappCta')} surface="contact_closing" size="lg" />
            <PhoneButton label={t('phoneCta')} surface="contact_closing" size="lg" />
          </div>
        </MotionReveal>
      </Section>
    </>
  );
}