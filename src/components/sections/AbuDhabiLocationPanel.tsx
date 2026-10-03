'use client';

import { useTranslations } from 'next-intl';

import { CityWaterPanelArt } from '@/components/art/Artwork';
import { PhoneButton, WhatsAppButton } from '@/components/ui/ContactActions';
import { WaterCaustics } from '@/components/sections/WaterCaustics';
import { locations, verifiedLocations } from '@/content/locations';
import type { LocationRecord } from '@/content/locations';

/**
 * Abu Dhabi location panel.
 *
 * Until management verifies exact venues, this renders an honest city-level
 * state: an abstract skyline reflected in pool water, plus direct contact
 * actions. No invented map pin, no invented pool name.
 */
export function AbuDhabiLocationPanel({
  records = locations.records,
}: {
  readonly records?: readonly LocationRecord[];
}) {
  const t = useTranslations();
  const verified = verifiedLocations(records);

  return (
    <div data-testid="abu-dhabi-location-panel" className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-pool-300/14">
        <div className="relative aspect-[16/11] w-full sm:aspect-[16/8]">
          <CityWaterPanelArt className="h-full w-full" />
          <WaterCaustics position="top" opacity={0.16} />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(3,19,31,0.94) 0%, rgba(3,19,31,0.32) 46%, rgba(3,19,31,0.1) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
              {t('locations.kicker')}
            </p>
            <h3 className="mt-3 text-[clamp(1.4rem,3.4vw,2.1rem)] font-semibold leading-[1.15] text-ice-50">
              {t('locations.cardTitle')}
            </h3>
            <p className="mt-2 max-w-[46ch] text-[0.92rem] leading-relaxed text-slate-300">
              {t('locations.cardBody')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[1.375rem] border border-pool-300/12 bg-ocean-900/40 p-6">
        <p className="max-w-[62ch] text-[0.88rem] leading-relaxed text-slate-400">{t('locations.emptyNote')}</p>
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton label={t('locations.whatsappCta')} surface="locations_panel" size="md" />
          <PhoneButton label={t('locations.phoneCta')} surface="locations_panel" size="md" />
        </div>
      </div>

      {verified.length > 0 ? (
        <section aria-labelledby="verified-venues" className="flex flex-col gap-4">
          <h4 id="verified-venues" className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
            {t('locations.gridTitle')}
          </h4>
          <ul className="grid gap-4 sm:grid-cols-2">
            {verified.map((record) => (
              <li key={record.id} className="rounded-2xl border border-pool-300/12 bg-ocean-900/50 p-5">
                <p className="text-[1rem] font-semibold text-ice-50">{record.name.value}</p>
                <p className="mt-1.5 text-[0.88rem] text-slate-400">{record.address.value}</p>
                {record.schedule.value ? (
                  <p className="mt-1.5 text-[0.82rem] text-slate-500">{record.schedule.value}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-[0.82rem] text-slate-600">{t('locations.gridEmpty')}</p>
      )}
    </div>
  );
}

export default AbuDhabiLocationPanel;