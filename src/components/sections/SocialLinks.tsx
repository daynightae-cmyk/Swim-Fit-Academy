'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { FacebookIcon, InstagramIcon, PhoneIcon, SparkIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { attributionParams, track } from '@/lib/analytics';
import { business, isPublicStatus, publicValue } from '@/content/business';
import { readUtmFromLocation } from '@/lib/utm';
import { localizedPath } from '@/i18n/routing';

/**
 * Social links.
 *
 * Every URL is centralised in `src/content/business.ts`. Instagram stays
 * candidate-marked until the owner confirms ownership, and no placeholder `#`
 * link is ever rendered.
 */
export function SocialLinks({ tone = 'deep' }: { readonly tone?: 'deep' | 'light' }) {
  const t = useTranslations('footer');
  const locale = useLocale();
  const light = tone === 'light';

  const facebook = business.social.facebook;
  const instagram = business.social.instagram;
  const facebookUrl = isPublicStatus(facebook.url.status) ? facebook.url.value : null;
  const instagramUrl = isPublicStatus(instagram.url.status) ? instagram.url.value : null;

  const click = (platform: 'facebook' | 'instagram') => () =>
    track(
      platform === 'facebook' ? 'social_facebook_click' : 'social_instagram_click',
      attributionParams(locale, 'contact', `social_${platform}`, readUtmFromLocation()),
    );

  const baseClass = [
    'inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[0.86rem] font-medium transition-colors',
    light
      ? 'border-ocean-500/12 bg-white text-slate-700 hover:border-pool-500/40'
      : 'border-pool-300/18 bg-ocean-900/50 text-ice-100 hover:border-pool-300/45',
  ].join(' ');

  return (
    <div data-testid="social-links">
      <p
        className={[
          'text-[0.68rem] font-semibold uppercase tracking-[0.24em]',
          light ? 'text-ocean-500/70' : 'text-pool-300',
        ].join(' ')}
      >
        {t('socialLabel')}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {facebookUrl ? (
          <li>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={click('facebook')}
              aria-label={t('facebookLabel')}
              data-testid="social-facebook"
              className={baseClass}
            >
              <FacebookIcon size={17} />
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
              data-testid="social-instagram"
              className={baseClass}
            >
              <InstagramIcon size={17} />
              <span>{t('instagramLabel')}</span>
            </a>
          </li>
        ) : (
          <li>
            {/* Candidate profile: disclosed, not presented as official. */}
            <span
              aria-label={t('instagramLabel')}
              data-testid="social-instagram-candidate"
              className={[
                baseClass,
                'cursor-not-allowed border-dashed opacity-70',
                light ? 'text-slate-500' : 'text-slate-500',
              ].join(' ')}
            >
              <InstagramIcon size={17} />
              <span>{t('instagramCandidate')}</span>
            </span>
          </li>
        )}

        <li>
          <a
            href="https://wa.me/971569698628"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('whatsapp_click', attributionParams(locale, 'contact', 'social_whatsapp', readUtmFromLocation()))
            }
            aria-label={t('whatsapp')}
            data-testid="social-whatsapp"
            className={baseClass}
          >
            <WhatsAppIcon size={17} />
            <span>{t('whatsapp')}</span>
          </a>
        </li>

        <li>
          <a
            href="tel:+971569698628"
            onClick={() =>
              track('phone_click', attributionParams(locale, 'contact', 'social_phone', readUtmFromLocation()))
            }
            aria-label={t('call')}
            data-testid="social-phone"
            className={baseClass}
          >
            <PhoneIcon size={17} />
            <span>{t('call')}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SocialLinks;

/** Quick jumps at the bottom of the contact page. */
export function ContactShortcuts() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const nav = useTranslations('nav');

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => {
          const launcher = document.getElementById('ai-launcher');
          if (launcher instanceof HTMLElement) launcher.click();
        }}
        data-testid="contact-ai-shortcut"
        className="btn btn-ghost"
      >
        <SparkIcon size={17} />
        <span>{t('aiShortcut')}</span>
      </button>
      <Link href={localizedPath(locale as 'ar', 'faq')} className="btn btn-quiet">
        {t('faqShortcut')}
      </Link>
      <Link href={localizedPath(locale as 'ar', 'programs')} className="btn btn-quiet">
        {nav('programs')}
      </Link>
    </div>
  );
}

export const CONTACT_PHONE = publicValue(business.phone.local) ?? '056 969 8628';
