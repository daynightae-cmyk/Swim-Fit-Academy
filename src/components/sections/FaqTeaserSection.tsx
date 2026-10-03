import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { FAQTeaser } from '@/components/sections/FAQAccordion';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { Section } from '@/components/ui/Section';
import { Kicker } from '@/components/ui/SectionHeading';
import { localizedPath, type Locale } from '@/i18n/routing';

/** 13 — FAQ teaser. Confirmed questions only, then a link to the full page. */
export async function FaqTeaserSection({ locale }: { readonly locale: Locale }) {
  const t = await getTranslations('faq');

  return (
    <Section labelledBy="faq-teaser-heading" spacing="default">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Kicker>{t('kicker')}</Kicker>
          <h2
            id="faq-teaser-heading"
            className="mt-5 text-balance text-[clamp(1.6rem,3.4vw,2.35rem)] font-semibold leading-[1.18] text-ink"
          >
            {t('title')}
          </h2>
          <p className="mt-4 max-w-[44ch] text-[0.94rem] leading-relaxed text-ink-2">{t('body')}</p>
          <MotionReveal className="mt-7">
            <Link href={localizedPath(locale, 'faq')} className="btn btn-ghost">
              {t('answeredTitle')}
            </Link>
          </MotionReveal>
        </div>

        <div className="lg:col-span-8">
          <FAQTeaser />
        </div>
      </div>
    </Section>
  );
}

export default FaqTeaserSection;