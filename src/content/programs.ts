import type { Sourced } from './business';

/**
 * Programs are organised by *skill intent* rather than commercial package
 * names, because no owner-approved package inventory exists.
 *
 * Nothing in this file may contain prices, session counts, class sizes, age
 * restrictions, ratios or guaranteed outcomes.
 */
export type ProgramId = 'start' | 'technique' | 'confidence' | 'performance';

export interface ProgramRecord {
  readonly id: ProgramId;
  readonly order: number;
  readonly marker: '01' | '02' | '03' | '04';
  readonly icon: 'entry' | 'rhythm' | 'balance' | 'flow';
  /** Visual depth used by the card waterline animation. */
  readonly depthPercent: number;
  /** Generic skill-intent cues rendered as a progress indicator, never a score. */
  readonly skillCues: readonly ProgramSkillCueId[];
}

export type ProgramSkillCueId =
  | 'water-comfort'
  | 'floating'
  | 'breath-control'
  | 'streamline'
  | 'kick'
  | 'stroke-coordination'
  | 'endurance'
  | 'race-readiness';

export const programs: readonly ProgramRecord[] = [
  {
    id: 'start',
    order: 1,
    marker: '01',
    icon: 'entry',
    depthPercent: 22,
    skillCues: ['water-comfort', 'floating', 'breath-control'],
  },
  {
    id: 'technique',
    order: 2,
    marker: '02',
    icon: 'rhythm',
    depthPercent: 44,
    skillCues: ['streamline', 'breath-control', 'kick'],
  },
  {
    id: 'confidence',
    order: 3,
    marker: '03',
    icon: 'balance',
    depthPercent: 66,
    skillCues: ['breath-control', 'stroke-coordination', 'streamline'],
  },
  {
    id: 'performance',
    order: 4,
    marker: '04',
    icon: 'flow',
    depthPercent: 88,
    skillCues: ['stroke-coordination', 'endurance', 'race-readiness'],
  },
];

export function programById(id: ProgramId): ProgramRecord {
  const found = programs.find((program) => program.id === id);
  if (!found) {
    throw new Error(`Unknown program id: ${id}`);
  }
  return found;
}

/** Ordered list for rendering. */
export function orderedPrograms(): readonly ProgramRecord[] {
  return [...programs].sort((a, b) => a.order - b.order);
}

/** Skill-intent selector used by /programs. It changes emphasis only. */
export type SkillPathSelection = 'beginner' | 'some-experience' | 'technique' | 'performance' | 'unsure';

export const skillPathSelections: readonly SkillPathSelection[] = [
  'beginner',
  'some-experience',
  'technique',
  'performance',
  'unsure',
];

export interface SkillPathRoute {
  readonly selection: SkillPathSelection;
  readonly emphasis: ProgramId;
  readonly note: Sourced<string | null>;
}

/**
 * The selector points at a *starting emphasis*, never at a purchasable package.
 */
export const skillPathRoutes: readonly SkillPathRoute[] = [
  {
    selection: 'beginner',
    emphasis: 'start',
    note: {
      value: 'Emphasis on water confidence and the first controlled movements.',
      status: 'SUPPORTED',
      source: 'Derived from the all-levels service statement.',
    },
  },
  {
    selection: 'some-experience',
    emphasis: 'technique',
    note: {
      value: 'Emphasis on rebuilding fundamentals with cleaner positions.',
      status: 'SUPPORTED',
      source: 'Derived from the all-levels service statement.',
    },
  },
  {
    selection: 'technique',
    emphasis: 'technique',
    note: {
      value: 'Emphasis on stroke mechanics, breathing pattern and rhythm.',
      status: 'SUPPORTED',
      source: 'Derived from the all-levels service statement.',
    },
  },
  {
    selection: 'performance',
    emphasis: 'performance',
    note: {
      value: 'Emphasis on coordination, efficiency and confident execution.',
      status: 'SUPPORTED',
      source: 'Derived from the all-levels service statement.',
    },
  },
  {
    selection: 'unsure',
    emphasis: 'confidence',
    note: {
      value: 'Emphasis on talking through the options before choosing.',
      status: 'SUPPORTED',
      source: 'Derived from the all-levels service statement.',
    },
  },
];

export function emphasisForSelection(selection: SkillPathSelection): ProgramId {
  return skillPathRoutes.find((route) => route.selection === selection)?.emphasis ?? 'confidence';
}