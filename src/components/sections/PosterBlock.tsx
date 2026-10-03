import { WidePoster } from '@/components/posters/WidePoster';
import { posterById, type PosterId } from '@/content/posters';

export interface PosterBlockProps {
  readonly id: PosterId;
  readonly priority?: boolean;
  readonly program?: 'start' | 'technique' | 'confidence' | 'performance';
  readonly tone?: 'default' | 'tight';
}

/**
 * Renders a wide cinematic poster from the real supplied photography.
 *
 * The record declares which media-manifest asset carries it and which
 * composition variant to use, so the art direction lives in content and the
 * component stays presentational.
 */
export function PosterBlock({ id, priority = false, program, tone = 'default' }: PosterBlockProps) {
  const record = posterById(id);

  return (
    <div
      className={
        tone === 'tight'
          ? 'mx-auto w-full max-w-[86rem] px-5 py-6 sm:px-8 lg:px-12 lg:py-10'
          : 'mx-auto w-full max-w-[86rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'
      }
    >
      <WidePoster
        id={record.id}
        marker={record.marker}
        microLabelKey={record.microLabelKey}
        headlineKey={record.headlineKey}
        sublineKey={record.sublineKey}
        mediaKey={record.mediaKey}
        variant={record.variant}
        ctaKey={record.cta?.labelKey}
        priority={priority}
        program={program}
      />
    </div>
  );
}

export default PosterBlock;