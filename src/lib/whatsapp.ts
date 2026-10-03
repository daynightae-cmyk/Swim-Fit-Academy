import { business, publicValue } from '@/content/business';

const WHATSAPP_BASE = 'https://wa.me';

/**
 * Normalises a phone value to the digits-only form WhatsApp expects.
 * Handles the UAE local format `056 969 8628`, the international
 * `+971 56 969 8628` and already-stripped input.
 */
export function normalizePhoneDigits(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('+')) {
    return trimmed.replace(/\D/g, '');
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('00')) {
    return digits.slice(2);
  }
  if (digits.startsWith('0')) {
    return `971${digits.slice(1)}`;
  }
  if (digits.startsWith('971')) {
    return digits;
  }
  return digits;
}

/** Canonical, never-parameterised WhatsApp deep link. */
export function canonicalWhatsAppUrl(): string {
  return publicValue(business.whatsapp) ?? `${WHATSAPP_BASE}/971569698628`;
}

/**
 * Builds a WhatsApp deep link with an encoded, human-readable message.
 * The number always comes from verified config — callers cannot override it.
 */
export function buildWhatsAppUrl(message: string, phone?: string): string {
  const digits = phone ? normalizePhoneDigits(phone) : normalizePhoneDigits('+971 56 969 8628');
  const trimmed = message.trim();
  if (!trimmed) {
    return `${WHATSAPP_BASE}/${digits}`;
  }
  return `${WHATSAPP_BASE}/${digits}?text=${encodeURIComponent(trimmed)}`;
}