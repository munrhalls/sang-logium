import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   turbo: {
  //     treeShaking: true,
  //     rules: {
  //       "*.svg": {
  //         loaders: ["@svgr/webpack"],
  //         as: "*.js",
  //       },
  //     },
  //   },
  // },

  // webpack: (config, { dev, isServer }) => {
  //   config.optimization.splitChunks = {
  //     chunks: "all",
  //     minSize: 20000,
  //     maxSize: 70000,
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: "vendors",
  //         chunks: "all",
  //       },
  //     },
  //   };
  //   if (!dev && !isServer) {
  //     config.optimization.usedExports = true;
  //   }

  //   // const fileLoaderRule = config.module.rules.find(
  //   //   (rule: RuleSetRule) =>
  //   //     rule.test instanceof RegExp && rule.test.test(".svg")
  //   // );

  //   // config.module.rules.push(
  //   //   {
  //   //     ...fileLoaderRule,
  //   //     test: /\.svg$/i,
  //   //     resourceQuery: /url/, // *.svg?url
  //   //   },
  //   //   {
  //   //     test: /\.svg$/i,
  //   //     issuer: fileLoaderRule.issuer,
  //   //     resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
  //   //     use: ["@svgr/webpack"],
  //   //   }
  //   // );

  //   // fileLoaderRule.exclude = /\.svg$/i;

  //   return config;
  // },

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

export default nextConfig;
