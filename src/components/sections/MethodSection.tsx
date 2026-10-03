import { getTranslations } from 'next-intl/server';

import { CoachingSceneArt } from '@/components/art/Artwork';
import { MethodTimeline } from '@/components/sections/MethodTimeline';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { WaterCaustics } from '@/components/sections/WaterCaustics';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { coachProfile } from '@/content/coach';
import { isPublicStatus, publicValue } from '@/content/business';

/**
 * 07 — Training method.
 *
 * Methodology-first, because the coach identity has not been owner-verified.
 * The profile slot below renders only fields that clear the verification policy.
 */
export async function MethodSection() {
  const t = await getTranslations('method');
  const name = publicValue(coachProfile.name);
  const bio = publicValue(coachProfile.bio);
  const portrait = publicValue(coachProfile.portrait);
  const credentials = isPublicStatus(coachProfile.credentials.status)
    ? publicValue(coachProfile.credentials)
    : null;

  return (
    <Section labelledBy="method-heading" spacing="loose" className="overflow-hidden">
      <WaterCaustics position="top" opacity={0.12} />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            marker="02"
            kicker={t('kicker')}
            title={t('title')}
            body={t('body')}
            id="method-heading"
          />

          {/* Reserved coach profile slot — driven purely by config. */}
          <div
            data-testid="coach-profile-slot"
            className="mt-9 overflow-hidden rounded-[1.5rem] border border-pool-300/14 bg-ocean-900/40"
          >
            <div className="relative aspect-[16/10] w-full">
              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={portrait} alt={name ?? ''} className="h-full w-full object-cover" />
              ) : (
                <CoachingSceneArt className="h-full w-full" />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(3,19,31,0.95) 0%, rgba(3,19,31,0.25) 52%, rgba(3,19,31,0.08) 100%)',
                }}
              />
            </div>

            <div className="p-6">
              {name ? (
                <p className="text-[1.05rem] font-semibold text-ice-50">{name}</p>
              ) : (
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-pool-300">
                  {t('slotTitle')}
                </p>
              )}
              {bio ? (
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-slate-300">{bio}</p>
              ) : (
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-slate-400">{t('slotBody')}</p>
              )}
              {credentials && credentials.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {credentials.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-pool-300/18 bg-ocean-950/50 px-3 py-1.5 text-[0.78rem] text-ice-100"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              {/* Source marker: this slot stays empty until the owner confirms data. */}
              {/* TODO_OWNER_DATA: coach profile requires owner verification. */}
              <p className="mt-5 border-t border-pool-300/10 pt-4 text-[0.76rem] leading-relaxed text-slate-600">
                <span className="font-latin">TODO_OWNER_DATA</span>
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <MotionReveal>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
              {t('timelineTitle')}
            </h3>
            <div className="mt-7">
              <MethodTimeline />
            </div>
          </MotionReveal>
        </div>
      </div>
    </Section>
  );
}

export default MethodSection;