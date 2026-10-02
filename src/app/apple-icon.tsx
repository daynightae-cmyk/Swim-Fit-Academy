import { ImageResponse } from 'next/og';

import { LANE_STROKES, SPINE_ARM, SPINE_STROKE } from '@/components/brand/markGeometry';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const alt = 'Swim Fit Academy';

/**
 * Apple touch icon generated from the provisional SF monogram.
 * PROVISIONAL_SITE_MARK — replaced when the owner approves a logo.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #061c2b 0%, #03131f 100%)',
          borderRadius: 40,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={LANE_STROKES[0]!} stroke="#78dcef" strokeWidth={6} />
            <path d={LANE_STROKES[1]!} stroke="#35c8e4" strokeWidth={5} />
            <path d={SPINE_STROKE} stroke="#78dcef" strokeWidth={5} />
            <path d={SPINE_ARM} stroke="#78dcef" strokeWidth={4} />
          </g>
          <circle cx="49" cy="14" r="3.4" fill="#35c8e4" />
        </svg>
      </div>
    ),
    size,
  );
}