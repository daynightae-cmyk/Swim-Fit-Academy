import { ImageResponse } from 'next/og';

import { LANE_STROKES, SPINE_ARM, SPINE_STROKE } from '@/components/brand/markGeometry';

export const alt = 'Swim Fit Academy — Abu Dhabi. Learn. Progress. Shine.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph / social preview composition.
 *
 * Deep-ocean water texture, provisional SF mark, wordmark, city and the brand
 * line. No ratings, no counts, no claims. Body copy is kept large enough to
 * survive a cropped preview.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 84px',
          background:
            'radial-gradient(120% 90% at 78% 0%, #12556f 0%, #0a3550 34%, #062434 62%, #03131f 100%)',
          color: '#f4fbfd',
          fontFamily: 'sans-serif',
        }}
      >
        {/* caustic field */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(115deg, rgba(120,220,239,0.10) 0px, rgba(120,220,239,0.10) 1px, transparent 1px, transparent 46px)',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 320,
            background: 'linear-gradient(to top, rgba(3,19,31,0.92), rgba(3,19,31,0))',
          }}
        />

        {/* horizon rule */}
        <div
          style={{
            position: 'absolute',
            top: 232,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(120,220,239,0.5), transparent)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <svg width="86" height="86" viewBox="0 0 64 64">
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d={LANE_STROKES[0]!} stroke="#78dcef" strokeWidth={6} />
              <path d={LANE_STROKES[1]!} stroke="#35c8e4" strokeWidth={5} />
              <path d={SPINE_STROKE} stroke="#78dcef" strokeWidth={5} />
              <path d={SPINE_ARM} stroke="#78dcef" strokeWidth={4} />
            </g>
            <circle cx="49" cy="14" r="3.4" fill="#35c8e4" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '0.16em' }}>SWIM FIT</div>
            <div style={{ fontSize: 15, letterSpacing: '0.42em', color: '#8ba1ad', marginTop: 6 }}>
              ACADEMY
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Learn. Progress. Shine.
          </div>
          <div style={{ fontSize: 30, color: '#78dcef', letterSpacing: '0.06em' }}>
            Swimming instruction for all levels · Abu Dhabi
          </div>
          <div style={{ fontSize: 24, color: '#8ba1ad' }} dir="ltr">
            056 969 8628
          </div>
        </div>
      </div>
    ),
    size,
  );
}