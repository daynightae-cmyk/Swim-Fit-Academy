'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { PhoneButton, WhatsAppButton } from '@/components/ui/ContactActions';
import { WaterCaustics } from '@/components/sections/WaterCaustics';
import { locations, verifiedLocations } from '@/content/locations';
import type { LocationRecord } from '@/content/locations';
import { media } from '@/content/media';

/**
 * Abu Dhabi location panel.
 *
 * Until management verifies exact venues, this renders an honest city-level
 * state: the authentic pool hall photography, plus direct contact
 * actions. No invented map pin, no invented pool name.
 */
export function AbuDhabiLocationPanel({
  records = locations.records,
}: {
  readonly records?: readonly LocationRecord[];
}) {
  const t = useTranslations();
  const verified = verifiedLocations(records);
  const visual = media.locationsVisual;

  return (
    <div data-testid="abu-dhabi-location-panel" className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-line shadow-card relative">
        <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
          <Image
            src={visual.src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            quality={88}
            className="object-cover"
            style={{
              objectPosition: visual.focalPoint,
              filter: visual.grade,
            }}
          />
          <WaterCaustics position="top" opacity={0.2} />
          
          {/* Giant Campaign Location Signature Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-6 select-none px-6 text-center font-latin text-[clamp(2.4rem,6.8vw,5.5rem)] font-black uppercase tracking-[0.14em] text-accent/15 sm:top-8 sm:px-8"
          >
            ABU DHABI · أبوظبي
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--surface-page) 0%, color-mix(in oklab, var(--surface-page) 80%, transparent) 50%, transparent 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-accent">
              {t('locations.kicker')}
            </p>
            <h3 className="mt-3 text-[clamp(1.6rem,3.8vw,2.4rem)] font-bold leading-[1.12] text-ink">
              {t('locations.cardTitle')}
            </h3>
            <p className="mt-2.5 max-w-[48ch] text-[0.98rem] leading-relaxed text-ink-2 sm:text-[1.04rem]">
              {t('locations.cardBody')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[1.375rem] border border-line bg-raised/70 p-6 backdrop-blur-sm">
        <p className="max-w-[62ch] text-[0.88rem] leading-relaxed text-ink-3">{t('locations.emptyNote')}</p>
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton label={t('locations.whatsappCta')} surface="locations_panel" size="md" />
          <PhoneButton label={t('locations.phoneCta')} surface="locations_panel" size="md" />
        </div>
      </div>

      {verified.length > 0 ? (
        <section aria-labelledby="verified-venues" className="flex flex-col gap-4">
          <h4 id="verified-venues" className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent">
            {t('locations.gridTitle')}
          </h4>
          <ul className="grid gap-4 sm:grid-cols-2">
            {verified.map((record) => (
              <li key={record.id} className="rounded-2xl border border-line bg-raised/80 p-5">
                <p className="text-[1rem] font-semibold text-ink">{record.name.value}</p>
                <p className="mt-1.5 text-[0.88rem] text-ink-2">{record.address.value}</p>
                {record.schedule.value ? (
                  <p className="mt-1.5 text-[0.82rem] text-ink-3">{record.schedule.value}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-[0.82rem] text-ink-4">{t('locations.gridEmpty')}</p>
      )}
    </div>
  );
}

export default AbuDhabiLocationPanel;