import { expect, test, type Page } from '@playwright/test';

export const WA_CANONICAL = 'https://wa.me/971569698628';
export const TEL_CANONICAL = 'tel:+971569698628';

export const AR_ROUTES = [
  '/ar',
  '/ar/programs',
  '/ar/coach',
  '/ar/locations',
  '/ar/results',
  '/ar/faq',
  '/ar/contact',
] as const;

export const EN_ROUTES = [
  '/en',
  '/en/programs',
  '/en/coach',
  '/en/locations',
  '/en/results',
  '/en/faq',
  '/en/contact',
] as const;

/** Collects console errors and uncaught page exceptions for a journey. */
export function watchRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  return errors;
}

/** No visual regression may introduce horizontal overflow. */
export async function expectNoHorizontalOverflow(page: Page) {
  const result = await page.evaluate(() => {
    const doc = document.documentElement;

    /** True when an ancestor clips horizontally, so the child cannot create a scrollbar. */
    const isClipped = (el: Element): boolean => {
      let node: Element | null = el.parentElement;
      while (node && node !== doc) {
        const style = getComputedStyle(node);
        if (
          style.overflowX === 'hidden' ||
          style.overflowX === 'clip' ||
          style.overflowX === 'auto' ||
          style.overflowX === 'scroll'
        ) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    const offenders = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .filter((el) => {
        if (el.tagName.toLowerCase() === 'svg' || el.closest('svg')) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        if (rect.right <= doc.clientWidth + 1 && rect.left >= -1) return false;
        return !isClipped(el);
      })
      .slice(0, 6)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') ?? '').slice(0, 50)}`);

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders,
    };
  });

  // The authoritative signal: the document must not scroll horizontally.
  expect(
    result.scrollWidth,
    `documentElement.scrollWidth ${result.scrollWidth} > clientWidth ${result.clientWidth}; offenders: ${result.offenders.join(', ')}`,
  ).toBeLessThanOrEqual(result.clientWidth + 1);
  expect(result.offenders, `overflowing elements: ${result.offenders.join(', ')}`).toEqual([]);
}

export async function expectSingleH1(page: Page) {
  await expect(page.locator('h1')).toHaveCount(1);
}

test.describe('Homepage', () => {
  test('Arabic homepage loads with correct document direction and hero copy', async ({ page }) => {
    const errors = watchRuntimeErrors(page);
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(/Swim Fit Academy Abu Dhabi/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar-AE');

    const h1 = page.locator('h1#hero-heading');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('اتعلّم.');
    await expect(h1).toContainText('تطوّر.');
    await expect(h1).toContainText('اتألّق.');
    await expect(page.getByRole('link', { name: /ابدأ على واتساب/ })).toBeVisible();

    await expectSingleH1(page);
    expect(errors).toEqual([]);
  });

  test('English homepage loads with LTR and English hero copy', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Swim Fit Academy Abu Dhabi/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-AE');
    const h1 = page.locator('h1#hero-heading');
    await expect(h1).toContainText('Learn.');
    await expect(h1).toContainText('Progress.');
    await expect(h1).toContainText('Shine.');
    await expectSingleH1(page);
  });

  test('root redirects into the Arabic default experience', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/ar$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar-AE');
  });

  test('renders all six wide posters with real DOM headlines', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-poster]')).toHaveCount(6);
    const headlines = [
      'الماء يبدأ بالحركة. والثقة تبدأ بالتدريب.',
      'من أول نفس جانبي… لسباحة واثقة.',
      'كل حركة محسوبة. كل تقدّم له معنى.',
      'ابدأ من مستواك. وتقدّم بطريقتك.',
      'تدريب سباحة في أبوظبي. والتفاصيل الدقيقة نأكدها معك مباشرة.',
      'جاهز تبدأ؟',
    ];
    for (const headline of headlines) {
      await expect(page.getByRole('heading', { name: headline })).toBeAttached();
    }
  });

  test('no horizontal overflow at 390px', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await expectNoHorizontalOverflow(page);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe('Routing', () => {
  for (const route of AR_ROUTES) {
    test(`responds successfully: ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  for (const route of EN_ROUTES) {
    test(`responds successfully: ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  test('language switch preserves the current route', async ({ page }) => {
    await page.goto('/ar/programs', { waitUntil: 'domcontentloaded' });
    await page.getByTestId('language-switch').first().click();
    await expect(page).toHaveURL(/\/en\/programs$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    await page.getByTestId('language-switch').first().click();
    await expect(page).toHaveURL(/\/ar\/programs$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('unknown routes return a designed 404 with a way back', async ({ page }) => {
    const response = await page.goto('/ar/does-not-exist', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(404);
    await expect(page.getByText('خرجت من المسار')).toBeVisible();
    await expect(page.getByRole('link', { name: /العودة للرئيسية/ })).toBeVisible();
  });
});

test.describe('Conversion', () => {
  test('every WhatsApp CTA points at the canonical wa.me number', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'load' });
    const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLAnchorElement).href),
    );
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) {
      expect(href.startsWith(`${WA_CANONICAL}`)).toBe(true);
    }
  });

  test('every phone CTA uses tel:+971569698628', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'load' });
    const hrefs = await page.locator('a[href^="tel:"]').evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')),
    );
    expect(hrefs.length).toBeGreaterThan(1);
    for (const href of hrefs) {
      expect(href).toBe(TEL_CANONICAL);
    }
  });

  test('trial form builds the expected WhatsApp handoff', async ({ page }) => {
    await page.goto('/ar/contact', { waitUntil: 'domcontentloaded' });

    await page.getByLabel('الاسم').fill('سارة');
    await page.getByLabel('رقم الجوال').fill('0501234567');
    await page.getByLabel('المتدرب').selectOption('child');
    await page.getByLabel('المستوى الحالي').selectOption('none');
    await page.getByLabel('لغة التواصل').selectOption('arabic');
    await page.getByLabel(/أوافق على التواصل/).check();

    // Submit without blocking the popup so the local success state is observable.
    await page.evaluate(() => {
      (window as unknown as { open: unknown }).open = () => null;
    });
    await page.getByTestId('trial-form-submit').click();

    const success = page.getByTestId('trial-form-success');
    await expect(success).toBeVisible();

    const href = await success.locator('a[href*="wa.me"]').first().getAttribute('href');
    expect(href).toBeTruthy();
    expect(href!.startsWith(`${WA_CANONICAL}?text=`)).toBe(true);

    const decoded = decodeURIComponent(href!.split('?text=')[1]!);
    expect(decoded).toContain('الاسم: سارة');
    expect(decoded).toContain('المتدرب: طفل');
    expect(decoded).toContain('لغة التواصل: العربية');
  });

  test('form errors preserve entered values and offer a direct fallback', async ({ page }) => {
    await page.goto('/ar/contact', { waitUntil: 'domcontentloaded' });
    await page.getByLabel('الاسم').fill('سارة');
    await page.getByTestId('trial-form-submit').click();

    await expect(page.getByText('اكتب رقم الجوال من فضلك.').first()).toBeVisible();
    await expect(page.getByLabel('الاسم')).toHaveValue('سارة');
    await expect(page.getByTestId('trial-form-error')).toBeVisible();
    await expect(page.getByTestId('trial-form-error').locator('a[href*="wa.me"]')).toBeVisible();
  });
});

