/**
 * Geometry for the PROVISIONAL_SITE_MARK.
 *
 * Concept: two flowing lane strokes (the water surface) crossed by a single
 * vertical lane marker that completes an abstract `F`. At favicon and 24px
 * header sizes the stroke count is reduced to two so the mark stays legible;
 * the full three-stroke version is used wherever there is room.
 *
 * The same path data is mirrored into `public/brand/*.svg` so the static assets
 * and the inline component never drift.
 */

export const MARK_VIEWBOX = '0 0 64 64';

/** The two flowing lane strokes. */
export const LANE_STROKES: readonly string[] = [
  'M11 25.5 C17 19.5 23 19.5 29 25.5 C35 31.5 41 31.5 47 25.5',
  'M11 41.5 C17 35.5 23 35.5 29 41.5 C35 47.5 41 47.5 47 41.5',
];

/** The vertical lane marker that completes the abstract `F`. */
export const SPINE_STROKE = 'M49.5 13 V51';

/** Horizontal accent that turns the marker into a legible `F`. */
export const SPINE_ARM = 'M49.5 25.5 H45';

export const MARK_GRADIENT_ID = 'sfa-mark-gradient';

export const MARK_VIEWBOX_WORDMARK = { width: 248, height: 56 };
