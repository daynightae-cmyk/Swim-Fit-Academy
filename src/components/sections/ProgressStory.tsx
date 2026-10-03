'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'motion/react';

import { SkillIcon } from '@/components/ui/Icon';
import { progressStory, renderableReviews, type VerifiedReview } from '@/content/faq';

/**
 * Anonymised progress story.
 *
 * The subject is a minor, so the copy never names them and never exposes
 * identifying detail. Only the skill progression is described.
 */
export function ProgressStory({ story = progressStory }: { readonly story?: typeof progressStory }) {
  const t = useTranslations();

  return (
    <article
      data-testid="progress-story"
      className="refract relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-pool-300/14 bg-ocean-900/45 p-6 sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60"
        style={{
          background:
            'radial-gradient(80% 100% at 22% 0%, rgba(120,220,239,0.18), transparent 68%)',
        }}
      />

      <div className="relative">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
          {t('results.storyKicker')}
        </p>
        <h3 className="mt-4 text-balance text-[1.35rem] font-semibold leading-[1.28] text-ice-50">
          {t('results.storyTitle')}
        </h3>
        <p className="mt-3 text-[0.8rem] font-medium text-slate-500">{t('results.storySubject')}</p>
        <p className="mt-4 max-w-[58ch] text-[0.93rem] leading-[1.78] text-slate-300">
          {t('results.storyBody')}
        </p>
      </div>

      {/* Skill timeline */}
      <ol className="relative mt-7 flex flex-col gap-3" aria-label={t('results.timelineTitle')}>
        {story.skillMilestones.map((milestone, index) => (
          <li key={milestone.id} className="flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pool-300/20 bg-ocean-950/60 font-latin text-[0.68rem] font-semibold text-pool-300"
            >
              {milestone.marker}
            </span>
            <span className="text-[0.92rem] text-ice-100">{t(`results.milestones.${milestone.id}`)}</span>
            {index < story.skillMilestones.length - 1 ? (
              <span aria-hidden="true" className="h-px flex-1 bg-pool-300/15" />
            ) : null}
          </li>
        ))}
      </ol>
    </article>
  );
}

export default ProgressStory;

/* -------------------------------------------------------------------------- */

export interface VerifiedReviewSlotProps {
  readonly reviews?: readonly VerifiedReview[];
}

/**
 * Reviews area.
 *
 * Renders a truthful empty state today. Only entries whose consent and content
 * are VERIFIED are ever rendered, and no rating or review-count schema exists.
 */
export function VerifiedReviewSlot({ reviews = renderableReviews() }: VerifiedReviewSlotProps) {
  const t = useTranslations();

  return (
    <section
      data-testid="verified-reviews"
      aria-labelledby="reviews-heading"
      className="rounded-[1.5rem] border border-dashed border-pool-300/20 bg-ocean-900/30 p-7 sm:p-9"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-pool-300/16 bg-ocean-950/50 text-pool-300">
          <SkillIcon name="flow" size={20} />
        </span>
        <div>
          <h3 id="reviews-heading" className="text-[1.1rem] font-semibold text-ice-50">
            {t('results.reviewsTitle')}
          </h3>
          {reviews.length === 0 ? (
            <>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-300">
                {t('results.reviewsEmpty')}
              </p>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-slate-500">
                {t('results.reviewsNote')}
              </p>
            </>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/** Future-ready review card. Never seeded with invented people. */
export function ReviewCard({ review }: { readonly review: VerifiedReview }) {
  const locale = useLocale();
  return (
    <li className="rounded-2xl border border-pool-300/12 bg-ocean-900/50 p-5">
      <p className="text-[0.92rem] leading-relaxed text-ice-100">
        {review.body.value?.[locale === 'ar' ? 'ar' : 'en'] ?? ''}
      </p>
      <p className="mt-3 text-[0.78rem] text-slate-500">
        {review.reviewerDisplayName.value ?? ''}
        {review.date.value ? ` · ${review.date.value}` : ''}
      </p>
    </li>
  );
}

export interface SkillTimelineProps {
  readonly markers: readonly { readonly id: string; readonly marker: string }[];
}

/** Generic skill milestone map. No personal data, no timings, no distances. */
export function SkillTimeline({ markers }: SkillTimelineProps) {
  const t = useTranslations();
  return (
    <ol className="flex flex-col gap-4" data-testid="skill-timeline">
      {markers.map((marker, index) => (
        <motion.li
          key={marker.id}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: index * 0.06 }}
          className="flex items-center gap-4"
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pool-300/18 bg-ocean-950/50 font-latin text-[0.7rem] font-semibold text-pool-300"
          >
            {marker.marker}
          </span>
          <span className="text-[0.94rem] text-ice-100">{t(`results.milestones.${marker.id}`)}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-pool-300/20 to-transparent" />
        </motion.li>
      ))}
    </ol>
  );
}

export interface BeforeAfterSkillStateProps {
  readonly beforeKey: string;
  readonly afterKey: string;
}

/**
 * Generic before/after skill state.
 * Describes capability, never a time, a distance, a grade or a result.
 */
export function BeforeAfterSkillState({ beforeKey, afterKey }: BeforeAfterSkillStateProps) {
  const t = useTranslations();
  return (
    <div data-testid="before-after-skill" className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-pool-300/12 bg-ocean-900/40 p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {t('results.timelineTitle')}
        </p>
        <p className="mt-2.5 text-[0.92rem] leading-relaxed text-slate-300">{t(beforeKey)}</p>
      </div>
      <div className="rounded-2xl border border-pool-300/20 bg-pool-400/[0.06] p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-pool-300">
          {t('results.methodologyTitle')}
        </p>
        <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ice-100">{t(afterKey)}</p>
      </div>
    </div>
  );
}