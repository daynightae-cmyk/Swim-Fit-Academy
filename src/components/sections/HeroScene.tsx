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
      className="relative isolate flex flex-col justify-end overflow-hidden bg-page pb-10 pt-20 transition-colors duration-500 sm:min-h-[92svh] sm:pb-16 sm:pt-28 lg:min-h-[96svh]"
    >
      {/* Background aquatic atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_82%_10%,rgba(21,184,214,0.32),transparent_62%),linear-gradient(to_bottom,var(--color-ocean-900),var(--color-ocean-950))]" />
      </div>
      <div className="absolute inset-0 -z-20">
        <WaterCaustics position="top" opacity={0.35} />
      </div>

      {/* Large desktop photographic presence */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 -z-20 end-0 hidden w-[68%] overflow-hidden md:block lg:w-[72%]"
        style={{
          maskImage: rtl
            ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, #000 32%), radial-gradient(120% 90% at 75% 50%, #000 60%, transparent 100%)'
            : 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.4) 14%, #000 32%), radial-gradient(120% 90% at 75% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: rtl
            ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, #000 32%), radial-gradient(120% 90% at 75% 50%, #000 60%, transparent 100%)'
            : 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.4) 14%, #000 32%), radial-gradient(120% 90% at 75% 50%, #000 60%, transparent 100%)',
          transform: rtl ? 'scaleX(-1)' : undefined,
        }}
      >
        <Image
          src={hero.src}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 0px, 72vw"
          quality={88}
          className="hero-photo object-cover"
          style={{
            objectPosition: hero.focalPoint,
            filter: hero.grade,
            animation: 'hero-drift 26s var(--ease-water) infinite alternate',
          }}
        />
      </div>

      {/* Direction-aware directional scrim to keep typography pristine */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: rtl ? 'var(--hero-scrim)' : 'var(--hero-scrim-ltr)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-44"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-page) 96%)' }}
      />
      <div
        aria-hidden="true"
        className="waterline absolute inset-x-0 bottom-0 -z-10"
      />
      <BubbleField count={6} className="-z-10" compact />

      {/* Main Campaign Hero Content */}
      <div className="relative mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12">
        <div className="w-full min-w-0 max-w-[56rem]">
          {/* Campaign Eyebrow */}
          <MotionReveal as="p" className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-accent">
            <span className="font-latin tracking-[0.28em]">{t('eyebrow')}</span>
            <span aria-hidden="true" className="h-px w-12 bg-gradient-to-r from-accent to-transparent opacity-75" />
            <span className="font-bold text-ink">{t('city')}</span>
          </MotionReveal>

          {/* Hero Headline — Campaign Scale */}
          <h1
            id="hero-heading"
            className={[
              'mt-5 w-full min-w-0 max-w-[calc(100vw-2.5rem)] text-ink sm:max-w-full',
              rtl
                ? 'text-[clamp(2.85rem,12.5vw,5rem)] font-black leading-[1.04] tracking-tight [text-wrap:wrap] sm:text-[clamp(3.6rem,9vw,7rem)]'
                : 'text-[clamp(3.1rem,10.5vw,8.4rem)] font-extrabold leading-[0.94] tracking-[-0.038em]',
            ].join(' ')}
          >
            <MotionReveal as="span" className="block text-ink">{t('line1')}</MotionReveal>
            <MotionReveal as="span" className="block text-accent font-black drop-shadow-sm" delayMs={90}>{t('line2')}</MotionReveal>
            <MotionReveal as="span" className="block text-ink" delayMs={180}>{t('line3')}</MotionReveal>
          </h1>

          {/* Mobile Swimmer Visual: integrated high in first viewport (390x844) */}
          <div className="relative my-5 overflow-hidden rounded-[1.25rem] border border-line shadow-card md:hidden">
            <div className="relative aspect-[16/9] w-full">
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
                className="absolute inset-0 bg-gradient-to-t from-[var(--surface-page)] via-transparent to-transparent opacity-80"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
              />
            </div>
          </div>

          <MotionReveal
            as="p"
            delayMs={220}
            className="mt-5 max-w-[42rem] text-[1.06rem] leading-[1.75] text-ink-2 sm:mt-7 sm:text-[1.2rem]"
          >
            {t('support')}
          </MotionReveal>

          <MotionReveal as="div" delayMs={280} className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
            <WhatsAppButton label={t('ctaPrimary')} size="lg" surface="hero" intent={t('ctaPrimary')} className="w-full sm:w-auto shadow-[0_12px_32px_-14px_rgba(21,184,214,0.85)]" />
            <Link href={localizedPath(locale, 'programs')} className="btn btn-ghost text-[0.98rem] px-6 py-3.5 sm:px-7 sm:py-4">
              {t('ctaSecondary')}
            </Link>
          </MotionReveal>

          <MotionReveal as="ul" delayMs={340} className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-2 sm:mt-9" aria-label={t('chips.city')}>
            {chips.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-inset/80 px-3.5 py-1.5 text-[0.74rem] font-medium text-ink backdrop-blur-md transition-colors hover:border-line-strong"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                {chip}
              </li>
            ))}
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

export default HeroScene;