import { formatUtmLine, type UtmParams } from './utm';

export const SWIMMER_TYPES = ['child', 'adult', 'self'] as const;
export type SwimmerType = (typeof SWIMMER_TYPES)[number];

export const LEVELS = ['none', 'basic', 'regular', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

export const CONTACT_LANGUAGES = ['arabic', 'english', 'either'] as const;
export type ContactLanguage = (typeof CONTACT_LANGUAGES)[number];

export const PROGRAM_IDS = ['start', 'technique', 'confidence', 'performance'] as const;
export type ProgramContext = (typeof PROGRAM_IDS)[number];

const LABELS = {
  ar: {
    program: 'البرنامج',
    name: 'الاسم',
    swimmer: 'المتدرب',
    level: 'المستوى الحالي',
    language: 'لغة التواصل',
    notes: 'ملاحظات',
    source: 'مصدر الزيارة',
    consent: 'موافقة التواصل عبر واتساب',
    child: 'طفل',
    adult: 'بالغ',
    self: 'أنا بنفسي',
    none: 'لا أسبح / أبدأ من الصفر',
    basic: 'أعرف السباحة بشكل بسيط',
    regular: 'أسبح بانتظام',
    advanced: 'مستواي متقدم وأريد تحسينه',
    either: 'أي لغة',
    arabic: 'العربية',
    english: 'الإنجليزية',
    programNames: {
      start: 'ابدأ السباحة',
      technique: 'طوّر الأساسيات',
      confidence: 'ابنِ الثقة',
      performance: 'ارتقِ بالأداء',
    },
  },
  en: {
    program: 'Program',
    name: 'Name',
    swimmer: 'Swimmer',
    level: 'Current level',
    language: 'Preferred language',
    notes: 'Notes',
    source: 'Visit source',
    consent: 'Consent to be contacted on WhatsApp',
    child: 'A child',
    adult: 'An adult',
    self: 'Myself',
    none: 'I do not swim / starting from scratch',
    basic: 'I can swim a little',
    regular: 'I swim regularly',
    advanced: 'I am advanced and want to improve',
    either: 'Either is fine',
    arabic: 'Arabic',
    english: 'English',
    programNames: {
      start: 'Start Swimming',
      technique: 'Build Technique',
      confidence: 'Build Confidence',
      performance: 'Advance Performance',
    },
  },
} as const;

export type MessageLocale = keyof typeof LABELS;

/** Reads a flat label from the active catalogue. */
function label(locale: MessageLocale, key: string): string {
  const entry = LABELS[locale] as unknown as Record<string, unknown>;
  const value = entry[key];
  return typeof value === 'string' ? value : key;
}

export function localizedSwimmerType(locale: MessageLocale, value: SwimmerType): string {
  return label(locale, value);
}

export function localizedLevel(locale: MessageLocale, value: Level): string {
  return label(locale, value);
}

export function localizedContactLanguage(locale: MessageLocale, value: ContactLanguage): string {
  return label(locale, value);
}

export function localizedProgramName(locale: MessageLocale, value: ProgramContext): string {
  return LABELS[locale].programNames[value];
}

export interface TrialRequestInput {
  readonly name: string;
  readonly phone: string;
  readonly swimmerType: SwimmerType;
  readonly level: Level;
  readonly language: ContactLanguage;
  readonly notes?: string;
  readonly consent: boolean;
  readonly program?: ProgramContext;
}

const MAX_NOTES = 320;

function cleanLine(value: string, max = 120): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

/**
 * Builds the prefilled WhatsApp message for a trial request.
 * Deterministic and unit-tested: the same input always yields the same text.
 */
export function buildTrialMessage(
  input: TrialRequestInput,
  locale: MessageLocale,
  utm: UtmParams = {},
): string {
  const t = LABELS[locale] as unknown as Record<string, string>;
  const lines: string[] = [];

  lines.push(locale === 'ar' ? 'مرحبًا Swim Fit Academy 👋' : 'Hello Swim Fit Academy 👋');
  lines.push(
    locale === 'ar' ? 'أرغب في معرفة البرنامج المناسب.' : 'I would like to ask about the right program.',
  );
  lines.push('');

  if (input.program) {
    lines.push(`${t.program}: ${localizedProgramName(locale, input.program)}`);
  }

  lines.push(`${t.name}: ${cleanLine(input.name)}`);
  lines.push(`${t.swimmer}: ${localizedSwimmerType(locale, input.swimmerType)}`);
  lines.push(`${t.level}: ${localizedLevel(locale, input.level)}`);
  lines.push(`${t.language}: ${localizedContactLanguage(locale, input.language)}`);

  const notes = cleanLine(input.notes ?? '', MAX_NOTES);
  if (notes) {
    lines.push(`${t.notes}: ${notes}`);
  }

  lines.push(`${t.consent}: ${input.consent ? (locale === 'ar' ? 'موافق' : 'Yes') : locale === 'ar' ? 'غير موافق' : 'No'}`);

  const attribution = formatUtmLine(utm);
  if (attribution) {
    lines.push(`${t.source}: ${attribution}`);
  }

  return lines.join('\n');
}

/** Short message used by program cards and poster CTAs. */
export function buildProgramMessage(program: ProgramContext, locale: MessageLocale): string {
  const name = localizedProgramName(locale, program);
  return locale === 'ar'
    ? `مرحبًا Swim Fit Academy 👋\nأرغب في الاستفسار عن برنامج «${name}».`
    : `Hello Swim Fit Academy 👋\nI would like to ask about the ${name} path.`;
}

/** Generic enquiry message for header, hero, footer and posters. */
export function buildGeneralMessage(locale: MessageLocale, intent?: string): string {
  const base =
    locale === 'ar' ? 'مرحبًا Swim Fit Academy 👋\nأرغب في الاستفسار عن تدريب السباحة.'
      : 'Hello Swim Fit Academy 👋\nI would like to ask about swimming training.';
  if (!intent) return base;
  return `${base}\n${intent}`;
}