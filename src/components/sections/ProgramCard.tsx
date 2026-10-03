'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { SkillIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { attributionParams, track } from '@/lib/analytics';
import { readUtmFromLocation } from '@/lib/utm';
import { buildProgramMessage } from '@/lib/messages';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { ProgramId, ProgramRecord, ProgramSkillCueId } from '@/content/programs';

const CUE_ICON: Record<ProgramSkillCueId, Parameters<typeof SkillIcon>[0]['name']> = {
  'water-comfort': 'entry',
  floating: 'flow',
  'breath-control': 'lungs',
  streamline: 'arrow',
  kick: 'kick',
  'stroke-coordination': 'rhythm',
  endurance: 'efficiency',
  'race-readiness': 'efficiency',
};

export interface ProgramCardProps {
  readonly program: ProgramRecord;
  readonly tone?: 'deep' | 'light';
  readonly onOpenAssistant?: (programId: ProgramId) => void;
}

/**
 * Skill-intent program card.
 *
 * Contains no price, session count, class size, age restriction, ratio or
 * guaranteed outcome — those are owner-required and deliberately absent.
 */
export function ProgramCard({ program, tone = 'deep', onOpenAssistant }: ProgramCardProps) {
  const locale = useLocale() as 'ar' | 'en';
  const t = useTranslations();
  const light = tone === 'light';

  const whatsappHref = buildWhatsAppUrl(buildProgramMessage(program.id, locale));

  const onCta = useCallback(() => {
    track('program_cta_click', {
      ...attributionParams(locale, 'programs', 'program_card', readUtmFromLocation()),
      program: program.id,
      intent: `program_${program.id}`,
    });
  }, [locale, program.id]);

  const onAssistant = useCallback(() => {
    track('ai_chat_open', {
      ...attributionParams(locale, 'programs', 'program_card_assistant', readUtmFromLocation()),
      program: program.id,
    });
    onOpenAssistant?.(program.id);
    const existing = document.getElementById('ai-launcher');
    if (existing instanceof HTMLElement) {
      existing.click();
    }
  }, [locale, program.id, onOpenAssistant]);

  const isHeroProgram = program.id === 'start';

  return (
    <article
      data-program={program.id}
      className={[
        'refract group relative flex h-full flex-col rounded-[1.5rem] border p-6 sm:p-7 backdrop-blur-md transition-all duration-400',
        isHeroProgram ? 'border-accent/40 shadow-[0_20px_50px_-24px_rgba(21,184,214,0.35)]' : 'border-line',
        light
          ? 'bg-raised/90 text-alt-ink hover:border-line-strong'
          : 'bg-inset/85 text-ink hover:border-line-strong',
      ].join(' ')}
      style={{ ['--card-depth' as string]: `${program.depthPercent}%` }}
    >
      {/* waterline hover */}
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-water)] group-hover:scale-x-100 group-focus-within:scale-x-100',
          light ? 'bg-ocean-500/70' : 'bg-gradient-to-r from-transparent via-accent to-transparent',
        ].join(' ')}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              'inline-flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-105',
              isHeroProgram ? 'border-accent/40 bg-sunken text-accent' : light ? 'border-line bg-sunken text-ocean-700' : 'border-line bg-sunken text-accent',
            ].join(' ')}
          >
            <SkillIcon name={program.icon} size={22} />
          </span>
          <span
            aria-hidden="true"
            className="font-latin text-[0.84rem] font-black tracking-[0.24em] text-accent"
          >
            {program.marker}
          </span>
        </div>
        <span
          className="font-latin text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-ink-4"
        >
          {t('programsSection.progressLabel')}
        </span>
      </div>

      <h3
        className={[
          'mt-6 text-balance text-[1.48rem] font-bold leading-[1.18] transition-colors group-hover:text-accent',
          light ? 'text-alt-ink' : 'text-ink',
        ].join(' ')}
      >
        {t(`program.${program.id}.title`)}
      </h3>

      <p
        className={[
          'mt-3 text-[0.98rem] leading-[1.75]',
          light ? 'text-alt-ink-2' : 'text-ink-2',
        ].join(' ')}
      >
        {t(`program.${program.id}.goal`)}
      </p>

      <p
        className={[
          'mt-3 text-[0.88rem] leading-relaxed',
          light ? 'text-alt-ink-2' : 'text-ink-3',
        ].join(' ')}
      >
        {t(`program.${program.id}.suitability`)}
      </p>

      {/* skill cues — generic intent, never a score */}
      <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('programsSection.progressLabel')}>
        {program.skillCues.map((cue) => (
          <li
            key={cue}
            className={[
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[0.74rem] font-medium',
              light
                ? 'border-line bg-sunken text-alt-ink-2'
                : 'border-line bg-sunken text-ink',
            ].join(' ')}
          >
            <SkillIcon name={CUE_ICON[cue]} size={13} />
            {t(`skillCue.${cue}`)}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCta}
            data-analytics="program_cta_click"
            data-program-cta={program.id}
            className={[
              'btn px-4 py-2.5 text-[0.82rem]',
              light ? 'btn-primary' : 'btn-primary',
            ].join(' ')}
          >
            <WhatsAppIcon size={16} />
            <span>{t('programsSection.cta')}</span>
          </a>
          <button
            type="button"
            onClick={onAssistant}
            data-program-assistant={program.id}
            className={[
              'btn px-4 py-2.5 text-[0.82rem]',
              light ? 'btn-quiet' : 'btn-ghost',
            ].join(' ')}
          >
            {t('programsSection.aiCta')}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProgramCard;
