import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sky-fortune/engine", "@sky-fortune/content", "@sky-fortune/ai"],
};

export default nextConfig;
