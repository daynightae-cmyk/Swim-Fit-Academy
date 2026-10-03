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
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('label')}
            </p>
            <h2
              id="trust-rail-heading"
              className="mt-2.5 text-balance text-[1.35rem] font-semibold leading-[1.2] text-ink sm:text-[1.6rem]"
            >
              {t('title')}
            </h2>
          </div>

          <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 lg:max-w-[46rem] lg:grid-cols-4">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span className="text-[0.88rem] leading-snug text-ink-2">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2.5">
            <WhatsAppButton surface="trust_rail" size="sm" />
            <PhoneButton surface="trust_rail" size="sm" />
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

export default TrustRail;