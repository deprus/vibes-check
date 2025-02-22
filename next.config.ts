import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2678400,
    formats: ["image/webp"],
    remotePatterns: [
      {
        hostname: "33zof8hmxz.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
