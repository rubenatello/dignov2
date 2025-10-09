import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const override = process.env.BACKEND_ORIGIN;
    const isDocker = process.env.DOCKER === 'true';
    const target = override
      ? override.replace(/\/$/, '')
      : isDocker
        ? 'http://web:8000'
        : 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*/`, // always add trailing slash
      },
      // Proxy media files from backend so browser can load /media/* from frontend origin
      {
        source: '/media/:path*',
        destination: `${target}/media/:path*`, // IMPORTANT: no trailing slash for files
      },
    ];
  },
  trailingSlash: true,
};

export default nextConfig;
