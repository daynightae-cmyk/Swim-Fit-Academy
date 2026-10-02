# Owner Input Register — Swim Fit Academy

> Single source of pending confirmations. Every item below is intentionally
> **not** rendered on the website. When management confirms an item, update the
> corresponding file in `src/content/` (never a component) and flip the
> `VerificationStatus` field.

**No item in this document may be guessed, inferred, or "probably true".**

## Blockers for public claims

| # | Field | Status | Target file | Impact if missing |
|---|---|---|---|---|
| 1 | Official Arabic business name | `OWNER_REQUIRED` | `src/content/business.ts` → `name.value` | Site uses the provisional identity |
| 2 | Official English capitalization | `OWNER_REQUIRED` | `src/content/business.ts` → `name.value` | Same as above |
| 3 | Final official logo | `OWNER_REQUIRED` | `public/brand/*.svg` | `PROVISIONAL_SITE_MARK` stays in use |
| 4 | Coach full public name | `OWNER_REQUIRED` | `src/content/coach.ts` → `coachProfile.name` | Coach page stays methodology-only |
| 5 | Coach approved bio | `OWNER_REQUIRED` | `src/content/coach.ts` → `coachProfile.bio` | Bio slot hidden |
| 6 | Credential wording | `OWNER_REQUIRED` | `src/content/coach.ts` → `coachProfile.credentials` | Credentials slot hidden |
| 7 | Credential issuing institution | `OWNER_REQUIRED` | `src/content/coach.ts` → `coachProfile.credentialIssuer` | No credential claim anywhere |
| 8 | Real coach photo | `OWNER_REQUIRED` | `src/content/coach.ts` → `coachProfile.portrait` | Atmospheric scene only |
| 9 | Exact training venues | `OWNER_REQUIRED` | `src/content/locations.ts` → `records[]` | City-level Abu Dhabi state |
| 10 | Schedule / timetable | `OWNER_REQUIRED` | `src/content/business.ts` → `schedule`, `hours` | No timetable is published |
| 11 | Prices | `OWNER_REQUIRED` | `src/content/business.ts` → `pricing` | Pricing FAQ hands off to WhatsApp |
| 12 | Package structure | `OWNER_REQUIRED` | `src/content/programs.ts` | Programs stay intent-based |
| 13 | Age bands | `OWNER_REQUIRED` | `src/content/business.ts` → `ageBands` | No age restrictions published |
| 14 | Trial-class policy | `OWNER_REQUIRED` | `src/content/business.ts` → `trialPolicy` | Trial FAQ hands off |
| 15 | Ladies-session availability | `OWNER_REQUIRED` | `src/content/business.ts` → `ladiesOnly` | FAQ hands off |
| 16 | Cancellation / reschedule policy | `OWNER_REQUIRED` | `src/content/business.ts` → `cancellationPolicy` | FAQ hands off |
| 17 | Guardian-consent policy | `OWNER_REQUIRED` | `src/content/faq.ts` → `consent` | Stories stay anonymised |
| 18 | Verified Instagram ownership | `UNVERIFIED` | `src/content/business.ts` → `social.instagram.url` | Instagram link is candidate-marked |
| 19 | Future verified reviews | `OWNER_REQUIRED` | `src/content/faq.ts` → `verifiedReviews[]` | Empty state renders |
| 20 | Verified business email | `OWNER_REQUIRED` | `src/content/business.ts` → `email` | No email is displayed |

## Already supported by evidence

- Business identity: Swim Fit Academy
- Service scope: Abu Dhabi, United Arab Emirates
- Swimming instruction for all levels
- Phone: `056 969 8628` / `+971 56 969 8628` / `tel:+971569698628`
- WhatsApp: `https://wa.me/971569698628`
- Facebook page: `https://www.facebook.com/1177131185475857`

## How to promote a field to public

1. Edit the `Sourced` entry in `src/content/` — set `value` and `status: 'VERIFIED'`.
2. Add a `source` string describing the evidence you hold.
3. Do **not** edit any component. Components read from config only.
4. Re-run `pnpm verify`. The unit tests assert that non-public statuses never render.