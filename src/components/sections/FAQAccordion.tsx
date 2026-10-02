'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';

import { ChevronIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { buildGeneralMessage, type MessageLocale } from '@/lib/messages';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { useLocale } from 'next-intl';
import { faqs, faqsByCategory, type FaqCategory, type FaqEntry } from '@/content/faq';

const CATEGORY_LABEL: Record<FaqCategory, string> = {
  answered: 'faq.answeredTitle',
  needsConfirmation: 'faq.confirmTitle',
};

export interface FAQAccordionProps {
  readonly entries?: readonly FaqEntry[];
  readonly category?: FaqCategory;
}

/**
 * FAQ accordion.
 *
 * Split by truthfulness: the "answerable now" group answers from supported
 * facts, and the "needs management confirmation" group states the limitation
 * and offers WhatsApp immediately.
 */
export function FAQAccordion({ entries, category }: FAQAccordionProps) {
  const t = useTranslations();
  const baseId = useId();
  const list = entries ?? faqs;

  return (
    <div data-testid="faq-accordion" data-category={category ?? 'all'} className="flex flex-col gap-12">
      {(['answered', 'needsConfirmation'] as const).map((group) => {
        const groupEntries = list.filter((entry) => entry.category === group);
        if (groupEntries.length === 0) return null;
        return (
          <section key={group} aria-labelledby={`${baseId}-${group}`}>
            <h3
              id={`${baseId}-${group}`}
              className={[
                'flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em]',
                group === 'answered' ? 'text-pool-300' : 'text-slate-500',
              ].join(' ')}
            >
              <span aria-hidden="true" className={group === 'answered' ? 'h-px w-8 bg-pool-400/45' : 'h-px w-8 bg-slate-500/40'} />
              {t(CATEGORY_LABEL[group])}
            </h3>
            <ul className="mt-5 flex flex-col divide-y divide-pool-300/10 border-y border-pool-300/10">
              {groupEntries.map((entry) => (
                <li key={entry.id}>
                  <FaqItem id={entry.id} category={group} baseId={baseId} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function FaqItem({ id, category, baseId }: { readonly id: string; readonly category: FaqCategory; readonly baseId: string }) {
  const t = useTranslations();
  const locale = useLocale() as MessageLocale;
  const [open, setOpen] = useState(false);
  const buttonId = `${baseId}-${id}-button`;
  const panelId = `${baseId}-${id}-panel`;
  const needsConfirmation = category === 'needsConfirmation';

  const whatsappHref = buildWhatsAppUrl(
    buildGeneralMessage(locale, needsConfirmation ? t('faq.confirmCta') : undefined),
  );

  return (
    <div data-faq-id={id} data-category={category}>
      <h4>
        <button
          type="button"
          id={buttonId}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          data-testid="faq-question"
          className="flex w-full items-center justify-between gap-5 py-5 text-start text-[1rem] font-medium text-ice-50 transition-colors hover:text-pool-200"
        >
          <span className="text-balance">{t(`faq.questions.${id}`)}</span>
          <ChevronIcon direction={open ? 'up' : 'down'} size={19} className="shrink-0 text-pool-400" />
        </button>
      </h4>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="pb-6">
        {needsConfirmation ? (
          <div className="flex flex-col gap-3">
            <p className="max-w-[62ch] text-[0.93rem] leading-[1.75] text-slate-300">
              {t('faq.confirmPrefix')}
            </p>
            <p className="max-w-[62ch] text-[0.88rem] leading-relaxed text-slate-500">{t('faq.confirmBody')}</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="whatsapp_click"
              className="btn btn-ghost mt-1 self-start px-4 py-2.5 text-[0.82rem]"
            >
              <WhatsAppIcon size={16} />
              <span>{t('faq.confirmCta')}</span>
            </a>
          </div>
        ) : (
          <p className="max-w-[62ch] text-[0.93rem] leading-[1.75] text-slate-300">{t(`faq.answers.${id}`)}</p>
        )}
      </div>
    </div>
  );
}

export default FAQAccordion;

/** FAQ teaser: the confirmed group only, with a link to the full page. */
export function FAQTeaser() {
  const t = useTranslations();
  const confirmed = faqsByCategory('answered');
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col divide-y divide-pool-300/10 border-y border-pool-300/10">
        {confirmed.map((entry) => (
          <li key={entry.id} className="flex items-start gap-3 py-4">
            <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-pool-400" />
            <p className="text-[0.98rem] text-ice-100">{t(`faq.questions.${entry.id}`)}</p>
          </li>
        ))}
      </ul>
      <p className="text-[0.86rem] leading-relaxed text-slate-500">{t('faq.schemaNote')}</p>
    </div>
  );
}