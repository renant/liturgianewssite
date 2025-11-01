import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import securityHeaders from "./headers";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable strict mode for better error detection
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable gzip compression
  
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.liturgianews.site",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
  },
  
  
  // Performance optimizations
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ["lucide-react", "@radix-ui/react-slot", "@radix-ui/react-label"],
  },
  
  // Headers for better caching and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
