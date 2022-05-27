/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en-US", "fr", "ru", "de", "ja"],
    defaultLocale: "en-US"
  },
  reactStrictMode: true,
  experimental: {
    outputStandalone: true
  },
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:slug*",
            destination: `http://localhost/api/:slug*`
          }
        ]
      : [];
  }
};

const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()(nextConfig);
