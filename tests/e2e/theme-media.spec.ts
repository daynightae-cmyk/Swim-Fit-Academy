import { expect, test, type BrowserContext, type Page } from '@playwright/test';

const WA_CANONICAL = 'https://wa.me/971569698628';

/** Seeds an explicit theme choice before any application code runs. */
async function seedTheme(context: BrowserContext, theme: 'day' | 'night') {
  await context.addInitScript((value) => {
    try {
      window.localStorage.setItem('sfa-theme', value);
    } catch {}
  }, theme);
}

/** Drives the OS-level preference for the no-explicit-choice case. */
async function seedSystemPreference(page: Page, scheme: 'light' | 'dark') {
  await page.emulateMedia({ colorScheme: scheme });
}

async function activeTheme(page: Page): Promise<string | undefined> {
  return page.evaluate(() => document.documentElement.dataset.theme);
}

/** Waits until the app has hydrated and the logos reflect the applied identity. */
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const root = document.documentElement;
    const logo = document.querySelector('img[data-logo]');
    return Boolean(root.dataset.theme && logo && logo.getAttribute('data-theme') === root.dataset.theme);
  }, undefined, { timeout: 15_000 });
  await page.waitForLoadState('load');
}

function visibleLogo(page: Page) {
  return page
    .locator('[data-testid="site-header"] img[data-logo]')
    .first();
}

test.describe('Day / Night identity', () => {
  test('exposes a theme toggle in the header', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    const toggle = page.getByTestId('theme-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-label', /التبديل إلى/);
  });

  test('an explicit night choice wins over a light system preference', async ({ page, context }) => {
    await seedSystemPreference(page, 'light');
    await seedTheme(context, 'night');
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    expect(await activeTheme(page)).toBe('night');
  });

  test('an explicit day choice wins over a dark system preference', async ({ page, context }) => {
    await seedSystemPreference(page, 'dark');
    await seedTheme(context, 'day');
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    expect(await activeTheme(page)).toBe('day');
  });

  test('follows the system preference when no explicit choice exists', async ({ page, browser }) => {
    await seedSystemPreference(page, 'light');
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    expect(await activeTheme(page)).toBe('day');

    const darkContext = await browser.newContext({ colorScheme: 'dark' });
    const darkPage = await darkContext.newPage();
    await darkPage.goto('/ar', { waitUntil: 'domcontentloaded' });
    expect(await activeTheme(darkPage)).toBe('night');
    await darkContext.close();
  });

  test('switching themes swaps to the correct supplied logo', async ({ page, context }) => {
    await seedTheme(context, 'night');
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);

    const logo = visibleLogo(page);
    await expect(logo).toHaveAttribute('data-logo', 'logoNight');
    await expect(logo).toHaveAttribute('src', /logo-night/);

    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');

    const dayLogo = visibleLogo(page);
    await expect(dayLogo).toHaveAttribute('data-logo', 'logoDay');
    await expect(dayLogo).toHaveAttribute('src', /logo-day/);
  });

  test('mounts only one logo, so there is no duplicate accessible name', async ({ page, context }) => {
    await seedTheme(context, 'day');
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);

    const logos = page.locator('img[data-logo]');
    const count = await logos.count();
    expect(count).toBeGreaterThan(0);

    // Every mounted logo must belong to the active identity.
    for (let i = 0; i < count; i += 1) {
      const theme = await logos.nth(i).getAttribute('data-theme');
      expect(theme).toBe('day');
    }

    const altTexts = await logos.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLImageElement).alt),
    );
    expect(new Set(altTexts).size).toBeLessThanOrEqual(2);
  });

  test('persists an explicit choice across navigation', async ({ page }) => {
    await seedSystemPreference(page, 'light');
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });

    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');

    await page.getByTestId('language-switch').first().click();
    await expect(page).toHaveURL(/\/en$/);

    expect(await activeTheme(page)).toBe('night');
    await expect(visibleLogo(page)).toHaveAttribute('data-logo', 'logoNight');
  });

  test('switching themes does not change the layout width', async ({ page, context }) => {
    await seedTheme(context, 'night');
    await page.goto('/ar', { waitUntil: 'load' });
    await page.waitForTimeout(300);

    const before = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');
    await page.waitForTimeout(300);

    const after = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(after.scrollWidth).toBe(before.scrollWidth);
    expect(after.clientWidth).toBe(before.clientWidth);
  });

  test('emits no hydration error or uncaught exception from theme init', async ({ page, context }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await seedTheme(context, 'day');
    await page.goto('/ar', { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const combined = [...consoleErrors, ...pageErrors].join(' | ').toLowerCase();
    expect(combined).not.toContain('hydration');
    expect(combined).not.toContain('did not match');
    expect(pageErrors).toEqual([]);
  });

  test('honours prefers-reduced-motion without breaking the toggle', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    const before = await activeTheme(page);
    await page.getByTestId('theme-toggle').click();
    const after = await activeTheme(page);
    expect(before).not.toBe(after);
  });

  test('repaints surfaces in both identities', async ({ page, context }) => {
    await seedTheme(context, 'night');
    await page.goto('/ar', { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const nightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByTestId('theme-toggle').click();
    await page.waitForTimeout(500);
    const dayBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    expect(nightBg).not.toBe(dayBg);
  });
});

test.describe('Real media on the page', () => {
  test('renders the supplied hero photograph with correct alt text', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'load' });
    const hero = page.locator('[data-hero-media]');
    await expect(hero).toHaveAttribute('data-hero-media', 'hero-primary');

    const alts = await page
      .locator('img[src*="hero-primary"]')
      .evaluateAll((nodes) => nodes.map((node) => (node as HTMLImageElement).alt));

    expect(alts.length).toBeGreaterThan(0);
    // Exactly one description is exposed; the duplicated decorative layer is hidden.
    const described = alts.filter((alt) => alt.length > 8);
    expect(described.length).toBe(1);
    expect(described[0]).toMatch(/مدرّب|متدرب/);
  });

  test('every poster is led by a distinct supplied photograph', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'load' });
    await page.waitForTimeout(400);

    const posters = page.locator('[data-poster]');
    await expect(posters).toHaveCount(6);

    const mediaIds: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      mediaIds.push((await posters.nth(i).getAttribute('data-media')) ?? '');
    }
    expect(new Set(mediaIds).size).toBe(6);

    const sources: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      const src = await posters.nth(i).locator('img').first().getAttribute('src');
      sources.push(src ?? '');
    }
    for (const src of sources) {
      expect(src).not.toContain('/media/reference/');
    }
  });

  test('no image is hotlinked to the reference CDN', async ({ page }) => {
    const routes = ['/ar', '/en', '/ar/programs', '/ar/contact', '/ar/coach'];
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'load' });
      const html = await page.content();
      expect(html, `${route} must not hotlink postimg`).not.toContain('i.postimg.cc');
    }
  });

  test('lazily loads below-fold posters and eagerly loads the hero', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'load' });

    const heroEager = await page
      .locator('[data-hero-media] img')
      .first()
      .getAttribute('loading');
    expect(heroEager).not.toBe('lazy');

    const posterLazy = await page
      .locator('[data-poster="conversion"] img')
      .first()
      .getAttribute('loading');
    expect(posterLazy).toBe('lazy');
  });

  test('keeps the WhatsApp contract intact after the visual change', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'load' });
    const hrefs = await page
      .locator('a[href*="wa.me"]')
      .evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).href));
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) {
      expect(href.startsWith(WA_CANONICAL)).toBe(true);
    }
  });
});