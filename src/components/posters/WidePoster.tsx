'use client';

import { useCallback, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { WhatsAppButton } from '@/components/ui/ContactActions';
import { attributionParams, track } from '@/lib/analytics';
import { readUtmFromLocation } from '@/lib/utm';
import type { MessageLocale, ProgramContext } from '@/lib/messages';
import { media, type MediaAsset } from '@/content/media';
import type { PosterMediaKey, PosterVariant } from '@/content/posters';

export interface WidePosterProps {
  readonly id: string;
  readonly marker: string;
  readonly microLabelKey: string;
  readonly headlineKey: string;
  readonly sublineKey: string;
  /** Media-manifest key of the real photograph that carries this poster. */
  readonly mediaKey: PosterMediaKey;
  /**
   * Composition variant. Six distinct layouts rather than six crops of the same
   * template: the reference pack is a single portrait pool series, so geometry
   * has to do the differentiating work the photography cannot.
   */
  readonly variant: PosterVariant;
  readonly ctaKey?: string;
  readonly priority?: boolean;
  readonly program?: ProgramContext;
}

const ASPECT_CLASS = 'aspect-[4/5] sm:aspect-[16/11] lg:aspect-[21/9]';

/**
 * Wide cinematic poster.
 *
 * Real media first: every poster is led by a supplied photograph delivered
 * through next/image, with the authored water treatment behind it as
 * atmosphere. Type is always real HTML, always selectable, always in the DOM.
 */
export function WidePoster({
  id,
  marker,
  microLabelKey,
  headlineKey,
  sublineKey,
  mediaKey,
  variant,
  ctaKey,
  priority = false,
  program,
}: WidePosterProps) {
  const asset = media[mediaKey] as MediaAsset;
  const locale = useLocale() as MessageLocale;
  const t = useTranslations();
  const frameRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  const rtl = locale === 'ar';
  const copySide = rtl ? 'to left' : 'to right';

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const node = frameRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 4;
    node.style.setProperty('--poster-shift-x', `${x.toFixed(2)}px`);
    node.style.setProperty('--poster-shift-y', `${y.toFixed(2)}px`);
  }, []);

  const trackCta = useCallback(() => {
    track('program_cta_click', {
      ...attributionParams(locale, 'poster', `poster_${id}`, readUtmFromLocation()),
      program: program ?? 'none',
      intent: `poster_${id}`,
    });
  }, [locale, id, program]);

  const alt = locale === 'ar' ? asset.altAr : asset.altEn;

  // Each variant places the copy and the subject differently, and each applies
  // its own scrim geometry, so the six posters never read as one repeated block.
  // `panel` adds the localised frosted copy surface. The centred `band` variant
  // already sits on a symmetric full-width scrim, so it stays unpanelled to keep
  // that composition open; the other five need it to survive bright water.
  const layout = {
    immersive: {
      copy: 'justify-end items-start',
      width: 'max-w-[34rem]',
      panel: true,
      scrim: `linear-gradient(100deg, ${copySide}, var(--poster-scrim) 0%, color-mix(in oklab, var(--poster-scrim) 62%, transparent) 30%, transparent 58%)`,
      photo: 'inset-0',
    },
    split: {
      copy: 'justify-center items-start',
      width: 'max-w-[26rem]',
      panel: true,
      scrim: `linear-gradient(90deg, ${copySide}, var(--poster-scrim) 0%, color-mix(in oklab, var(--poster-scrim) 55%, transparent) 26%, transparent 44%), linear-gradient(${copySide}, var(--poster-scrim-soft) 0%, transparent 52%)`,
      photo: 'inset-y-0 end-0 w-[58%] sm:w-[52%]',
    },
    band: {
      copy: 'justify-center items-center text-center mx-auto',
      width: 'max-w-[40rem]',
      panel: false,
      scrim: `linear-gradient(${copySide}, var(--poster-scrim) 0%, color-mix(in oklab, var(--poster-scrim) 72%, transparent) 34%, color-mix(in oklab, var(--poster-scrim) 72%, transparent) 66%, var(--poster-scrim) 100%)`,
      photo: 'inset-0',
    },
    bleed: {
      copy: 'justify-end items-start',
      width: 'max-w-[30rem]',
      panel: true,
      scrim: `linear-gradient(74deg, ${copySide}, var(--poster-scrim) 0%, color-mix(in oklab, var(--poster-scrim) 48%, transparent) 24%, transparent 46%), linear-gradient(to top, var(--poster-scrim) 0%, transparent 44%)`,
      photo: 'inset-0',
    },
    horizon: {
      copy: 'justify-start items-start pt-10',
      width: 'max-w-[32rem]',
      panel: true,
      scrim: `linear-gradient(to bottom, var(--poster-scrim) 0%, color-mix(in oklab, var(--poster-scrim) 60%, transparent) 26%, transparent 52%), linear-gradient(${copySide}, var(--poster-scrim-soft) 0%, transparent 44%)`,
      photo: 'inset-0',
    },
    close: {
      copy: 'justify-end items-start',
      width: 'max-w-[28rem]',
      panel: true,
      scrim: `linear-gradient(115deg, ${copySide}, var(--poster-scrim) 0%, color-mix(in oklab, var(--poster-scrim) 66%, transparent) 32%, transparent 56%)`,
      photo: 'inset-0',
    },
  }[variant];

  const centred = variant === 'band';

  return (
    <section
      ref={frameRef}
      aria-labelledby={`poster-${id}-heading`}
      data-poster={id}
      data-variant={variant}
      data-media={asset.id}
      className={[
        'poster-frame group relative isolate overflow-hidden rounded-[1.4rem] border bg-sunken sm:rounded-[1.75rem] lg:rounded-[2rem]',
        'transition-[border-color,box-shadow] duration-500',
        active ? 'border-line-strong shadow-[var(--shadow-raised)]' : 'border-line',
        ASPECT_CLASS,
      ].join(' ')}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={{ '--poster-shift-x': '0px', '--poster-shift-y': '0px' } as React.CSSProperties}
    >
      {/* Authored water environment behind the photograph */}
      <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[radial-gradient(110%_80%_at_76%_10%,rgba(21,184,214,0.24),transparent_56%),linear-gradient(to_bottom,var(--color-ocean-900),var(--color-ocean-950))]" />

      {/* The real photograph */}
      <div
        className={`absolute -z-20 overflow-hidden ${layout.photo}`}
        style={
          variant === 'split'
            ? {
                maskImage: rtl
                  ? 'linear-gradient(to left, transparent 0%, #000 16%)'
                  : 'linear-gradient(to right, transparent 0%, #000 16%)',
                WebkitMaskImage: rtl
                  ? 'linear-gradient(to left, transparent 0%, #000 16%)'
                  : 'linear-gradient(to right, transparent 0%, #000 16%)',
              }
            : undefined
        }
      >
        <Image
          src={asset.src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1400px"
          quality={84}
          className="object-cover"
          style={{
            objectPosition: asset.focalPoint,
            filter: asset.grade,
            animation: 'poster-drift 24s var(--ease-water) infinite alternate',
            transition: 'filter 420ms var(--ease-water)',
          }}
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: layout.scrim }} />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      <div className={`relative flex h-full flex-col p-6 sm:p-9 lg:p-14 ${layout.copy}`}>
        <div
          data-poster-copy
          className={[
            'poster-copy-inner flex flex-col gap-4 transition-transform duration-500 ease-[var(--ease-water)]',
            layout.width,
            centred ? 'items-center text-center' : 'items-start',
            layout.panel ? 'poster-copy-panel p-6 sm:p-7' : '',
          ].join(' ')}
          style={{ transform: 'translate3d(var(--poster-shift-x), var(--poster-shift-y), 0)' }}
        >
          <p
            className={`flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-[var(--poster-eyebrow)] ${centred ? 'justify-center' : ''}`}
          >
            <span aria-hidden="true" className="font-latin">{marker}</span>
            <span aria-hidden="true" className="h-px w-8 bg-[var(--poster-eyebrow)] opacity-60" />
            <span>{t(microLabelKey)}</span>
          </p>

          <h2
            id={`poster-${id}-heading`}
            className={`text-balance text-[clamp(1.5rem,4.4vw,3.3rem)] font-semibold text-[var(--poster-copy-ink)] ${rtl ? 'leading-[1.22] tracking-normal' : 'leading-[1.14] tracking-[-0.02em]'}`}
          >
            {t(headlineKey)}
          </h2>

          <p className="max-w-[46ch] text-[0.95rem] leading-[1.75] text-[var(--poster-copy-ink-2)] sm:text-base">
            {t(sublineKey)}
          </p>

          {ctaKey ? (
            <div className="mt-2">
              <WhatsAppButton
                label={t(ctaKey)}
                size="md"
                surface="poster"
                intent={`poster_${id}`}
                onActivate={trackCta}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default WidePoster;

/** The supplied photography each poster is built on. */
export const POSTER_MEDIA = {
  brand: media.posterBrand,
  technique: media.posterTechnique,
  progress: media.posterProgress,
  levels: media.posterAllLevels,
  'abu-dhabi': media.posterAbuDhabi,
  conversion: media.posterConversion,
} as const;