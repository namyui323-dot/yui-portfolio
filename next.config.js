const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 구글 드라이브 사진을 사이트에서 쓸 수 있게 허용
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
  experimental: {
    serverActions: {},
  },
};

module.exports = withNextIntl(nextConfig);
