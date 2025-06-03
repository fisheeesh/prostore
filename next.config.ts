import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      }
    ]
  },
  typescript: {
    //* This will still allow production build with type errors!
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
