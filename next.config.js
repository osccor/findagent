/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // SWC transform for styled-components: SSR consistency, minification and
  // readable display names. Mirrors the Boneo production setup.
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
