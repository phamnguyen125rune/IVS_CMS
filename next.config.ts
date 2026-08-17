import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';

    return [
      {
        // Bắt mọi request từ trình duyệt bắt đầu bằng /api/v1/
        source: '/api/v1/:path*',
        // Chuyển tiếp thẳng sang máy chủ Spring Boot Backend
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
