import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.radargp.com",
        // hostname: "image.grandchef.info",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["192.168.0.146", "172.19.0.1"],
};

export default nextConfig;
