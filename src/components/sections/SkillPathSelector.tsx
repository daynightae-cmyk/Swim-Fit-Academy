'use client';

import { useCallback, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  emphasisForSelection,
  skillPathSelections,
  type ProgramId,
  type SkillPathSelection,
} from '@/content/programs';
import { buildProgramMessage, type MessageLocale } from '@/lib/messages';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { AIConciergeTrigger } from '@/components/ai/AIConciergeTrigger';

/**
 * Skill-path selector.
 *
 * Changes emphasis only. It never implies a commercial package inventory, and
 * it always ends with a WhatsApp conversation rather than a checkout.
 */
export function SkillPathSelector() {
  const t = useTranslations();
  const locale = useLocale() as MessageLocale;
  const [selection, setSelection] = useState<SkillPathSelection>('unsure');
  const emphasis = emphasisForSelection(selection);

  const onSelect = useCallback((value: SkillPathSelection) => {
    setSelection(value);
  }, []);

  return (
    <div data-testid="skill-path-selector" className="flex flex-col gap-6">
      <fieldset className="border-0 p-0">
        <legend className="sr-only">{t('programsSection.title')}</legend>
        <div className="flex flex-wrap gap-2.5">
          {skillPathSelections.map((option) => {
            const active = option === selection;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                aria-pressed={active}
                data-skill-option={option}
                className={[
                  'rounded-full border px-4 py-2.5 text-[0.85rem] font-medium transition-colors',
                  active
                    ? 'border-pool-400 bg-pool-400 text-ocean-950'
                    : 'border-pool-300/20 bg-ocean-900/50 text-ice-100 hover:border-pool-300/45 hover:bg-pool-400/10',
                ].join(' ')}
              >
                {t(`skillPathOption.${option}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div
        aria-live="polite"
        data-emphasis={emphasis}
        className="flex flex-col gap-4 rounded-[1.375rem] border border-pool-300/14 bg-ocean-900/45 p-6 sm:p-7"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span aria-hidden="true" className="font-latin text-[0.72rem] font-semibold tracking-[0.24em] text-pool-400">
            {`0${[1, 2, 3, 4].find((n) => emphasis === (['start', 'technique', 'confidence', 'performance'] as const)[n - 1]) ?? 3}`}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-pool-400/40" />
          <p className="text-[1.05rem] font-semibold text-ice-50">{t(`program.${emphasis}.title`)}</p>
        </div>
        <p className="max-w-[58ch] text-[0.95rem] leading-[1.75] text-slate-300">
          {t(`program.${emphasis}.goal`)}
        </p>
        <p className="max-w-[58ch] text-[0.88rem] leading-relaxed text-slate-500">
          {t(`skillPathNote.${selection}`)}
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <a
            href={buildWhatsAppUrl(buildProgramMessage(emphasis, locale))}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="program_cta_click"
            className="btn btn-primary px-5 py-3 text-[0.86rem]"
          >
            <WhatsAppIcon size={16} />
            <span>{t('programsSection.cta')}</span>
          </a>
          <AIConciergeTrigger
            label={t('programsSection.aiCta')}
            testId="skill-path-ai-cta"
            className="whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
}

export default SkillPathSelector;

export type { ProgramId };