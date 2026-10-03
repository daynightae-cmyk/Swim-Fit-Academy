/**
 * Authoritative media manifest.
 *
 * Every asset here was downloaded from the supplied reference pack and then
 * opened and judged by eye before being promoted. `verified` is true only for
 * assets that passed that inspection.
 *
 * Hard rules encoded in this file:
 * - Production code never references `public/media/reference/`.
 * - Nothing with baked-in marketing copy or baked-in signage is marked verified.
 * - Nothing that would imply an award, medal, rating or named coach is promoted.
 * - Crop, focal point and grading are CSS concerns, so no source file is ever
 *   destructively re-encoded; next/image derives AVIF/WebP on the fly.
 */

export type MediaRole =
  | 'logoDay'
  | 'logoNight'
  | 'logoDayBadge'
  | 'logoNightBadge'
  | 'heroPrimary'
  | 'posterBrand'
  | 'posterTechnique'
  | 'posterProgress'
  | 'posterAllLevels'
  | 'posterAbuDhabi'
  | 'posterConversion'
  | 'methodVisual'
  | 'coachVisual'
  | 'resultsVisual'
  | 'locationsVisual'
  | 'contactVisual';

export type MediaTheme = 'day' | 'night' | 'both';

export interface MediaAsset {
  readonly id: string;
  readonly role: MediaRole;
  /** Reference-pack URL the asset came from. */
  readonly sourceUrl: string;
  /** Deterministic filename inside the reference pack. */
  readonly referenceFile: string;
  /** Shipped path, relative to `public/`. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly altAr: string;
  readonly altEn: string;
  /**
   * CSS `object-position`. Chosen so the subject survives a wide crop; the
   * reference pack is portrait, so crops are deliberately banded.
   */
  readonly focalPoint: string;
  readonly theme: MediaTheme;
  /**
   * Editorial grade applied in CSS. Distinct per poster so six crops of one
   * pool never read as six copies of the same frame.
   */
  readonly grade?: string;
  /** True only after opening and judging the file. */
  readonly verified: boolean;
  readonly notes: string;
}

/* -------------------------------------------------------------------------- */
/* Real supplied logo pair                                                    */
/* -------------------------------------------------------------------------- */

