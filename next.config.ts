import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['optqosltphgdqmdlkiuj.supabase.co'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
