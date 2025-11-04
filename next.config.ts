import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'battulaaljewels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-media.glamira.com',
      },
    ],
  },
};

export default nextConfig;
