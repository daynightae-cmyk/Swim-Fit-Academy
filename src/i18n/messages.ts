import type { Locale } from '@/i18n/routing';

import ar from './messages/ar.json';
import en from './messages/en.json';

export const catalogs = { ar, en } as const;

export type MessageCatalog = (typeof ar) & typeof en;

/** Returns the catalogue for a locale, defaulting to Arabic. */
export function catalogFor(locale: Locale): MessageCatalog {
  return (locale === 'en' ? en : ar) as MessageCatalog;
}

type Leaves<T> = {
  [K in keyof T]: T[K] extends string
    ? K
    : T[K] extends readonly (infer U)[]
      ? U extends string
        ? K
        : never
      : Leaves<T[K]>;
}[keyof T];

/** Union of every leaf message key. Used to keep components type-safe against the catalogue. */
export type MessageKey = Leaves<typeof ar>;