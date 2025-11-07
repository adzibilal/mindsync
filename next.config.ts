import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude pdf-parse-new from bundling untuk compatibility
  serverExternalPackages: ["pdf-parse-new"],
};

export default nextConfig;
