import { describe, expect, it } from 'vitest';

import {
  buildHandoff,
  detectIntent,
  localConciergeAnswer,
  requiresHandoff,
} from '@/lib/ai/fallback';
import { OWNER_REQUIRED_TOPICS, knownFacts } from '@/lib/ai/knowledge';
import { buildSystemInstruction } from '@/lib/ai/prompt';
import { conciergeRequestSchema } from '@/lib/ai/schemas';

const OWNER_REQUIRED_QUESTIONS: readonly { ar: string; en: string }[] = [
  { ar: 'الأسعار كام؟', en: 'How much does it cost?' },
  { ar: 'المواعيد متاحة إزاي؟', en: 'What are the available times?' },
  { ar: 'الموقع فين بالظبط؟', en: 'Where exactly is the pool?' },
  { ar: 'فيه حصة تجريبية؟', en: 'Is there a trial class?' },
  { ar: 'في حصص للسيدات؟', en: 'Do you have ladies-only sessions?' },
  { ar: 'مين المدرب؟', en: 'Who is the coach?' },
  { ar: 'عندكم كام طالب؟', en: 'How many students do you have?' },
];

describe('AI fallback policy', () => {
  it('answers supported facts without a handoff', () => {
    const programs = localConciergeAnswer('ar', 'عندكم برامج إيه؟');
    expect(programs.intent).toBe('programs');
    expect(programs.requiresHandoff).toBe(false);
    expect(programs.text.length).toBeGreaterThan(20);

    const contact = localConciergeAnswer('en', 'what is your phone number');
    expect(contact.requiresHandoff).toBe(false);
    expect(contact.text).toContain('056 969 8628');
  });

  it.each(OWNER_REQUIRED_QUESTIONS)(
    'refuses to guess and hands off instead: $en',
    ({ ar, en }) => {
      for (const [locale, message] of [
        ['ar', ar],
        ['en', en],
      ] as const) {
        const answer = localConciergeAnswer(locale, message);
        expect(answer.requiresHandoff).toBe(true);
        expect(answer.handoffReason.length).toBeGreaterThan(10);
        // The handoff must always be one clear next action.
        const handoff = buildHandoff(locale, answer.handoffReason);
        expect(handoff.whatsappUrl.startsWith('https://wa.me/971569698628?text=')).toBe(true);
      }
    },
  );

  it('never states a price, rating or guarantee in a fallback answer', () => {
    const banned = ['AED', 'درهم', '5 stars', 'نجوم', 'guarantee', 'مضمون', 'award', 'جائزة'];
    for (const { ar, en } of OWNER_REQUIRED_QUESTIONS) {
      for (const [locale, message] of [
        ['ar', ar],
        ['en', en],
      ] as const) {
        const answer = localConciergeAnswer(locale, message).text;
        for (const term of banned) {
          expect(answer.toLowerCase()).not.toContain(term.toLowerCase());
        }
      }
    }
  });

  it('is deterministic', () => {
    const a = localConciergeAnswer('ar', 'الأسعار؟');
    const b = localConciergeAnswer('ar', 'الأسعار؟');
    expect(a).toEqual(b);
  });

  it('always offers useful chips', () => {
    const answer = localConciergeAnswer('en', 'hello');
    expect(answer.chips.length).toBeGreaterThan(0);
    expect(answer.chips.some((chip) => chip.toLowerCase().includes('whatsapp'))).toBe(true);
  });

  it('falls back to a clarifying answer for gibberish, with a handoff', () => {
    const answer = localConciergeAnswer('en', 'zzzz qqqq wwww');
    expect(answer.intent).toBe('unclear');
    expect(answer.requiresHandoff).toBe(true);
  });

  it('detects intent across both languages', () => {
    expect(detectIntent('مرحبا')).toBe('greeting');
    expect(detectIntent('Hello there')).toBe('greeting');
    expect(detectIntent('أنا مبتدئ')).toBe('beginner');
    expect(detectIntent('I want better technique')).toBe('technique');
    expect(detectIntent('locations?')).toBe('locations');
    expect(detectIntent('عندكم تقييمات؟')).toBe('reviews');
    expect(requiresHandoff('pricing')).toBe(true);
    expect(requiresHandoff('greeting')).toBe(false);
  });

  it('reports its mode honestly as local, never as Gemini', () => {
    expect(localConciergeAnswer('en', 'hello').mode).toBe('local');
    expect(localConciergeAnswer('en', 'hello').text.toLowerCase()).not.toContain('gemini');
  });
});

describe('concierge knowledge boundary', () => {
  it('only advertises facts that cleared verification', () => {
    const keys = knownFacts().map((fact) => fact.key);
    expect(keys).toContain('name');
    expect(keys).toContain('city');
    expect(keys).toContain('phoneLocal');
    expect(keys).toContain('whatsapp');
    expect(keys).toContain('levels');
    expect(keys).toContain('facebook');
    expect(keys).not.toContain('instagram');
  });

  it('lists the owner-required topics', () => {
    expect(OWNER_REQUIRED_TOPICS).toContain('prices');
    expect(OWNER_REQUIRED_TOPICS).toContain('ladies-only availability');
    expect(OWNER_REQUIRED_TOPICS).toContain('credential issuer');
  });

  it('tells the model never to fabricate', () => {
    const prompt = buildSystemInstruction('ar');
    expect(prompt).toContain('Never fabricate reviews');
    expect(prompt).toContain('owner-confirmed list');
    expect(prompt).toContain('056 969 8628');
    expect(prompt).not.toContain('temperature');
  });

  it('varies the language instruction by locale', () => {
    expect(buildSystemInstruction('ar')).toContain('أجب بالعربية');
    expect(buildSystemInstruction('en')).toContain("visitor's language");
  });
});

describe('concierge request validation', () => {
  it('rejects an empty message', () => {
    expect(conciergeRequestSchema.safeParse({ locale: 'ar', message: '   ' }).success).toBe(false);
  });

  it('rejects an unsupported locale', () => {
    expect(conciergeRequestSchema.safeParse({ locale: 'fr', message: 'bonjour' }).success).toBe(false);
  });

  it('caps message length', () => {
    expect(conciergeRequestSchema.safeParse({ locale: 'en', message: 'a'.repeat(601) }).success).toBe(false);
  });

  it('caps conversation history length', () => {
    const history = Array.from({ length: 20 }, () => ({ role: 'user' as const, text: 'hi' }));
    expect(conciergeRequestSchema.safeParse({ locale: 'en', message: 'hi', history }).success).toBe(false);
  });

  it('accepts a minimal valid payload', () => {
    const parsed = conciergeRequestSchema.safeParse({ locale: 'ar', message: 'مرحبا' });
    expect(parsed.success).toBe(true);
    expect(parsed.data?.history).toEqual([]);
  });
});
