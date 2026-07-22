import { cache } from "react";
import type { Locale } from "./config";
import {
  getNestedValue,
  interpolate,
  handlePlural,
  deepCompareKeys,
} from "./utils";
import en from "./dictionaries/en.json";
import zh from "./dictionaries/zh.json";
import ja from "./dictionaries/ja.json";

/** Type-safe dictionary structure (inferred from en.json) */
export type Dictionary = typeof en;
export type DictionaryKeys = keyof Dictionary;

/** Build dot-notation key paths recursively */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & string];

/** All valid translation keys */
export type TranslationKey = NestedKeyOf<Dictionary>;

/** Interpolation variables */
export type TranslationVars = Record<string, string | number>;

/** Plural form options */
export interface PluralOptions {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/** Pre-loaded dictionaries */
const dictionaries: Record<Locale, Dictionary> = {
  en,
  zh,
  ja,
};

/** Fallback dictionary (English) */
const fallbackDict = dictionaries.en;

// Deep validate dictionary consistency in development
if (process.env.NODE_ENV === "development") {
  const missingInZh = deepCompareKeys(en, zh);
  const missingInJa = deepCompareKeys(en, ja);

  if (missingInZh.length > 0) {
    console.warn(`[i18n] Missing keys in zh.json: ${missingInZh.join(", ")}`);
  }

  if (missingInJa.length > 0) {
    console.warn(`[i18n] Missing keys in ja.json: ${missingInJa.join(", ")}`);
  }
}

/** Create cached translator with t() function for server components */
export const createTranslator = cache((locale: Locale) => {
  const dict = dictionaries[locale];

  function t(
    key: TranslationKey,
    vars?: TranslationVars,
    options?: { count?: number },
  ): string {
    const keys = key.split(".") as string[];

    // Try current locale first, fallback to English
    let value = getNestedValue(dict, keys);

    if (value === undefined) {
      value = getNestedValue(fallbackDict, keys);

      // Warn about missing translations in development
      if (process.env.NODE_ENV === "development" && value === undefined) {
        console.warn(
          `[i18n] Missing translation key: "${key}" (locale: ${locale})`,
        );
      }
    }

    if (value === undefined) return key;
    if (typeof value !== "string") return key;

    // Apply plural handling with locale-aware rules and interpolation
    let result = value;
    if (options?.count !== undefined) {
      result = handlePlural(result, options.count, locale);
    }
    result = interpolate(result, vars);

    return result;
  }

  return { t, dict, locale };
});

/** Get dictionary for locale (cached per request) */
export const getDictionary = cache((locale: Locale): Dictionary => {
  return dictionaries[locale];
});
