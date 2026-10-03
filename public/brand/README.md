# Brand Asset Drop Zone

## Current status: PROVISIONAL_SITE_MARK

Everything in this folder is a **temporary site identity**. It is not an
owner-approved academy logo and must never be presented as official.

| File | Purpose |
|---|---|
| `provisional-wordmark-light.svg` | Horizontal `SWIM FIT / ACADEMY` wordmark for dark surfaces |
| `provisional-wordmark-dark.svg` | Horizontal wordmark for light surfaces |
| `provisional-mark-light.svg` | Compact `SF` monogram for dark surfaces |
| `provisional-mark-dark.svg` | Compact `SF` monogram for light surfaces |
| `favicon.svg` | Browser tab mark, derived from the monogram |

## Replacing the mark

1. Drop the owner-approved files here using the same filenames
   (`logo-primary.svg`, `logo-mark.svg`, `logo-light.svg`, `logo-dark.svg`,
   `social-preview.png`, `favicon.svg`).
2. Update `src/content/business.ts` → `business.mark` to drop the
   `PROVISIONAL_SITE_MARK` label.
3. Update `src/components/brand/ProvisionalMark.tsx` only if the new geometry
   cannot be expressed by the current prop-based monogram component.
4. Re-run `pnpm verify`.

Do not add generated or placeholder imagery and later treat it as an official
academy asset.

## Approved photography drop zone

- `media/generated/` — original vector/raster art authored by the site build
- `media/posters/` — poster source art, when photography replaces the built-in
  vector compositions
- coach / pool / training photography, once the owner approves it

No imagery may imply that a generated or stock person is an actual student or
member of staff.