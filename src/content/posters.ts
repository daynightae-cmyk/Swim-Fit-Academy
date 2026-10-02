/**
 * Wide cinematic poster system.
 *
 * Every poster is a *composed* layout: original vector art plus real HTML text.
 * No text is baked into an image, no collage, no contact sheet.
 *
 * Art is authored as React SVG in `src/components/art/`. When the academy
 * supplies approved photography, a poster switches to `kind: 'photo'` and the
 * same layout renders through `next/image` with intrinsic dimensions.
 */

export type PosterId = 'brand' | 'technique' | 'progress' | 'levels' | 'abu-dhabi' | 'conversion';

export type PosterArtId =
  | 'dawn-lane'
  | 'water-trail'
  | 'lane-rhythm'
  | 'level-depths'
  | 'city-horizon'
  | 'light-lane';

export interface PosterArt {
  readonly kind: 'art';
  readonly art: PosterArtId;
  /** Decorative art is hidden from assistive technology. */
  readonly decorative: true;
  readonly altKey: string;
}

export interface PosterPhoto {
  readonly kind: 'photo';
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /** Localised descriptive alt text. */
  readonly alt: { readonly ar: string; readonly en: string };
}

export interface PosterRecord {
  readonly id: PosterId;
  readonly order: number;
  readonly marker: string;
  readonly microLabelKey: string;
  readonly headlineKey: string;
  readonly sublineKey: string;
  readonly visual: PosterArt | PosterPhoto;
  readonly cta?: { readonly labelKey: string; readonly hrefKind: 'whatsapp' | 'route' };
  readonly tone: 'deep' | 'lifted';
}

export const posters: readonly PosterRecord[] = [
  {
    id: 'brand',
    order: 1,
    marker: '01',
    microLabelKey: 'poster.brand.micro',
    headlineKey: 'poster.brand.headline',
    sublineKey: 'poster.brand.subline',
    visual: { kind: 'art', art: 'dawn-lane', decorative: true, altKey: 'poster.brand.alt' },
    tone: 'deep',
  },
  {
    id: 'technique',
    order: 2,
    marker: '02',
    microLabelKey: 'poster.technique.micro',
    headlineKey: 'poster.technique.headline',
    sublineKey: 'poster.technique.subline',
    visual: { kind: 'art', art: 'water-trail', decorative: true, altKey: 'poster.technique.alt' },
    tone: 'deep',
  },
  {
    id: 'progress',
    order: 3,
    marker: '03',
    microLabelKey: 'poster.progress.micro',
    headlineKey: 'poster.progress.headline',
    sublineKey: 'poster.progress.subline',
    visual: { kind: 'art', art: 'lane-rhythm', decorative: true, altKey: 'poster.progress.alt' },
    tone: 'lifted',
  },
  {
    id: 'levels',
    order: 4,
    marker: '04',
    microLabelKey: 'poster.levels.micro',
    headlineKey: 'poster.levels.headline',
    sublineKey: 'poster.levels.subline',
    visual: { kind: 'art', art: 'level-depths', decorative: true, altKey: 'poster.levels.alt' },
    tone: 'deep',
  },
  {
    id: 'abu-dhabi',
    order: 5,
    marker: '05',
    microLabelKey: 'poster.abudhabi.micro',
    headlineKey: 'poster.abudhabi.headline',
    sublineKey: 'poster.abudhabi.subline',
    visual: { kind: 'art', art: 'city-horizon', decorative: true, altKey: 'poster.abudhabi.alt' },
    tone: 'deep',
  },
  {
    id: 'conversion',
    order: 6,
    marker: '06',
    microLabelKey: 'poster.conversion.micro',
    headlineKey: 'poster.conversion.headline',
    sublineKey: 'poster.conversion.subline',
    visual: { kind: 'art', art: 'light-lane', decorative: true, altKey: 'poster.conversion.alt' },
    cta: { labelKey: 'poster.conversion.cta', hrefKind: 'whatsapp' },
    tone: 'deep',
  },
];

export function posterById(id: PosterId): PosterRecord {
  const found = posters.find((poster) => poster.id === id);
  if (!found) {
    throw new Error(`Unknown poster id: ${id}`);
  }
  return found;
}