require('dotenv').config();
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  /**
   * We have special extensions here for page components, because we want to
   * test unit tests right beside our page, and having extension this way
   * can prevent next.js from regarding those files as page components.
   */
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },
  images: {
    domains: ['avatars.dicebear.com'],
  },
  dir: './src',
};

module.exports = nextConfig;
