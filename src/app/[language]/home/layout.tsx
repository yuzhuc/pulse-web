import type { Metadata } from "next";
import { getTranslation, type LocaleParams } from "@/i18n/server";
import { generateAlternates, generateLocaleStaticParams } from "@/i18n/metadata";

export const generateStaticParams = generateLocaleStaticParams;

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
	const { t, locale } = await getTranslation(params);
	const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "";
	const baseUrl = domain ? `https://${domain}` : "";

	return {
		title: t('site.title.home'),
		description: t('site.description.home'),
		alternates: generateAlternates(`/${locale}/home`),
		openGraph: {
			title: t('site.title.home'),
			description: t('site.description.home'),
			url: `${baseUrl}/${locale}/home`,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: t('site.title.home'),
			description: t('site.description.home'),
		},
	};
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