test.describe('AI concierge', () => {
  test('opens, answers with the local fallback, and hands off without a key', async ({ page }) => {
    const errors = watchRuntimeErrors(page);
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });

    await page.getByTestId('ai-launcher').click();
    const panel = page.getByTestId('ai-chat-panel');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('dialog')).toBeVisible();

    await panel.getByTestId('ai-composer').fill('الأسعار كام؟');
    await panel.getByTestId('ai-send').click();

    // The deterministic local responder answers and appends a handoff card.
    await expect(page.getByTestId('ai-handoff-card')).toBeVisible({ timeout: 15_000 });
    await expect(panel).toContainText('تحتاج تأكيد مباشر');

    const handoffHref = await page
      .getByTestId('ai-handoff-card')
      .locator('a[href*="wa.me"]')
      .getAttribute('href');
    expect(handoffHref!.startsWith(WA_CANONICAL)).toBe(true);

    expect(errors).toEqual([]);
  });

  test('closes on Escape', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await page.getByTestId('ai-launcher').click();
    await expect(page.getByTestId('ai-chat-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('ai-chat-panel')).toHaveCount(0);
  });

  test('answers a known fact without inventing detail', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await page.getByTestId('ai-launcher').click();
    const panel = page.getByTestId('ai-chat-panel');
    await panel.getByTestId('ai-composer').fill('إيه رقم تليفونكم؟');
    await panel.getByTestId('ai-send').click();
    await expect(panel).toContainText('056 969 8628', { timeout: 15_000 });
    await expect(page.getByTestId('ai-handoff-card')).toHaveCount(0);
  });

  test('never exposes API key state to visitors', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    expect(html).not.toContain('GEMINI_API_KEY');
    expect(html).not.toContain('AI MODE:');
  });
});

