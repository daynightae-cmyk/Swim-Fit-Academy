import { describe, expect, it } from 'vitest';

import { appRoutes, isLocale, localizedPath, otherLocale, swapLocaleInPath } from '@/i18n/routing';
import {
  faqsByCategory,
  renderableReviews,
  verifiedReviews,
  type VerifiedReview,
} from '@/content/faq';
import { locations, verifiedLocations } from '@/content/locations';
import { coachProfile } from '@/content/coach';
import { posters } from '@/content/posters';
import ar from '@/i18n/messages/ar.json';
import en from '@/i18n/messages/en.json';


function flatten(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  if (Array.isArray(value)) return [prefix, ...value.flatMap((item, i) => flatten(item, `${prefix}.${i}`))];
  return Object.entries(value).flatMap(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key));
}

describe('locale routing', () => {
  it('treats Arabic as the default locale', () => {
    expect(isLocale('ar')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it('builds localized paths for every route', () => {
    expect(localizedPath('ar')).toBe('/ar');
    expect(localizedPath('en', 'programs')).toBe('/en/programs');
    expect(appRoutes.map((route) => route.slug)).toEqual([
      '',
      'programs',
      'coach',
      'locations',
      'results',
      'faq',
      'contact',
    ]);
  });

  it('preserves the current route when swapping locale', () => {
    expect(swapLocaleInPath('/ar/programs', 'en')).toBe('/en/programs');
    expect(swapLocaleInPath('/en/contact', 'ar')).toBe('/ar/contact');
    expect(swapLocaleInPath('/ar', 'en')).toBe('/en');
    expect(swapLocaleInPath('/programs', 'ar')).toBe('/ar/programs');
  });

  it('flips between the two locales', () => {
    expect(otherLocale('ar')).toBe('en');
    expect(otherLocale('en')).toBe('ar');
  });
});

describe('content truth invariants', () => {
  it('keeps the Arabic and English catalogues structurally identical', () => {
    const arKeys = flatten(ar).sort();
    const enKeys = flatten(en).sort();
    const missingInEn = arKeys.filter((key) => !enKeys.includes(key));
    const missingInAr = enKeys.filter((key) => !arKeys.includes(key));
    expect({ missingInEn, missingInAr }).toEqual({ missingInEn: [], missingInAr: [] });
  });

  it('publishes no unverified venue records', () => {
    expect(locations.records).toHaveLength(0);
    expect(verifiedLocations()).toHaveLength(0);
    expect(locations.city).toBe('Abu Dhabi');
  });

  it('never exposes an unverified coach field', () => {
    expect(coachProfile.verificationStatus).toBe('PENDING_OWNER');
    expect(coachProfile.name.value).toBeNull();
    expect(coachProfile.credentials.value).toBeNull();
    expect(coachProfile.credentialIssuer.value).toBeNull();
    expect(coachProfile.portrait.value).toBeNull();
  });

  it('keeps reviews empty and refuses to render unverified entries', () => {
    expect(verifiedReviews).toHaveLength(0);
    expect(renderableReviews()).toHaveLength(0);

    const verified: VerifiedReview = {
      id: 'r1',
      source: { value: 'Google', status: 'VERIFIED' },
      rating: { value: 5, status: 'VERIFIED' },
      date: { value: '2026-01-01', status: 'VERIFIED' },
      reviewerDisplayName: { value: 'A. Parent', status: 'VERIFIED' },
      consent: { value: true, status: 'VERIFIED' },
      verificationStatus: 'VERIFIED',
      sourceUrl: { value: null, status: 'UNVERIFIED' },
      body: { value: { ar: 'أ', en: 'a' }, status: 'VERIFIED' },
    };

    // A pending entry never renders, even when everything else is verified.
    expect(renderableReviews([{ ...verified, verificationStatus: 'PENDING' }])).toHaveLength(0);
    // Consent must be verified before anything is public.
    expect(renderableReviews([{ ...verified, consent: { value: false, status: 'VERIFIED' } }])).toHaveLength(0);
    expect(renderableReviews([{ ...verified, consent: { value: true, status: 'OWNER_REQUIRED' } }])).toHaveLength(0);
    // Unverified body copy never renders.
    expect(
      renderableReviews([{ ...verified, body: { value: { ar: 'أ', en: 'a' }, status: 'UNVERIFIED' } }]),
    ).toHaveLength(0);

    // The happy path does render.
    expect(renderableReviews([verified])).toHaveLength(1);
  });

  it('defines six distinct wide posters with inline art', () => {
    expect(posters).toHaveLength(6);
    const art = posters.map((poster) =>
      poster.visual.kind === 'art' ? poster.visual.art : 'photo',
    );
    expect(new Set(art).size).toBe(6);
    for (const poster of posters) {
      expect(ar.poster[poster.id as 'brand'] ?? ar.poster.brand).toBeDefined();
    }
  });

  it('splits FAQs into answerable and management-confirmation groups', () => {
    expect(faqsByCategory('answered').length).toBeGreaterThanOrEqual(4);
    expect(faqsByCategory('needsConfirmation').length).toBeGreaterThanOrEqual(7);
    for (const entry of faqsByCategory('answered')) {
      expect(en.faq.answers[entry.id as keyof typeof en.faq.answers]).toBeTruthy();
    }
    for (const entry of faqsByCategory('needsConfirmation')) {
      expect((en.faq.answers as Record<string, string | undefined>)[entry.id]).toBeUndefined();
    }
  });

  it('never contains banned commercial or social-proof claims in page copy', () => {
    const flatCopy = JSON.stringify(en).toLowerCase();
    for (const term of ['aggregateRating', 'priceRange', 'openingHours', 'streetAddress']) {
      expect(flatCopy).not.toContain(term);
    }
    for (const term of ['top rated', 'award-winning', 'number one', 'best swimming']) {
      expect(flatCopy).not.toContain(term);
    }
  });
});
