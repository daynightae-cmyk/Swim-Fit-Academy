/**
 * Visual capture with a hard readiness gate.
 *
 * The screenshot step must never run against a dead or half-started server, and
 * must never emit a wall of ERR_CONNECTION_REFUSED frames. This script:
 *   1. probes the target until it answers with a real 2xx HTML response
 *   2. refuses to capture anything if readiness fails
 *   3. writes a capture report with pass/fail counts
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const OUT = path.resolve('artifacts/visual-final');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'laptop', width: 1024, height: 768, mobile: false },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'mobile-small', width: 360, height: 800, mobile: true },
];

const THEMES = ['night', 'day'];

const FRAMES = [
  { name: 'home', route: '/ar', anchor: 0 },
  { name: 'hero', route: '/ar', anchor: 0, sameAs: 'home' },
  { name: 'poster-01', route: '/ar', selector: '[data-poster="brand"]' },
  { name: 'poster-02', route: '/ar', selector: '[data-poster="technique"]' },
  { name: 'poster-03', route: '/ar', selector: '[data-poster="progress"]' },
  { name: 'poster-04', route: '/ar', selector: '[data-poster="levels"]' },
  { name: 'poster-05', route: '/ar', selector: '[data-poster="abu-dhabi"]' },
  { name: 'poster-06', route: '/ar', selector: '[data-poster="conversion"]' },
  { name: 'programs', route: '/ar', selector: '#programs-heading' },
  { name: 'method', route: '/ar', selector: '[data-testid="method-timeline"]' },
  { name: 'results', route: '/ar', selector: '[data-testid="progress-story"]' },
  { name: 'locations', route: '/ar', selector: '[data-testid="abu-dhabi-location-panel"]' },
  { name: 'faq', route: '/ar', selector: '[data-testid="faq-accordion"]' },
  { name: 'contact', route: '/ar/contact', anchor: 0 },
  { name: 'coach', route: '/ar/coach', anchor: 0 },
  { name: 'footer', route: '/ar', selector: 'footer' },
  { name: 'en-home', route: '/en', anchor: 0 },
  { name: 'en-contact', route: '/en/contact', selector: '[data-testid="trial-request-form"]' },
  { name: 'not-found', route: '/ar/nope', anchor: 0 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/* Readiness gate                                                             */
/* -------------------------------------------------------------------------- */

async function waitForServer(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  let attempt = 0;

  while (Date.now() < deadline) {
    attempt += 1;
    try {
      const response = await fetch(`${BASE}/ar`, { redirect: 'manual' });
      const type = response.headers.get('content-type') ?? '';
      if (response.ok && type.includes('text/html')) {
        console.log(`server ready after ${attempt} attempt(s): ${response.status} ${type}`);
        return true;
      }
      console.log(`  attempt ${attempt}: ${response.status} ${type || '(no content-type)'}`);
    } catch (error) {
      console.log(`  attempt ${attempt}: ${String(error).slice(0, 80)}`);
    }
    await sleep(1500);
  }

  console.error(`SERVER NOT READY after ${timeoutMs / 1000}s — refusing to capture.`);
  return false;
}

if (!(await waitForServer())) {
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* Capture                                                                    */
/* -------------------------------------------------------------------------- */

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const report = [];

for (const viewport of VIEWPORTS) {
  // Only the two widest viewports get both themes; smaller ones use night,
  // which is the default identity.
  const themes = viewport.width >= 1024 ? THEMES : ['night'];

    for (const activeTheme of themes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
        reducedMotion: 'reduce',
        colorScheme: activeTheme === 'day' ? 'light' : 'dark',
      });

      // Seed the explicit choice so the identity is deterministic.
      await context.addInitScript(
        ([key, value]) => {
          try {
            window.localStorage.setItem(key, value);
          } catch {}
        },
        ['sfa-theme', activeTheme],
      );

      const page = await context.newPage();
      const suffix = themes.length > 1 ? `-${activeTheme}` : '';

      for (const frame of FRAMES) {
        if (frame.sameAs && frame.sameAs === frame.name) continue;
        try {
          await page.goto(`${BASE}${frame.route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
          await page.waitForTimeout(300);

          const applied = await page.evaluate(() => document.documentElement.dataset.theme);
          if (applied !== activeTheme) {
            throw new Error(`theme did not apply: expected ${activeTheme}, got ${applied}`);
          }

          if (typeof frame.anchor === 'number') {
            await page.evaluate((y) => window.scrollTo(0, y), frame.anchor);
          } else {
            await page.evaluate((selector) => {
              const node = document.querySelector(selector);
              if (!node) return;
              const rect = node.getBoundingClientRect();
              window.scrollTo(0, Math.max(0, rect.top + window.scrollY - window.innerHeight * 0.3));
            }, frame.selector);
          }

          await page.waitForTimeout(360);
          await page.screenshot({ path: path.join(OUT, `${viewport.name}${suffix}--${frame.name}.png`) });
          report.push({ viewport: viewport.name, theme: activeTheme, frame: frame.name, status: 'ok' });
        } catch (error) {
          report.push({
            viewport: viewport.name,
            theme: activeTheme,
            frame: frame.name,
            status: 'failed',
            reason: String(error).split('\n')[0].slice(0, 140),
          });
        }
      }

      // AI concierge open state.
      try {
        await page.goto(`${BASE}/ar`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(280);
        await page.getByTestId('ai-launcher').click();
        await page.waitForTimeout(300);
        await page.getByTestId('ai-composer').fill('الأسعار كام؟');
        await page.getByTestId('ai-send').click();
        await page.getByTestId('ai-handoff-card').waitFor({ state: 'visible', timeout: 15_000 });
        await page.waitForTimeout(240);
        await page.getByTestId('ai-chat-panel').screenshot({
          path: path.join(OUT, `${viewport.name}${suffix}--ai-open.png`),
        });
        report.push({ viewport: viewport.name, theme: activeTheme, frame: 'ai-open', status: 'ok' });
      } catch (error) {
        report.push({
          viewport: viewport.name,
          theme: activeTheme,
          frame: 'ai-open',
          status: 'failed',
          reason: String(error).split('\n')[0].slice(0, 140),
        });
      }

      await context.close();
    }
}

await browser.close();
await writeFile(path.join(OUT, 'capture-report.json'), JSON.stringify(report, null, 2), 'utf8');

const failed = report.filter((entry) => entry.status === 'failed');
console.log(`\ncaptured ${report.length - failed.length}/${report.length}`);
for (const entry of failed) {
  console.log(`FAILED ${entry.viewport}/${entry.theme} ${entry.frame}: ${entry.reason}`);
}

process.exitCode = failed.length > 0 ? 1 : 0;