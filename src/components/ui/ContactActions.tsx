'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { attributionParams, track } from '@/lib/analytics';
import {
  buildGeneralMessage,
  buildProgramMessage,
  buildTrialMessage,
  type MessageLocale,
  type ProgramContext,
  type TrialRequestInput,
} from '@/lib/messages';
import { readUtmFromLocation } from '@/lib/utm';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import { PhoneIcon, WhatsAppIcon } from './Icon';

type ButtonVariant = 'primary' | 'ghost' | 'quiet';
type ButtonSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-[0.83rem] px-4 py-2.5',
  md: 'text-[0.9rem] px-5 py-3',
  lg: 'text-[0.97rem] px-6 py-3.5 sm:text-base sm:px-7 sm:py-4',
};

export interface WhatsAppButtonProps {
  readonly label?: string;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  /** Program that initiated the interaction, if any. */
  readonly program?: ProgramContext;
  /** Free-form intent label. Must never contain personal data. */
  readonly intent?: string;
  /** Where the click happened, for analytics. */
  readonly surface: string;
  readonly className?: string;
  readonly ariaLabel?: string;
  /** Extra conversion signal, e.g. which poster the click came from. */
  readonly onActivate?: () => void;
}

/**
 * WhatsApp-first conversion action.
 *
 * The destination number always comes from verified config, never from props,
 * so no component can redirect a visitor to an unverified number.
 */
export function WhatsAppButton({
  label,
  variant = 'primary',
  size = 'md',
  program,
  intent,
  surface,
  className,
  ariaLabel,
  onActivate,
}: WhatsAppButtonProps) {
  const locale = useLocale() as MessageLocale;
  const t = useTranslations('common');

  const href = useMemo(() => {
    const message = program
      ? buildProgramMessage(program, locale)
      : intent
        ? buildGeneralMessage(locale, intent)
        : buildGeneralMessage(locale);
    return buildWhatsAppUrl(message);
  }, [program, intent, locale]);

  const onClick = useCallback(() => {
    track('whatsapp_click', {
      ...attributionParams(locale, surface, 'whatsapp_button', readUtmFromLocation()),
      program: program ?? 'none',
      intent: program ?? intent ?? 'general',
    });
    onActivate?.();
  }, [locale, surface, program, intent, onActivate]);

  return (
    <a
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ?? label ?? t('whatsapp')}
      data-analytics="whatsapp_click"
      className={['btn', `btn-${variant}`, SIZE_CLASSES[size], className ?? ''].join(' ')}
    >
      <WhatsAppIcon size={size === 'lg' ? 21 : 18} />
      <span>{label ?? t('whatsapp')}</span>
    </a>
  );
}

export interface PhoneButtonProps {
  readonly label?: string;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly surface: string;
  readonly className?: string;
  readonly ariaLabel?: string;
}

/** Direct call action. The tel target comes from verified config. */
export function PhoneButton({
  label,
  variant = 'ghost',
  size = 'md',
  surface,
  className,
  ariaLabel,
}: PhoneButtonProps) {
  const locale = useLocale() as MessageLocale;
  const t = useTranslations('common');

  const onClick = useCallback(() => {
    track('phone_click', attributionParams(locale, surface, 'phone_button', readUtmFromLocation()));
  }, [locale, surface]);

  return (
    <a
      href="tel:+971569698628"
      onClick={onClick}
      aria-label={ariaLabel ?? label ?? t('phone')}
      data-analytics="phone_click"
      className={['btn', `btn-${variant}`, SIZE_CLASSES[size], className ?? ''].join(' ')}
    >
      <PhoneIcon size={size === 'lg' ? 21 : 18} />
      <span>{label ?? t('phone')}</span>
    </a>
  );
}

export interface TrialHandoffProps {
  readonly input: TrialRequestInput;
  readonly surface: string;
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly label?: string;
}

/**
 * Renders an anchor that opens WhatsApp with a fully prepared trial-request
 * message. Used by the form's success state and its failure fallback.
 */
export function TrialHandoff({
  input,
  surface,
  className,
  children,
  variant = 'primary',
  size = 'md',
  label,
}: TrialHandoffProps) {
  const locale = useLocale() as MessageLocale;

  const href = useMemo(() => {
    const utm = readUtmFromLocation();
    return buildWhatsAppUrl(buildTrialMessage(input, locale, utm));
  }, [input, locale]);

  const onClick = useCallback(() => {
    track('trial_form_submit', {
      ...attributionParams(locale, surface, 'trial_handoff', readUtmFromLocation()),
      formState: 'submitted',
      program: input.program ?? 'none',
    });
  }, [locale, surface, input.program]);

  return (
    <a
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics="trial_form_submit"
      className={['btn', `btn-${variant}`, SIZE_CLASSES[size], className ?? ''].join(' ')}
    >
      <WhatsAppIcon size={size === 'lg' ? 21 : 18} />
      <span>{label ?? children ?? 'WhatsApp'}</span>
    </a>
  );
}