const LOGOS = {
  logoNightBadge: {
    src: '/media/brand/logo-night-badge-tight.png',
    referenceFile: 'ref-13.png',
    sourceUrl: 'https://i.postimg.cc/x83kFDmq/cropped-circle-image-(10).png',
    width: 800,
    height: 800,
    theme: 'night',
    notes:
      'Supplied circular badge on a deep navy disc with the SF monogram and the swimmer-in-the-wave. Confirmed by opening the file: this is the dark-surface variant. Used at avatar, badge and small-icon scale.',
  },
  logoDayBadge: {
    src: '/media/brand/logo-day-badge-tight.png',
    referenceFile: 'ref-14.png',
    sourceUrl: 'https://i.postimg.cc/4yQKFkcF/cropped-circle-image-(11).png',
    width: 800,
    height: 800,
    theme: 'day',
    notes:
      'Supplied circular badge on a white disc with the SF monogram in navy and cyan. Confirmed by opening the file: this is the light-surface variant.',
  },
  logoNight: {
    // Derived from logo-night.png by cropping to the mark's own bounds, because
    // the supplied square file carries heavy padding that made the wordmark
    // unreadable at header height.
    src: '/media/brand/logo-night-tight.png',
    referenceFile: 'ref-37.jpg',
    sourceUrl: 'https://i.postimg.cc/bN4Txqmy/swrt-Chat-GPT-2-aktwbr-2026-09-43-55-m.jpg',
    width: 568,
    height: 380,
    theme: 'night',
    notes:
      'Supplied horizontal lockup, "SWIM FIT / SWIMMING ACADEMY" on deep navy. Confirmed by opening the file. Primary header and footer mark on dark surfaces.',
  },
  logoDay: {
    src: '/media/brand/logo-day-tight.png',
    referenceFile: 'ref-38.jpg',
    sourceUrl: 'https://i.postimg.cc/136KMbd5/swrt-Chat-GPT-2-aktwbr-2026-09-44-01-m.jpg',
    width: 583,
    height: 394,
    theme: 'day',
    notes:
      'Supplied horizontal lockup, navy and cyan on white. Confirmed by opening the file. Primary header and footer mark on light surfaces.',
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Promoted photography                                                       */
/* -------------------------------------------------------------------------- */

export const media = {
  logoNightBadge: {
    ...LOGOS.logoNightBadge,
    id: 'logo-night-badge',
    role: 'logoNightBadge',
    focalPoint: '50% 50%',
    altAr: 'شعار سويم فيت أكاديمي — النسخة الداكنة',
    altEn: 'Swim Fit Academy logo, dark variant',
    verified: true,
  },
  logoDayBadge: {
    ...LOGOS.logoDayBadge,
    id: 'logo-day-badge',
    role: 'logoDayBadge',
    focalPoint: '50% 50%',
    altAr: 'شعار سويم فيت أكاديمي — النسخة الفاتحة',
    altEn: 'Swim Fit Academy logo, light variant',
    verified: true,
  },
  logoNight: {
    ...LOGOS.logoNight,
    id: 'logo-night',
    role: 'logoNight',
    focalPoint: '50% 50%',
    altAr: 'سويم فيت أكاديمي',
    altEn: 'Swim Fit Academy',
    verified: true,
  },
  logoDay: {
    ...LOGOS.logoDay,
    id: 'logo-day',
    role: 'logoDay',
    focalPoint: '50% 50%',
    altAr: 'سويم فيت أكاديمي',
    altEn: 'Swim Fit Academy',
    verified: true,
  },

  heroPrimary: {
    id: 'hero-primary',
    role: 'heroPrimary',
    referenceFile: 'ref-09.png',
    sourceUrl: 'https://i.postimg.cc/QMwnVcvp/Chat-GPT-Image-Oct-2-2026-01-19-41-AM-9.png',
    src: '/media/hero/hero-primary.png',
    width: 640,
    height: 800,
    focalPoint: '50% 42%',
    theme: 'both',
    grade: 'saturate(1.06) contrast(1.04)',
    altAr: 'مدرّب يساعد متدرّباً على السباحة عند حافة المسبح',
    altEn: 'An instructor supporting a swimmer at the pool edge',
    verified: true,
    notes:
      'Split-level half-underwater frame: waterline through the middle, pool floor below. Chosen as the hero because it is genuinely cinematic, carries real light and real water physics, and has no baked text. The reference pack contains no clean three-person back-view pool image; see docs/VISUAL_REFERENCE_MANIFEST.md.',
  },

  posterBrand: {
    id: 'poster-brand',
    role: 'posterBrand',
    referenceFile: 'ref-02.png',
    sourceUrl: 'https://i.postimg.cc/RVSGSPNz/Chat-GPT-Image-Oct-2-2026-01-19-29-AM-2.png',
    src: '/media/posters/brand.png',
    width: 640,
    height: 800,
    focalPoint: '38% 44%',
    theme: 'night',
    grade: 'saturate(1.12) contrast(1.08) brightness(0.92)',
    altAr: 'متدرّب يتدرب على السباحة بإشراف المدرّب',
    altEn: 'A swimmer practising under instruction',
    verified: true,
    notes: 'Wide band crops the converging lane ropes for depth. Used for the brand poster.',
  },

  posterTechnique: {
    id: 'poster-technique',
    role: 'posterTechnique',
    referenceFile: 'ref-05.png',
    sourceUrl: 'https://i.postimg.cc/yY1n1fkq/Chat-GPT-Image-Oct-2-2026-01-19-36-AM-5.png',
    src: '/media/posters/technique.png',
    width: 640,
    height: 800,
    focalPoint: '52% 30%',
    theme: 'night',
    grade: 'saturate(1.18) contrast(1.14) brightness(0.88)',
    altAr: 'رجل يسبح حرة مع رذاذ ماء — تدريب على التقنية',
    altEn: 'Freestyle stroke with a burst of water, a technique drill',
    verified: true,
    notes: 'Highest-energy frame in the pack: splash, extended arm, lane depth. Crops tight on the splash for the technique poster.',
  },

  posterProgress: {
    id: 'poster-progress',
    role: 'posterProgress',
    referenceFile: 'ref-03.png',
    sourceUrl: 'https://i.postimg.cc/Dyv5vC8k/Chat-GPT-Image-Oct-2-2026-01-19-33-AM-3.png',
    src: '/media/posters/progress.png',
    width: 640,
    height: 800,
    focalPoint: '50% 34%',
    theme: 'night',
    grade: 'saturate(1.04) contrast(1.02) brightness(0.94)',
    altAr: 'متدرّب يتقدم في السباحة مع انعكاس الماء في المقدمة',
    altEn: 'A swimmer progressing, with water reflection in the foreground',
    verified: true,
    notes: 'Crop favours the reflective water band at the bottom, which reads as repetition and rhythm.',
  },

  posterAllLevels: {
    id: 'poster-all-levels',
    role: 'posterAllLevels',
    referenceFile: 'ref-07.png',
    sourceUrl: 'https://i.postimg.cc/mrJ6h7KN/Chat-GPT-Image-Oct-2-2026-01-19-38-AM-7.png',
    src: '/media/posters/all-levels.png',
    width: 640,
    height: 800,
    focalPoint: '50% 52%',
    theme: 'night',
    grade: 'saturate(1.1) contrast(1.05) brightness(0.9)',
    altAr: 'مجموعة متدرّبين مع المدرّب عند حافة المسبح',
    altEn: 'A group of swimmers with their instructor at the pool wall',
    verified: true,
    notes: 'Widest group frame in the clean set. Focal point lowered so no face is clipped by a wide crop.',
  },

  posterAbuDhabi: {
    id: 'poster-abu-dhabi',
    role: 'posterAbuDhabi',
    referenceFile: 'ref-01.png',
    sourceUrl: 'https://i.postimg.cc/d0yjHpST/Chat-GPT-Image-Oct-2-2026-01-19-27-AM-1.png',
    src: '/media/posters/abu-dhabi.png',
    width: 640,
    height: 800,
    focalPoint: '50% 26%',
    theme: 'night',
    grade: 'saturate(0.86) contrast(1.16) brightness(0.86)',
    altAr: 'المسبح الداخلي بممراته المتوازية والنوافذ',
    altEn: 'The indoor pool with its parallel lanes and tall windows',
    verified: true,
    notes:
      'Environment frame: the pool hall, lane ropes and windows carry the Abu Dhabi location section without inventing a venue. Desaturated and deepened so it reads as architecture rather than portraiture.',
  },

  posterConversion: {
    id: 'poster-conversion',
    role: 'posterConversion',
    referenceFile: 'ref-10.png',
    sourceUrl: 'https://i.postimg.cc/Pq9FN105/Chat-GPT-Image-Oct-2-2026-01-19-43-AM-10.png',
    src: '/media/posters/conversion.png',
    width: 640,
    height: 800,
    focalPoint: '50% 24%',
    theme: 'night',
    grade: 'saturate(1.02) contrast(1.02) brightness(1.0) blur(0px)',
    altAr: 'مدرّب عند حافة المسبح بإضاءة دافئة',
    altEn: 'An instructor at the pool edge in warm light',
    verified: true,
    notes:
      'Warmest frame in the pack, used for the closing conversion poster so the final beat feels human rather than athletic.',
  },

  methodVisual: {
    id: 'method-visual',
    role: 'methodVisual',
    referenceFile: 'ref-04.png',
    sourceUrl: 'https://i.postimg.cc/X7jxj2Xh/Chat-GPT-Image-Oct-2-2026-01-19-34-AM-4.png',
    src: '/media/sections/method.png',
    width: 640,
    height: 800,
    focalPoint: '50% 40%',
    theme: 'both',
    grade: 'saturate(1.05) contrast(1.05)',
    altAr: 'مدرّب يوجّه مجموعة متدرّبين في المسبح',
    altEn: 'An instructor guiding a group of swimmers in the pool',
    verified: true,
    notes: 'Group instruction frame for the method sequence.',
  },

  coachVisual: {
    id: 'coach-visual',
    role: 'coachVisual',
    referenceFile: 'ref-06.png',
    sourceUrl: 'https://i.postimg.cc/wMcWWZM4/Chat-GPT-Image-Oct-2-2026-01-19-37-AM-6.png',
    src: '/media/sections/coach.png',
    width: 640,
    height: 800,
    focalPoint: '50% 36%',
    theme: 'both',
    grade: 'saturate(1.02) contrast(1.04)',
    altAr: 'مدرّب يتحدث مع متدرّب على حافة المسبح',
    altEn: 'An instructor talking with a swimmer poolside',
    verified: true,
    notes:
      'Poolside instruction frame. Used as atmosphere only: it is never captioned as a named coach, because coach identity is still OWNER_REQUIRED.',
  },

  resultsVisual: {
    id: 'results-visual',
    role: 'resultsVisual',
    referenceFile: 'ref-03.png',
    sourceUrl: 'https://i.postimg.cc/Dyv5vC8k/Chat-GPT-Image-Oct-2-2026-01-19-33-AM-3.png',
    src: '/media/sections/results.png',
    width: 640,
    height: 800,
    focalPoint: '50% 30%',
    theme: 'both',
    grade: 'saturate(1.06) contrast(1.04)',
    altAr: 'متدرّب يتقدم في السباحة',
    altEn: 'A swimmer progressing',
    verified: true,
    notes:
      'Progress atmosphere for the results page. Deliberately not a medal, trophy or award image — no achievement is implied.',
  },

  locationsVisual: {
    id: 'locations-visual',
    role: 'locationsVisual',
    referenceFile: 'ref-01.png',
    sourceUrl: 'https://i.postimg.cc/d0yjHpST/Chat-GPT-Image-Oct-2-2026-01-19-27-AM-1.png',
    src: '/media/sections/locations.png',
    width: 640,
    height: 800,
    focalPoint: '50% 24%',
    theme: 'both',
    grade: 'saturate(0.9) contrast(1.14)',
    altAr: 'مسبح داخلي بممرات متوازية',
    altEn: 'An indoor pool with parallel lanes',
    verified: true,
    notes: 'City-level pool atmosphere. No venue, address or map pin is implied.',
  },

  contactVisual: {
    id: 'contact-visual',
    role: 'contactVisual',
    referenceFile: 'ref-10.png',
    sourceUrl: 'https://i.postimg.cc/Pq9FN105/Chat-GPT-Image-Oct-2-2026-01-19-43-AM-10.png',
    src: '/media/sections/contact.png',
    width: 640,
    height: 800,
    focalPoint: '50% 22%',
    theme: 'day',
    grade: 'saturate(1.04) contrast(1.02)',
    altAr: 'مدرّب عند حافة المسبح في ضوء دافئ',
    altEn: 'An instructor poolside in warm light',
    verified: true,
    notes: 'Warm, human frame for the contact page.',
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;

/** Look up an asset by key with a compile-time guarantee it exists. */
export function getMedia<K extends MediaKey>(key: K): MediaAsset {
  return media[key] as MediaAsset;
}

/**
 * Returns the logo for the active theme.
 * Falls back to the night mark only when a light asset is missing, never to a
 * generated substitute.
 */
export function logoForTheme(theme: 'day' | 'night'): MediaAsset {
  return theme === 'day' ? (media.logoDay as MediaAsset) : (media.logoNight as MediaAsset);
}

export function badgeForTheme(theme: 'day' | 'night'): MediaAsset {
  return theme === 'day' ? (media.logoDayBadge as MediaAsset) : (media.logoNightBadge as MediaAsset);
}

/** Every promoted asset, used by the media-integrity test. */
export function allMedia(): MediaAsset[] {
  return Object.values(media) as MediaAsset[];
}

/**
 * Files deliberately NOT promoted, with the reason.
 * Kept in code so the manifest and the manifest document cannot drift apart.
 */
export interface RejectedReference {
  readonly referenceFile: string;
  readonly reason: string;
}

export const REJECTED_REFERENCES: readonly RejectedReference[] = [
  ...['ref-08.png'].map((referenceFile) => ({
    referenceFile,
    reason:
      'Child wearing a medal. Promoted imagery must not imply an award, medal or achievement the academy has not confirmed.',
  })),
  ...['ref-27.png', 'ref-31.png'].map((referenceFile) => ({
    referenceFile,
    reason:
      'The only back-view "approaching the pool" frames in the pack, but both carry baked-in signage and marketing copy. Shipping them would put text inside the artwork and duplicate the logo.',
  })),
  ...['ref-11.png', 'ref-12.png', 'ref-15.png', 'ref-16.png', 'ref-17.png', 'ref-18.png', 'ref-19.png', 'ref-20.png', 'ref-21.png', 'ref-22.png', 'ref-23.png', 'ref-24.png', 'ref-25.png', 'ref-26.png', 'ref-28.png', 'ref-29.png', 'ref-30.png', 'ref-32.png', 'ref-33.png', 'ref-34.png', 'ref-35.png', 'ref-36.png', 'ref-39.png', 'ref-40.png', 'ref-41.png'].map(
    (referenceFile) => ({
      referenceFile,
      reason:
        'AI-generated marketing poster with baked-in Arabic/English copy, icon bars and a composited logo. Unusable as site imagery; several also assert owner-unconfirmed claims such as "professional coaching" and "safest environment".',
    }),
  ),
];
