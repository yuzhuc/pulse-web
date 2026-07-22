import type { TranslationVars } from "./dictionaries";

/** Get nested value from object using key path array */
export function getNestedValue(obj: unknown, keyPath: string[]): unknown {
  let value: unknown = obj;

  for (const k of keyPath) {
    if (typeof value === "object" && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/** Replace {variable} placeholders with actual values */
export function interpolate(text: string, vars?: TranslationVars): string {
  if (!vars) return text;

  return Object.entries(vars).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }, text);
}

/** Plural rules for different languages */
const pluralRules: Record<string, (count: number) => string> = {
  // English, Chinese, Japanese, etc. (simple: one/other)
  en: (count) => (count === 1 ? "one" : "other"),
  zh: () => "other",
  ja: () => "other",
  // Russian, Polish, etc. (complex: one/few/many/other)
  ru: (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14))
      return "few";
    if (
      mod10 === 0 ||
      (mod10 >= 5 && mod10 <= 9) ||
      (mod100 >= 11 && mod100 <= 14)
    )
      return "many";
    return "other";
  },
  pl: (count) => {
    if (count === 1) return "one";
    if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
    )
      return "few";
    return "many";
  },
  ar: (count) => {
    if (count === 0) return "zero";
    if (count === 1) return "one";
    if (count === 2) return "two";
    if (count % 100 >= 3 && count % 100 <= 10) return "few";
    if (count % 100 >= 11 && count % 100 <= 99) return "many";
    return "other";
  },
};

/** Handle plural forms with locale-aware rules */
export function handlePlural(
  text: string,
  count: number,
  locale = "en",
): string {
  const parts = text.split("|");

  if (parts.length === 1) {
    return text;
  }

  // Parse plural forms: "zero:...|one:...|two:...|few:...|many:...|other:..."
  const forms: Record<string, string> = {};
  for (const part of parts) {
    const match = part.match(/^(zero|one|two|few|many|other):(.*)$/);
    if (match) {
      forms[match[1]] = match[2];
    }
  }

  // Get plural rule for locale
  const rule = pluralRules[locale] || pluralRules.en;
  const pluralForm = rule(count);

  // Return matching form or fallback to other
  return forms[pluralForm] ?? forms.other ?? text;
}

/** Right-to-left locale codes */
export const rtlLocales = ["ar", "he", "fa", "ur"] as const;
export type RTLLocale = (typeof rtlLocales)[number];

/** Check if locale is RTL */
export function isRTL(locale: string): boolean {
  return rtlLocales.includes(locale as RTLLocale);
}

/** Get text direction for locale */
export function getTextDirection(locale: string): "rtl" | "ltr" {
  return isRTL(locale) ? "rtl" : "ltr";
}

/** Deep compare two objects for key consistency */
export function deepCompareKeys(
  obj1: unknown,
  obj2: unknown,
  path = "",
): string[] {
  const missing: string[] = [];

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return missing;
  }

  const keys1 = Object.keys(obj1);

  // Check keys in obj1 but not in obj2
  for (const key of keys1) {
    const fullPath = path ? `${path}.${key}` : key;
    if (!(key in obj2)) {
      missing.push(fullPath);
    } else {
      const nested = deepCompareKeys(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key],
        fullPath,
      );
      missing.push(...nested);
    }
  }

  return missing;
}
