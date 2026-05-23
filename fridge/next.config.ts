import type { NextConfig } from 'next';

const config: NextConfig = {
  // Allow large base64 image payloads from the fridge camera
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};

export default config;
