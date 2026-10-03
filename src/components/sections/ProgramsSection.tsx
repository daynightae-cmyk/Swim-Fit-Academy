import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { MotionReveal, Stagger } from '@/components/motion/MotionReveal';
import { ProgramCard } from '@/components/sections/ProgramCard';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppButton } from '@/components/ui/ContactActions';
import { AIConciergeTrigger } from '@/components/ai/AIConciergeTrigger';
import { orderedPrograms } from '@/content/programs';
import { localizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

export interface ProgramsSectionProps {
  readonly locale: Locale;
  readonly tone?: 'deep' | 'light';
  /** Home shows the closing CTA; the programs page adds the selector instead. */
  readonly withCloser?: boolean;
}

/** 05 — Programs. Organised by skill intent, never by invented packages. */
export async function ProgramsSection({ locale, tone = 'deep', withCloser = true }: ProgramsSectionProps) {
  const t = await getTranslations('programsSection');
  const list = orderedPrograms();

  return (
    <Section
      id="programs"
      labelledBy="programs-heading"
      tone={tone}
      spacing="loose"
      className={tone === 'light' ? 'border-y border-ocean-500/8' : 'border-y border-pool-300/8'}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          marker="01"
          kicker={t('kicker')}
          title={t('title')}
          body={t('body')}
          id="programs-heading"
          tone={tone}
        />
        <Link
          href={localizedPath(locale, 'programs')}
          className={[
            'btn shrink-0 self-start whitespace-nowrap lg:self-auto',
            tone === 'light' ? 'btn-ghost text-ocean-950' : 'btn-ghost',
          ].join(' ')}
        >
          {t('allPrograms')}
        </Link>
      </div>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((program) => (
          <ProgramCard key={program.id} program={program} tone={tone} />
        ))}
      </Stagger>

      {withCloser ? (
        <MotionReveal className="mt-12 flex flex-col gap-6 rounded-[1.5rem] border border-pool-300/14 bg-ocean-900/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-[46ch]">
            <p className="text-[1.1rem] font-semibold text-ice-50">{t('closerTitle')}</p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-400">{t('closerBody')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton label={t('whatsappCta')} surface="programs_closer" size="md" />
            <AIConciergeTrigger
              label={t('aiCta')}
              testId="programs-ai-cta"
              className="whitespace-nowrap"
            />
          </div>
        </MotionReveal>
      ) : null}
    </Section>
  );
}

export default ProgramsSection;