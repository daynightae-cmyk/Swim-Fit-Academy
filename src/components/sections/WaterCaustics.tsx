import type { ReactNode } from 'react';

export interface WaterCausticsProps {
  /** Placement of the caustic field inside its parent. */
  readonly position?: 'top' | 'center' | 'full';
  readonly opacity?: number;
  readonly scale?: number;
  readonly slow?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
}

/**
 * Decorative caustic light layer.
 *
 * A single rasterised SVG turbulence is used as a background image and animated
 * with transform/opacity only, so it composites on the GPU and never touches
 * layout. Hidden from assistive technology.
 */
export function WaterCaustics({
  position = 'full',
  opacity = 0.28,
  scale = 1,
  slow = false,
  className,
  children,
}: WaterCausticsProps) {
  const positionClass =
    position === 'top'
      ? 'inset-x-0 top-0 h-[46%]'
      : position === 'center'
        ? 'inset-x-0 top-1/2 h-[70%] -translate-y-1/2'
        : 'inset-0';

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${positionClass} overflow-hidden ${className ?? ''}`}>
      <div
        className={`caustics absolute ${slow ? 'caustics-drift-slow' : 'caustics-drift'} h-full w-full`}
        style={{ opacity, transform: `scale(${scale})` }}
      />
      {children}
    </div>
  );
}

export interface WaterHazeProps {
  readonly className?: string;
  readonly strength?: 'soft' | 'medium' | 'strong';
}

/** Soft underwater haze used between sections to create depth transitions. */
export function WaterHaze({ className, strength = 'soft' }: WaterHazeProps) {
  const opacity = strength === 'strong' ? 0.5 : strength === 'medium' ? 0.3 : 0.18;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ''}`}
      style={{
        background: `radial-gradient(90% 60% at 50% 0%, rgba(120,220,239,${opacity * 0.5}), transparent 62%),
             radial-gradient(70% 50% at 80% 100%, rgba(21,184,214,${opacity * 0.35}), transparent 66%)`,
      }}
    />
  );
}

export interface BubbleFieldProps {
  readonly count?: number;
  readonly className?: string;
  /** Mobile renders fewer bubbles to protect scroll smoothness. */
  readonly compact?: boolean;
}

const BUBBLE_SEEDS = [
  { x: 8, size: 5, delay: 0, duration: 15 },
  { x: 19, size: 3, delay: 3.2, duration: 18 },
  { x: 31, size: 7, delay: 6.5, duration: 16 },
  { x: 44, size: 4, delay: 1.4, duration: 20 },
  { x: 56, size: 6, delay: 8.1, duration: 17 },
  { x: 68, size: 3, delay: 4.6, duration: 19 },
  { x: 79, size: 5, delay: 10.2, duration: 15.5 },
  { x: 91, size: 4, delay: 7.3, duration: 21 },
  { x: 4, size: 6, delay: 12.4, duration: 18.5 },
  { x: 25, size: 3, delay: 14.1, duration: 16.5 },
  { x: 61, size: 7, delay: 11.7, duration: 19.5 },
  { x: 86, size: 5, delay: 16.2, duration: 17.5 },
];

/** Very sparse bubble field. Purely decorative, never a load-bearing effect. */
export function BubbleField({ count = 8, className, compact = false }: BubbleFieldProps) {
  const seeds = BUBBLE_SEEDS.slice(0, Math.max(0, Math.min(count, BUBBLE_SEEDS.length)));
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}>
      {seeds.map((seed, index) => (
        <span
          key={index}
          className="bubble"
          style={{
            insetInlineStart: `${seed.x}%`,
            bottom: '-8%',
            width: compact ? seed.size * 0.7 : seed.size,
            height: compact ? seed.size * 0.7 : seed.size,
            animationDelay: `${seed.delay}s`,
            animationDuration: `${compact ? seed.duration * 1.3 : seed.duration}s`,
          }}
        />
      ))}
    </div>
  );
}