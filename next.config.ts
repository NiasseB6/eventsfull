/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brave-aardvark-778.convex.cloud',
      },
    ],
  },
};

module.exports = nextConfig;

