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
      <div className="overflow-hidden rounded-[1.5rem] border border-line shadow-card">
        <div className="relative aspect-[16/11] w-full sm:aspect-[16/8]">
          <Image
            src={visual.src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={82}
            className="object-cover"
            style={{
              objectPosition: visual.focalPoint,
              filter: visual.grade,
            }}
          />
          <WaterCaustics position="top" opacity={0.16} />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--surface-page) 0%, color-mix(in oklab, var(--surface-page) 75%, transparent) 46%, transparent 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('locations.kicker')}
            </p>
            <h3 className="mt-3 text-[clamp(1.4rem,3.4vw,2.1rem)] font-semibold leading-[1.15] text-ink">
              {t('locations.cardTitle')}
            </h3>
            <p className="mt-2 max-w-[46ch] text-[0.92rem] leading-relaxed text-ink-2">
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