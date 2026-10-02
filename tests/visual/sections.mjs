/**
 * Section-level visual QA frames.
 *
 * Captures full viewport frames parked at each major section, which is what
 * actually has to be judged: composition, rhythm, contrast and spacing. Element
 * crops hide exactly the problems worth catching.
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const OUT = path.resolve('artifacts/visual/sections');

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 1000 },
  { name: 'laptop-1024', width: 1024, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const FRAMES = [
  { name: '01-hero', route: '/ar', anchor: 0 },
  { name: '02-trust', route: '/ar', selector: '[data-section="trust-rail"]' },
  { name: '03-brand', route: '/ar', selector: '#brand-heading' },
  { name: '04-poster-brand', route: '/ar', selector: '[data-poster="brand"]' },
  { name: '05-programs', route: '/ar', selector: '#programs-heading' },
  { name: '06-poster-technique', route: '/ar', selector: '[data-poster="technique"]' },
  { name: '07-method', route: '/ar', selector: '[data-testid="method-timeline"]' },
  { name: '08-poster-progress', route: '/ar', selector: '[data-poster="progress"]' },
  { name: '09-results', route: '/ar', selector: '[data-testid="progress-story"]' },
  { name: '10-poster-levels', route: '/ar', selector: '[data-poster="levels"]' },
  { name: '11-locations', route: '/ar', selector: '[data-testid="abu-dhabi-location-panel"]' },
  { name: '12-poster-abudhabi', route: '/ar', selector: '[data-poster="abu-dhabi"]' },
  { name: '13-faq', route: '/ar', selector: '#faq-teaser-heading' },
  { name: '14-ai-invite', route: '/ar', selector: '#ai-invite-heading' },
  { name: '15-poster-conversion', route: '/ar', selector: '[data-poster="conversion"]' },
  { name: '16-footer', route: '/ar', selector: 'footer' },

  { name: 'programs-page', route: '/ar/programs', selector: '#programs-heading' },
  { name: 'programs-skillpath', route: '/ar/programs', selector: '[data-testid="skill-path-selector"]' },
  { name: 'coach-page', route: '/ar/coach', selector: '[data-testid="coach-profile-card"]' },
  { name: 'coach-method', route: '/ar/coach', selector: '[data-testid="method-timeline"]' },
  { name: 'locations-page', route: '/ar/locations', selector: '[data-testid="abu-dhabi-location-panel"]' },
  { name: 'results-page', route: '/ar/results', selector: '[data-testid="verified-reviews"]' },
  { name: 'faq-page', route: '/ar/faq', selector: '[data-testid="faq-accordion"]' },
  { name: 'contact-hero', route: '/ar/contact', anchor: 0 },
  { name: 'contact-form', route: '/ar/contact', selector: '[data-testid="trial-request-form"]' },
  { name: 'contact-social', route: '/ar/contact', selector: '[data-testid="contact-unpublished"]' },
  { name: 'not-found', route: '/ar/nope', anchor: 0 },

  { name: 'en-hero', route: '/en', anchor: 0 },
  { name: 'en-programs', route: '/en', selector: '#programs-heading' },
  { name: 'en-poster', route: '/en', selector: '[data-poster="brand"]' },
  { name: 'en-contact-form', route: '/en/contact', selector: '[data-testid="trial-request-form"]' },
  { name: 'en-footer', route: '/en', selector: 'footer' },
];

const report = [];
const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.width < 500,
    hasTouch: viewport.width < 500,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  for (const frame of FRAMES) {
    try {
      await page.goto(`${BASE}${frame.route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(280);

      if (typeof frame.anchor === 'number') {
        await page.evaluate((y) => window.scrollTo(0, y), frame.anchor);
      } else {
        // Park the section in the middle of the viewport so context is visible.
        await page.evaluate((selector) => {
          const node = document.querySelector(selector);
          if (!node) return;
          const rect = node.getBoundingClientRect();
          const top = rect.top + window.scrollY - window.innerHeight * 0.34;
          window.scrollTo(0, Math.max(0, top));
        }, frame.selector);
      }

      await page.waitForTimeout(340);
      await page.screenshot({ path: path.join(OUT, `${viewport.name}--${frame.name}.png`) });
      report.push({ viewport: viewport.name, frame: frame.name, status: 'ok' });
    } catch (error) {
      report.push({
        viewport: viewport.name,
        frame: frame.name,
        status: 'failed',
        reason: String(error).split('\n')[0],
      });
    }
  }

  await context.close();
}

await browser.close();
await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2), 'utf8');

const failed = report.filter((entry) => entry.status === 'failed');
console.log(`frames: ${report.length - failed.length}/${report.length}`);
for (const entry of failed) console.log(`FAILED ${entry.viewport} ${entry.frame}: ${entry.reason}`);
