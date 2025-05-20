/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  trailingSlash: false,
  // ——— remove experimental altogether ———
  // experimental: {
  //   appDir: true,
  // },
};

module.exports = nextConfig;
