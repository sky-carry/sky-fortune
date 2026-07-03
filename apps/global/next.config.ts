import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sky-fortune/engine", "@sky-fortune/content"],
};

export default nextConfig;
