'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { BrandLogo } from '@/components/brand/BrandLogo';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { appRoutes, localizedPath, type Locale } from '@/i18n/routing';
import { attributionParams, track } from '@/lib/analytics';
import { business, isPublicStatus, publicValue } from '@/content/business';
import { media } from '@/content/media';
import { readUtmFromLocation } from '@/lib/utm';

/**
 * Editorial footer.
 *
 * A designed closing scene rather than a thin strip: the real supplied night/day
 * lockup, a supplied photograph carrying the water atmosphere, a ghost wordmark
 * that follows the theme, four navigation columns and a restrained wave on the
 * top edge.
 */
export function EditorialFooter() {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  const year = new Date().getFullYear();
  const phoneLocal = publicValue(business.phone.local) ?? '056 969 8628';
  const whatsapp = publicValue(business.whatsapp) ?? 'https://wa.me/971569698628';
  const facebook = business.social.facebook;
  const instagram = business.social.instagram;
  const facebookUrl = isPublicStatus(facebook.url.status) ? facebook.url.value : null;
  const instagramUrl = isPublicStatus(instagram.url.status) ? instagram.url.value : null;

  const click = (event: 'whatsapp' | 'phone' | 'facebook' | 'instagram') => () => {
    track(
      event === 'whatsapp'
        ? 'whatsapp_click'
        : event === 'phone'
          ? 'phone_click'
          : event === 'facebook'
            ? 'social_facebook_click'
            : 'social_instagram_click',
      attributionParams(locale, 'footer', `footer_${event}`, readUtmFromLocation()),
    );
  };

  const academyLinks = appRoutes.filter((route) => ['programs', 'coach', 'results'].includes(route.key));
  const visitLinks = appRoutes.filter((route) => ['locations', 'faq', 'contact'].includes(route.key));
  const atmosphere = media.locationsVisual;

  return (
    <footer className="relative isolate overflow-hidden bg-sunken">
      {/* Supplied photograph carrying the closing water atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 -z-30">
        <Image
          src={atmosphere.src}
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          quality={70}
          className="object-cover"
          style={{
            objectPosition: atmosphere.focalPoint,
            filter: 'saturate(0.72) contrast(1.1) brightness(0.5)',
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklab, var(--surface-sunken) 88%, transparent), color-mix(in oklab, var(--surface-page) 92%, transparent) 62%, var(--surface-page))',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: 'radial-gradient(120% 70% at 50% 0%, var(--accent-soft), transparent 62%)',
        }}
      />

      {/* Giant Campaign Ghost wordmark spanning full viewport */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[4%] select-none text-center font-latin text-[clamp(4.5rem,23vw,21rem)] font-black leading-none tracking-tight overflow-hidden"
        style={{ color: 'var(--ghost-wordmark)' }}
      >
        SWIM FIT
        {locale === 'ar' ? (
          <div
            className="mt-[-2vw] font-sans text-[clamp(1.2rem,3.8vw,3.2rem)] font-black tracking-normal opacity-70"
            style={{ color: 'var(--ghost-wordmark)' }}
          >
            سويم فيت أكاديمي · أبوظبي
          </div>
        ) : null}
      </div>

      {/* Wave on the top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 overflow-hidden">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="footer-wave-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path
            className="footer-wave"
            d="M0 30 C180 14 360 44 540 30 C720 16 900 46 1080 32 C1260 18 1350 34 1440 26 L1440 56 L0 56 Z"
            fill="url(#footer-wave-fill)"
          />
          <path
            className="footer-wave"
            d="M0 30 C180 14 360 44 540 30 C720 16 900 46 1080 32 C1260 18 1350 34 1440 26"
            fill="none"
            stroke="var(--wave-stroke)"
            strokeWidth="1.4"
          />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-[86rem] px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pt-36">
        {/* Top CTA */}
        <div className="flex flex-col gap-7 border-b border-line pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[30rem]">
            <h2 className="text-balance text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold leading-[1.1] text-ink">
              {t('ctaTitle')}
            </h2>
            <p className="mt-3 max-w-[44ch] text-[0.98rem] leading-relaxed text-ink-2">{t('ctaBody')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={click('whatsapp')}
              data-testid="footer-whatsapp"
              className="btn btn-primary px-6 py-3.5"
            >
              <WhatsAppIcon size={19} />
              <span>{t('whatsapp')}</span>
            </a>
            <a href="tel:+971569698628" onClick={click('phone')} data-testid="footer-phone" className="btn btn-ghost px-6 py-3.5">
              <PhoneIcon size={19} />
              <span>{t('call')}</span>
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-11 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-labelledby="footer-academy">
            <h3 id="footer-academy" className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('academyTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link href={localizedPath(locale, '')} className="text-[0.92rem] text-ink-2 transition-colors hover:text-ink">
                  {nav('home')}
                </Link>
              </li>
              {academyLinks.map((route) => (
                <li key={route.key}>
                  <Link href={localizedPath(locale, route.slug)} className="text-[0.92rem] text-ink-2 transition-colors hover:text-ink">
                    {nav(route.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-visit">
            <h3 id="footer-visit" className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('visitTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li className="text-[0.92rem] text-ink">{publicValue(business.city) ?? 'Abu Dhabi'}</li>
              {visitLinks.map((route) => (
                <li key={route.key}>
                  <Link href={localizedPath(locale, route.slug)} className="text-[0.92rem] text-ink-2 transition-colors hover:text-ink">
                    {nav(route.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('contactTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a href="tel:+971569698628" onClick={click('phone')} dir="ltr" className="font-latin text-[0.92rem] text-ink transition-colors hover:text-accent">
                  {phoneLocal}
                </a>
              </li>
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={click('whatsapp')}
                  className="inline-flex items-center gap-2 text-[0.92rem] text-ink-2 transition-colors hover:text-ink"
                >
                  <WhatsAppIcon size={16} />
                  <span>{t('whatsapp')}</span>
                </a>
              </li>
              {facebookUrl ? (
                <li>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={click('facebook')}
                    aria-label={t('facebookLabel')}
                    data-testid="footer-facebook"
                    className="inline-flex items-center gap-2 text-[0.92rem] text-ink-2 transition-colors hover:text-ink"
                  >
                    <FacebookIcon size={16} />
                    <span>{t('facebookLabel')}</span>
                  </a>
                </li>
              ) : null}
              {instagramUrl ? (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={click('instagram')}
                    aria-label={t('instagramLabel')}
                    data-testid="footer-instagram"
                    className="inline-flex items-center gap-2 text-[0.92rem] text-ink-2 transition-colors hover:text-ink"
                  >
                    <InstagramIcon size={16} />
                    <span>{t('instagramLabel')}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h3 className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {t('languageTitle')}
            </h3>
            <div className="mt-5">
              <LanguageSwitch />
            </div>
            <div className="mt-6">
              <BrandLogo height={46} className="h-auto w-auto opacity-90" />
            </div>
            <p className="mt-5 max-w-[30ch] text-[0.78rem] leading-relaxed text-ink-3">{t('provisional')}</p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="divider-fade" />
        <div className="flex flex-col gap-2 pt-6 text-[0.78rem] leading-relaxed text-ink-3">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span dir="ltr" className="font-latin">
              © {year} Swim Fit Academy
            </span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span>{t('locationLine')}</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span>{t('rights')}</span>
          </p>
          <p className="max-w-[62ch] text-ink-4">
            {t('developerCredit')} · {t('developerCreditNote')}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default EditorialFooter;