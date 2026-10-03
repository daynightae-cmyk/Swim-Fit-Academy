'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { AIHandoffCard, AIQuickActions } from '@/components/ai/AIHandoffCard';
import { CloseIcon, SendIcon, SpeakerIcon, StopIcon, WhatsAppIcon } from '@/components/ui/Icon';
import { attributionParams, track } from '@/lib/analytics';
import { readUtmFromLocation } from '@/lib/utm';
import { buildHandoff } from '@/lib/ai/fallback';

type Role = 'user' | 'assistant';
type Status = 'idle' | 'thinking' | 'streaming' | 'answer' | 'handoff' | 'unavailable';

interface Message {
  readonly id: string;
  readonly role: Role;
  readonly text: string;
  readonly handoffUrl?: string;
}

interface StreamEvent {
  type: 'meta' | 'delta' | 'handoff' | 'done';
  text?: string;
  mode?: 'gemini' | 'local';
  required?: boolean;
  reason?: string;
  whatsappUrl?: string;
  chips?: string[];
}

const PANEL_WIDTH_CLASS = 'sm:w-[26rem] lg:w-[27.5rem]';
const PANEL_HEIGHT_CLASS = 'sm:max-h-[70vh]';

/**
 * AI concierge chat panel.
 *
 * Behaviour contract:
 * - proper dialog semantics, Escape closes, focus trapped only while open
 * - desktop floating panel; mobile near-full-screen bottom sheet with safe areas
 * - server-renderable content is never blocked: the panel mounts on demand
 * - the API is the only source of answers; without a key the deterministic
 *   local responder answers using the same approved knowledge
 */
export function AIChatPanel({ open, onClose }: { readonly open: boolean; readonly onClose: () => void }) {
  if (!open) return null;
  // Remounting on open yields a fresh conversation without a state-resetting effect.
  return <ChatPanelCore onClose={onClose} />;
}

