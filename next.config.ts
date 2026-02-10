import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  // Production optimizations
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wpankbozgzatrprryzra.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
    ],
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;
