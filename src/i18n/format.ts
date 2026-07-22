import type { Locale } from "./config";

// Date formatting options
export type DateFormat =
	| "short"
	| "medium"
	| "long"
	| "full"
	| "relative";

const dateFormatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
	short: { year: "numeric", month: "numeric", day: "numeric" },
	medium: { year: "numeric", month: "short", day: "numeric" },
	long: { year: "numeric", month: "long", day: "numeric" },
	full: {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	},
	relative: { year: "numeric", month: "numeric", day: "numeric" },
};

// Format date
export function formatDate(
	date: Date | string | number,
	locale: Locale,
	format: DateFormat = "medium",
): string {
	const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

	if (format === "relative") {
		return formatRelativeDate(d, locale);
	}

	return d.toLocaleDateString(locale, dateFormatOptions[format]);
}

// Relative date formatting (e.g., "2 days ago")
export function formatRelativeDate(date: Date, locale: Locale): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	const diffInMonths = Math.floor(diffInDays / 30);
	const diffInYears = Math.floor(diffInDays / 365);

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

	if (diffInSeconds < 60) {
		return rtf.format(-diffInSeconds, "second");
	}
	if (diffInMinutes < 60) {
		return rtf.format(-diffInMinutes, "minute");
	}
	if (diffInHours < 24) {
		return rtf.format(-diffInHours, "hour");
	}
	if (diffInDays < 30) {
		return rtf.format(-diffInDays, "day");
	}
	if (diffInMonths < 12) {
		return rtf.format(-diffInMonths, "month");
	}
	return rtf.format(-diffInYears, "year");
}

// Number formatting options
export type NumberFormat = "decimal" | "currency" | "percent";

// Format number
export function formatNumber(
	value: number,
	locale: Locale,
	format: NumberFormat = "decimal",
	options?: Intl.NumberFormatOptions,
): string {
	const defaultOptions: Record<NumberFormat, Intl.NumberFormatOptions> = {
		decimal: {},
		currency: { style: "currency", currency: "USD" },
		percent: { style: "percent" },
	};

	return value.toLocaleString(locale, { ...defaultOptions[format], ...options });
}

// Format currency
export function formatCurrency(
	value: number,
	locale: Locale,
	currency = "USD",
): string {
	return value.toLocaleString(locale, {
		style: "currency",
		currency,
	});
}

// Format compact number (e.g., 1K, 1M)
export function formatCompactNumber(value: number, locale: Locale): string {
	return value.toLocaleString(locale, {
		notation: "compact",
		compactDisplay: "short",
	});
}

// Create formatter instance for convenience
export function createFormatter(locale: Locale) {
	return {
		date: (date: Date | string | number, format?: DateFormat) =>
			formatDate(date, locale, format),
		relativeDate: (date: Date) => formatRelativeDate(date, locale),
		number: (value: number, format?: NumberFormat, options?: Intl.NumberFormatOptions) =>
			formatNumber(value, locale, format, options),
		currency: (value: number, currency?: string) =>
			formatCurrency(value, locale, currency),
		compact: (value: number) => formatCompactNumber(value, locale),
	};
}
