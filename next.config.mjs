/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/economic-demographic-trend-rag' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/economic-demographic-trend-rag/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
