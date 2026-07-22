import { cache } from "react";
import type { Locale } from "./config";
import { createTranslator, getDictionary } from "./dictionaries";

/** Next.js 15+ params type for locale routes */
export type LocaleParams = Promise<{ language: string }>;

/** Extract and cache locale from Next.js params */
export const getLocale = cache(
  async (params: LocaleParams): Promise<Locale> => {
    const { language } = await params;
    return language as Locale;
  },
);

/** All-in-one helper for server component translations */
export async function getTranslation(params: LocaleParams) {
  const locale = await getLocale(params);
  const translator = createTranslator(locale);
  const dictionary = getDictionary(locale);

  return {
    ...translator,
    locale,
    dictionary,
  };
}
