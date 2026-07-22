import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN;
	const baseUrl = domain ? `https://${domain}` : "";

	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : undefined,
	};
}
