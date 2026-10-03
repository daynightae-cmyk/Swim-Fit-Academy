/**
 * Visual QA capture.
 *
 * Not a pass/fail gate — it produces the real screenshots that must be inspected
 * by eye at every required viewport. Run with:
 *   node --experimental-strip-types tests/visual/capture.mjs
 *   pnpm exec next start --port 3111   (in a second shell)
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const OUT = path.resolve('artifacts/visual');

const VIEWPORTS = [
  { name: 'desktop-1440x1000', width: 1440, height: 1000, isMobile: false },
  { name: 'laptop-1024x768', width: 1024, height: 768, isMobile: false },
  { name: 'tablet-768x1024', width: 768, height: 1024, isMobile: false },
  { name: 'mobile-390x844', width: 390, height: 844, isMobile: true },
];

/** Targets capture the required review surface for each viewport. */
const TARGETS = [
  { name: 'home-hero', route: '/ar', anchor: null, full: false },
  { name: 'home-trust-rail', route: '/ar', selector: '[data-section="trust-rail"]' },
  { name: 'home-brand', route: '/ar', selector: '#brand-heading' },
  { name: 'home-poster-01', route: '/ar', selector: '[data-poster="brand"]' },
  { name: 'home-programs', route: '/ar', selector: '#programs-heading' },
  { name: 'home-poster-02', route: '/ar', selector: '[data-poster="technique"]' },
  { name: 'home-method', route: '/ar', selector: '[data-testid="method-timeline"]' },
  { name: 'home-poster-03', route: '/ar', selector: '[data-poster="progress"]' },
  { name: 'home-progress', route: '/ar', selector: '[data-testid="progress-story"]' },
  { name: 'home-poster-04', route: '/ar', selector: '[data-poster="levels"]' },
  { name: 'home-locations', route: '/ar', selector: '[data-testid="abu-dhabi-location-panel"]' },
  { name: 'home-poster-05', route: '/ar', selector: '[data-poster="abu-dhabi"]' },
  { name: 'home-faq-teaser', route: '/ar', selector: '#faq-teaser-heading' },
  { name: 'home-ai-invite', route: '/ar', selector: '#ai-invite-heading' },
  { name: 'home-poster-06-conversion', route: '/ar', selector: '[data-poster="conversion"]' },
  { name: 'home-footer', route: '/ar', selector: 'footer' },
  { name: 'home-full-page', route: '/ar', full: true },

  { name: 'programs-hero', route: '/ar/programs', selector: '#page-heading' },
  { name: 'programs-cards', route: '/ar/programs', selector: '#programs-heading' },
  { name: 'programs-skill-path', route: '/ar/programs', selector: '[data-testid="skill-path-selector"]' },

  { name: 'coach-hero', route: '/ar/coach', selector: '#page-heading' },
  { name: 'coach-profile-slot', route: '/ar/coach', selector: '[data-testid="coach-profile-card"]' },
  { name: 'coach-method', route: '/ar/coach', selector: '[data-testid="method-timeline"]' },

  { name: 'locations-hero', route: '/ar/locations', selector: '#page-heading' },
  { name: 'locations-panel', route: '/ar/locations', selector: '[data-testid="abu-dhabi-location-panel"]' },

  { name: 'results-hero', route: '/ar/results', selector: '#page-heading' },
  { name: 'results-story', route: '/ar/results', selector: '[data-testid="progress-story"]' },
  { name: 'results-reviews-empty', route: '/ar/results', selector: '[data-testid="verified-reviews"]' },

  { name: 'faq-hero', route: '/ar/faq', selector: '#page-heading' },
  { name: 'faq-answered', route: '/ar/faq', selector: '[data-category="answered"]' },
  { name: 'faq-needs-confirmation', route: '/ar/faq', selector: '[data-category="needsConfirmation"]' },

  { name: 'contact-hero', route: '/ar/contact', selector: '#page-heading' },
  { name: 'contact-form', route: '/ar/contact', selector: '[data-testid="trial-request-form"]' },
  { name: 'contact-social', route: '/ar/contact', selector: '[data-testid="social-links"]' },
  { name: 'contact-unpublished', route: '/ar/contact', selector: '[data-testid="contact-unpublished"]' },

  { name: 'not-found', route: '/ar/this-route-does-not-exist', selector: 'main' },

  // English parity: the two locales must feel like one product.
  { name: 'en-home-hero', route: '/en', selector: null },
  { name: 'en-home-programs', route: '/en', selector: '#programs-heading' },
  { name: 'en-home-poster-01', route: '/en', selector: '[data-poster="brand"]' },
  { name: 'en-home-footer', route: '/en', selector: 'footer' },
  { name: 'en-contact-form', route: '/en/contact', selector: '[data-testid="trial-request-form"]' },
  { name: 'en-programs-cards', route: '/en/programs', selector: '#programs-heading' },
];

