import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { WhatsAppButton } from '@/components/ui/ContactActions';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { media } from '@/content/media';
import { localizedPath, type Locale } from '@/i18n/routing';

import { WaterCaustics, BubbleField } from './WaterCaustics';

/**
 * Hero.
 *
 * Built around the real supplied photograph rather than drawn artwork: the
 * split-level half-underwater frame carries the light, the water physics and the
 * human moment, while the authored water treatment supplies the environment
 * around it. Composition is an editorial split, which is what a 640x800 source
 * deserves at 1440px — a full-bleed upscale would blur, and the image would
 * fight the headline instead of supporting it.
 *
 * Everything the visitor reads first is server-rendered HTML.
 */
export async function HeroScene({ locale }: { readonly locale: Locale }) {
  const t = await getTranslations('hero');
  const rtl = locale === 'ar';
  const chips = [t('chips.city'), t('chips.levels'), t('chips.bilingual'), t('chips.whatsapp')];
  const hero = media.heroPrimary;

  return (
    <section
      aria-labelledby="hero-heading"
      data-dir={rtl ? 'rtl' : 'ltr'}
      data-hero-media={hero.id}
      className="relative isolate flex flex-col justify-end overflow-hidden bg-page pb-12 pt-28 transition-colors duration-500 sm:min-h-[88svh] sm:pb-16 lg:min-h-[94svh]"
    >
      {/* Authored environment behind the photograph */}
      <div aria-hidden="true" className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_8%,rgba(21,184,214,0.28),transparent_58%),linear-gradient(to_bottom,var(--color-ocean-900),var(--color-ocean-950))]" />
      </div>
      <div className="absolute inset-0 -z-20">
        <WaterCaustics position="top" opacity={0.3} />
      </div>

      {/* The real photograph, mirrored with the writing direction so the copy
          and the subject stay on opposite sides in both AR and EN. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 -z-20 end-0 hidden w-[60%] overflow-hidden md:block"
        style={{
          // Blend the photograph into the page so the panel reads as one surface.
          maskImage: rtl
            ? 'linear-gradient(to right, transparent 0%, #000 22%)'
            : 'linear-gradient(to left, transparent 0%, #000 22%)',
          WebkitMaskImage: rtl
            ? 'linear-gradient(to right, transparent 0%, #000 22%)'
            : 'linear-gradient(to left, transparent 0%, #000 22%)',
          // Mirror with the writing direction so the copy and the subject stay
          // on opposite sides in both AR and EN.
          transform: rtl ? 'scaleX(-1)' : undefined,
        }}
      >
        <Image
          src={hero.src}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 0px, 58vw"
          quality={86}
          className="hero-photo object-cover"
          style={{
            objectPosition: hero.focalPoint,
            filter: hero.grade,
            animation: 'hero-drift 26s var(--ease-water) infinite alternate',
          }}
        />
      </div>

      {/* Direction-aware wash: darkens the copy side, keeps the subject legible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: rtl ? 'var(--hero-scrim)' : 'var(--hero-scrim-ltr)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-page) 94%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)', opacity: 0.5 }}
      />
      <BubbleField count={6} className="-z-10" compact />

      <div className="relative mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[54rem]">
          <MotionReveal as="p" className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent">
            <span className="font-latin">{t('eyebrow')}</span>
            <span aria-hidden="true" className="h-px w-10 bg-accent opacity-60" />
            <span>{t('city')}</span>
          </MotionReveal>

          <h1
            id="hero-heading"
            className={[
              'mt-6 text-[clamp(2.85rem,10.2vw,7.2rem)] text-ink',
              rtl ? 'font-bold leading-[1.12] tracking-normal' : 'font-semibold leading-[0.96] tracking-[-0.03em]',
            ].join(' ')}
          >
            <MotionReveal as="span" className="block">{t('line1')}</MotionReveal>
            <MotionReveal as="span" className="block text-accent" delayMs={90}>{t('line2')}</MotionReveal>
            <MotionReveal as="span" className="block" delayMs={180}>{t('line3')}</MotionReveal>
          </h1>

          <MotionReveal
            as="p"
            delayMs={240}
            className="mt-7 max-w-[38rem] text-[1.02rem] leading-relaxed text-ink-2 sm:text-[1.12rem]"
          >
            {t('support')}
          </MotionReveal>

          <MotionReveal as="div" delayMs={300} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <WhatsAppButton label={t('ctaPrimary')} size="lg" surface="hero" intent={t('ctaPrimary')} className="w-full sm:w-auto" />
            <Link href={localizedPath(locale, 'programs')} className="btn btn-ghost text-[0.97rem] px-6 py-3.5 sm:px-7 sm:py-4">
              {t('ctaSecondary')}
            </Link>
          </MotionReveal>

          <MotionReveal as="ul" delayMs={360} className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2" aria-label={t('chips.city')}>
            {chips.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-inset px-3 py-1.5 text-[0.74rem] font-medium text-ink backdrop-blur-sm"
              >
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                {chip}
              </li>
            ))}
          </MotionReveal>
        </div>
      </div>

      {/*
        Mobile carries the photograph as a bounded editorial panel above the copy
        rather than as a full-bleed background: a 640x800 source stretched across
        a 390px viewport would crop the subject out of the frame entirely.
      */}
      <div className="relative mx-auto w-full max-w-[86rem] px-5 pt-6 md:hidden">
        <MotionReveal
          as="figure"
          delayMs={120}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] border border-line shadow-card"
        >
          <Image
            src={hero.src}
            alt={hero.altAr}
            fill
            priority
            sizes="(max-width: 768px) 100vw"
            quality={84}
            className="object-cover"
            style={{ objectPosition: hero.focalPoint, filter: hero.grade }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--color-page) 0%, transparent 45%), linear-gradient(to bottom, rgba(3,19,31,0.2) 0%, transparent 35%)',
            }}
          />
        </MotionReveal>
      </div>
    </section>
  );
}

export default HeroScene;