import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { HeroArt } from '@/components/art/Artwork';
import { WhatsAppButton } from '@/components/ui/ContactActions';
import { MotionReveal } from '@/components/motion/MotionReveal';
import type { Locale } from '@/i18n/routing';
import { localizedPath } from '@/i18n/routing';

import { WaterCaustics, BubbleField } from './WaterCaustics';

/**
 * Hero signature scene.
 *
 * The headline, supporting line and both CTAs are server-rendered HTML and are
 * visible before any effect loads. The atmospheric layers are CSS/SVG only:
 * no canvas loop, no video, no dependency on JavaScript to be readable.
 */
export async function HeroScene({ locale }: { readonly locale: Locale }) {
  const t = await getTranslations('hero');
  const rtl = locale === 'ar';
  const chips = [t('chips.city'), t('chips.levels'), t('chips.bilingual'), t('chips.whatsapp')];

  return (
    <section
      aria-labelledby="hero-heading"
      data-dir={rtl ? 'rtl' : 'ltr'}
      className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden pb-12 pt-28 sm:min-h-[90svh] sm:pb-16 lg:min-h-[92svh]"
    >
      {/* Scene layers */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
      >
        <HeroArt className="h-full w-full" />
      </div>
      <div className="absolute inset-0 -z-20">
        <WaterCaustics position="top" opacity={0.34} />
      </div>
      {/* Direction-aware wash: deepens the copy side, keeps the subject readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background: rtl
            ? 'linear-gradient(260deg, rgba(3,19,31,0.86) 0%, rgba(3,19,31,0.5) 32%, rgba(3,19,31,0.06) 62%, rgba(3,19,31,0.3) 100%), linear-gradient(to top, rgba(3,19,31,0.96) 0%, rgba(3,19,31,0.1) 40%, rgba(3,19,31,0.34) 100%)'
            : 'linear-gradient(100deg, rgba(3,19,31,0.86) 0%, rgba(3,19,31,0.5) 32%, rgba(3,19,31,0.06) 62%, rgba(3,19,31,0.3) 100%), linear-gradient(to top, rgba(3,19,31,0.96) 0%, rgba(3,19,31,0.1) 40%, rgba(3,19,31,0.34) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-20 h-40"
        style={{ background: 'linear-gradient(to bottom, transparent, #03131f 92%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(120,220,239,0.45), transparent)' }}
      />
      <BubbleField count={6} className="-z-10" compact />

      <div className="relative mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[54rem]">
          <MotionReveal as="p" className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-pool-300">
            <span className="font-latin">{t('eyebrow')}</span>
            <span aria-hidden="true" className="h-px w-10 bg-pool-400/55" />
            <span>{t('city')}</span>
          </MotionReveal>

          <h1
            id="hero-heading"
            className="mt-6 text-[clamp(2.9rem,10.5vw,7.2rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-ice-50 [text-shadow:0_4px_40px_rgba(3,19,31,0.6)]"
          >
            <MotionReveal as="span" className="block">{t('line1')}</MotionReveal>
            <MotionReveal as="span" className="block text-pool-300" delayMs={90}>{t('line2')}</MotionReveal>
            <MotionReveal as="span" className="block" delayMs={180}>{t('line3')}</MotionReveal>
          </h1>

          <MotionReveal
            as="p"
            delayMs={240}
            className="mt-7 max-w-[38rem] text-[1.02rem] leading-relaxed text-slate-200/95 sm:text-[1.12rem]"
          >
            {t('support')}
          </MotionReveal>

          <MotionReveal as="div" delayMs={300} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <WhatsAppButton label={t('ctaPrimary')} size="lg" surface="hero" intent={t('ctaPrimary')} className="w-full sm:w-auto" />
            <Link href={localizedPath(locale, 'programs')} className="btn btn-ghost text-[0.97rem] px-6 py-3.5 sm:px-7 sm:py-4">
              {t('ctaSecondary')}
            </Link>
          </MotionReveal>

          <MotionReveal as="ul" delayMs={360} className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2" aria-label={t('chips.city')}>
            {chips.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-pool-300/22 bg-ocean-950/35 px-3 py-1.5 text-[0.74rem] font-medium text-ice-100 backdrop-blur-sm"
              >
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-pool-400" />
                {chip}
              </li>
            ))}
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

export default HeroScene;
