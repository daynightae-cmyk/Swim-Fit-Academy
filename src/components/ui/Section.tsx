/** Shared layout primitives used across sections. */

/** Hairline divider with a cyan horizon fade. */
export function Divider({ className }: { readonly className?: string }) {
  return <div aria-hidden="true" className={`divider-fade ${className ?? ''}`} />;
}

/**
 * Standard page section wrapper.
 * Keeps vertical rhythm consistent and reserves the mobile sticky-bar offset.
 */
export function Section({
  id,
  children,
  tone = 'deep',
  className,
  labelledBy,
  spacing = 'default',
}: {
  readonly id?: string;
  readonly children: React.ReactNode;
  readonly tone?: 'deep' | 'light';
  readonly className?: string;
  readonly labelledBy?: string;
  readonly spacing?: 'default' | 'tight' | 'loose';
}) {
  const padding =
    spacing === 'tight'
      ? 'py-14 sm:py-16'
      : spacing === 'loose'
        ? 'py-20 sm:py-24 lg:py-28'
        : 'py-16 sm:py-20 lg:py-24';

  const light = tone === 'light';

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={[
        'relative',
        padding,
        light ? 'bg-ice-50 text-ocean-950' : 'bg-ocean-950 text-ice-50',
        className ?? '',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12">{children}</div>
    </section>
  );
}

/** Constrains reading width for long-form copy. */
export function Prose({ children, className }: { readonly children: React.ReactNode; readonly className?: string }) {
  return <div className={`prose-body max-w-[68ch] ${className ?? ''}`}>{children}</div>;
}
