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
    <Section labelledBy="brand-heading" spacing="loose" className="overflow-hidden">
      <WaterCaustics position="center" opacity={0.14} scale={1.1} />
      <Stagger className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <MotionReveal className="lg:col-span-7">
          <Kicker>{t('kicker')}</Kicker>
          <h2
            id="brand-heading"
            className="mt-6 text-balance text-[clamp(1.85rem,4.4vw,3.35rem)] font-semibold leading-[1.16] tracking-[-0.02em] text-ice-50"
          >
            {t('headline')}
          </h2>
        </MotionReveal>

        <MotionReveal delayMs={120} className="flex flex-col gap-6 lg:col-span-5">
          <p className="text-[1rem] leading-[1.8] text-slate-300">{t('body')}</p>
          <p className="border-s border-pool-300/25 ps-4 text-[0.86rem] leading-relaxed text-slate-500">
            {t('note')}
          </p>
        </MotionReveal>
      </Stagger>
    </Section>
  );
}

export default BrandStatement;