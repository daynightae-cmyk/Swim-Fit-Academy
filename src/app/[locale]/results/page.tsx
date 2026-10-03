import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import {
  BeforeAfterSkillState,
  ProgressStory,
  SkillTimeline,
  VerifiedReviewSlot,
} from '@/components/sections/ProgressStory';
import { PosterBlock } from '@/components/sections/PosterBlock';
import { StructuredData } from '@/components/seo/StructuredData';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppButton } from '@/components/ui/ContactActions';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { progressStory, verifiedCompetitionResults } from '@/content/faq';
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
  const t = await getTranslations({ locale, namespace: 'meta.results' });
  return buildRouteMetadata({
    locale,
    slug: 'results',
    title: t('title'),
    description: t('description'),
  });
}

export default async function ResultsPage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  setRequestLocale(locale);

  const t = await getTranslations('results');
  const c = await getTranslations('common');

  return (
    <>
      <StructuredData locale={locale} />

      <PageHero marker="01" kicker={t('kicker')} title={t('title')} body={t('body')}>
        <WhatsAppButton label={c('whatsapp')} surface="results_hero" size="md" />
      </PageHero>

      <Section labelledBy="results-story" tone="light" spacing="loose">
        <SectionHeading
          kicker={t('storyKicker')}
          title={t('storyTitle')}
          body={t('storyBody')}
          id="results-story"
          tone="light"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProgressStory story={progressStory} />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-[1.5rem] border border-ocean-500/10 bg-white/70 p-6 sm:p-8">
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-ocean-500/70">
                {t('timelineTitle')}
              </h3>
              <div className="mt-6">
                <SkillTimeline markers={progressStory.skillMilestones} />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-ocean-500/10 bg-white/70 p-6 sm:p-8">
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-ocean-500/70">
                {t('methodologyTitle')}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {t.raw('methodology').map((item: string) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-slate-700">
                    <span aria-hidden="true" className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-pool-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <MotionReveal className="mt-6">
          <BeforeAfterSkillState
            beforeKey="results.milestones.body-position"
            afterKey="results.milestones.streamline-kicking"
          />
        </MotionReveal>
      </Section>

      <Section labelledBy="results-reviews" spacing="loose">
        <SectionHeading
          kicker={t('reviewsTitle')}
          title={t('reviewsTitle')}
          body={t('reviewsNote')}
          id="results-reviews"
        />
        <div className="mt-10">
          <VerifiedReviewSlot />
        </div>

        {/* No competition results exist. The slot stays empty until verified. */}
        {verifiedCompetitionResults.length === 0 ? (
          <p className="mt-6 text-[0.82rem] text-slate-600">{t('noData')}</p>
        ) : null}
      </Section>

      <div className="mx-auto w-full max-w-[86rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <PosterBlock id="progress" tone="tight" />
      </div>
    </>
  );
}