function ChatPanelCore({ onClose }: { readonly onClose: () => void }) {
  const t = useTranslations('concierge');
  const locale = useLocale() as 'ar' | 'en';
  const titleId = useId();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [mode, setMode] = useState<'gemini' | 'local'>('local');
  const [chips, setChips] = useState<readonly string[]>([]);
  const [speakReplies, setSpeakReplies] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idRef = useRef(0);

  /* ------------------------------------------------------------ speaking */

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  /* ----------------------------------------------------------- lifecycle */

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
      );
      const list = Array.from(focusables);
      if (list.length === 0) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey, true);
      cancelAnimationFrame(raf);
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, status]);

  /* ------------------------------------------------------------ speaking */

  const speak = useCallback(
    (text: string) => {
      if (!speakReplies) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\n+/g, '. '));
        utterance.lang = locale === 'ar' ? 'ar-AE' : 'en-AE';
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech is a progressive enhancement; failures are silent.
      }
    },
    [speakReplies, locale],
  );

  /* -------------------------------------------------------------- sending */

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || status === 'thinking' || status === 'streaming') return;

      setInput('');

      const userId = `m${(idRef.current += 1)}`;
      const assistantId = `m${(idRef.current += 1)}`;

      const history = messages
        .filter((message) => message.text.trim().length > 0)
        .slice(-8)
        .map((message) => ({ role: message.role, text: message.text }));

      setMessages((prev) => [
        ...prev,
        { id: userId, role: 'user', text },
        { id: assistantId, role: 'assistant', text: '' },
      ]);
      setStatus('thinking');
      track('ai_message_sent', attributionParams(locale, 'ai_panel', 'chat_panel', readUtmFromLocation()));

      const controller = new AbortController();
      abortRef.current = controller;

      const starterHandoff = buildHandoff(locale, '');
      let handoffUrl: string | undefined;

      try {
        const response = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ locale, message: text, history }),
        });

        if (!response.ok || !response.body) {
          throw new Error(`concierge_http_${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let assembled = '';

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            let event: StreamEvent;
            try {
              event = JSON.parse(trimmed) as StreamEvent;
            } catch {
              continue;
            }

            if (event.type === 'meta' && event.mode) {
              setMode(event.mode);
            } else if (event.type === 'delta' && typeof event.text === 'string') {
              assembled += event.text;
              setStatus('streaming');
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantId ? { ...message, text: assembled } : message,
                ),
              );
            } else if (event.type === 'handoff') {
              handoffUrl = event.required ? (event.whatsappUrl ?? starterHandoff.whatsappUrl) : undefined;
              // Attach the handoff card to the reply immediately so the visitor is
              // never left without a next action.
              if (handoffUrl) {
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === assistantId ? { ...message, handoffUrl } : message,
                  ),
                );
              }
            } else if (event.type === 'done') {
              setStatus('answer');
              if (Array.isArray(event.chips)) setChips(event.chips);
            }
          }
        }

        if (handoffUrl) {
          setStatus('handoff');
          track('ai_handoff_whatsapp', attributionParams(locale, 'ai_panel', 'chat_panel', readUtmFromLocation()));
        } else {
          setStatus('answer');
        }

        speak(assembled);
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') {
          setStatus('idle');
          return;
        }
        const fallback = buildHandoff(locale, t('handoff.reason'));
        setStatus('unavailable');
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, text: t('errorBody'), handoffUrl: fallback.whatsappUrl }
              : message,
          ),
        );
      } finally {
        abortRef.current = null;
      }
    },
    [messages, status, locale, speak, t],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  };

  const onChip = (chip: string) => {
    void send(chip);
  };

  const busy = status === 'thinking' || status === 'streaming';

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-testid="ai-chat-panel"
      className={[
        'pointer-events-auto fixed z-[60] flex flex-col overflow-hidden',
        PANEL_WIDTH_CLASS,
        PANEL_HEIGHT_CLASS,
        // Mobile: bottom sheet with safe-area padding and a sticky composer.
        'inset-x-0 bottom-0 max-h-[88svh] rounded-t-[1.5rem] sm:inset-x-auto sm:bottom-24 sm:end-5 sm:rounded-[1.5rem]',
      ].join(' ')}
      style={{ boxShadow: '0 40px 90px -40px rgba(0,0,0,0.95)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line bg-glass px-4 py-3.5 backdrop-blur-xl">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <span className="orb-pulse absolute inset-0 rounded-full bg-accent/25 blur-md" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-glass">
            <ConciergeOrb className="h-6 w-6" />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p id={titleId} className="truncate text-[0.95rem] font-semibold text-ink">
            {t('title')}
          </p>
          <p className="truncate text-[0.76rem] text-ink-3">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {process.env.NODE_ENV === 'development' ? (
            <span
              data-testid="ai-mode-indicator"
              className="rounded-full border border-line px-2 py-0.5 font-latin text-[0.6rem] font-semibold uppercase tracking-wider text-accent"
            >
              {mode === 'gemini' ? `AI MODE: GEMINI` : `AI MODE: LOCAL FALLBACK`}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            data-testid="ai-chat-close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:bg-accent/12"
          >
            <CloseIcon size={17} />
          </button>
        </div>
      </div>

      {/* Lane divider */}
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      {/* Messages */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-center gap-4">
            <p className="text-balance text-[1rem] leading-relaxed text-ink-2">{t('answers.greeting')}</p>
            <AIQuickActions chips={chips.length > 0 ? chips : (t.raw('chips') as unknown as readonly string[])} onSelect={onChip} disabled={busy} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-[1.7] whitespace-pre-line',
                    message.role === 'user' ? 'bubble-user ms-auto' : 'bubble-assistant me-auto',
                  ].join(' ')}
                  dir={message.role === 'assistant' ? 'auto' : undefined}
                >
                  {message.text}
                  {message.role === 'assistant' && message.text.length === 0 && busy ? (
                    <span className="flex items-center gap-1.5 py-1" aria-label={t('thinking')}>
                      <span className="ripple-dot h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="ripple-dot h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="ripple-dot h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                  ) : null}
                </div>
                {message.handoffUrl ? (
                  <AIHandoffCard whatsappUrl={message.handoffUrl} reason={t('handoff.reason')} compact />
                ) : null}
              </div>
            ))}

            {status === 'unavailable' ? (
              <AIHandoffCard whatsappUrl={buildHandoff(locale, t('handoff.reason')).whatsappUrl} reason={t('unavailable')} compact />
            ) : null}

            {chips.length > 0 && !busy ? (
              <AIQuickActions chips={chips} onSelect={onChip} />
            ) : null}
          </div>
        )}
      </div>

      {/* Disclaimer + composer */}
      <div className="border-t border-line bg-glass px-4 pb-3 pt-2.5 backdrop-blur-xl">
        <p className="mb-2 text-[0.68rem] leading-relaxed text-ink-4">{t('disclaimer')}</p>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-[0.7rem] text-ink-3">
            <input
              type="checkbox"
              checked={speakReplies}
              onChange={(event) => {
                setSpeakReplies(event.target.checked);
                if (!event.target.checked) stopSpeaking();
              }}
              className="h-3.5 w-3.5 accent-pool-400"
            />
            {speakReplies ? t('voiceStop') : t('voiceEnable')}
          </label>
          {speakReplies ? (
            <button
              type="button"
              onClick={stopSpeaking}
              aria-label={t('voiceStop')}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-line text-accent"
            >
              <StopIcon size={11} />
            </button>
          ) : (
            <span aria-hidden="true" className="text-accent/70">
              <SpeakerIcon size={13} />
            </span>
          )}
          {process.env.NODE_ENV === 'development' ? (
            <span
              data-testid="ai-mode-label"
              className="ms-auto font-latin text-[0.6rem] uppercase tracking-wider text-ink-4 opacity-70"
            >
              {mode === 'gemini' ? 'AI MODE: GEMINI' : 'AI MODE: LOCAL FALLBACK'}
            </span>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <label className="sr-only" htmlFor="ai-composer">
            {t('placeholder')}
          </label>
          <textarea
            id="ai-composer"
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onComposerKeyDown}
            placeholder={t('placeholder')}
            disabled={busy}
            data-testid="ai-composer"
            className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-line bg-inset px-3.5 py-2.5 text-[0.92rem] leading-relaxed text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length === 0}
            aria-label={t('send')}
            data-testid="ai-send"
            className="btn btn-primary h-11 w-11 shrink-0 p-0"
          >
            <SendIcon size={17} />
          </button>
        </form>
      </div>

      {/* Direct WhatsApp fallback is always reachable from the panel */}
      <a
        href={buildHandoff(locale, t('handoff.reason')).whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track('ai_handoff_whatsapp', attributionParams(locale, 'ai_panel', 'chat_footer', readUtmFromLocation()))
        }
        className="flex items-center justify-center gap-2 border-t border-line bg-glass py-2.5 text-[0.78rem] font-medium text-accent transition-colors hover:bg-accent/10"
      >
        <WhatsAppIcon size={15} />
        <span>{t('handoff.cta')}</span>
      </a>
      <div style={{ height: 'env(safe-area-inset-bottom)' }} aria-hidden="true" />
    </div>
  );
}

function ConciergeOrb({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ai-orb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#78dcef" />
          <stop offset="100%" stopColor="#15b8d6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#ai-orb)" opacity="0.22" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#ai-orb)" strokeWidth="2" opacity="0.85" />
      <g fill="none" stroke="#b3ecf8" strokeLinecap="round" strokeWidth="3">
        <path d="M15 27 C19 23.5 23 23.5 27 27 C31 30.5 35 30.5 39 27" opacity="0.95" />
        <path d="M15 37 C19 33.5 23 33.5 27 37 C31 40.5 35 40.5 39 37" opacity="0.65" />
      </g>
      <circle cx="43" cy="20" r="2.6" fill="#b3ecf8" />
    </svg>
  );
}

export default AIChatPanel;