/**
 * Centralised, privacy-conscious analytics.
 *
 * Rules enforced here:
 * - Every event name is a closed union. Nothing is caller-defined.
 * - Payloads are shallow, allow-listed scalars only.
 * - Conversation text, names, phone numbers and form values are never allowed.
 */

import type { UtmParams } from './utm';

export const ANALYTICS_EVENTS = [
  'whatsapp_click',
  'phone_click',
  'trial_form_start',
  'trial_form_submit',
  'program_cta_click',
  'language_switch',
  'ai_chat_open',
  'ai_message_sent',
  'ai_handoff_whatsapp',
  'social_facebook_click',
  'social_instagram_click',
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/** Allow-listed payload keys. Anything else is dropped. */
export const ANALYTICS_PARAM_KEYS = [
  'surface',
  'locale',
  'route',
  'program',
  'intent',
  'mode',
  'formState',
  'hasUtm',
] as const;

export type AnalyticsParamKey = (typeof ANALYTICS_PARAM_KEYS)[number];
export type AnalyticsParams = Partial<Record<AnalyticsParamKey, string>>;

const MAX_PARAM_LENGTH = 64;

function sanitizeParams(params: AnalyticsParams | undefined): Record<string, string> {
  if (!params) return {};
  const out: Record<string, string> = {};
  for (const key of ANALYTICS_PARAM_KEYS) {
    const value = params[key];
    if (typeof value === 'string' && value.trim()) {
      out[key] = value.trim().slice(0, MAX_PARAM_LENGTH);
    }
  }
  return out;
}

/**
 * Analytics bridge. Uses Vercel Analytics when the runtime provides it and
 * degrades to a no-op everywhere else, so calls are always safe.
 */
export interface AnalyticsBridge {
  track(event: AnalyticsEvent, params?: AnalyticsParams): void;
}

let bridge: AnalyticsBridge | null = null;

export function setAnalyticsBridge(next: AnalyticsBridge | null): void {
  bridge = next;
}

export function track(event: AnalyticsEvent, params?: AnalyticsParams): void {
  const safe = sanitizeParams(params);
  try {
    bridge?.track(event, safe);
  } catch {
    // Analytics must never break a user journey.
  }
}

/** Builds the attribution payload shared by conversion events. */
export function attributionParams(
  locale: string,
  route: string,
  surface: string,
  utm: UtmParams,
): AnalyticsParams {
  return {
    surface,
    locale,
    route,
    hasUtm: Object.keys(utm).length > 0 ? 'yes' : 'no',
  };
}