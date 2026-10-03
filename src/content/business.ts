/**
 * Verification vocabulary for every business fact that can reach a page.
 *
 * - VERIFIED      — corroborated by owner-confirmed evidence held by the academy.
 * - SUPPORTED     — present in the public research baseline; safe to state as fact.
 * - UNVERIFIED    — a candidate value exists but has not been confirmed. Never rendered as fact.
 * - OWNER_REQUIRED — management must confirm before the site may state it.
 */
export const VERIFICATION_STATUSES = [
  'VERIFIED',
  'SUPPORTED',
  'UNVERIFIED',
  'OWNER_REQUIRED',
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

/** Statuses that are allowed to render as public statements of fact. */
const PUBLIC_STATUSES: readonly VerificationStatus[] = ['VERIFIED', 'SUPPORTED'];

export interface Sourced<T> {
  value: T;
  status: VerificationStatus;
  /** Short, human-readable provenance shown in the owner-input document. */
  source?: string;
}

export function isPublicStatus(status: VerificationStatus): boolean {
  return PUBLIC_STATUSES.includes(status);
}

/**
 * Normalizes a sourced field for public consumption.
 * Anything not VERIFIED or SUPPORTED resolves to `null` so that components
 * physically cannot render an unconfirmed fact.
 */
export function publicValue<T>(field: Sourced<T | null>): T | null {
  return isPublicStatus(field.status) ? field.value : null;
}

export function publicFlag(field: Sourced<boolean>): boolean {
  return isPublicStatus(field.status) ? field.value : false;
}

/** Throws when a caller tries to use a null public value. Used by tests. */
export function requirePublicValue<T>(field: Sourced<T | null>, label: string): T {
  const value = publicValue(field);
  if (value === null) {
    throw new Error(`Refusing to render "${label}": status is ${field.status}.`);
  }
  return value;
}

export interface SocialProfile {
  readonly platform: 'facebook' | 'instagram';
  readonly url: Sourced<string | null>;
  readonly handle: string;
  /** Instagram ownership is unconfirmed, so it renders with a candidate marker. */
  readonly isCandidate: boolean;
}

export interface BusinessConfig {
  readonly name: Sourced<string | null>;
  readonly legalName: Sourced<string | null>;
  readonly tagline: Sourced<string | null>;
  readonly city: Sourced<string | null>;
  readonly region: Sourced<string | null>;
  readonly country: Sourced<string | null>;
  readonly serviceScope: Sourced<string | null>;
  readonly levels: Sourced<string | null>;
  readonly phone: {
    readonly local: Sourced<string | null>;
    readonly international: Sourced<string | null>;
    readonly tel: Sourced<string | null>;
  };
  readonly whatsapp: Sourced<string | null>;
  readonly email: Sourced<string | null>;
  readonly address: Sourced<string | null>;
  readonly hours: Sourced<string | null>;
  readonly pricing: Sourced<string | null>;
  readonly schedule: Sourced<string | null>;
  readonly ageBands: Sourced<string | null>;
  readonly trialPolicy: Sourced<string | null>;
  readonly ladiesOnly: Sourced<string | null>;
  readonly cancellationPolicy: Sourced<string | null>;
  readonly social: {
    readonly facebook: SocialProfile;
    readonly instagram: SocialProfile;
  };
  readonly mark: {
    /** Site identity is provisional until an owner-approved logo exists. */
    readonly status: 'PROVISIONAL_SITE_MARK';
    readonly label: string;
  };
}

const researchBaseline = 'docs/DIGITAL-INTELLIGENCE-BASELINE.md';

export const business: BusinessConfig = {
  name: {
    value: 'Swim Fit Academy',
    status: 'SUPPORTED',
    source: researchBaseline,
  },
  legalName: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'Registered business name and trade licence not supplied.',
  },
  tagline: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No owner-approved tagline exists yet.',
  },
  city: {
    value: 'Abu Dhabi',
    status: 'SUPPORTED',
    source: researchBaseline,
  },
  region: {
    value: 'Abu Dhabi',
    status: 'SUPPORTED',
    source: researchBaseline,
  },
  country: {
    value: 'United Arab Emirates',
    status: 'SUPPORTED',
    source: researchBaseline,
  },
  serviceScope: {
    value: 'Abu Dhabi',
    status: 'SUPPORTED',
    source: researchBaseline,
  },
  levels: {
    value: 'All levels',
    status: 'SUPPORTED',
    source: researchBaseline,
  },
  phone: {
    local: {
      value: '056 969 8628',
      status: 'SUPPORTED',
      source: researchBaseline,
    },
    international: {
      value: '+971 56 969 8628',
      status: 'SUPPORTED',
      source: researchBaseline,
    },
    tel: {
      value: 'tel:+971569698628',
      status: 'SUPPORTED',
      source: 'Derived from the supported international phone number.',
    },
  },
  whatsapp: {
    value: 'https://wa.me/971569698628',
    status: 'SUPPORTED',
    source: 'Derived from the supported international phone number.',
  },
  email: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No verified business email address exists.',
  },
  address: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No verified street address exists.',
  },
  hours: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No verified opening hours exist.',
  },
  pricing: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No owner-approved price list exists.',
  },
  schedule: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No owner-approved timetable exists.',
  },
  ageBands: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No owner-approved age bands exist.',
  },
  trialPolicy: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No owner-approved trial policy exists.',
  },
  ladiesOnly: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'Ladies-only availability is not confirmed.',
  },
  cancellationPolicy: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No owner-approved cancellation policy exists.',
  },
  social: {
    facebook: {
      platform: 'facebook',
      handle: 'facebook.com/1177131185475857',
      url: {
        value: 'https://www.facebook.com/1177131185475857',
        status: 'SUPPORTED',
        source: 'Numeric Facebook page id observed in the research baseline.',
      },
      isCandidate: false,
    },
    instagram: {
      platform: 'instagram',
      handle: '@_swim_fit_academy_',
      url: {
        value: 'https://www.instagram.com/_swim_fit_academy/',
        status: 'UNVERIFIED',
        source: 'Candidate profile only. Ownership requires owner confirmation.',
      },
      isCandidate: true,
    },
  },
  mark: {
    status: 'PROVISIONAL_SITE_MARK',
    label: 'PROVISIONAL_SITE_MARK',
  },
};

/** Facts the site is allowed to state as truth today. */
export function supportedFacts() {
  return {
    name: publicValue(business.name)!,
    city: publicValue(business.city)!,
    country: publicValue(business.country)!,
    phoneLocal: publicValue(business.phone.local)!,
    phoneInternational: publicValue(business.phone.international)!,
    tel: publicValue(business.phone.tel)!,
    whatsapp: publicValue(business.whatsapp)!,
    levels: publicValue(business.levels)!,
    facebookUrl: publicValue(business.social.facebook.url),
  };
}

/** Social links are only exposed when they clear the public-status policy. */
export function publicSocialLinks() {
  const facebook = publicValue(business.social.facebook.url);
  const instagram = business.social.instagram;
  return {
    facebook: facebook ? ({ ...business.social.facebook, url: facebook } as const) : null,
    instagram: isPublicStatus(instagram.url.status)
      ? ({ ...instagram, url: instagram.url.value } as const)
      : null,
  };
}