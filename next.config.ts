import {withSentryConfig} from "@sentry/nextjs";
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

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "j-b3c8e5abd",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Automatically annotate React components to show their full name in breadcrumbs and session replay
reactComponentAnnotation: {
enabled: true,
},

// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
// tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});