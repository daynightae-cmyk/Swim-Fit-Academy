import 'server-only';

/**
 * Server-only Gemini client.
 *
 * - The API key is read from a non-public environment variable and never reaches
 *   the browser bundle.
 * - No sampling parameters are sent: the current Flash-class GA model rejects
 *   `temperature`, `top_p` and `top_k`.
 * - Every failure degrades to the deterministic local responder, so the UI can
 *   never crash because of a model outage.
 */

import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';

import { buildSystemInstruction } from './prompt';
import { localConciergeAnswer, type LocalAnswer } from './fallback';
import type { ChatMessageInput } from './schemas';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

export type ConciergeRunMode = 'gemini' | 'local';

export function geminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export interface ConciergeRun {
  readonly mode: ConciergeRunMode;
  readonly text: string;
  /** True when the reply contains an owner-required fact and needs a handoff card. */
  readonly requiresHandoff: boolean;
}

/**
 * Heuristic guard: if the model answers a question about an owner-required topic
 * without acknowledging that confirmation is needed, we still attach a handoff
 * card. Being slightly over-cautious is the correct failure direction here.
 */
export function needsHandoffFor(message: string, reply: string): boolean {
  const combined = `${message} ${reply}`;
  const ar = combined.replace(/[\u064B-\u0652]/g, '');
  const signals = [
    'تاكيد',
    'تأكيد',
    'الاداره',
    'الإداره',
    'اداره',
    'whatsapp',
    'واتساب',
    'contact management',
    'management confirmation',
    'confirm',
    'needs confirmation',
  ];
  const lower = ar.toLowerCase();
  return signals.some((signal) => lower.includes(signal));
}

export async function runGeminiConcierge(
  locale: 'ar' | 'en',
  message: string,
  history: readonly ChatMessageInput[],
): Promise<ConciergeRun> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });
  const contents = [
    ...history.map((entry) => ({
      role: entry.role === 'user' ? 'user' : 'model',
      parts: [{ text: entry.text }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const stream = await ai.models.generateContentStream({
    model: geminiModel(),
    contents,
    config: {
      systemInstruction: buildSystemInstruction(locale, message),
      maxOutputTokens: 400,
    },
  });

  let text = '';
  for await (const chunk of stream as AsyncGenerator<GenerateContentResponse>) {
    const delta = chunk.text;
    if (typeof delta === 'string' && delta) {
      text += delta;
    }
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Gemini returned an empty completion');
  }

  return {
    mode: 'gemini',
    text: trimmed,
    requiresHandoff: needsHandoffFor(message, trimmed),
  };
}

/** Never throws: any model failure returns the deterministic local answer. */
export async function runConcierge(
  locale: 'ar' | 'en',
  message: string,
  history: readonly ChatMessageInput[],
  options: { allowGemini?: boolean } = {},
): Promise<ConciergeRun> {
  const allowGemini = options.allowGemini ?? true;
  if (allowGemini && geminiConfigured()) {
    try {
      return await runGeminiConcierge(locale, message, history);
    } catch {
      const local: LocalAnswer = localConciergeAnswer(locale, message);
      return { mode: 'local', text: local.text, requiresHandoff: local.requiresHandoff };
    }
  }
  const local: LocalAnswer = localConciergeAnswer(locale, message);
  return { mode: 'local', text: local.text, requiresHandoff: local.requiresHandoff };
}