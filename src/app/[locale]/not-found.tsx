import { routing, type AppLocaleParam } from '@/i18n/routing';

/** Locale-scoped not-found surface, rendered inside the locale layout. */
export default async function LocaleNotFound({
  params,
}: {
  readonly params?: AppLocaleParam;
}) {
  const { locale } = params ? await params : { locale: routing.defaultLocale };
  const rtl = locale === 'ar';

  return (
    <section className="relative mx-auto flex min-h-[70svh] w-full max-w-[52rem] flex-col items-center justify-center px-5 py-24 text-center">
      <div aria-hidden="true" className="caustics caustics-drift pointer-events-none absolute inset-0 opacity-16" />
      <div className="relative flex flex-col items-center">
        <p className="font-latin text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-pool-300">404</p>
        <h1 className="mt-5 text-balance text-[clamp(1.7rem,5vw,2.9rem)] font-semibold leading-[1.15] text-ice-50">
          {rtl ? 'الصفحة دي خرجت من المسار 🏊' : 'This page drifted out of the lane 🏊'}
        </h1>
        <p className="mt-4 max-w-[48ch] text-[0.95rem] leading-relaxed text-slate-400">
          {rtl
            ? 'الرابط مش موجود أو اتغيّر. ارجع للرئيسية أو تواصل معانا مباشرة.'
            : 'The link does not exist or has changed. Head back home, or reach us directly.'}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={`/${routing.defaultLocale}`} className="btn btn-primary px-6 py-3.5">
            {rtl ? 'العودة للرئيسية' : 'Back to home'}
          </a>
          <a
            href="https://wa.me/971569698628"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost px-6 py-3.5"
          >
            {rtl ? 'تواصل واتساب' : 'Message on WhatsApp'}
          </a>
        </div>
      </div>
    </section>
  );
}
