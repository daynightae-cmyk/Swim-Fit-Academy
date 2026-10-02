'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { attributionParams, track } from '@/lib/analytics';
import { readUtmFromLocation } from '@/lib/utm';

import { AIChatPanel } from './AIChatPanel';

/**
 * Floating AI concierge launcher.
 *
 * A small aquatic orb with a subtle surface pulse. It never blocks the sticky
 * mobile WhatsApp bar: on small screens it sits above it, and the chat panel
 * opens as a bottom sheet that keeps its own safe-area padding.
 */
export function AIConciergeLauncher() {
  const t = useTranslations('ai');
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const onToggle = useCallback(() => {
    setOpen((value) => {
      const next = !value;
      if (next) {
        track('ai_chat_open', attributionParams(locale, 'ai_launcher', 'launcher', readUtmFromLocation()));
      }
      return next;
    });
  }, [locale]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t('ariaLabel')}
        data-testid="ai-launcher"
        className={[
          'group fixed bottom-[4.6rem] end-4 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-400 ease-[var(--ease-buoy)] sm:bottom-6 sm:end-6 sm:h-14 sm:w-14',
          open ? 'scale-90' : 'hover:scale-[1.04]',
        ].join(' ')}
        style={{ boxShadow: '0 20px 44px -18px rgba(21,184,214,0.55)' }}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-pool-400 to-pool-600" />
        <span
          aria-hidden="true"
          className="orb-pulse absolute inset-[-6px] rounded-full border border-pool-300/30"
        />
        <span className="relative h-full w-full">
          <OrbGlyph className="h-full w-full" />
        </span>
      </button>

      <AIChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function OrbGlyph({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="launcher-orb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4fbfd" />
          <stop offset="100%" stopColor="#b3ecf8" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#launcher-orb)" strokeLinecap="round" strokeWidth="3.4">
        <path d="M14 27 C18.5 23 23 23 27.5 27 C32 31 36.5 31 41 27" />
        <path d="M14 38 C18.5 34 23 34 27.5 38 C32 42 36.5 42 41 38" opacity="0.72" />
        <path d="M47 18 V42" strokeWidth="3" />
        <path d="M47 27.5 H44" strokeWidth="2.4" />
      </g>
      <circle cx="47" cy="18" r="2.6" fill="#f4fbfd" />
    </svg>
  );
}

export default AIConciergeLauncher;