import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

/**
 * Promotes the visually-verified references into stable production paths.
 *
 * Only assets that were opened and judged are promoted. The originals stay in
 * public/media/reference/ so the manifest stays auditable; production code never
 * points at that folder.
 *
 * Cropping, focal positioning and grading stay in CSS (object-position, filter)
 * rather than being baked into files, so nothing is destructively re-encoded and
 * next/image can still produce AVIF/WebP derivatives.
 */

const REFERENCE_DIR = path.resolve('public/media/reference');
const PRODUCTION_DIRS = [
  'public/media/brand',
  'public/media/hero',
  'public/media/posters',
  'public/media/sections',
];

/** source reference -> production destination (relative to public/) */
const PROMOTIONS = [
  // Real supplied logo pair. Confirmed by opening both files.
  ['ref-14.png', 'public/media/brand/logo-day-badge.png'],
  ['ref-13.png', 'public/media/brand/logo-night-badge.png'],
  ['ref-38.jpg', 'public/media/brand/logo-day.png'],
  ['ref-37.jpg', 'public/media/brand/logo-night.png'],

  // Hero: split-level half-underwater frame. Cinematic, no baked text.
  ['ref-09.png', 'public/media/hero/hero-primary.png'],

  // Poster fragments and section imagery, chosen from the clean photographic set.
  ['ref-05.png', 'public/media/posters/technique.png'],
  ['ref-03.png', 'public/media/posters/progress.png'],
  ['ref-07.png', 'public/media/posters/all-levels.png'],
  ['ref-01.png', 'public/media/posters/abu-dhabi.png'],
  ['ref-10.png', 'public/media/posters/conversion.png'],
  ['ref-02.png', 'public/media/posters/brand.png'],
  ['ref-04.png', 'public/media/sections/method.png'],
  ['ref-06.png', 'public/media/sections/coach.png'],
];

await Promise.all(PRODUCTION_DIRS.map((dir) => mkdir(dir, { recursive: true })));

const promoted = [];
for (const [source, destination] of PROMOTIONS) {
  const from = path.join(REFERENCE_DIR, source);
  const to = path.resolve(destination);
  try {
    await copyFile(from, to);
    const info = await stat(to);
    promoted.push({ source: `public/media/reference/${source}`, destination, bytes: info.size });
    console.log(`promoted ${source} -> ${destination} (${(info.size / 1024).toFixed(0)}kb)`);
  } catch (error) {
    console.error(`FAILED ${source}: ${String(error)}`);
    process.exitCode = 1;
  }
}

console.log(`\npromoted ${promoted.length}/${PROMOTIONS.length} production assets`);