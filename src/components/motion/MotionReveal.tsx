'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Reduced-motion boundary.
 *
 * Every animation in the product goes through here. When the visitor prefers
 * reduced motion, the reveal collapses to an instant, static render — content is
 * never hidden behind an effect.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

export interface ReducedMotionBoundaryProps {
  readonly children: ReactNode;
  /** Rendered instead of `children` when reduced motion is requested. */
  readonly fallback?: ReactNode;
}

/** Renders the plain variant for reduced-motion visitors. */
export function ReducedMotionBoundary({ children, fallback }: ReducedMotionBoundaryProps) {
  const reduced = usePrefersReducedMotion();
  return <>{reduced && fallback !== undefined ? fallback : children}</>;
}

export interface MotionRevealProps {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly className?: string;
  /** Fraction of the element that must be visible before revealing. */
  readonly threshold?: number;
  readonly delayMs?: number;
  readonly once?: boolean;
  readonly id?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-hidden'?: boolean;
  readonly role?: string;
}

/**
 * Reveals children when they enter the viewport.
 *
 * Implemented with IntersectionObserver rather than a scroll listener so the
 * work stays off the main thread and never blocks scrolling.
 */
export function MotionReveal({
  children,
  as: Tag = 'div',
  className,
  threshold = 0.16,
  delayMs = 0,
  once = true,
  id,
  role,
  'aria-labelledby': ariaLabelledBy,
  'aria-hidden': ariaHidden,
}: MotionRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // Environments without IntersectionObserver must still render the content.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      aria-hidden={ariaHidden}
      className={className}
      data-visible={visible ? 'true' : 'false'}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export interface StaggerProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly threshold?: number;
}

/** Reveals a group of children with a short sequential delay. */
export function Stagger({ children, className, threshold = 0.12 }: StaggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className} data-visible={visible ? 'true' : 'false'}>
      {children}
    </div>
  );
}