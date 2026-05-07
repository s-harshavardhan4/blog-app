/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Expose API URL to browser at build time
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
