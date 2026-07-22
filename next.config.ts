import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ['three'],
	output: 'standalone',
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		useLightningcss: true,
		webpackBuildWorker: true,
	},
	poweredByHeader: false,
	generateEtags: false,
};

export default nextConfig;
