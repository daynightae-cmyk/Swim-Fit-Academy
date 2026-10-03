import { useTranslations } from 'next-intl';

import { SparkIcon } from '@/components/ui/Icon';
import { AIConciergeTrigger } from '@/components/ai/AIConciergeTrigger';
import { WaterCaustics } from '@/components/sections/WaterCaustics';

/**
 * 14 — AI concierge invitation.
 *
 * Opens the real launcher rather than faking a chat widget, so the visitor
 * meets the same interface they will use.
 */
export function AiInviteSection() {
  const t = useTranslations('ai');
  const concierge = useTranslations('concierge');

  return (
    <section
      aria-labelledby="ai-invite-heading"
      data-section="ai-invite"
      className="relative overflow-hidden border-y border-line bg-page py-14 sm:py-16"
    >
      <WaterCaustics position="center" opacity={0.18} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-line-strong), transparent)' }}
      />

      <div className="relative mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start gap-8 rounded-[1.75rem] border border-line bg-raised/80 p-7 shadow-card backdrop-blur-md sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-sunken text-accent">
              <span
                aria-hidden="true"
                className="orb-pulse absolute inset-[-5px] rounded-2xl border border-accent/25"
              />
              <SparkIcon size={21} className="relative" />
            </span>
            <div className="max-w-[46ch]">
              <h2
                id="ai-invite-heading"
                className="text-balance text-[clamp(1.5rem,3.4vw,2.2rem)] font-semibold leading-[1.18] text-ink"
              >
                {t('inviteTitle')}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{t('inviteBody')}</p>
              <p className="mt-4 max-w-[56ch] text-[0.82rem] leading-relaxed text-ink-4">
                {concierge('disclaimer')}
              </p>
            </div>
          </div>

          <AIConciergeTrigger
            label={t('openChat')}
            variant="primary"
            size="lg"
            testId="ai-invite-cta"
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}

export default AiInviteSection;