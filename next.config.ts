import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
      {
        hostname: 'jxeovzqwohfpfwrqtgbc.supabase.co',
      },
    ],
  },
};
export default nextConfig;
