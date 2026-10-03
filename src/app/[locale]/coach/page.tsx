import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/sections/PageHero';
import { MethodTimeline } from '@/components/sections/MethodTimeline';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { WaterCaustics } from '@/components/sections/WaterCaustics';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppButton } from '@/components/ui/ContactActions';
import { StructuredData } from '@/components/seo/StructuredData';
import { coachProfile } from '@/content/coach';
import { isPublicStatus, publicValue } from '@/content/business';
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
  const t = await getTranslations({ locale, namespace: 'meta.coach' });
  return buildRouteMetadata({
    locale,
    slug: 'coach',
    title: t('title'),
    description: t('description'),
  });
}

export default async function CoachPage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);

  const t = await getTranslations('method');
  const c = await getTranslations('common');

  const name = publicValue(coachProfile.name);
  const bio = publicValue(coachProfile.bio);
  const portrait = publicValue(coachProfile.portrait);
  const credentialIssuer = publicValue(coachProfile.credentialIssuer);
  const credentials = isPublicStatus(coachProfile.credentials.status)
    ? publicValue(coachProfile.credentials)
    : null;

  return (
    <>
      <StructuredData locale={locale} />

      <PageHero kicker={t('kicker')} title={t('title')} body={t('body')}>
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton label={c('whatsapp')} surface="coach_hero" size="md" />
          <Link href={localizedPath(locale, 'programs')} className="btn btn-ghost">
            {(await getTranslations({ locale, namespace: 'nav' }))('programs')}
          </Link>
        </div>
      </PageHero>

      {/* Reserved coach profile: every field is config-driven and null today. */}
      <Section labelledBy="coach-profile-heading" tone="light" spacing="loose">
        <SectionHeading
          title={t('title')}
          body={t('body')}
          id="coach-profile-heading"
          tone="light"
        />

        <MotionReveal className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div
              data-testid="coach-profile-card"
              className="flex h-full flex-col gap-5 rounded-[1.5rem] border border-ocean-500/10 bg-white/70 p-6 sm:p-8"
            >
              {name ? (
                <p className="text-[1.25rem] font-semibold text-ocean-950">{name}</p>
              ) : (
                <p className="text-[1.05rem] font-semibold text-ocean-950">{t('slotTitle')}</p>
              )}

              {bio ? (
                <p className="text-[0.95rem] leading-[1.75] text-slate-700">{bio}</p>
              ) : (
                <p className="text-[0.95rem] leading-[1.75] text-slate-600">{t('slotBody')}</p>
              )}

              {credentials && credentials.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {credentials.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-ocean-500/10 bg-ice-50 px-4 py-2.5 text-[0.88rem] text-slate-700"
                    >
                      {item}
                      {credentialIssuer ? ` — ${credentialIssuer}` : null}
                    </li>
                  ))}
                </ul>
              ) : null}

              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={portrait} alt={name ?? ''} className="w-full rounded-2xl object-cover" />
              ) : null}

              <p className="mt-auto border-t border-ocean-500/10 pt-4 text-[0.76rem] leading-relaxed text-slate-500">
                {t('disclaimer')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-ocean-500/70">
              {t('timelineTitle')}
            </h3>
            <div className="mt-7 rounded-[1.5rem] border border-ocean-500/10 bg-white/60 p-6">
              <MethodTimeline />
            </div>
          </div>
        </MotionReveal>
      </Section>

      <Section labelledBy="coach-next" spacing="loose" className="overflow-hidden">
        <WaterCaustics position="center" opacity={0.12} />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[44ch]">
            <h2 id="coach-next" className="text-balance text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-[1.18] text-ice-50">
              {t('title')}
            </h2>
            <p className="mt-4 text-[0.94rem] leading-relaxed text-slate-400">{t('disclaimer')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton label={c('whatsapp')} surface="coach_next" size="md" />
            <Link href={localizedPath(locale, 'contact')} className="btn btn-ghost">
              {(await getTranslations({ locale, namespace: 'nav' }))('contact')}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}