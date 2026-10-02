import Link from 'next/link';

/**
 * Root 404.
 * Rendered outside the locale tree, so it stays bilingual-neutral and always
 * offers a route back into the product.
 */
export default function NotFound() {
  return (
    <html lang="ar-AE" dir="rtl">
      <body className="flex min-h-svh flex-col items-center justify-center bg-ocean-950 px-5 text-center text-ice-50">
        <div aria-hidden="true" className="caustics caustics-drift pointer-events-none absolute inset-0 opacity-20" />
        <main className="relative flex flex-col items-center">
          <p className="font-latin text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-pool-300">404</p>
          <h1 className="mt-5 text-balance text-[clamp(1.7rem,5vw,2.9rem)] font-semibold leading-[1.15]">
            الصفحة دي خرجت من المسار 🏊
          </h1>
          <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-slate-400">
            الرابط مش موجود أو اتغيّر. ارجع للرئيسية أو تواصل معانا مباشرة.
          </p>
          <p dir="ltr" className="mt-6 max-w-[46ch] text-[0.9rem] leading-relaxed text-slate-500">
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
