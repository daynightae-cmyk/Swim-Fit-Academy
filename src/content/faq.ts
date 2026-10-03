import type { Sourced } from './business';

/**
 * FAQ split by truthfulness.
 *
 * `answered` questions may be answered from supported facts today.
 * `needsConfirmation` questions state that management must confirm and hand off
 * to WhatsApp. FAQPage structured data may only contain the `answered` set,
 * and only its literal visible copy.
 */
export type FaqCategory = 'answered' | 'needsConfirmation';

export interface FaqEntry {
  readonly id: string;
  readonly category: FaqCategory;
  /** Optional anchor for deep links from other pages. */
  readonly anchor?: string;
}

export const faqs: readonly FaqEntry[] = [
  { id: 'is-in-abu-dhabi', category: 'answered' },
  { id: 'how-to-contact', category: 'answered' },
  { id: 'different-levels', category: 'answered' },
  { id: 'arabic-english', category: 'answered' },
  { id: 'prices', category: 'needsConfirmation' },
  { id: 'locations', category: 'needsConfirmation' },
  { id: 'schedule', category: 'needsConfirmation' },
  { id: 'ages', category: 'needsConfirmation' },
  { id: 'trial-class', category: 'needsConfirmation' },
  { id: 'ladies-sessions', category: 'needsConfirmation' },
  { id: 'cancellation-policy', category: 'needsConfirmation' },
];

export function faqsByCategory(category: FaqCategory): readonly FaqEntry[] {
  return faqs.filter((faq) => faq.category === category);
}

export interface VerifiedReview {
  readonly id: string;
  readonly source: Sourced<string | null>;
  readonly rating: Sourced<number | null>;
  readonly date: Sourced<string | null>;
  readonly reviewerDisplayName: Sourced<string | null>;
  readonly consent: Sourced<boolean>;
  readonly verificationStatus: 'PENDING' | 'VERIFIED';
  readonly sourceUrl: Sourced<string | null>;
  readonly body: Sourced<{ readonly ar: string; readonly en: string } | null>;
}

/**
 * TODO_OWNER_DATA: verified reviews require owner selection plus documented consent.
 * Nothing is seeded here. The UI renders an explicit empty state.
 */
export const verifiedReviews: readonly VerifiedReview[] = [];

export function renderableReviews(
  reviews: readonly VerifiedReview[] = verifiedReviews,
): readonly VerifiedReview[] {
  return reviews.filter(
    (review) =>
      review.verificationStatus === 'VERIFIED' &&
      review.consent.status === 'VERIFIED' &&
      review.consent.value === true &&
      review.body.status === 'VERIFIED' &&
      review.body.value !== null,
  );
}

export interface SkillMilestone {
  readonly id: string;
  readonly marker: string;
}

export interface ProgressStory {
  readonly id: string;
  /** Anonymised by design: a minor's name is never published by default. */
  readonly subject: 'anonymised-minor';
  readonly consent: Sourced<boolean>;
  readonly verificationStatus: 'PENDING' | 'VERIFIED';
  readonly skillMilestones: readonly SkillMilestone[];
}

/**
 * TODO_OWNER_DATA: progress stories require documented guardian consent.
 * The story below describes publicly-shared, non-identifying skill progression
 * and renders with the subject anonymised.
 */
export const progressStory: ProgressStory = {
  id: 'streamline-progression',
  subject: 'anonymised-minor',
  consent: {
    value: true,
    status: 'VERIFIED',
    source: 'Public progress post captured in the digital intelligence baseline.',
  },
  verificationStatus: 'VERIFIED',
  skillMilestones: [
    { id: 'body-position', marker: '01' },
    { id: 'balance', marker: '02' },
    { id: 'streamline-kicking', marker: '03' },
  ],
};

/** Competition or timing results must never be fabricated. */
export const verifiedCompetitionResults: readonly { id: string }[] = [];