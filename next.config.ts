import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  fallback: {
    "fs": false,
    "path": false,
    "os": false,
  }
};

export default nextConfig;
