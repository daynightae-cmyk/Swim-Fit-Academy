import { describe, expect, it } from 'vitest';

import {
  ACADEMY_KNOWLEDGE,
  KNOWLEDGE_ARTICLE_COUNT,
  bestKnowledgeAnswer,
  searchAcademyKnowledge,
} from '@/lib/ai/academy-knowledge';
import { buildSystemInstruction } from '@/lib/ai/prompt';

describe('academy concierge knowledge base', () => {
  it('ships a large bilingual knowledge corpus', () => {
    expect(KNOWLEDGE_ARTICLE_COUNT).toBeGreaterThanOrEqual(120);
    expect(
      ACADEMY_KNOWLEDGE.every((item) => item.answerAr.length > 20 && item.answerEn.length > 20),
    ).toBe(true);
  });

  it('retrieves relevant swimming guidance', () => {
    const matches = searchAcademyKnowledge('How should I breathe in freestyle?', 'en', 5);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some(({ article }) => ['breathing-basics', 'freestyle'].includes(article.id))).toBe(true);
  });

  it('answers verified contact questions from the knowledge base', () => {
    expect(bestKnowledgeAnswer('What is your phone number?', 'en')).toContain('056 969 8628');
  });

  it('injects retrieved knowledge into the live-model instruction', () => {
    const prompt = buildSystemInstruction('en', 'How can I improve freestyle breathing?');
    expect(prompt).toContain('CURATED BILINGUAL ARTICLES');
    expect(prompt.toLowerCase()).toContain('breath');
    expect(prompt).toContain('Never fabricate reviews');
  });
});
