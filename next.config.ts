import type { NextConfig } from "next";

const staticHosting = process.env.FOUR_STATIC_HOSTING === "true";
const hostingBasePath = process.env.NEXT_PUBLIC_HOSTING_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(staticHosting ? { output: "export", basePath: hostingBasePath } : {}),
  images: {
    qualities: [75, 90, 95],
    ...(staticHosting
      ? {
          loader: "custom",
          loaderFile: "./src/lib/hosting-image-loader.ts",
          deviceSizes: [480, 768, 1024, 1440, 1920],
          imageSizes: [64, 128, 256, 384],
        }
      : {}),
  },
};

export default nextConfig;
