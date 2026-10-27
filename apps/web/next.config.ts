import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo root (where pnpm-lock.yaml lives), so Next does not guess it.
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  images: {
    domains: ['images.unsplash.com', 'developers.google.com', 'img.icons8.com', 'i.postimg.cc'],
  },
};

export default nextConfig;
