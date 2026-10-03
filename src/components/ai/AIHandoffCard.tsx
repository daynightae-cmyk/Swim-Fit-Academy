'use client';

import { useTranslations } from 'next-intl';

import { WhatsAppIcon } from '@/components/ui/Icon';

export interface AIHandoffCardProps {
  readonly whatsappUrl: string;
  readonly reason?: string;
  readonly compact?: boolean;
}

/**
 * WhatsApp handoff card.
 *
 * Appears automatically whenever a reply touches a detail that management has
 * not confirmed, so the visitor is never left hunting for a contact route.
 */
export function AIHandoffCard({ whatsappUrl, reason, compact = false }: AIHandoffCardProps) {
  const t = useTranslations('concierge');

  return (
    <div
      data-testid="ai-handoff-card"
      className={[
        'rounded-2xl border border-pool-300/22 bg-gradient-to-b from-pool-400/12 to-transparent p-4',
        compact ? 'mt-2' : 'mt-3',
      ].join(' ')}
    >
      <p className="text-[0.92rem] font-semibold text-ice-50">{t('handoff.title')}</p>
      {reason ? <p className="mt-1.5 text-[0.84rem] leading-relaxed text-slate-300">{reason}</p> : null}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="ai_handoff_whatsapp"
        className="btn btn-primary mt-3.5 w-full py-3 text-[0.88rem]"
      >
        <WhatsAppIcon size={18} />
        <span>{t('handoff.cta')}</span>
      </a>
    </div>
  );
}

export default AIHandoffCard;

export interface AIQuickActionsProps {
  readonly chips: readonly string[];
  readonly onSelect: (chip: string) => void;
  readonly disabled?: boolean;
}

/** Starter chips: programs, times, locations, how to start, trial, WhatsApp. */
export function AIQuickActions({ chips, onSelect, disabled }: AIQuickActionsProps) {
  if (chips.length === 0) return null;

  return (
    <div data-testid="ai-quick-actions" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip)}
          className="shrink-0 rounded-full border border-pool-300/22 bg-ocean-900/60 px-3.5 py-2 text-[0.8rem] font-medium text-ice-100 transition-colors hover:border-pool-300/50 hover:bg-pool-400/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}