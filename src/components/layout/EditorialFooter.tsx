'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { appRoutes, localizedPath, type Locale } from '@/i18n/routing';
import { attributionParams, track } from '@/lib/analytics';
import { business } from '@/content/business';
import { isPublicStatus, publicValue } from '@/content/business';
import { readUtmFromLocation } from '@/lib/utm';

/**
 * Editorial footer.
 *
 * A substantial closing surface rather than a thin strip: top CTA, four
 * navigation columns, social links with accessible labels, a huge ghost
 * wordmark behind the content and a low-amplitude wave on the top edge.
 */
export function EditorialFooter() {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const common = useTranslations('common');

  const year = new Date().getFullYear();
  const phoneLocal = publicValue(business.phone.local) ?? '056 969 8628';
  const whatsapp = publicValue(business.whatsapp) ?? 'https://wa.me/971569698628';
  const facebook = business.social.facebook;
  const instagram = business.social.instagram;
  const instagramVerified = isPublicStatus(instagram.url.status) ? instagram.url.value : null;
  const facebookVerified = isPublicStatus(facebook.url.status) ? facebook.url.value : null;
  const cityName = publicValue(business.city) ?? 'Abu Dhabi';

  const click = (event: 'whatsapp' | 'phone' | 'facebook' | 'instagram') => () => {
    track(
      event === 'whatsapp' ? 'whatsapp_click' : event === 'phone' ? 'phone_click' : event === 'facebook' ? 'social_facebook_click' : 'social_instagram_click',
      attributionParams(locale, 'footer', `footer_${event}`, readUtmFromLocation()),
    );
  };

  const academyLinks = appRoutes.filter((route) =>
    ['programs', 'coach', 'results'].includes(route.key),
  );
  const visitLinks = appRoutes.filter((route) => ['locations', 'faq', 'contact'].includes(route.key));

  return (
    <footer className="relative isolate overflow-hidden bg-ocean-950">
      {/* low-amplitude wave on the top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 overflow-hidden">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="footer-wave-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a2a3f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a2a3f" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="footer-wave-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78dcef" stopOpacity="0" />
              <stop offset="35%" stopColor="#78dcef" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#78dcef" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#78dcef" stopOpacity="0" />
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
            stroke="url(#footer-wave-stroke)"
            strokeWidth="1.4"
          />
        </svg>
      </div>

      {/* ghost wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[6%] select-none text-center font-latin text-[clamp(3rem,17vw,14rem)] font-extrabold leading-none tracking-[0.03em]"
        style={{ color: 'rgba(120,220,239,0.055)' }}
      >
        SWIM FIT
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, transparent 62%)',
          maskImage: 'linear-gradient(to bottom, #000 0%, transparent 62%)',
        }}
      >
        <div className="caustics caustics-drift-slow h-full w-full opacity-[0.14]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 70% at 50% 0%, rgba(21,184,214,0.14), transparent 62%), linear-gradient(to bottom, rgba(10,42,63,0.6), #03131f 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[86rem] px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pt-36">
        {/* Top CTA */}
        <div className="flex flex-col gap-7 border-b border-pool-300/12 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[30rem]">
            <h2 className="text-balance text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold leading-[1.1] text-ice-50">
              {t('ctaTitle')}
            </h2>
            <p className="mt-3 max-w-[44ch] text-[0.98rem] leading-relaxed text-slate-400">
              {t('ctaBody')}
            </p>
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
            <a
              href="tel:+971569698628"
              onClick={click('phone')}
              data-testid="footer-phone"
              className="btn btn-ghost px-6 py-3.5"
            >
              <PhoneIcon size={19} />
              <span>{t('call')}</span>
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-11 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-labelledby="footer-academy">
            <h3 id="footer-academy" className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
              {t('academyTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link
                  href={localizedPath(locale, '')}
                  className="text-[0.92rem] text-slate-400 transition-colors hover:text-ice-50"
                >
                  {nav('home')}
                </Link>
              </li>
              {academyLinks.map((route) => (
                <li key={route.key}>
                  <Link
                    href={localizedPath(locale, route.slug)}
                    className="text-[0.92rem] text-slate-400 transition-colors hover:text-ice-50"
                  >
                    {nav(route.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-visit">
            <h3 id="footer-visit" className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
              {t('visitTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
                <li className="text-[0.92rem] text-ice-100">{cityName}</li>
              {visitLinks.map((route) => (
                <li key={route.key}>
                  <Link
                    href={localizedPath(locale, route.slug)}
                    className="text-[0.92rem] text-slate-400 transition-colors hover:text-ice-50"
                  >
                    {nav(route.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
              {t('contactTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href="tel:+971569698628"
                  onClick={click('phone')}
                  dir="ltr"
                  className="font-latin text-[0.92rem] text-ice-100 transition-colors hover:text-pool-300"
                >
                  {phoneLocal}
                </a>
              </li>
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={click('whatsapp')}
                  className="inline-flex items-center gap-2 text-[0.92rem] text-slate-400 transition-colors hover:text-ice-50"
                >
                  <WhatsAppIcon size={16} />
                  <span>{t('whatsapp')}</span>
                </a>
              </li>
              {facebookVerified ? (
                <li>
                  <a
                    href={facebookVerified}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={click('facebook')}
                    aria-label={t('facebookLabel')}
                    data-testid="footer-facebook"
                    className="inline-flex items-center gap-2 text-[0.92rem] text-slate-400 transition-colors hover:text-ice-50"
                  >
                    <FacebookIcon size={16} />
                    <span>{t('facebookLabel')}</span>
                  </a>
                </li>
              ) : null}
              {instagramVerified ? (
                <li>
                  <a
                    href={instagramVerified}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={click('instagram')}
                    aria-label={t('instagramLabel')}
                    data-testid="footer-instagram"
                    className="inline-flex items-center gap-2 text-[0.92rem] text-slate-400 transition-colors hover:text-ice-50"
                  >
                    <InstagramIcon size={16} />
                    <span>{t('instagramLabel')}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h3 className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pool-300">
              {t('languageTitle')}
            </h3>
            <div className="mt-5">
              <LanguageSwitch />
            </div>
            <p className="mt-5 max-w-[30ch] text-[0.8rem] leading-relaxed text-slate-600">
              {t('provisional')}
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="divider-fade" />
        <div className="flex flex-col gap-2 pt-6 text-[0.78rem] leading-relaxed text-slate-500">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span dir="ltr" className="font-latin">
              © {year} Swim Fit Academy
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>{t('locationLine')}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>{t('rights')}</span>
          </p>
          <p className="max-w-[62ch] text-slate-600">
            {t('developerCredit')} · {t('developerCreditNote')}
          </p>
        </div>
        <p className="sr-only">{common('provisionalMarkNote')}</p>
      </div>
    </footer>
  );
}

export default EditorialFooter;