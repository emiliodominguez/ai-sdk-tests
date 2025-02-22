import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	sassOptions: {
		silenceDeprecations: ["legacy-js-api", "bogus-combinators"],
	},
};

export default nextConfig;
