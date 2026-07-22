import type { Metadata } from "next";
import { locales, defaultLocale } from "./config";

/** Generate alternates metadata for SEO (canonical + hreflang) */
export function generateAlternates(path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = `/${locale}${path}`;
  }

  return {
    canonical: path,
    languages: {
      ...languages,
      "x-default": `/${defaultLocale}${path}`,
    },
  };
}

/** Generate static params for all locales */
export function generateLocaleStaticParams() {
  return locales.map((locale) => ({ language: locale }));
}
