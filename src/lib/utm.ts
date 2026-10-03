/**
 * UTM attribution.
 *
 * Only the five standard campaign parameters plus `gclid` are ever read.
 * Free-text visitor input is never carried into analytics.
 */

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export interface UtmParams {
  readonly utm_source?: string;
  readonly utm_medium?: string;
  readonly utm_campaign?: string;
  readonly utm_term?: string;
  readonly utm_content?: string;
}

export type PartialUtm = { [K in UtmKey]?: string };

/** Hard cap so a hostile query string cannot bloat a WhatsApp message. */
const MAX_VALUE_LENGTH = 80;

function sanitizeValue(value: string | null | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
  if (!trimmed) return undefined;
  // Strip control characters and characters that would break the message layout.
  return trimmed.replace(/[\u0000-\u001F\u007F]/g, '');
}

/**
 * Reads standard campaign parameters from any `URLSearchParams`-shaped input.
 * Unrecognised keys are dropped, so nothing arbitrary is ever forwarded.
 */
export function parseUtm(input: URLSearchParams | Record<string, string | undefined>): UtmParams {
  const get = (key: string): string | undefined => {
    if (input instanceof URLSearchParams) {
      return input.get(key) ?? undefined;
    }
    return (input as Record<string, string | undefined>)[key];
  };

  const result: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = sanitizeValue(get(key));
    if (value) {
      result[key] = value;
    }
  }
  return result as UtmParams;
}

export function utmToSearchParams(utm: UtmParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) {
      params.set(key, value);
    }
  }
  return params;
}

export function hasUtm(utm: UtmParams): boolean {
  return UTM_KEYS.some((key) => Boolean(utm[key]));
}

/** Reads UTM plus click id from a live URL, tolerating a missing `window`. */
export function readUtmFromLocation(): UtmParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const gclid = sanitizeValue(params.get('gclid'));
  const utm = parseUtm(params);
  return gclid ? { ...utm, utm_source: utm.utm_source ?? 'gclid', utm_medium: utm.utm_medium ?? gclid } : utm;
}

/** One-line attribution summary for the outbound WhatsApp message. */
export function formatUtmLine(utm: UtmParams): string | null {
  const parts: string[] = [];
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) {
      parts.push(`${key}=${value}`);
    }
  }
  return parts.length > 0 ? parts.join(' · ') : null;
}