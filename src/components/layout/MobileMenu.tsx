'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { appRoutes, localizedPath, type Locale } from '@/i18n/routing';

import { LanguageSwitch } from './LanguageSwitch';

/**
 * Mobile navigation.
 *
 * Opens with a short water-curtain mask (under ~350ms) rather than a giant
 * theatrical overlay, traps Escape, and locks background scroll only while open.
 * The parent remounts this component on route change, so navigating away always
 * closes the menu without a state-resetting effect.
 */
export function MobileMenu({ locale }: { readonly locale: Locale }) {
  const t = useTranslations('common');
  const nav = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      const trigger = document.getElementById('mobile-menu-trigger');
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const list = [trigger, ...Array.from(focusables)].filter(
        (node): node is HTMLElement => node !== null,
      );
      if (list.length === 0) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
    };
  }, [open]);

  return (
    <>
      <button
        id="mobile-menu-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t('closeMenu') : t('openMenu')}
        data-testid="mobile-menu-button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-pool-300/22 text-ice-100 transition-colors hover:bg-pool-400/10 lg:hidden"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
            <path d="M3.5 7h17M3.5 12h17M3.5 17h11" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={nav('primary')}
          data-testid="mobile-menu"
          className="animate-menu-curtain fixed inset-x-0 top-[4.25rem] bottom-0 z-40 lg:hidden"
        >
          <div className="absolute inset-0 -z-10 bg-ocean-950/97 backdrop-blur-2xl" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-40"
            style={{ background: 'radial-gradient(70% 100% at 50% 0%, rgba(21,184,214,0.16), transparent 70%)' }}
          />

          <nav className="h-full overflow-y-auto px-5 pb-28 pt-5">
            <ul className="flex flex-col divide-y divide-pool-300/10">
              {appRoutes.map((route) => {
                const target = localizedPath(locale, route.slug);
                return (
                  <li key={route.key}>
                    <Link
                      href={target}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-4 py-4 text-[1.12rem] font-medium text-ice-50"
                    >
                      <span>{nav(route.key)}</span>
                      <span
                        aria-hidden="true"
                        className="h-1 w-4 rounded-full bg-pool-400/30 transition-all duration-400"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8">
              <LanguageSwitch />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

export default MobileMenu;