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
          className="absolute inset-y-0 start-[1.375rem] w-px bg-gradient-to-b from-accent/10 via-accent/30 to-accent/5"
        />

        {methodStages.map((stage) => (
          <li key={stage.id} className="relative flex gap-5 pb-8 last:pb-0">
            <div className="relative z-10 shrink-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-sunken text-accent backdrop-blur-sm">
                <SkillIcon name={stage.icon} size={19} />
              </span>
              <span
                aria-hidden="true"
                className="absolute -inset-[3px] rounded-full border border-pool-300/10"
                style={{ opacity: 1 - stage.depthPercent / 130 }}
              />
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="font-latin text-[0.7rem] font-semibold tracking-[0.24em] text-pool-400/80">
                  {String(stage.order).padStart(2, '0')}
                </span>
                <h3 className="text-[1.12rem] font-semibold text-ink">
                  {t(`method.stages.${stage.id as MethodStageId}.title`)}
                </h3>
              </div>
              <p className="mt-2 max-w-[62ch] text-[0.93rem] leading-[1.75] text-ink-2">
                {t(`method.stages.${stage.id as MethodStageId}.body`)}
              </p>
              {/* depth indicator */}
              <div className="mt-3.5 h-[3px] w-full max-w-[22rem] overflow-hidden rounded-full bg-accent/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pool-500/50 to-pool-300"
                  style={{ width: `${stage.depthPercent}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Technique focus */}
      <div>
        <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent">
          {t('method.techniquesTitle')}
        </h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {techniqueFocuses.map((focus) => (
            <li
              key={focus.id}
              className="refract flex gap-3.5 rounded-2xl border border-line bg-inset p-4"
            >
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-sunken text-accent">
                <SkillIcon name={focus.icon} size={17} />
              </span>
              <div>
                <p className="text-[0.95rem] font-semibold text-ink">
                  {t(`method.techniques.${focus.id}.title`)}
                </p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-2">
                  {t(`method.techniques.${focus.id}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-[70ch] border-t border-line pt-5 text-[0.8rem] leading-relaxed text-ink-3">
        {t('method.disclaimer')}
      </p>
    </div>
  );
}

export default MethodTimeline;