import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/COMET-fy-q4-25-26",
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
