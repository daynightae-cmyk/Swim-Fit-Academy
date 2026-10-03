import { getTranslations } from 'next-intl/server';

import { MotionReveal, Stagger } from '@/components/motion/MotionReveal';
import { WaterCaustics } from '@/components/sections/WaterCaustics';
import { Section } from '@/components/ui/Section';
import { Kicker } from '@/components/ui/SectionHeading';

/**
 * 03 — Brand statement.
 *
 * A deliberately quiet moment: large editorial type, one paragraph, and an
 * honest note about what the site refuses to publish.
 */
export async function BrandStatement() {
  const t = await getTranslations('brand');

  return (
    <Section labelledBy="brand-heading" spacing="loose" className="relative overflow-hidden">
      <WaterCaustics position="center" opacity={0.16} scale={1.1} />
      
      {/* Giant Ghost Campaign Typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 top-1/2 -translate-y-1/2 select-none font-latin text-[clamp(5rem,16vw,14rem)] font-black uppercase tracking-tight text-accent/5 hidden sm:block"
      >
        CONFIDENCE
      </div>

      <Stagger className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
        <MotionReveal className="lg:col-span-7">
          <Kicker>{t('kicker')}</Kicker>
          <h2
            id="brand-heading"
            className="mt-6 text-balance text-[clamp(2.1rem,4.8vw,3.6rem)] font-bold leading-[1.14] text-ink"
          >
            {t('headline')}
          </h2>
        </MotionReveal>

        <MotionReveal delayMs={120} className="flex flex-col gap-6 lg:col-span-5 justify-center">
          <p className="text-[1.06rem] leading-[1.8] text-ink-2 sm:text-[1.15rem]">{t('body')}</p>
          <p className="border-s-2 border-accent/60 ps-4 text-[0.88rem] leading-relaxed text-ink-3">
            {t('note')}
          </p>
        </MotionReveal>
      </Stagger>
    </Section>
  );
}

export default BrandStatement;