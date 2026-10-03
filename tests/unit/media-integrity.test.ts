import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  allMedia,
  badgeForTheme,
  logoForTheme,
  media,
  REJECTED_REFERENCES,
  type MediaAsset,
} from '@/content/media';

const PUBLIC_DIR = path.resolve('public');
const SRC_DIR = path.resolve('src');
const MANIFEST = path.resolve('src', 'content', 'media.ts');

function fileExists(publicPath: string): boolean {
  return existsSync(path.join(PUBLIC_DIR, publicPath.replace(/^\//, '')));
}

function collectSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectSourceFiles(full, out);
    else if (/\.(ts|tsx|mjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Strips comments so documentation text cannot trip a real-code assertion. */
function codeOnly(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.replace(/(^|\s)\/\/.*$/, '$1'))
    .join('\n');
}

describe('media manifest', () => {
  it('ships a hero, a day logo and a night logo', () => {
    expect(media.heroPrimary).toBeDefined();
    expect(logoForTheme('day')).toBeDefined();
    expect(logoForTheme('night')).toBeDefined();
  });

  it('uses a genuinely different asset per theme', () => {
    const day = logoForTheme('day');
    const night = logoForTheme('night');
    expect(day.src).not.toBe(night.src);
    expect(day.theme).toBe('day');
    expect(night.theme).toBe('night');
    expect(badgeForTheme('day').src).not.toBe(badgeForTheme('night').src);
  });

  it('resolves every referenced local file', () => {
    const missing = allMedia()
      .filter((asset) => !fileExists(asset.src))
      .map((asset) => `${asset.id} -> ${asset.src}`);
    expect(missing).toEqual([]);
  });

  it('marks only visually inspected assets as verified', () => {
    for (const asset of allMedia()) {
      expect(asset.verified, `${asset.id} must be verified`).toBe(true);
      expect(asset.referenceFile, `${asset.id} must name its reference`).toMatch(/^ref-\d+\./);
      expect(asset.sourceUrl, `${asset.id} must name its source URL`).toMatch(/^https:\/\//);
    }
  });

  it('gives every asset bilingual alt text, a focal point and notes', () => {
    for (const asset of allMedia()) {
      expect(asset.altAr.length, `${asset.id} altAr`).toBeGreaterThan(8);
      expect(asset.altEn.length, `${asset.id} altEn`).toBeGreaterThan(8);
      expect(asset.focalPoint, `${asset.id} focalPoint`).toMatch(/^\d+% \d+%$/);
      expect(asset.notes.length, `${asset.id} notes`).toBeGreaterThan(20);
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
    }
  });

  it('never hotlinks the CDN from runtime code', () => {
    // The manifest itself records provenance URLs by design; no other module
    // may reference the image host.
    const offenders: string[] = [];

    for (const file of collectSourceFiles(SRC_DIR)) {
      if (path.resolve(file) === MANIFEST) continue;
      const code = codeOnly(readFileSync(file, 'utf8'));
      if (code.includes('i.postimg.cc')) {
        offenders.push(path.relative(process.cwd(), file));
      }
    }

    expect(offenders).toEqual([]);
  });

  it('never serves a production asset from the reference folder', () => {
    const offenders = collectSourceFiles(SRC_DIR)
      .filter((file) => path.resolve(file) !== MANIFEST)
      .filter((file) => readFileSync(file, 'utf8').includes('/media/reference/'))
      .map((file) => path.relative(process.cwd(), file));

    expect(offenders).toEqual([]);
  });

  it('ships every asset from a stable production path', () => {
    for (const asset of allMedia()) {
      expect(asset.src, `${asset.id} src`).toMatch(/^\/media\/(brand|hero|posters|sections)\//);
      expect(asset.src, `${asset.id} src`).not.toContain('/reference/');
    }
  });

  it('promotes no asset that implies an award or a medal', () => {
    // ref-08 shows a child wearing a medal. Promoting it would assert an
    // achievement the academy has never confirmed.
    expect(media.resultsVisual.referenceFile).not.toBe('ref-08.png');
    expect(media.heroPrimary.referenceFile).not.toBe('ref-08.png');
  });

  it('promotes no asset with baked-in marketing copy or signage', () => {
    const banned = new Set([
      'ref-11.png', 'ref-12.png',
      'ref-15.png', 'ref-16.png', 'ref-17.png', 'ref-18.png',
      'ref-19.png', 'ref-20.png', 'ref-21.png', 'ref-22.png',
      'ref-23.png', 'ref-24.png', 'ref-25.png', 'ref-26.png',
      'ref-27.png', 'ref-28.png', 'ref-29.png', 'ref-30.png',
      'ref-31.png', 'ref-32.png', 'ref-33.png', 'ref-34.png',
      'ref-35.png', 'ref-36.png',
      'ref-39.png', 'ref-40.png', 'ref-41.png',
    ]);

    for (const asset of allMedia()) {
      expect(
        banned.has(asset.referenceFile),
        `${asset.id} must not use a baked-text reference`,
      ).toBe(false);
    }
  });

  it('documents every reference it declined to promote', () => {
    expect(REJECTED_REFERENCES.length).toBeGreaterThan(20);
    for (const rejected of REJECTED_REFERENCES) {
      expect(rejected.referenceFile).toMatch(/^ref-\d+\./);
      expect(rejected.reason.length).toBeGreaterThan(40);
    }
  });

  it('covers the whole downloaded pack across used and rejected sets', () => {
    const downloaded = readdirSync(path.join(PUBLIC_DIR, 'media', 'reference')).filter((name) =>
      /^ref-\d+\./.test(name),
    );
    const used = new Set(allMedia().map((asset) => asset.referenceFile));
    const rejected = new Set(REJECTED_REFERENCES.map((entry) => entry.referenceFile));
    const uncovered = downloaded.filter((file) => !used.has(file) && !rejected.has(file));
    expect(uncovered).toEqual([]);
  });

  it('gives each poster a distinct photograph', () => {
    const posterAssets: MediaAsset[] = [
      media.posterBrand,
      media.posterTechnique,
      media.posterProgress,
      media.posterAllLevels,
      media.posterAbuDhabi,
      media.posterConversion,
    ];
    expect(new Set(posterAssets.map((asset) => asset.src)).size).toBe(6);
    expect(new Set(posterAssets.map((asset) => asset.grade ?? '')).size).toBeGreaterThanOrEqual(4);
  });
});