export const locales = ["en", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "Chinese",
  ja: "Japanese",
};

export const localeLabels: Record<Locale, { native: string; english: string }> =
  {
    en: { native: "English", english: "English" },
    zh: { native: "中文", english: "Chinese" },
    ja: { native: "日本語", english: "Japanese" },
  };