const report = [];

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.isMobile,
    hasTouch: viewport.isMobile,
    reducedMotion: 'reduce',
  });

  const page = await context.newPage();

  for (const target of TARGETS) {
    await page.goto(`${BASE}${target.route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(320);

    try {
      if (target.selector) {
        const locator = page.locator(target.selector).first();
        await locator.scrollIntoViewIfNeeded({ timeout: 8000 });
        await page.waitForTimeout(220);
        await locator.screenshot({
          path: path.join(OUT, `${viewport.name}--${target.name}.png`),
        });
      } else {
        await page.screenshot({
          path: path.join(OUT, `${viewport.name}--${target.name}.png`),
          fullPage: Boolean(target.full),
        });
      }
      report.push({ viewport: viewport.name, target: target.name, status: 'captured' });
    } catch (error) {
      report.push({
        viewport: viewport.name,
        target: target.name,
        status: 'failed',
        reason: String(error).split('\n')[0],
      });
    }
  }

  // AI chat open state, captured once per viewport.
  try {
    await page.goto(`${BASE}/ar`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(280);
    await page.getByTestId('ai-launcher').click();
    await page.waitForTimeout(320);
    await page.getByTestId('ai-composer').fill('الأسعار كام؟');
    await page.getByTestId('ai-send').click();
    await page.getByTestId('ai-handoff-card').waitFor({ state: 'visible', timeout: 12_000 });
    await page.waitForTimeout(240);
    await page.getByTestId('ai-chat-panel').screenshot({
      path: path.join(OUT, `${viewport.name}--ai-chat-open.png`),
    });
    report.push({ viewport: viewport.name, target: 'ai-chat-open', status: 'captured' });
  } catch (error) {
    report.push({
      viewport: viewport.name,
      target: 'ai-chat-open',
      status: 'failed',
      reason: String(error).split('\n')[0],
    });
  }

  // Mobile menu open state.
  if (viewport.width < 1024) {
    try {
      await page.goto(`${BASE}/ar`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(240);
      await page.getByTestId('mobile-menu-button').click();
      await page.waitForTimeout(340);
      await page.screenshot({ path: path.join(OUT, `${viewport.name}--mobile-menu-open.png`) });
      report.push({ viewport: viewport.name, target: 'mobile-menu-open', status: 'captured' });
    } catch (error) {
      report.push({
        viewport: viewport.name,
        target: 'mobile-menu-open',
        status: 'failed',
        reason: String(error).split('\n')[0],
      });
    }
  }

  await context.close();
}

await browser.close();

await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'capture-report.json'), JSON.stringify(report, null, 2), 'utf8');

const failed = report.filter((entry) => entry.status === 'failed');
console.log(`captured: ${report.length - failed.length}/${report.length}`);
for (const entry of failed) {
  console.log(`FAILED ${entry.viewport} ${entry.target}: ${entry.reason}`);
}
