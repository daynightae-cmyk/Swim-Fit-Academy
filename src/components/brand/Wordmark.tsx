import { LANE_STROKES, MARK_GRADIENT_ID, SPINE_ARM, SPINE_STROKE } from './markGeometry';

export interface WordmarkProps {
  readonly variant?: 'light' | 'dark';
  readonly className?: string;
  /** Marks the wordmark decorative; pass a title to expose it. */
  readonly title?: string;
  readonly titleId?: string;
  readonly showMark?: boolean;
}

/**
 * PROVISIONAL_SITE_MARK — horizontal wordmark.
 * `SWIM FIT` over a tracked-out `ACADEMY`, separated from the monogram by a
 * hairline lane divider.
 */
export function Wordmark({
  variant = 'light',
  className,
  title,
  titleId,
  showMark = true,
}: WordmarkProps) {
  const primary = variant === 'light' ? '#f4fbfd' : '#03131f';
  const secondary = variant === 'light' ? '#8ba1ad' : '#526772';
  const divider = variant === 'light' ? 'rgba(120,220,239,0.28)' : 'rgba(6,28,43,0.22)';
  const gradientFrom = variant === 'light' ? '#78dcef' : '#0a2a3f';
  const gradientTo = variant === 'light' ? '#15b8d6' : '#35c8e4';

  return (
    <svg
      viewBox="0 0 248 56"
      width={248}
      height={56}
      className={className}
      role={titleId ? 'img' : undefined}
      aria-labelledby={titleId}
      aria-hidden={titleId ? undefined : true}
      focusable="false"
    >
      {titleId ? <title id={titleId}>{title}</title> : null}
      <defs>
        <linearGradient id={`${MARK_GRADIENT_ID}-wordmark`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>

      {showMark ? (
        <g
          transform="translate(2 4)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          {LANE_STROKES.map((d, index) => (
            <path
              key={d}
              d={d}
              stroke={
                index === 0 ? `url(#${MARK_GRADIENT_ID}-wordmark)` : variant === 'light' ? '#35c8e4' : '#0a2a3f'
              }
              strokeWidth={index === 0 ? 6 : 5}
            />
          ))}
          <path
            d={SPINE_STROKE}
            stroke={variant === 'light' ? '#78dcef' : '#123c55'}
            strokeWidth={5}
          />
          <path d={SPINE_ARM} stroke={variant === 'light' ? '#78dcef' : '#123c55'} strokeWidth={4} />
          <circle cx="49" cy="14" r="3.4" fill={variant === 'light' ? '#35c8e4' : '#0a2a3f'} />
        </g>
      ) : null}

      <line
        x1={showMark ? 60 : 4}
        y1="6"
        x2={showMark ? 60 : 4}
        y2="50"
        stroke={divider}
        strokeWidth="1"
      />

      <text
        x={showMark ? 74 : 10}
        y="26"
        fill={primary}
        fontFamily="var(--font-manrope), system-ui, sans-serif"
        fontSize="19"
        fontWeight="700"
        letterSpacing="2.6"
      >
        SWIM FIT
      </text>
      <text
        x={showMark ? 75 : 11}
        y="46"
        fill={secondary}
        fontFamily="var(--font-manrope), system-ui, sans-serif"
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="6.4"
      >
        ACADEMY
      </text>
    </svg>
  );
}

export default Wordmark;