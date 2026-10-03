'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { otherLocale, swapLocaleInPath, type Locale } from '@/i18n/routing';
import { track } from '@/lib/analytics';

/**
 * Language switch.
 *
 * Preserves the current route by swapping only the locale segment, so a visitor
 * reading /ar/programs moves to /en/programs rather than back to the homepage.
 */
export function LanguageSwitch({
  variant = 'full',
  className,
}: {
  readonly variant?: 'full' | 'compact';
  readonly className?: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const pathname = usePathname();
  const next = otherLocale(locale);
  const href = swapLocaleInPath(pathname ?? `/${locale}`, next);
  const label = t('switchLanguageLabel');

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        hrefLang={next}
        lang={next}
        onClick={() => track('language_switch', { locale: next, route: pathname ?? `/${locale}` })}
        aria-label={label}
        data-testid="language-switch-compact"
        className={[
          'inline-flex h-9 items-center rounded-full border border-pool-300/22 px-3 text-[0.78rem] font-semibold text-ice-100 transition-colors hover:border-pool-300/50 hover:bg-pool-400/10',
          className ?? '',
        ].join(' ')}
      >
        <span aria-hidden="true" className="font-latin">
          {next}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      hrefLang={next}
      lang={next}
      onClick={() => track('language_switch', { locale: next, route: pathname ?? `/${locale}` })}
      aria-label={label}
      data-testid="language-switch"
      className={[
        'group inline-flex items-center gap-1 rounded-full border border-pool-300/20 bg-ocean-950/30 p-1 text-[0.74rem] font-semibold backdrop-blur-sm',
        className ?? '',
      ].join(' ')}
    >
      {(['ar', 'en'] as const).map((code) => {
        const active = code === locale;
        return (
          <span
            key={code}
            aria-hidden="true"
            className={[
              'rounded-full px-2.5 py-1 transition-colors',
              active ? 'bg-pool-400/90 text-ocean-950' : 'text-slate-400',
            ].join(' ')}
          >
            <span className="font-latin">{code === 'ar' ? 'AR' : 'EN'}</span>
          </span>
        );
      })}
    </Link>
  );
}

export default LanguageSwitch;