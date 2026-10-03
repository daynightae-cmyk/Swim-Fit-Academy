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
                group === 'answered' ? 'text-accent' : 'text-ink-4',
              ].join(' ')}
            >
              <span aria-hidden="true" className={group === 'answered' ? 'h-px w-8 bg-accent/45' : 'h-px w-8 bg-ink-4/40'} />
              {t(CATEGORY_LABEL[group])}
            </h3>
            <ul className="mt-5 flex flex-col divide-y divide-line border-y border-line">
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
    <div
      data-faq-id={id}
      data-category={category}
      className={[
        'transition-colors duration-300',
        open ? 'bg-accent/5 -mx-3 px-3 rounded-2xl sm:-mx-4 sm:px-4' : '',
      ].join(' ')}
    >
      <h4>
        <button
          type="button"
          id={buttonId}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          data-testid="faq-question"
          className="flex w-full items-center justify-between gap-5 py-6 text-start text-[1.08rem] font-bold text-ink transition-colors hover:text-accent sm:text-[1.22rem]"
        >
          <span className="text-balance">{t(`faq.questions.${id}`)}</span>
          <ChevronIcon direction={open ? 'up' : 'down'} size={20} className="shrink-0 text-accent transition-transform duration-300" />
        </button>
      </h4>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="pb-6 pt-1">
        {needsConfirmation ? (
          <div className="flex flex-col gap-3.5">
            <p className="max-w-[62ch] text-[0.98rem] leading-[1.8] text-ink-2 sm:text-[1.04rem]">
              {t('faq.confirmPrefix')}
            </p>
            <p className="max-w-[62ch] text-[0.9rem] leading-relaxed text-ink-4">{t('faq.confirmBody')}</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="whatsapp_click"
              className="btn btn-ghost mt-1 self-start px-5 py-3 text-[0.86rem]"
            >
              <WhatsAppIcon size={16} />
              <span>{t('faq.confirmCta')}</span>
            </a>
          </div>
        ) : (
          <p className="max-w-[62ch] text-[0.98rem] leading-[1.8] text-ink-2 sm:text-[1.04rem]">{t(`faq.answers.${id}`)}</p>
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
      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {confirmed.map((entry) => (
          <li key={entry.id} className="flex items-start gap-3 py-4">
            <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <p className="text-[0.98rem] text-ink-2">{t(`faq.questions.${entry.id}`)}</p>
          </li>
        ))}
      </ul>
      <p className="text-[0.86rem] leading-relaxed text-ink-4">{t('faq.schemaNote')}</p>
    </div>
  );
}