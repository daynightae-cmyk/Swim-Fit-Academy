import { business, publicValue } from '@/content/business';

/**
 * The complete, approved knowledge surface of the concierge.
 *
 * Anything not listed in `KNOWN_FACTS` is owner-required and must trigger a
 * WhatsApp handoff instead of a guess.
 */

export interface KnownFact {
  readonly key: string;
  readonly value: string;
}

export function knownFacts(): readonly KnownFact[] {
  const facts: KnownFact[] = [
    { key: 'name', value: publicValue(business.name) ?? 'Swim Fit Academy' },
    { key: 'city', value: publicValue(business.city) ?? 'Abu Dhabi' },
    { key: 'country', value: publicValue(business.country) ?? 'United Arab Emirates' },
    { key: 'phoneLocal', value: publicValue(business.phone.local) ?? '056 969 8628' },
    {
      key: 'phoneInternational',
      value: publicValue(business.phone.international) ?? '+971 56 969 8628',
    },
    { key: 'whatsapp', value: publicValue(business.whatsapp) ?? 'https://wa.me/971569698628' },
    { key: 'levels', value: publicValue(business.levels) ?? 'All levels' },
    {
      key: 'service',
      value: 'Swimming instruction for all levels in Abu Dhabi.',
    },
    {
      key: 'bilingual',
      value: 'The website supports Arabic and English.',
    },
  ];

  const facebook = publicValue(business.social.facebook.url);
  if (facebook) {
    facts.push({ key: 'facebook', value: facebook });
  }
  return facts;
}

/**
 * Topics the academy has not confirmed. The assistant must state that the
 * detail needs management confirmation and offer WhatsApp.
 */
export const OWNER_REQUIRED_TOPICS = [
  'prices',
  'pool locations',
  'schedule',
  'timetable',
  'opening hours',
  'coach full name',
  'credential issuer',
  'ratings',
  'reviews count',
  'student count',
  'years in business',
  'guaranteed outcomes',
  'ladies-only availability',
  'trial fee',
  'cancellation policy',
  'promotions',
  'age bands',
  'package inventory',
] as const;

export type OwnerRequiredTopic = (typeof OWNER_REQUIRED_TOPICS)[number];