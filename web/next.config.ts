import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "",
  assetPrefix: "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
