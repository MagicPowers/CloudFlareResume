import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Every route on this site prerenders, so it ships as a plain folder of
   * files. That keeps it hostable free on any static host and removes the
   * runtime image optimiser as a dependency — derivatives are generated at
   * build time instead (see scripts/build-gallery.mjs).
   */
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
