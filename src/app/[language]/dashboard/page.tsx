import { getTranslation, type LocaleParams } from "@/i18n/server";

export default async function Dashboard({ params }: { params: LocaleParams }) {
	const { t } = await getTranslation(params);

	return (
		<div>
			<h1>{t('dashboard.greeting', { name: '访客' })}</h1>
			<p>{t('dashboard.intro')}</p>
		</div>
	);
}
