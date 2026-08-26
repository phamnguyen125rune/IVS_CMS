// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   // Cho phép next/image tối ưu ảnh từ các domain bên ngoài
//   // Thêm domain khi tích hợp S3 hoặc Cloudinary
//   images: {
//     remotePatterns: [
//       // {
//       //   protocol: 'https',
//       //   hostname: '**.amazonaws.com',  // S3
//       // },
//       // {
//       //   protocol: 'https',
//       //   hostname: 'res.cloudinary.com', // Cloudinary
//       // },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
