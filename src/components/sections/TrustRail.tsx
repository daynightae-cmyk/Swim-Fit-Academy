import { getTranslations } from 'next-intl/server';

import { MotionReveal } from '@/components/motion/MotionReveal';
import { PhoneButton, WhatsAppButton } from '@/components/ui/ContactActions';
import { Divider } from '@/components/ui/Section';

export interface TrustRailProps {
  readonly tone?: 'deep' | 'light';
}

/** 02 — Quick contact / trust rail. Only supported facts are listed. */
export async function TrustRail({ tone = 'light' }: TrustRailProps) {
  const t = await getTranslations('trustRail');
  const items = [t('items.city'), t('items.levels'), t('items.bilingual'), t('items.channel')];
  const light = tone === 'light';

  return (
    <section
      aria-labelledby="trust-rail-heading"
      data-section="trust-rail"
      className={[
        'relative z-10',
        light ? 'bg-ice-50 text-ocean-950' : 'bg-ocean-950',
      ].join(' ')}
    >
      {light ? (
        <div
          aria-hidden="true"
          className="h-16 sm:h-24"
          style={{
            background: 'linear-gradient(to bottom, ' +
      'var(--transition-from) 0%, var(--transition-via) 30%, ' +
      'var(--transition-to) 100%)',
          }}
        />
      ) : null}
      <div className="mx-auto w-full max-w-[86rem] px-5 pb-12 pt-4 sm:px-8 sm:pb-16 sm:pt-6 lg:px-12 lg:pb-16 lg:pt-8">
        <MotionReveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[26rem]">
            <p
              className={[
                'text-[0.68rem] font-semibold uppercase tracking-[0.24em]',
                light ? 'text-ocean-500/70' : 'text-pool-300',
              ].join(' ')}
            >
              {t('label')}
            </p>
            <h2
              id="trust-rail-heading"
              className={[
                'mt-3 text-balance text-[1.35rem] font-semibold leading-[1.2] sm:text-[1.6rem]',
                light ? 'text-ocean-950' : 'text-ice-50',
              ].join(' ')}
            >
              {t('title')}
            </h2>
          </div>

          <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 lg:max-w-[46rem] lg:grid-cols-4">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className={[
                    'mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full',
                    light ? 'bg-pool-500' : 'bg-pool-400',
                  ].join(' ')}
                />
                <span
                  className={[
                    'text-[0.88rem] leading-snug',
                    light ? 'text-slate-700' : 'text-slate-300',
                  ].join(' ')}
                >
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
      {light ? null : <Divider />}
    </section>
  );
}

export default TrustRail;