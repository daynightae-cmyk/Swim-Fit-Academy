/**
 * Logo cropping.
 *
 * The supplied lockups are 800x800 files with generous padding around the mark,
 * so simply scaling the whole file makes the wordmark unreadable at header size.
 * This measures the opaque content of each asset and re-exports a tight crop.
 *
 * Crops are derived assets: the untouched originals stay in
 * public/media/reference/ and public/media/brand/.
 */
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const BRAND_DIR = path.resolve('public/media/brand');
await mkdir(BRAND_DIR, { recursive: true });

const TARGETS = [
  { file: 'logo-night.png', out: 'logo-night-tight.png', pad: 6 },
  { file: 'logo-day.png', out: 'logo-day-tight.png', pad: 6 },
  { file: 'logo-night-badge.png', out: 'logo-night-badge-tight.png', pad: 0 },
  { file: 'logo-day-badge.png', out: 'logo-day-badge-tight.png', pad: 0 },
];

const browser = await chromium.launch();
const page = await browser.newPage();

const results = [];

for (const target of TARGETS) {
  const bytes = await readFile(path.join(BRAND_DIR, target.file));
  const dataUrl = `data:image/png;base64,${bytes.toString('base64')}`;

  const box = await page.evaluate(
    async ([src, pad]) => {
      const image = new Image();
      image.src = src;
      await image.decode();

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, 0, 0);

      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = (x, y) => {
        const i = (y * canvas.width + x) * 4;
        return [data[i], data[i + 1], data[i + 2], data[i + 3]];
      };

      // Background is sampled from all four corners and averaged, which works
      // for both the white day field and the navy night field.
      const corners = [
        px(0, 0),
        px(canvas.width - 1, 0),
        px(0, canvas.height - 1),
        px(canvas.width - 1, canvas.height - 1),
      ];
      const bg = [
        Math.round(corners.reduce((s, c) => s + c[0], 0) / 4),
        Math.round(corners.reduce((s, c) => s + c[1], 0) / 4),
        Math.round(corners.reduce((s, c) => s + c[2], 0) / 4),
      ];

      const threshold = 26;
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          const [r, g, b] = px(x, y);
          const distance =
            Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]);
          if (distance > threshold) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const left = Math.max(0, minX - pad);
      const top = Math.max(0, minY - pad);
      const width = Math.min(canvas.width - left, maxX - minX + 1 + pad * 2);
      const height = Math.min(canvas.height - top, maxY - minY + 1 + pad * 2);

      // Re-render the crop.
      const out = document.createElement('canvas');
      out.width = width;
      out.height = height;
      const outCtx = out.getContext('2d');
      outCtx.drawImage(image, left, top, width, height, 0, 0, width, height);

      return {
        dataUrl: out.toDataURL('image/png'),
        width,
        height,
        background: bg,
      };
    },
    [dataUrl, target.pad],
  );

  const png = Buffer.from(box.dataUrl.split(',')[1], 'base64');
  await writeFile(path.join(BRAND_DIR, target.out), png);

  results.push({
    file: target.out,
    width: box.width,
    height: box.height,
    ratio: Number((box.width / box.height).toFixed(3)),
    bytes: png.length,
  });
  console.log(
    `${target.file} -> ${target.out}: ${box.width}x${box.height} (ratio ${(box.width / box.height).toFixed(3)}), ${(png.length / 1024).toFixed(1)}kb`,
  );
}

await browser.close();
await writeFile(path.join(BRAND_DIR, 'tight-dimensions.json'), JSON.stringify(results, null, 2), 'utf8');
console.log(`\ncropped ${results.length} logo assets`);