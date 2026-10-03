import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { AbuDhabiLocationPanel } from '@/components/sections/AbuDhabiLocationPanel';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { localizedPath, type Locale } from '@/i18n/routing';

/** 11 — Abu Dhabi / location truth. City-level only until venues are verified. */
export async function LocationsSection({ locale }: { readonly locale?: Locale }) {
  const t = await getTranslations('locations');

  return (
    <Section labelledBy="locations-heading" spacing="loose" className="border-y border-line">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            marker="04"
            kicker={t('kicker')}
            title={t('title')}
            body={t('body')}
            id="locations-heading"
          />
          {locale ? (
            <MotionReveal className="mt-8">
              <Link href={localizedPath(locale, 'locations')} className="btn btn-ghost">
                {t('whatsappCta')}
              </Link>
            </MotionReveal>
          ) : null}
        </div>

        <div className="lg:col-span-7">
          <AbuDhabiLocationPanel />
        </div>
      </div>
    </Section>
  );
}

export default LocationsSection;