import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // reactStrictMode: false,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  /* config options here */
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
