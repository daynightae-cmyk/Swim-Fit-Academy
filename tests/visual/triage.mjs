/**
 * Triage contact sheet.
 *
 * DEV-ONLY. Renders every downloaded reference as a labelled thumbnail so the
 * pack can be classified visually. The output lives in the gitignored
 * artifacts/ directory and is never shipped or referenced by the product.
 */
import { chromium } from '@playwright/test';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const REF_DIR = path.resolve('public/media/reference');
const OUT = path.resolve('artifacts/triage');

const files = (await readdir(REF_DIR)).filter((name) => /^ref-\d+\./.test(name)).sort((a, b) => a.localeCompare(b));

const dims = JSON.parse(
  await readFileSafe(path.join(REF_DIR, 'dimensions.json')),
);

function byFile(file) {
  return dims.find((entry) => entry.file === file) ?? { width: null, height: null };
}

async function readFileSafe(file) {
  try {
    const fs = await import('node:fs/promises');
    return await fs.readFile(file, 'utf8');
  } catch {
    return '[]';
  }
}

const cells = files
  .map((file) => {
    const info = byFile(file);
    return `<figure>
      <img src="/media/reference/${file}" alt="" loading="eager" />
      <figcaption><b>${file.replace(/\.(png|jpg)$/, '')}</b> · ${info.width}×${info.height}</figcaption>
    </figure>`;
  })
  .join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin:0; background:#0b0b0d; color:#fff; font:12px/1.3 system-ui, sans-serif; padding:16px; }
  h1 { font-size:15px; margin:0 0 14px; letter-spacing:.04em; text-transform:uppercase; color:#7ee6ff; }
  .grid { display:grid; grid-template-columns:repeat(6, 1fr); gap:12px; }
  figure { margin:0; background:#15151a; border:1px solid #26262e; border-radius:6px; overflow:hidden; }
  img { display:block; width:100%; height:150px; object-fit:contain; background:#000; }
  figcaption { padding:5px 7px; font-size:10px; color:#9aa; }
  b { color:#fff; }
</style></head><body>
  <h1>Swim Fit Academy — reference pack triage (${files.length} assets, dev-only)</h1>
  <div class="grid">${cells}</div>
</body></html>`;

await mkdir(OUT, { recursive: true });
const htmlFile = path.join(OUT, 'triage.html');
await writeFile(htmlFile, html, 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

// Serve the repo's public/ directory plus the generated html.
await page.route('**/*', async (route) => {
  const request = route.request();
  if (request.url().startsWith('file://')) return route.continue();
  return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
});

await page.route('**/media/reference/**', async (route) => {
  const name = path.basename(new URL(route.request().url()).pathname);
  const file = path.join(REF_DIR, name);
  const fs = await import('node:fs/promises');
  try {
    const bytes = await fs.readFile(file);
    const type = name.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    return route.fulfill({ status: 200, contentType: type, body: bytes });
  } catch {
    return route.fulfill({ status: 404, body: '' });
  }
});

await page.goto('http://triage.local/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const height = await page.evaluate(() => document.body.scrollHeight);
await page.setViewportSize({ width: 1600, height: Math.min(height + 40, 6000) });
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(OUT, 'triage-sheet.png'), fullPage: true });

await browser.close();
console.log(`triage sheet written: ${path.join(OUT, 'triage-sheet.png')}`);
