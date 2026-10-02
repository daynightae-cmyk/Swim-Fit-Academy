import type { Sourced } from './business';

/**
 * Coach profile slot.
 *
 * The public research material contained a self-declared statement about a
 * master's degree in swimming training, but neither the coach identity nor the
 * issuing institution was independently verified. Every field therefore stays
 * `null` until the academy supplies approved, publishable data.
 *
 * TODO_OWNER_DATA: coach profile requires owner verification.
 */
export interface CoachProfile {
  readonly name: Sourced<string | null>;
  readonly bio: Sourced<string | null>;
  readonly credentials: Sourced<readonly string[] | null>;
  readonly credentialIssuer: Sourced<string | null>;
  readonly portrait: Sourced<string | null>;
  readonly verificationStatus: 'PENDING_OWNER' | 'VERIFIED';
}

export const coachProfile: CoachProfile = {
  name: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'Coach full public name has not been supplied by the owner.',
  },
  bio: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No owner-approved coach biography exists.',
  },
  credentials: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'Self-declared only; wording not verified.',
  },
  credentialIssuer: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'Credential issuing institution has not been supplied.',
  },
  portrait: {
    value: null,
    status: 'OWNER_REQUIRED',
    source: 'No approved coach photography exists. Never substitute a generated face.',
  },
  verificationStatus: 'PENDING_OWNER',
};

export type MethodStageId =
  | 'comfort'
  | 'body-position'
  | 'breathing'
  | 'propulsion'
  | 'technique'
  | 'confidence';

export interface MethodStage {
  readonly id: MethodStageId;
  readonly order: number;
  readonly depthPercent: number;
  readonly icon: 'entry' | 'align' | 'lungs' | 'kick' | 'rhythm' | 'flow';
}

export interface TechniqueFocus {
  readonly id: 'breathing' | 'streamline' | 'balance' | 'rhythm' | 'efficiency';
  readonly icon: 'lungs' | 'arrow' | 'balance' | 'rhythm' | 'efficiency';
  readonly disclaimer: true;
}

/**
 * A teaching sequence, not a medical or safety guarantee.
 * Copy lives in the message catalogues; this file holds structure only.
 */
export const methodStages: readonly MethodStage[] = [
  { id: 'comfort', order: 1, depthPercent: 18, icon: 'entry' },
  { id: 'body-position', order: 2, depthPercent: 32, icon: 'align' },
  { id: 'breathing', order: 3, depthPercent: 46, icon: 'lungs' },
  { id: 'propulsion', order: 4, depthPercent: 60, icon: 'kick' },
  { id: 'technique', order: 5, depthPercent: 76, icon: 'rhythm' },
  { id: 'confidence', order: 6, depthPercent: 92, icon: 'flow' },
];

export const techniqueFocuses: readonly TechniqueFocus[] = [
  { id: 'breathing', icon: 'lungs', disclaimer: true },
  { id: 'streamline', icon: 'arrow', disclaimer: true },
  { id: 'balance', icon: 'balance', disclaimer: true },
  { id: 'rhythm', icon: 'rhythm', disclaimer: true },
  { id: 'efficiency', icon: 'efficiency', disclaimer: true },
];