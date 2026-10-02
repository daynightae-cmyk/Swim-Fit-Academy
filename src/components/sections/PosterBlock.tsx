import { WidePoster } from '@/components/posters/WidePoster';
import { posterById, type PosterId } from '@/content/posters';

export interface PosterBlockProps {
  readonly id: PosterId;
  readonly program?: 'start' | 'technique' | 'confidence' | 'performance';
  readonly tone?: 'default' | 'tight';
}

/**
 * Full-width wrapper for a WidePoster inside a page flow.
 * Keeps the horizontal rhythm identical on every page that uses a poster.
 */
export function PosterBlock({ id, program, tone = 'default' }: PosterBlockProps) {
  return (
    <div
      className={
        tone === 'tight'
          ? 'mx-auto w-full max-w-[86rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14'
          : 'mx-auto w-full max-w-[86rem] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16'
      }
    >
      <WidePoster poster={posterById(id)} program={program} />
    </div>
  );
}

export default PosterBlock;
