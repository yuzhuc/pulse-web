import type { Metadata } from "next";
import { getTranslation, type LocaleParams } from "@/i18n/server";
import { generateAlternates, generateLocaleStaticParams } from "@/i18n/metadata";

export const generateStaticParams = generateLocaleStaticParams;

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
	const { t, locale } = await getTranslation(params);
	const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "";
	const baseUrl = domain ? `https://${domain}` : "";

	return {
		title: t("site.title.dashboard"),
		description: t("site.description.dashboard"),
		alternates: generateAlternates(`/${locale}/dashboard`),
		openGraph: {
			title: t("site.title.dashboard"),
			description: t("site.description.dashboard"),
			url: `${baseUrl}/${locale}/dashboard`,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: t("site.title.dashboard"),
			description: t("site.description.dashboard"),
		},
	};
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
