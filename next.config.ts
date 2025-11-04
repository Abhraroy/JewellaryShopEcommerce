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
      {
        protocol: 'https',
        hostname: 'www.onlinepng.com',
      },
    ],
  },
};

export default nextConfig;
