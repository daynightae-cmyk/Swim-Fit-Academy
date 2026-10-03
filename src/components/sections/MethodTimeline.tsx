'use client';

import { useTranslations } from 'next-intl';

import { SkillIcon } from '@/components/ui/Icon';
import { methodStages, techniqueFocuses, type MethodStageId } from '@/content/coach';

/**
 * Training method timeline.
 *
 * A depth-annotated progression. Every stage stays fully understandable without
 * motion, and the copy stays descriptive rather than prescriptive: this is
 * coaching guidance, not medical advice and not a safety guarantee.
 */
export function MethodTimeline() {
  const t = useTranslations();

  return (
    <div data-testid="method-timeline" className="flex flex-col gap-10">
      <ol className="relative flex flex-col gap-0">
        {/* depth rail */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-[1.375rem] w-px bg-gradient-to-b from-accent/30 via-accent/60 to-accent/10"
        />

        {methodStages.map((stage) => (
          <li key={stage.id} className="relative flex gap-6 pb-10 last:pb-0 group">
            {/* Giant ghost background numeral */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute end-2 top-0 select-none font-latin text-[3.8rem] sm:text-[4.5rem] font-black leading-none text-accent/8 transition-colors duration-500 group-hover:text-accent/15"
            >
              {String(stage.order).padStart(2, '0')}
            </span>

            <div className="relative z-10 shrink-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-sunken text-accent backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:scale-105">
                <SkillIcon name={stage.icon} size={20} />
              </span>
              <span
                aria-hidden="true"
                className="absolute -inset-[3px] rounded-full border border-accent/20"
                style={{ opacity: 1 - stage.depthPercent / 140 }}
              />
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="font-latin text-[0.72rem] font-bold tracking-[0.26em] text-accent">
                  {String(stage.order).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="h-px w-6 bg-accent/30" />
                <h3 className="text-[1.2rem] font-bold text-ink sm:text-[1.28rem]">
                  {t(`method.stages.${stage.id as MethodStageId}.title`)}
                </h3>
              </div>
              <p className="mt-2.5 max-w-[62ch] text-[0.98rem] leading-[1.8] text-ink-2 sm:text-[1.02rem]">
                {t(`method.stages.${stage.id as MethodStageId}.body`)}
              </p>
              {/* Refined depth indicator */}
              <div className="mt-4 h-[3px] w-full max-w-[24rem] overflow-hidden rounded-full bg-accent/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-strong via-accent to-pool-200 transition-all duration-700"
                  style={{ width: `${stage.depthPercent}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Technique focus */}
      <div className="pt-4">
        <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
          {t('method.techniquesTitle')}
        </h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techniqueFocuses.map((focus) => (
            <li
              key={focus.id}
              className="refract flex gap-4 rounded-2xl border border-line bg-inset/70 p-5 backdrop-blur-sm transition-all duration-300 hover:border-line-strong hover:bg-inset"
            >
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-sunken text-accent shadow-sm">
                <SkillIcon name={focus.icon} size={18} />
              </span>
              <div>
                <p className="text-[1rem] font-bold text-ink">
                  {t(`method.techniques.${focus.id}.title`)}
                </p>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-2">
                  {t(`method.techniques.${focus.id}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-[70ch] border-t border-line pt-6 text-[0.82rem] leading-relaxed text-ink-3">
        {t('method.disclaimer')}
      </p>
    </div>
  );
}

export default MethodTimeline;