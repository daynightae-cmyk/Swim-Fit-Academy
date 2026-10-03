/**
 * Crop probe.
 *
 * DEV-ONLY. Renders each candidate photograph cropped to a wide cinematic band so
 * the crop can be judged by eye before it is committed to the design.
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const REF_DIR = path.resolve('public/media/reference');
const OUT = path.resolve('artifacts/triage');

/** Candidate → the vertical band of the 640x800 frame that survives a 21:9 crop. */
const CANDIDATES = [
  { file: 'ref-09.png', band: [0.14, 0.86], label: 'ref-09 split-level' },
  { file: 'ref-05.png', band: [0.2, 0.8], label: 'ref-05 splash' },
  { file: 'ref-03.png', band: [0.24, 0.82], label: 'ref-03 reflection' },
  { file: 'ref-07.png', band: [0.22, 0.84], label: 'ref-07 group' },
  { file: 'ref-01.png', band: [0.16, 0.82], label: 'ref-01 wide pool' },
  { file: 'ref-10.png', band: [0.12, 0.86], label: 'ref-10 warm' },
  { file: 'ref-02.png', band: [0.18, 0.84], label: 'ref-02 kickboard' },
  { file: 'ref-04.png', band: [0.2, 0.86], label: 'ref-04 group rear' },
  { file: 'ref-06.png', band: [0.12, 0.9], label: 'ref-06 poolside talk' },
  { file: 'ref-27.png', band: [0.14, 0.98], label: 'ref-27 approach (baked signage)' },
];

await mkdir(OUT, { recursive: true });

const cells = CANDIDATES.map((c) => {
  const [top, bottom] = c.band;
  const pct = ((bottom - top) * 100).toFixed(1);
  const topPct = (top * 100).toFixed(1);
  return `<figure>
    <div class="crop">
      <img src="/media/reference/${c.file}" alt=""
        style="width:100%; position:absolute; left:0; top:${topPct}%; transform:translateY(-${topPct}%); height:auto;" />
    </div>
    <figcaption><b>${c.label}</b> · band ${topPct}%–${bottom}% (${pct}% tall)</figcaption>
  </figure>`;
}).join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#08080a;color:#fff;font:12px system-ui;padding:16px}
  h1{font-size:14px;color:#7ee6ff;margin:0 0 14px;text-transform:uppercase;letter-spacing:.05em}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  figure{margin:0;background:#111;border:1px solid #2a2a32;border-radius:6px;overflow:hidden}
  .crop{position:relative;width:100%;aspect-ratio:21/9;overflow:hidden;background:#000}
  figcaption{padding:6px 8px;font-size:10px;color:#9aa}
  b{color:#fff}
</style></head><body>
  <h1>Wide-crop probe — 21:9 bands from the clean photographic set (dev-only)</h1>
  <div class="grid">${cells}</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1200 } });

await page.route('**/media/reference/**', async (route) => {
  const name = path.basename(new URL(route.request().url()).pathname);
  try {
    const bytes = await readFile(path.join(REF_DIR, name));
    const type = name.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    return route.fulfill({ status: 200, contentType: type, body: bytes });
  } catch {
    return route.fulfill({ status: 404, body: '' });
  }
});

await page.route('**/*', async (route) => {
  if (route.request().url().includes('/media/reference/')) return route.fallback();
  return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
});

await page.goto('http://probe.local/', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);

const height = await page.evaluate(() => document.body.scrollHeight);
await page.setViewportSize({ width: 1500, height: Math.min(height + 30, 4000) });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, 'crop-probe.png'), fullPage: true });
await writeFile(path.join(OUT, 'crop-probe.html'), html, 'utf8');

await browser.close();
console.log('crop probe written');