'use client';

import { useEffect } from 'react';

/**
 * Locale-scoped error boundary.
 *
 * Never exposes a stack trace. Keeps the phone and WhatsApp routes visible so
 * a visitor is never stranded by a rendering failure.
 */
export default function LocaleError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    // Log the digest only. Never log visitor content.
    console.error('route_error', error.digest ?? 'unknown');
  }, [error]);

  return (
    <section className="relative mx-auto flex min-h-[70svh] w-full max-w-[52rem] flex-col items-center justify-center px-5 py-24 text-center">
      <div aria-hidden="true" className="caustics caustics-drift pointer-events-none absolute inset-0 opacity-16" />
      <div className="relative flex flex-col items-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-pool-300">
          Swim Fit Academy
        </p>
        <h1 className="mt-5 text-balance text-[clamp(1.6rem,4.4vw,2.6rem)] font-semibold leading-[1.16] text-ice-50">
          حصلت مشكلة غير متوقعة
        </h1>
        <p className="mt-4 max-w-[48ch] text-[0.95rem] leading-relaxed text-slate-400">
          جرّب تحديث الصفحة. ولو المشكلة استمرت، تواصل معنا مباشرة.
        </p>
        <p dir="ltr" className="mt-3 max-w-[48ch] text-[0.88rem] leading-relaxed text-slate-500">
          Something unexpected happened. Try refreshing, or reach us on WhatsApp at 056 969 8628.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary px-6 py-3.5">
            إعادة المحاولة
          </button>
          <a
            href="https://wa.me/971569698628"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost px-6 py-3.5"
          >
            تواصل واتساب
          </a>
          <a href="tel:+971569698628" className="btn btn-quiet px-5 py-3.5">
            056 969 8628
          </a>
        </div>
      </div>
    </section>
  );
}
