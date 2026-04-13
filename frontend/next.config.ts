import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Appwrite storage — local development
        protocol: "http",
        hostname: "localhost",
        pathname: "/v1/storage/**",
      },
      {
        // Appwrite storage — production (update hostname when deployed)
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/storage/**",
      },
    ],
  },
};

export default nextConfig;
