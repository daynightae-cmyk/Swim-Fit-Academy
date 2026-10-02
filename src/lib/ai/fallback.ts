/**
 * Deterministic local concierge responder.
 *
 * This runs whenever `GEMINI_API_KEY` is absent, and it obeys exactly the same
 * truth policy as the live model: known facts are answered, owner-required
 * details are stated as needing management confirmation, and a WhatsApp handoff
 * is always offered. It never claims to be Gemini.
 *
 * Copy lives in the centralised message catalogues (`src/i18n/messages/*.json`)
 * so Arabic and English stay in one place.
 */

import arMessages from '@/i18n/messages/ar.json';
import enMessages from '@/i18n/messages/en.json';

import type { ConciergeMode, HandoffPayload } from './schemas';
import { buildWhatsAppUrl } from '../whatsapp';

export type ConciergeIntent =
  | 'greeting'
  | 'programs'
  | 'beginner'
  | 'technique'
  | 'locations'
  | 'schedule'
  | 'pricing'
  | 'trial'
  | 'ladies'
  | 'coach'
  | 'contact'
  | 'phone'
  | 'whatsapp'
  | 'language'
  | 'reviews'
  | 'unclear';

export interface LocalAnswer {
  readonly intent: ConciergeIntent;
  readonly text: string;
  readonly requiresHandoff: boolean;
  readonly handoffReason: string;
  readonly chips: readonly string[];
  readonly mode: ConciergeMode;
}

type Catalog = typeof enMessages;

function catalogFor(locale: 'ar' | 'en'): Catalog {
  return (locale === 'ar' ? arMessages : enMessages) as unknown as Catalog;
}

/* -------------------------------------------------------------------------- */
/* Intent detection                                                           */
/* -------------------------------------------------------------------------- */

