import Link from 'next/link';

import { DEFAULT_THEME, THEME_BOOTSTRAP_SCRIPT } from '@/lib/theme';

/**
 * Root 404.
 *
 * Rendered outside the locale tree, so it declares its own language, direction
 * and day/night identity. The same bootstrap script as the locale layout keeps
 * the stored theme from flashing.
 */
export default function NotFound() {
  return (
    <html lang="ar-AE" dir="rtl" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-svh bg-page text-ink antialiased">
        <div aria-hidden="true" className="caustics caustics-drift pointer-events-none absolute inset-0 opacity-20" />
        <main className="relative mx-auto flex min-h-svh w-full max-w-[44rem] flex-col items-center justify-center px-5 text-center">
          <p className="font-latin text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent">404</p>
          <h1 className="mt-5 text-balance text-[clamp(1.7rem,5vw,2.9rem)] font-semibold leading-[1.15]">
            الصفحة دي خرجت من المسار 🏊
          </h1>
          <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink-2">
            الرابط مش موجود أو اتغيّر. ارجع للرئيسية أو تواصل معانا مباشرة.
          </p>
          <p dir="ltr" className="mt-3 max-w-[46ch] text-[0.88rem] leading-relaxed text-ink-3">
            This page drifted out of the lane. Head back home, or reach us on WhatsApp at 056 969 8628.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/ar" className="btn btn-primary px-6 py-3.5">
              العودة للرئيسية
            </Link>
            <a
              href="https://wa.me/971569698628"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost px-6 py-3.5"
            >
              تواصل واتساب
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
