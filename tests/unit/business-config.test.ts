import { describe, expect, it } from 'vitest';

import {
  business,
  isPublicStatus,
  publicFlag,
  publicSocialLinks,
  publicValue,
  requirePublicValue,
  supportedFacts,
  VERIFICATION_STATUSES,
} from '@/content/business';

/**
 * Business config normalisation.
 *
 * The core guarantee of the site: a fact that management has not confirmed can
 * never be resolved to a value, so a component physically cannot render it.
 */
describe('business config normalisation', () => {
  it('exposes a closed verification vocabulary', () => {
    expect(VERIFICATION_STATUSES).toEqual([
      'VERIFIED',
      'SUPPORTED',
      'UNVERIFIED',
      'OWNER_REQUIRED',
    ]);
    expect(isPublicStatus('VERIFIED')).toBe(true);
    expect(isPublicStatus('SUPPORTED')).toBe(true);
    expect(isPublicStatus('UNVERIFIED')).toBe(false);
    expect(isPublicStatus('OWNER_REQUIRED')).toBe(false);
  });

  it('resolves supported facts to their values', () => {
    expect(publicValue(business.name)).toBe('Swim Fit Academy');
    expect(publicValue(business.city)).toBe('Abu Dhabi');
    expect(publicValue(business.phone.local)).toBe('056 969 8628');
    expect(publicValue(business.phone.international)).toBe('+971 56 969 8628');
    expect(publicValue(business.phone.tel)).toBe('tel:+971569698628');
    expect(publicValue(business.whatsapp)).toBe('https://wa.me/971569698628');
    expect(publicValue(business.levels)).toBe('All levels');
  });

  it('never resolves an owner-required fact', () => {
    const ownerRequired = [
      business.legalName,
      business.tagline,
      business.address,
      business.email,
      business.hours,
      business.pricing,
      business.schedule,
      business.ageBands,
      business.trialPolicy,
      business.ladiesOnly,
      business.cancellationPolicy,
    ];
    for (const field of ownerRequired) {
      expect(field.status).toBe('OWNER_REQUIRED');
      expect(publicValue(field)).toBeNull();
    }
  });

  it('throws when a caller tries to force an unconfirmed value', () => {
    expect(() => requirePublicValue(business.pricing, 'pricing')).toThrow(/Refusing to render/);
    expect(requirePublicValue(business.phone.local, 'phone')).toBe('056 969 8628');
  });

  it('treats an unverified social profile as a non-public value', () => {
    expect(business.social.instagram.url.status).toBe('UNVERIFIED');
    expect(publicValue(business.social.instagram.url)).toBeNull();
    expect(business.social.instagram.isCandidate).toBe(true);
  });

  it('exposes Facebook but withholds Instagram from sameAs candidates', () => {
    const links = publicSocialLinks();
    expect(links.facebook?.url).toBe('https://www.facebook.com/1177131185475857');
    expect(links.instagram).toBeNull();
  });

  it('normalises boolean facts conservatively', () => {
    // Instagram is not a boolean fact; a false-y "verified" flag must still read as false.
    const instagramVerified = isPublicStatus(business.social.instagram.url.status);
    expect(instagramVerified).toBe(false);
    expect(publicFlag({ value: instagramVerified, status: 'SUPPORTED' })).toBe(false);
    expect(publicFlag({ value: true, status: 'OWNER_REQUIRED' })).toBe(false);
  });

  it('never reports a price, rating or student count as supported', () => {
    const facts = supportedFacts();
    const keys = Object.keys(facts);
    expect(keys).not.toContain('pricing');
    expect(keys).not.toContain('rating');
    expect(keys).not.toContain('studentCount');
    expect(keys).not.toContain('yearsInBusiness');
  });

  it('records the owner-approved circular site identity', () => {
    expect(business.mark.status).toBe('OWNER_APPROVED_LOGO');
    expect(business.mark.label).toBe('Swim Fit Academy official circular logo');
  });
});
