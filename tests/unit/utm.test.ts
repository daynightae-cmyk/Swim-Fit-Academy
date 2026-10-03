import { describe, expect, it } from 'vitest';

import {
  formatUtmLine,
  hasUtm,
  parseUtm,
  readUtmFromLocation,
  utmToSearchParams,
  UTM_KEYS,
} from '@/lib/utm';

describe('UTM parser', () => {
  it('reads the five standard campaign parameters', () => {
    const params = new URLSearchParams(
      'utm_source=google&utm_medium=cpc&utm_campaign=trial&utm_term=swim&utm_content=hero',
    );
    expect(parseUtm(params)).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'trial',
      utm_term: 'swim',
      utm_content: 'hero',
    });
  });

  it('drops unknown keys so nothing arbitrary is forwarded', () => {
    const params = new URLSearchParams('utm_source=google&email=a@b.com&name=sneaky');
    expect(Object.keys(parseUtm(params))).toEqual(['utm_source']);
  });

  it('ignores blank values', () => {
    expect(parseUtm(new URLSearchParams('utm_source=&utm_medium=cpc'))).toEqual({ utm_medium: 'cpc' });
    expect(hasUtm(parseUtm(new URLSearchParams('utm_source=')))).toBe(false);
  });

  it('caps value length so a hostile query cannot bloat a message', () => {
    const long = 'x'.repeat(400);
    const parsed = parseUtm(new URLSearchParams(`utm_source=${long}`));
    expect(parsed.utm_source).toHaveLength(80);
  });

  it('removes control characters from a value', () => {
    const parsed = parseUtm({ utm_source: 'google' });
    expect(parsed.utm_source).toBe('google');
  });

  it('removes control characters rather than injecting whitespace', () => {
    // UTM values are opaque campaign tokens. A control character is noise, and
    // substituting a space would corrupt the value.
    expect(parseUtm({ utm_source: 'a\nb\tc' }).utm_source).toBe('abc');
  });

  it('round-trips through URLSearchParams', () => {
    const utm = parseUtm(new URLSearchParams('utm_source=google&utm_campaign=trial'));
    expect(parseUtm(utmToSearchParams(utm))).toEqual(utm);
  });

  it('formats a single attribution line', () => {
    expect(formatUtmLine({ utm_source: 'google', utm_campaign: 'trial' })).toBe(
      'utm_source=google · utm_campaign=trial',
    );
    expect(formatUtmLine({})).toBeNull();
  });

  it('exposes exactly the five documented keys', () => {
    expect([...UTM_KEYS]).toEqual([
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ]);
  });
});

describe('readUtmFromLocation', () => {
  it('returns an empty object when there is no window', () => {
    expect(readUtmFromLocation()).toEqual({});
  });
});
