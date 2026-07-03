import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath,
  transpilePackages: ["@sky-fortune/engine", "@sky-fortune/content", "@sky-fortune/ai"],
};

export default nextConfig;
