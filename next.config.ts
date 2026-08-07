import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
  globPublicPatterns: ["**/*.{js,ts,tsx,json,html,css,woff2,svg,png,jpg,ico,webmanifest}"],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
});

const nextConfig: NextConfig = withSerwist({
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/audio/proxy",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
        ],
      },
    ];
  },
});

export default nextConfig;
