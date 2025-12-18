import type { NextConfig } from 'next';

// Ensure Prisma uses the binary engine in dev/runtime (avoid Accelerate "client" engine).
if (process.env.PRISMA_CLIENT_ENGINE_TYPE !== 'binary') {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';
}
if (process.env.PRISMA_ACCELERATE_URL) {
  delete process.env.PRISMA_ACCELERATE_URL;
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
