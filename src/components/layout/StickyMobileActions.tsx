'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

import { PhoneIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { attributionParams, track } from '@/lib/analytics';
import { readUtmFromLocation } from '@/lib/utm';

/**
 * Sticky mobile conversion bar.
 *
 * WhatsApp primary, phone secondary. Respects device safe areas and never
 * collides with browser chrome or the AI concierge trigger.
 */
export function StickyMobileActions() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      data-testid="sticky-mobile-actions"
      className={[
        'fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-[var(--ease-water)] sm:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="border-t border-line bg-page/94 px-3 py-2.5 backdrop-blur-xl">
        <div className="grid grid-cols-[1.6fr_1fr] gap-2">
          <a
            href="https://wa.me/971569698628"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('whatsapp_click', attributionParams(locale, 'sticky', 'sticky_whatsapp', readUtmFromLocation()))
            }
            aria-label="WhatsApp 056 969 8628"
            data-testid="sticky-whatsapp"
            className="btn btn-primary w-full py-3 text-[0.88rem]"
          >
            <WhatsAppIcon size={18} />
            <span>WhatsApp</span>
          </a>
          <a
            href="tel:+971569698628"
            onClick={() => track('phone_click', attributionParams(locale, 'sticky', 'sticky_phone', readUtmFromLocation()))}
            aria-label="Call 056 969 8628"
            data-testid="sticky-phone"
            className="btn btn-ghost w-full py-3 text-[0.88rem]"
          >
            <PhoneIcon size={18} />
            <span>056 969 8628</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default StickyMobileActions;