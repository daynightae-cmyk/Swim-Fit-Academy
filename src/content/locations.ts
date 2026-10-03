import type { Sourced } from './business';

/**
 * Typed location records.
 *
 * Exact venues only reach the site after management confirmation, therefore the
 * current dataset is intentionally empty and the UI renders an honest
 * city-level Abu Dhabi state instead of an invented pool.
 */

export interface LocationRecord {
  readonly id: string;
  readonly name: Sourced<string | null>;
  readonly address: Sourced<string | null>;
  readonly lat: Sourced<number | null>;
  readonly lng: Sourced<number | null>;
  readonly schedule: Sourced<string | null>;
  readonly programs: readonly string[];
  readonly verified: boolean;
}

export interface LocationsData {
  readonly city: string;
  readonly cityLocalized: { readonly ar: string; readonly en: string };
  readonly country: string;
  readonly records: readonly LocationRecord[];
}

/**
 * TODO_OWNER_DATA: training venues require owner verification.
 * Add a record here only when the academy has confirmed the venue in writing.
 */
export const locations: LocationsData = {
  city: 'Abu Dhabi',
  cityLocalized: { ar: 'أبوظبي', en: 'Abu Dhabi' },
  country: 'United Arab Emirates',
  records: [],
};

/** Records that management has explicitly verified and may render as exact venues. */
export function verifiedLocations(records: readonly LocationRecord[] = locations.records) {
  return records.filter(
    (record) =>
      record.verified &&
      record.name.status === 'VERIFIED' &&
      record.address.status === 'VERIFIED' &&
      typeof record.lat.value === 'number' &&
      typeof record.lng.value === 'number',
  );
}