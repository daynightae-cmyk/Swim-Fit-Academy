'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { BrandLogo, ThemeToggle } from '@/components/brand/BrandLogo';
import { appRoutes, localizedPath, type Locale } from '@/i18n/routing';
import { track } from '@/lib/analytics';

import { LanguageSwitch } from './LanguageSwitch';
import { MobileMenu } from './MobileMenu';

/**
 * Site header.
 *
 * Carries the real supplied Swim Fit Academy lockup, which swaps between the day
 * and night assets with the active identity. Transparent over the hero, then a
 * restrained themed-glass bar after scroll.
 */
export function SiteHeader() {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const c = useTranslations('common');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // A single passive scroll listener; the state only drives the surface style.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (slug: (typeof appRoutes)[number]['slug']) =>
    pathname === localizedPath(locale, slug);

  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      data-testid="site-header"
      className={[
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled
          ? 'border-line bg-page/82 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-[4.25rem] w-full max-w-[86rem] items-center gap-3 px-5 sm:px-8 lg:h-[4.75rem] lg:px-12">
        <Link
          href={localizedPath(locale, '')}
          aria-label="Swim Fit Academy"
          className="group flex shrink-0 items-center gap-3"
        >
          <BrandLogo height={40} priority className="h-auto w-auto" />
        </Link>

        <nav aria-label={t('primary')} className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {appRoutes
              .filter((route) => route.key !== 'home')
              .map((route) => {
                const active = isActive(route.slug);
                return (
                  <li key={route.key}>
                    <Link
                      href={localizedPath(locale, route.slug)}
                      aria-current={active ? 'page' : undefined}
                      data-active={active ? 'true' : 'false'}
                      className={[
                        'nav-lane group relative inline-flex items-center rounded-full px-3.5 py-2 text-[0.85rem] font-medium transition-colors',
                        active ? 'text-ink' : 'text-ink-3 hover:text-ink',
                      ].join(' ')}
                    >
                      <span>{t(route.key)}</span>
                      <span
                        aria-hidden="true"
                        className={[
                          'pointer-events-none absolute inset-x-3.5 bottom-1.5 h-px origin-center bg-accent transition-transform duration-400 ease-[var(--ease-water)]',
                          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        ].join(' ')}
                      />
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <LanguageSwitch className="hidden sm:inline-flex" />
          <ThemeToggle />
          <a
            href="https://wa.me/971569698628"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c('whatsapp')}
            data-testid="header-whatsapp"
            onClick={() => track('whatsapp_click', { surface: 'header', locale, route: 'header' })}
            className="btn btn-primary px-3.5 py-2.5 text-[0.8rem] sm:px-4"
          >
            <WhatsAppGlyph />
            <span className="sr-only sm:not-sr-only">{c('whatsapp')}</span>
          </a>
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}

function WhatsAppGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M12.04 2.5c-5.24 0-9.5 4.24-9.5 9.46 0 1.67.44 3.3 1.27 4.73L2.5 21.5l4.94-1.28a9.53 9.53 0 0 0 4.6 1.17c5.24 0 9.5-4.24 9.5-9.46S17.28 2.5 12.04 2.5Z" />
      <path d="M8.72 7.6c-.2-.44-.4-.45-.6-.46h-.5c-.17 0-.45.06-.69.31-.24.25-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.79 2.87 4.44 3.91 2.2.87 2.65.7 3.13.65.48-.04 1.55-.63 1.77-1.24.22-.61.22-1.14.15-1.25-.06-.11-.24-.17-.49-.3-.24-.13-1.55-.77-1.79-.85-.24-.09-.42-.13-.6.13-.17.25-.66.85-.81 1.02-.15.17-.3.2-.55.07-.24-.13-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.15-.24-.02-.37.11-.5.11-.11.24-.3.36-.45.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.13-.6-1.46-.82-2Z" />
    </svg>
  );
}

export default SiteHeader;