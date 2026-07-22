"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary, TranslationKey, TranslationVars } from "./dictionaries";
import { getNestedValue, interpolate, handlePlural } from "./utils";

interface I18nContextType {
	locale: Locale;
	dictionary: Dictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
	children,
	locale,
	dictionary,
}: {
	children: ReactNode;
	locale: Locale;
	dictionary: Dictionary;
}) {
	return (
		<I18nContext.Provider value={{ locale, dictionary }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within an I18nProvider");
	}
	return context;
}

export function useLocale() {
	return useI18n().locale;
}

export function useDictionary() {
	return useI18n().dictionary;
}

// Type-safe translation hook
export function useTranslator() {
	const { dictionary, locale } = useI18n();

	function t(
		key: TranslationKey,
		vars?: TranslationVars,
		options?: { count?: number },
	): string {
		const keys = key.split(".") as string[];
		const value = getNestedValue(dictionary, keys);

		if (value === undefined) {
			if (process.env.NODE_ENV === "development") {
				console.warn(`[i18n] Missing translation key: "${key}" (locale: ${locale})`);
			}
			return key;
		}

		if (typeof value !== "string") {
			return key;
		}

		let result = value;
		if (options?.count !== undefined) {
			result = handlePlural(result, options.count, locale);
		}

		result = interpolate(result, vars);

		return result;
	}

	return { t };
}
