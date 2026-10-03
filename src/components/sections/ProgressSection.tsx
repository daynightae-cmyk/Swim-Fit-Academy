import { getTranslations } from 'next-intl/server';

import {
  BeforeAfterSkillState,
  ProgressStory,
  SkillTimeline,
  VerifiedReviewSlot,
} from '@/components/sections/ProgressStory';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { progressStory } from '@/content/faq';

/** 09 — Progress framework. Evidence about method, never invented reviews. */
export async function ProgressSection() {
  const t = await getTranslations('results');

  return (
    <Section labelledBy="results-heading" tone="light" spacing="loose">
      <SectionHeading
        marker="03"
        kicker={t('kicker')}
        title={t('title')}
        body={t('body')}
        id="results-heading"
        tone="light"
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProgressStory story={progressStory} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-[1.5rem] border border-line bg-raised/75 p-6 shadow-card backdrop-blur-sm sm:p-8">
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('timelineTitle')}
            </h3>
            <div className="mt-6">
              <SkillTimeline markers={progressStory.skillMilestones} />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-raised/75 p-6 shadow-card backdrop-blur-sm sm:p-8">
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('methodologyTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {t.raw('methodology').map((item: string) => (
                <li key={item} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-ink-2">
                  <span aria-hidden="true" className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
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

      <div className="mt-6">
        <VerifiedReviewSlot />
      </div>
    </Section>
  );
}

export default ProgressSection;