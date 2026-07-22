import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { locales, defaultLocale, type Locale } from "./i18n/config";

function getLocale(request: NextRequest): Locale {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  if (!languages || languages.length === 0) {
		return defaultLocale;
	}

	try {
		return match(languages, [...locales], defaultLocale) as Locale;
	} catch {
		return defaultLocale;
	}
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if accessing /{language} directly, redirect to /{language}/home
  const localeOnlyMatch = locales.find((locale) => pathname === `/${locale}`);
  if (localeOnlyMatch) {
    request.nextUrl.pathname = `/${localeOnlyMatch}/home`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some((locale) =>
    pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);

  // Redirect root to /{language}/home
  if (pathname === "/") {
    request.nextUrl.pathname = `/${locale}/home`;
  } else {
    request.nextUrl.pathname = `/${locale}${pathname}`;
  }

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Match all paths except:
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|.well-known|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
