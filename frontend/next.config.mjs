/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isDocker = process.env.DOCKER === 'true';
    const target = isDocker
      ? 'http://web:8000' // Docker Compose service name for backend
      : 'http://localhost:8000';
    return [
      { source: '/api/:path*', destination: `${target}/api/:path*` },
    ];
  },
  trailingSlash: false,
};

export default nextConfig;
