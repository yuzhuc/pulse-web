import { getTranslation, type LocaleParams } from "@/i18n/server";

export default async function Home({ params }: { params: LocaleParams }) {
	const { t } = await getTranslation(params);

	return (
		<div>
			<h1>{t("home.greeting", { name: "访客" })}</h1>
			<p>{t("home.intro")}</p>
		</div>
	);
}
