import { z } from 'zod';

export const CONCIERGE_MODES = ['gemini', 'local'] as const;
export type ConciergeMode = (typeof CONCIERGE_MODES)[number];

export const CHAT_STATES = [
  'idle',
  'thinking',
  'streaming',
  'answer',
  'handoff',
  'temporarily-unavailable',
] as const;
export type ChatState = (typeof CHAT_STATES)[number];

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_MESSAGES = 16;

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

export const conciergeRequestSchema = z.object({
  locale: z.enum(['ar', 'en']),
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  history: z.array(chatMessageSchema).max(MAX_HISTORY_MESSAGES).optional().default([]),
  /** Optional program context so the assistant can acknowledge the intent. */
  program: z.enum(['start', 'technique', 'confidence', 'performance']).optional(),
});

export type ConciergeRequest = z.infer<typeof conciergeRequestSchema>;

export const handoffSchema = z.object({
  type: z.literal('handoff'),
  locale: z.enum(['ar', 'en']),
  reason: z.string(),
  whatsappUrl: z.string().startsWith('https://wa.me/'),
});

export type HandoffPayload = z.infer<typeof handoffSchema>;

export { MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH };