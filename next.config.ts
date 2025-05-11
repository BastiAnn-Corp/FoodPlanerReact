import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
  basePath: process.env.BASE_URL || '/FoodPlanerReact',
};

export default nextConfig;
