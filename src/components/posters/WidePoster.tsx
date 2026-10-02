'use client';

import { useCallback, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { PosterArtwork } from '@/components/art/Artwork';
import { WhatsAppButton } from '@/components/ui/ContactActions';
import { attributionParams, track } from '@/lib/analytics';
import { readUtmFromLocation } from '@/lib/utm';
import type { MessageLocale, ProgramContext } from '@/lib/messages';
import type { PosterRecord } from '@/content/posters';

export interface WidePosterProps {
  readonly poster: PosterRecord;
  /** Above-the-fold posters skip lazy loading. */
  readonly priority?: boolean;
  readonly program?: ProgramContext;
}

const ASPECT_CLASS = 'aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]';

/**
 * Wide cinematic poster.
 *
 * Contract:
 * - headline, supporting line and micro-label are real, selectable HTML
 * - the visual is either inline vector art or owner-supplied photography
 *   delivered through next/image with intrinsic dimensions
 * - the scrim and the art mirror together with the writing direction, so Arabic
 *   keeps its negative space on the correct side
 * - the CTA is always visible; hover and focus deepen it rather than reveal it
 * - mobile uses a static image position and reduced motion
 */
export function WidePoster({ poster, priority = false, program }: WidePosterProps) {
  const locale = useLocale() as MessageLocale;
  const t = useTranslations();
  const frameRef = useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const active = hovered || focused;
  const rtl = locale === 'ar';

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    // Coarse pointers (touch) get a static composition.
    if (event.pointerType === 'touch') return;
    const node = frameRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 4;
    node.style.setProperty('--poster-shift-x', `${x.toFixed(2)}px`);
    node.style.setProperty('--poster-shift-y', `${y.toFixed(2)}px`);
  }, []);

  const trackCta = useCallback(() => {
    track('program_cta_click', {
      ...attributionParams(locale, 'poster', `poster_${poster.id}`, readUtmFromLocation()),
      program: program ?? 'none',
      intent: `poster_${poster.id}`,
    });
  }, [locale, poster.id, program]);

  const visualAlt =
    poster.visual.kind === 'photo'
      ? poster.visual.alt[locale]
      : t(poster.visual.kind === 'art' ? poster.visual.altKey : 'poster.brand.alt');

  // The scrim darkens the copy side and thins toward the subject.
  const copySide = rtl ? 'to left' : 'to right';
  const scrim = poster.tone === 'lifted'
    ? `linear-gradient(100deg, ${copySide}, rgba(3,19,31,0.9) 0%, rgba(3,19,31,0.62) 30%, rgba(3,19,31,0.16) 56%, rgba(3,19,31,0.1) 100%)`
    : `linear-gradient(100deg, ${copySide}, rgba(3,19,31,0.92) 0%, rgba(4,26,40,0.7) 32%, rgba(4,26,40,0.18) 60%, rgba(3,19,31,0.34) 100%)`;

  return (
    <section
      ref={frameRef}
      aria-labelledby={`poster-${poster.id}-heading`}
      data-poster={poster.id}
      data-dir={rtl ? 'rtl' : 'ltr'}
      className={`poster-frame group relative isolate overflow-hidden rounded-[1.4rem] border border-pool-300/14 sm:rounded-[1.75rem] lg:rounded-[2rem] ${ASPECT_CLASS}`}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ '--poster-shift-x': '0px', '--poster-shift-y': '0px' } as React.CSSProperties}
    >
      {/* Visual */}
      <div
        aria-hidden={poster.visual.kind === 'art' ? true : undefined}
        className="poster-visual absolute inset-0 -z-20 overflow-hidden"
      >
        {poster.visual.kind === 'photo' ? (
          <Image
            src={poster.visual.src}
            alt={visualAlt}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1400px"
            className="object-cover transition-transform duration-[900ms] ease-[var(--ease-water)]"
            style={{ transform: active ? 'scale(1.025)' : 'scale(1)' }}
          />
        ) : (
          <div
            className="h-full w-full transition-transform duration-[1100ms] ease-[var(--ease-water)]"
            style={{
              transform: `scale(${active ? 1.025 : 1}) scaleX(${rtl ? -1 : 1})`,
            }}
          >
            <PosterArtwork art={poster.visual.art} className="h-full w-full" />
          </div>
        )}
      </div>

      {/* Controlled scrim: never sits over the CTA */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: scrim }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(to top, rgba(3,19,31,0.88) 0%, rgba(3,19,31,0.14) 48%, rgba(3,19,31,0.4) 100%)' }}
      />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-6 sm:p-9 lg:p-14">
        <div
          className="poster-copy-inner flex max-w-[36rem] flex-col items-start gap-4 transition-transform duration-500 ease-[var(--ease-water)]"
          style={{ transform: 'translate3d(var(--poster-shift-x), var(--poster-shift-y), 0)' }}
        >
          <p className="flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-pool-300">
            <span aria-hidden="true" className="font-latin">{poster.marker}</span>
            <span aria-hidden="true" className="h-px w-8 bg-pool-400/45" />
            <span>{t(poster.microLabelKey)}</span>
          </p>

          <h2
            id={`poster-${poster.id}-heading`}
            className="text-balance text-[clamp(1.5rem,4.4vw,3.3rem)] font-semibold leading-[1.14] tracking-[-0.02em] text-ice-50 [text-shadow:0_2px_28px_rgba(3,19,31,0.65)]"
          >
            {t(poster.headlineKey)}
          </h2>

          <p className="max-w-[46ch] text-[0.95rem] leading-relaxed text-slate-200/95 sm:text-base [text-shadow:0_1px_16px_rgba(3,19,31,0.6)]">
            {t(poster.sublineKey)}
          </p>

          {poster.cta ? (
            <div className="mt-2 transition-transform duration-500 ease-[var(--ease-water)]" style={{ transform: active ? 'translateY(0)' : 'translateY(2px)' }}>
              <WhatsAppButton
                label={t(poster.cta.labelKey)}
                size="md"
                surface="poster"
                intent={`poster_${poster.id}`}
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
