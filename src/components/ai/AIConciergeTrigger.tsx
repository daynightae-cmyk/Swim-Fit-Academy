'use client';

import { useTranslations } from 'next-intl';

import { SparkIcon } from '@/components/ui/Icon';

/**
 * Opens the real AI concierge launcher.
 *
 * Server components use this instead of an inline handler, so the trigger keeps
 * its own small client boundary while the surrounding page stays server-rendered.
 */
export function AIConciergeTrigger({
  label,
  variant = 'ghost',
  size = 'md',
  testId,
  className,
}: {
  readonly label?: string;
  readonly variant?: 'primary' | 'ghost' | 'quiet';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly testId?: string;
  readonly className?: string;
}) {
  const t = useTranslations('ai');

  const sizeClass =
    size === 'lg'
      ? 'px-6 py-3.5 text-[0.97rem]'
      : size === 'sm'
        ? 'px-4 py-2.5 text-[0.8rem]'
        : 'px-5 py-3 text-[0.86rem]';

  return (
    <button
      type="button"
      data-testid={testId}
      className={`btn btn-${variant} ${sizeClass} ${className ?? ''}`}
      onClick={() => {
        const launcher = document.getElementById('ai-launcher');
        if (launcher instanceof HTMLElement) launcher.click();
      }}
    >
      <SparkIcon size={size === 'lg' ? 19 : 17} />
      <span>{label ?? t('openChat')}</span>
    </button>
  );
}

export default AIConciergeTrigger;