const AR_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(AR_DIACRITICS, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .replace(/[\u0624\u0626]/g, '\u064A')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeLatin(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Ordered rules: the first match wins, so commercial topics are checked first. */
const RULES: readonly { intent: ConciergeIntent; ar: readonly string[]; en: readonly string[] }[] = [
  {
    intent: 'pricing',
    ar: ['اسعار', 'سعر', 'بكام', 'الاشتراك', 'تكلفه', 'خصم', 'عروض', 'باقه', 'باقات', 'التمويل'],
    en: [
      'price',
      'prices',
      'pricing',
      'cost',
      'how much',
      'fee',
      'fees',
      'discount',
      'offer',
      'package',
      'packages',
      'subscription',
      'affordable',
    ],
  },
  {
    intent: 'schedule',
    ar: ['المواعيد', 'مواعيد', 'الجدول', 'جدول', 'الوقت', 'ساعات', 'الدوام', 'متي', 'ايام', 'الاحد', 'السبت', 'مسائي', 'صباحي'],
    en: [
      'schedule',
      'timing',
      'timetable',
      'hours',
      'opening',
      'when',
      'what time',
      'days',
      'week',
      'weekend',
      'evening',
      'morning',
    ],
  },
  {
    intent: 'locations',
    ar: ['المواقع', 'موقع', 'الموقع', 'الحوض', 'المسبح', 'عنوان', 'مكان', 'منطقه', 'خليج', 'المرفأ', 'العين', 'الريم', 'ابوظبي'],
    en: [
      'location',
      'locations',
      'pool',
      'pools',
      'address',
      'venue',
      'where',
      'map',
      'khalifa',
      'yas',
      'reem',
      'corniche',
      'abu dhabi',
    ],
  },
  {
    intent: 'trial',
    ar: ['تجربه', 'الحصه التجريبيه', 'زياره', 'حجز', 'احجز', 'اشترك', 'تسجيل'],
    en: [
      'trial',
      'trial class',
      'book',
      'booking',
      'reserve',
      'reservation',
      'first class',
      'sign up',
      'signup',
      'enroll',
    ],
  },
  {
    intent: 'ladies',
    ar: ['نساء', 'النساء', 'سيدات', 'السيدات', 'بنات', 'اناث'],
    en: ['ladies', 'lady', 'women', 'women only', 'female', 'girls only', 'girls'],
  },
  {
    intent: 'coach',
    ar: ['المدرب', 'المدربه', 'مدرس', 'المعلم', 'شهاده', 'مؤهل', 'مؤهلات', 'خبره', 'مؤهلات Academ', 'الدرجه'],
    en: [
      'coach',
      'trainer',
      'teacher',
      'instructor',
      'credential',
      'credentials',
      'certificate',
      'degree',
      'qualified',
      'who teaches',
      'staff',
      'experience',
    ],
  },
  {
    intent: 'reviews',
    ar: ['تقييم', 'تقييمات', 'مراجعات', 'راي', 'اراء', 'نجوم', 'نجمه', 'ميداليه', 'جوائز', 'الطلاب', 'سنوات'],
    en: [
      'review',
      'reviews',
      'rating',
      'ratings',
      'stars',
      'testimonial',
      'award',
      'awards',
      'medal',
      'how many students',
      'years',
    ],
  },
  {
    intent: 'phone',
    ar: ['رقم', 'الهاتف', 'التليفون', 'اتصال', 'اتصل', 'كلمني', 'موبايل', 'جوال'],
    en: ['phone', 'call', 'number', 'telephone', 'mobile', 'ring me', 'contact number'],
  },
  {
    intent: 'whatsapp',
    ar: ['واتساب', 'واتس اب', 'واتساب', 'راسلني', 'تواصل', 'تواصل معنا', 'كلمني عبر'],
    en: ['whatsapp', 'message me', 'text me', 'dm', 'reach you', 'get in touch', 'contact you'],
  },
  {
    intent: 'beginner',
    ar: ['مبتدئ', 'مبتدئه', 'اول مره', 'من الصفر', 'ما بعرف سباحه', 'مش بعرف', 'ابدأ', 'ابدا'],
    en: [
      'beginner',
      'beginners',
      'starting',
      'first time',
      'never swam',
      'no experience',
      'from scratch',
      'total beginner',
      'zero',
    ],
  },
  {
    intent: 'technique',
    ar: ['تقنيه', 'اعداد', 'اصلاح', 'تحسين', 'اطور', 'تطوير', 'الستايل', 'الحركه', 'نفس'],
    en: [
      'technique',
      'techniques',
      'fix',
      'improve',
      'form',
      'stroke',
      'breathing',
      'butterfly',
      'breaststroke',
      'freestyle',
      'backstroke',
      'better at',
    ],
  },
  {
    intent: 'programs',
    ar: ['برامج', 'برنامج', 'ماذا تقدمون', 'ماذا تقدم', 'خدماتكم', 'خدمه', 'خيارات', 'مسارات', 'مستويات', 'مناسب'],
    en: ['program', 'programs', 'what do you offer', 'what do you do', 'services', 'options', 'paths', 'levels'],
  },
  {
    intent: 'language',
    ar: ['انجليزي', 'عربي', 'لغه', 'تتكلم', 'تحدث', 'لغتي'],
    en: ['english', 'arabic', 'language', 'speak', 'do you speak', 'bilingual'],
  },
  {
    intent: 'contact',
    ar: ['تواصل معنا', 'التواصل', 'ازاي اتواصل', 'كيف اتواصل', 'اتصل بنا'],
    en: ['contact', 'contact us', 'reach', 'get in touch'],
  },
  {
    intent: 'greeting',
    ar: ['مرحبا', 'السلام عليكم', 'اهلا', 'هلا', 'صباح الخير', 'مساء الخير', 'هاي'],
    en: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salam'],
  },
];

export function detectIntent(rawMessage: string): ConciergeIntent {
  const ar = normalizeArabic(rawMessage);
  const en = normalizeLatin(rawMessage);

  for (const rule of RULES) {
    if (rule.ar.some((needle) => ar.includes(normalizeArabic(needle)))) {
      return rule.intent;
    }
    if (rule.en.some((needle) => en.includes(needle))) {
      return rule.intent;
    }
  }
  return 'unclear';
}

/* -------------------------------------------------------------------------- */
/* Policy                                                                    */
/* -------------------------------------------------------------------------- */

/** Intents whose honest answer is "management must confirm this". */
const HANDOFF_INTENTS: readonly ConciergeIntent[] = [
  'pricing',
  'schedule',
  'locations',
  'trial',
  'ladies',
  'coach',
  'reviews',
  'unclear',
];

export function requiresHandoff(intent: ConciergeIntent): boolean {
  return HANDOFF_INTENTS.includes(intent);
}

/* -------------------------------------------------------------------------- */
/* Responder                                                                 */
/* -------------------------------------------------------------------------- */

export function buildHandoff(locale: 'ar' | 'en', reason: string): HandoffPayload {
  const catalog = catalogFor(locale);
  return {
    type: 'handoff',
    locale,
    reason,
    whatsappUrl: buildWhatsAppUrl(catalog.concierge.handoff.prefill),
  };
}

export interface FallbackOptions {
  readonly program?: 'start' | 'technique' | 'confidence' | 'performance';
}

/**
 * Deterministic answer used when no live model is configured, or when the live
 * model is unavailable. Pure function: the same input always produces the same
 * output.
 */
export function localConciergeAnswer(
  locale: 'ar' | 'en',
  rawMessage: string,
  _options: FallbackOptions = {},
): LocalAnswer {
  const catalog = catalogFor(locale);
  const intent = detectIntent(rawMessage);
  const answers = catalog.concierge.answers as Record<string, string | undefined>;

  const text = answers[intent] ?? answers.unclear ?? '';
  const handoff = requiresHandoff(intent);

  const chips = handoff
    ? catalog.concierge.chipsAfterHandoff
    : ((catalog.concierge.chipsByIntent as Record<string, readonly string[]>)[intent] ??
      catalog.concierge.chips);

  return {
    intent,
    text,
    requiresHandoff: handoff,
    handoffReason: handoff ? catalog.concierge.handoff.reason : '',
    chips,
    mode: 'local',
  };
}