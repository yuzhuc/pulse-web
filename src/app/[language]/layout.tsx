import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale, type LocaleParams } from "@/i18n/server";
import { I18nProvider } from "@/i18n/context";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "";

export const metadata: Metadata = {
	metadataBase: domain ? new URL(`https://${domain}`) : undefined,
	title: {
		template: 'Bun-Next | %s',
		default: 'Bun-Next',
	},
};

export function generateStaticParams() {
	return locales.map((locale) => ({ language: locale }));
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: LocaleParams;
}>) {
	const locale = await getLocale(params);
	const dict = getDictionary(locale);

	return (
		<html
			lang={locale}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="relative">
				<I18nProvider locale={locale} dictionary={dict}>
					{children}
				</I18nProvider>
			</body>
		</html>
	);
}
