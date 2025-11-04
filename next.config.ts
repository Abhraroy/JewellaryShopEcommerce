import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'battulaaljewels.com',
      },
    ],
  },
};

export default nextConfig;
