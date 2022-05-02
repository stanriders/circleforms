/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en-US", "fr", "ru", "de", "ja"],
    defaultLocale: "en-US",
  },
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
};

module.exports = nextConfig;