test.describe('Content truth', () => {
  test('publishes no invented commercial or social-proof claims', async ({ page }) => {
    for (const route of ['/ar', '/ar/faq', '/ar/results', '/ar/locations', '/ar/coach']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const text = (await page.locator('body').innerText()).toLowerCase();
      for (const term of [
        'aed',
        'درهم',
        '5 stars',
        'aggregateRating',
        'priceRange',
        'openingHours',
        'streetAddress',
        'top rated',
        'award',
      ]) {
        expect(text, `${route} must not contain "${term}"`).not.toContain(term);
      }
    }
  });

  test('renders only supported structured data', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.length).toBeGreaterThan(0);
    const parsed = JSON.parse(jsonLd.join('\n')) as Record<string, unknown>;
    const serialised = JSON.stringify(parsed);
    expect(serialised).toContain('SwimmingSchool');
    expect(serialised).toContain('Abu Dhabi');
    for (const key of [
      'aggregateRating',
      'review',
      'priceRange',
      'openingHours',
      'streetAddress',
      'geo',
      'award',
    ]) {
      expect(serialised, `structured data must not contain ${key}`).not.toContain(`"${key}"`);
    }
    expect(serialised).not.toContain('instagram.com');
  });

  test('sitemap and robots are served', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const body = await sitemap.text();
    expect(body).toContain('/ar');
    expect(body).toContain('/en/contact');

    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap');
  });

  test('declares hreflang alternates for both locales', async ({ page }) => {
    await page.goto('/ar/programs', { waitUntil: 'domcontentloaded' });

    // Read attributes through the DOM rather than a CSS selector: Next emits
    // `hrefLang`, and HTML attribute names are case-insensitive.
    const alternates = await page.locator('link[rel="alternate"]').evaluateAll((nodes) =>
      nodes.map((node) => ({
        lang: node.getAttribute('hreflang') ?? node.getAttribute('hrefLang') ?? '',
        href: node.getAttribute('href') ?? '',
      })),
    );

    const byLang = Object.fromEntries(alternates.map((entry) => [entry.lang, entry.href]));
    expect(byLang.ar).toMatch(/\/ar\/programs$/);
    expect(byLang.en).toMatch(/\/en\/programs$/);
    expect(byLang['x-default']).toMatch(/\/ar$/);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ar\/programs$/);
  });

  test('exposes conservative Open Graph metadata', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Swim Fit Academy/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'ar_AE');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });
});

test.describe('Accessibility', () => {
  test('exposes a skip link, one main landmark and a labelled footer', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'تخطَّ إلى المحتوى' })).toHaveCount(1);
  });

  test('decorative art is hidden from assistive technology', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    const exposedSvgs = await page.locator('svg:not([aria-hidden="true"])').evaluateAll((nodes) =>
      nodes
        .filter((node) => !node.querySelector('title'))
        .map((node) => {
          const svg = node as SVGElement;
          return `${svg.tagName.toLowerCase()}.${svg.getAttribute('class') ?? ''}`;
        }),
    );
    // Only brand marks that carry a <title> may be exposed to assistive technology.
    expect(exposedSvgs).toEqual([]);
  });

  test('keyboard focus reaches the primary CTA', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus-visible, :focus');
    await expect(focused.first()).toBeVisible();
    const outline = await page
      .locator(':focus')
      .first()
      .evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
  });

  test('mobile menu opens, traps focus and closes with Escape', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    const trigger = page.getByTestId('mobile-menu-button');
    test.skip(!(await trigger.isVisible()), 'mobile menu trigger is hidden on this viewport');

    await trigger.click();
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
    await expect(page.getByTestId('mobile-menu')).toHaveAttribute('aria-modal', 'true');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('mobile-menu')).toHaveCount(0);
  });
});

test.describe('Responsive behaviour', () => {
  test('mobile keeps identity, CTA and phone within the first viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('header-whatsapp')).toBeVisible();

    const whatsapp = page.getByRole('link', { name: 'ابدأ على واتساب' }).first();
    await expect(whatsapp).toBeInViewport();

    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(400);
    await expect(page.getByTestId('sticky-whatsapp')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('mobile chat panel does not cover the sticky CTA when closed', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(300);
    await expect(page.getByTestId('ai-chat-panel')).toHaveCount(0);
    const stickyBox = await page.getByTestId('sticky-whatsapp').boundingBox();
    const launcherBox = await page.getByTestId('ai-launcher').boundingBox();
    expect(stickyBox).not.toBeNull();
    expect(launcherBox).not.toBeNull();
    // The launcher must sit above the sticky bar, never on top of it.
    expect(launcherBox!.y).toBeLessThan(stickyBox!.y);
  });
});
