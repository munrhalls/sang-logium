import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ["cdn.sanity.io"],
    formats: ["image/avif", "image/webp"],

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
