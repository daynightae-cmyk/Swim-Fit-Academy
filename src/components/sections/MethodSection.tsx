import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { MethodTimeline } from '@/components/sections/MethodTimeline';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { WaterCaustics } from '@/components/sections/WaterCaustics';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { coachProfile } from '@/content/coach';
import { isPublicStatus, publicValue } from '@/content/business';
import { media } from '@/content/media';

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
  const coachVisual = media.coachVisual;

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
            className="mt-9 overflow-hidden rounded-[1.5rem] border border-line bg-raised/75 shadow-card backdrop-blur-sm"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={portrait} alt={name ?? ''} className="h-full w-full object-cover" />
              ) : (
                <Image
                  src={coachVisual.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  quality={82}
                  className="object-cover"
                  style={{
                    objectPosition: coachVisual.focalPoint,
                    filter: coachVisual.grade,
                  }}
                />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, var(--surface-page) 0%, color-mix(in oklab, var(--surface-page) 65%, transparent) 48%, transparent 100%)',
                }}
              />
            </div>

            <div className="p-6">
              {name ? (
                <p className="text-[1.05rem] font-semibold text-ink">{name}</p>
              ) : (
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-accent">
                  {t('slotTitle')}
                </p>
              )}
              {bio ? (
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-2">{bio}</p>
              ) : (
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-3">{t('slotBody')}</p>
              )}
              {credentials && credentials.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {credentials.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-sunken px-3 py-1.5 text-[0.78rem] text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              {/* Source marker: this slot stays empty until the owner confirms data. */}
              {/* TODO_OWNER_DATA: coach profile requires owner verification. */}
              <p className="mt-5 border-t border-line pt-4 text-[0.76rem] leading-relaxed text-ink-4">
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