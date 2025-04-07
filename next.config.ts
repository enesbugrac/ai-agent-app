import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ["raw.githubusercontent.com", "assets.coingecko.com"],
  },
};

export default nextConfig;
