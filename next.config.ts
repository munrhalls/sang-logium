import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/category/:slug*",
        destination: "/categories/:slug*",
        permanent: true,
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
