import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["plus.unsplash.com"], // For external images
    unoptimized: true, // Serve images as is (useful for local SVGs)
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // Allows importing SVGs as React components
    });
    return config;
  },
};

export default nextConfig;
