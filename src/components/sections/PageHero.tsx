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

      <div aria-hidden="true" className="waterline absolute inset-x-0 bottom-0" />

      <div className="relative mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12">
        {marker ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute end-8 top-1/2 -translate-y-1/2 select-none font-latin text-[clamp(6rem,18vw,16rem)] font-black text-accent/5 hidden md:block"
          >
            {marker}
          </div>
        ) : null}

        <div className="max-w-[48rem]">
          <MotionReveal as="p" className="flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.3em] text-accent">
            {marker ? <span className="font-latin tracking-[0.24em]">{marker}</span> : null}
            {marker ? <span aria-hidden="true" className="h-px w-10 bg-accent/50" /> : null}
            <span>{kicker}</span>
          </MotionReveal>

          <MotionReveal as="h1" delayMs={80} id="page-heading" className="mt-5 text-[clamp(2.4rem,7.4vw,4.8rem)] font-bold leading-[1.04] tracking-tight text-ink sm:mt-6">
            {title}
          </MotionReveal>

          {body ? (
            <MotionReveal as="p" delayMs={150} className="mt-5 max-w-[46ch] text-[1.08rem] leading-[1.78] text-ink-2 sm:mt-6 sm:text-[1.18rem]">
              {body}
            </MotionReveal>
          ) : null}

          {supportLine ? (
            <p className="mt-5 text-[0.9rem] leading-relaxed text-ink-3">{supportLine}</p>
          ) : null}

          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

export default PageHero;