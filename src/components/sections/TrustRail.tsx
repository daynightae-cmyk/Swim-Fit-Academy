import { getTranslations } from 'next-intl/server';

import { MotionReveal } from '@/components/motion/MotionReveal';
import { PhoneButton, WhatsAppButton } from '@/components/ui/ContactActions';

export interface TrustRailProps {
  readonly tone?: 'deep' | 'light';
}

/** 02 — Quick contact / trust rail. Only supported facts are listed. */
export async function TrustRail({ tone: _tone = 'deep' }: TrustRailProps) {
  const t = await getTranslations('trustRail');
  const items = [t('items.city'), t('items.levels'), t('items.bilingual'), t('items.channel')];

  return (
    <section
      aria-labelledby="trust-rail-heading"
      data-section="trust-rail"
      className="relative z-10 border-b border-line bg-page text-ink"
    >
      <div className="mx-auto w-full max-w-[86rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <MotionReveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[26rem]">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-accent">
              {t('label')}
            </p>
            <h2
              id="trust-rail-heading"
              className="mt-2.5 text-balance text-[1.45rem] font-bold leading-[1.18] text-ink sm:text-[1.75rem]"
            >
              {t('title')}
            </h2>
          </div>

          <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 lg:max-w-[46rem] lg:grid-cols-4">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
                />
                <span className="text-[0.94rem] font-medium leading-snug text-ink-2 sm:text-[0.98rem]">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <WhatsAppButton surface="trust_rail" size="md" />
            <PhoneButton surface="trust_rail" size="md" />
          </div>
        </MotionReveal>
      </div>
      <div aria-hidden="true" className="waterline absolute inset-x-0 bottom-0" />
    </section>
  );
}

export default TrustRail;