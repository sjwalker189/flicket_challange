import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: "http://localhost:3001/graphql",
      },
    ];
  },
};

export default nextConfig;
