import { LANE_STROKES, MARK_GRADIENT_ID, MARK_VIEWBOX, SPINE_ARM, SPINE_STROKE } from './markGeometry';

export interface ProvisionalMarkProps {
  /** Height in pixels; width follows the square viewBox. */
  readonly size?: number;
  /** `light` for dark surfaces, `dark` for light surfaces. */
  readonly variant?: 'light' | 'dark';
  readonly title?: string;
  readonly className?: string;
  /**
   * Decorative by default: the mark always sits beside a text label, so it is
   * hidden from assistive technology unless a title is supplied.
   */
  readonly titleId?: string;
  /** Collapses to the two lane strokes when the mark is very small. */
  readonly simplified?: boolean;
}

/**
 * PROVISIONAL_SITE_MARK — compact SF monogram.
 * Replace with the owner-approved mark; see public/brand/README.md.
 */
export function ProvisionalMark({
  size = 40,
  variant = 'light',
  title,
  className,
  titleId,
  simplified = false,
}: ProvisionalMarkProps) {
  const strokePrimary = variant === 'light' ? '#35c8e4' : '#0a2a3f';
  const strokeSecondary = variant === 'light' ? '#78dcef' : '#123c55';
  const gradientFrom = variant === 'light' ? '#78dcef' : '#0a2a3f';
  const gradientTo = variant === 'light' ? '#15b8d6' : '#35c8e4';
  const heavy = simplified ? 7.5 : 6.5;

  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      className={className}
      role={titleId ? 'img' : undefined}
      aria-labelledby={titleId}
      aria-hidden={titleId ? undefined : true}
      focusable="false"
    >
      {titleId ? <title id={titleId}>{title}</title> : null}
      <defs>
        <linearGradient id={MARK_GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {LANE_STROKES.map((d, index) => (
          <path
            key={d}
            d={d}
            stroke={index === 0 ? `url(#${MARK_GRADIENT_ID})` : strokePrimary}
            strokeWidth={index === 0 ? heavy : heavy - 1}
          />
        ))}
        {!simplified ? (
          <>
            <path d={SPINE_STROKE} stroke={strokeSecondary} strokeWidth={heavy - 1} />
            <path d={SPINE_ARM} stroke={strokeSecondary} strokeWidth={heavy - 2.5} />
            <circle cx="49.5" cy="13" r="4" fill={strokePrimary} />
          </>
        ) : null}
      </g>
    </svg>
  );
}

export default ProvisionalMark;
