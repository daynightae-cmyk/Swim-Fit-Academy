import { NextResponse } from 'next/server';

import { buildHandoff, localConciergeAnswer } from '@/lib/ai/fallback';
import { geminiConfigured, geminiModel, runConcierge } from '@/lib/ai/gemini';
import { conciergeRequestSchema } from '@/lib/ai/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Reports the active concierge mode. No key material is ever returned. */
export function GET() {
  const mode = geminiConfigured() ? 'gemini' : 'local';
  return NextResponse.json(
    { mode, model: mode === 'gemini' ? geminiModel() : null },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

type StreamEvent =
  | { type: 'meta'; mode: 'gemini' | 'local' }
  | { type: 'delta'; text: string }
  | { type: 'handoff'; required: boolean; reason?: string; whatsappUrl?: string }
  | { type: 'done'; mode: 'gemini' | 'local'; chips: readonly string[] };

function frame(event: StreamEvent): string {
  return `${JSON.stringify(event)}\n`;
}

/**
 * POST /api/concierge
 *
 * Server-only Gemini integration with a deterministic local fallback.
 * Responses are newline-delimited JSON so the client can render deltas
 * incrementally without layout jumps. Payloads are validated with Zod, history
 * is length-capped, and no transcript is persisted.
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = conciergeRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { locale, message, history } = parsed.data;

  const encoder = new TextEncoder();
  const useGemini = geminiConfigured();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) => controller.enqueue(encoder.encode(frame(event)));
      try {
        send({ type: 'meta', mode: useGemini ? 'gemini' : 'local' });

        const run = await runConcierge(locale, message, history, { allowGemini: useGemini });
        send({ type: 'delta', text: run.text });

        const localChips = localConciergeAnswer(locale, message).chips;

        if (run.requiresHandoff) {
          const handoff = buildHandoff(locale, run.text);
          send({
            type: 'handoff',
            required: true,
            reason: handoff.reason,
            whatsappUrl: handoff.whatsappUrl,
          });
        } else {
          send({ type: 'handoff', required: false });
        }

        send({ type: 'done', mode: run.mode, chips: localChips });
      } catch {
        // Absolute last resort: the local responder has no failure mode.
        const local = localConciergeAnswer(locale, message);
        send({ type: 'delta', text: local.text });
        send({
          type: 'handoff',
          required: local.requiresHandoff,
          reason: local.requiresHandoff ? local.handoffReason : undefined,
          whatsappUrl: local.requiresHandoff
            ? buildHandoff(locale, local.handoffReason).whatsappUrl
            : undefined,
        });
        send({ type: 'done', mode: 'local', chips: local.chips });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}