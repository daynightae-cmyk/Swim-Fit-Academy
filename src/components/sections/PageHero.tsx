import { ContactWaterArt } from '@/components/art/Artwork';
import { WaterCaustics } from '@/components/sections/WaterCaustics';
import { MotionReveal } from '@/components/motion/MotionReveal';
import type { ReactNode } from 'react';

/**
 * Inner page hero.
 *
 * Keeps the identity and the value proposition above the fold on every page,
 * then hands over to the page content. Server-rendered, no client JS required.
 */
export function PageHero({
  marker,
  kicker,
  title,
  body,
  children,
  supportLine,
}: {
  readonly marker?: string;
  readonly kicker: string;
  readonly title: string;
  readonly body?: string;
  readonly supportLine?: string;
  readonly children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="page-heading"
      className="relative isolate overflow-hidden pb-14 pt-32 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-40"
    >
      <div className="absolute inset-0 -z-30">
        <ContactWaterArt className="h-full w-full" />
      </div>
      <div className="absolute inset-0 -z-20">
        <WaterCaustics position="top" opacity={0.2} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklab, var(--surface-sunken) 70%, transparent) 0%, color-mix(in oklab, var(--surface-page) 82%, transparent) 40%, var(--surface-page) 100%)',
        }}
      />

      <div className="mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[46rem]">
          <MotionReveal as="p" className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-accent">
            {marker ? <span className="font-latin">{marker}</span> : null}
            {marker ? <span aria-hidden="true" className="h-px w-8 bg-accent/45" /> : null}
            <span>{kicker}</span>
          </MotionReveal>

          <MotionReveal as="h1" delayMs={80} id="page-heading" className="mt-6 text-[clamp(2.1rem,6.4vw,4.1rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-ink">
            {title}
          </MotionReveal>

          {body ? (
            <MotionReveal as="p" delayMs={150} className="mt-6 max-w-[46ch] text-[1.02rem] leading-[1.75] text-ink-2">
              {body}
            </MotionReveal>
          ) : null}

          {supportLine ? (
            <p className="mt-6 text-[0.86rem] text-ink-3">{supportLine}</p>
          ) : null}

          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

export default PageHero;