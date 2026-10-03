import type { ReactNode } from 'react';

export interface SectionHeadingProps {
  readonly kicker?: string;
  readonly title: string;
  readonly body?: string;
  readonly align?: 'start' | 'center';
  readonly tone?: 'deep' | 'light';
  readonly className?: string;
  readonly as?: 'h2' | 'h3';
  readonly id?: string;
  /** Renders the kicker as a numbered lane marker. */
  readonly marker?: string;
}

/**
 * Editorial section heading.
 *
 * `tone="light"` switches to an ice-white surface so long pages alternate
 * between deep water and quiet, readable moments.
 */
export function SectionHeading({
  kicker,
  title,
  body,
  align = 'start',
  tone = 'deep',
  className,
  as: Tag = 'h2',
  id,
  marker,
}: SectionHeadingProps) {
  const light = tone === 'light';
  return (
    <div
      className={[
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className ?? '',
      ].join(' ')}
    >
      {kicker || marker ? (
        <div className="flex items-center gap-3">
          {marker ? (
            <span
              aria-hidden="true"
              className={[
                'font-latin text-[0.72rem] font-semibold tracking-[0.24em]',
                light ? 'text-ocean-600' : 'text-accent',
              ].join(' ')}
            >
              {marker}
            </span>
          ) : null}
          {marker && kicker ? (
            <span aria-hidden="true" className={light ? 'h-px w-8 bg-ocean-500/30' : 'h-px w-8 bg-pool-400/40'} />
          ) : null}
          {kicker ? (
            <p
              className={[
                'text-[0.72rem] font-semibold uppercase tracking-[0.22em]',
                light ? 'text-alt-ink-2' : 'text-accent',
              ].join(' ')}
            >
              {kicker}
            </p>
          ) : null}
        </div>
      ) : null}

      <Tag
        id={id}
        className={[
          'text-balance max-w-[22ch] text-3xl leading-[1.15] sm:text-4xl lg:text-[2.85rem]',
          align === 'center' ? 'mx-auto' : '',
          light ? 'text-alt-ink' : 'text-ink',
        ].join(' ')}
      >
        {title}
      </Tag>

      {body ? (
        <p
          className={[
            'max-w-[62ch] text-[1.0rem] leading-relaxed sm:text-[1.05rem]',
            light ? 'text-alt-ink-2' : 'text-ink-2',
          ].join(' ')}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

export interface KickerProps {
  readonly children: ReactNode;
  readonly tone?: 'deep' | 'light';
  readonly className?: string;
}

export function Kicker({ children, tone = 'deep', className }: KickerProps) {
  return (
    <p
      className={[
        'text-[0.72rem] font-semibold uppercase tracking-[0.24em]',
        tone === 'light' ? 'text-slate-600' : 'text-pool-300',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </p>
  );
}

export interface OwnerRequiredNoteProps {
  readonly children: ReactNode;
  readonly tone?: 'deep' | 'light';
}

/**
 * Honest state for facts the academy has not confirmed.
 * Never a placeholder value — always an explanation plus a way forward.
 */
export function OwnerRequiredNote({ children, tone = 'deep' }: OwnerRequiredNoteProps) {
  return (
    <p
      className={[
        'text-[0.83rem] leading-relaxed',
        tone === 'light' ? 'text-alt-ink-2' : 'text-ink-3',
      ].join(' ')}
    >
      {children}
    </p>
  );
}