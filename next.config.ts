/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.kassifi.com.br',
        pathname: '/storage/uploads/**',
      },
    ],
  },
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig;
