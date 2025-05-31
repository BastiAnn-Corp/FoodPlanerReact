import type { NextConfig } from "next";
import {envVars} from "@/util/config";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
  basePath: envVars.baseURL,
};

export default nextConfig;
