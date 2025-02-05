import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 优化构建输出
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      '@clerk/nextjs',
      'framer-motion',
      'lucide-react',
      'date-fns'
    ],
    turbo: {
      rules: {
        '*.js': ['jsx-loader']
      }
    },
    optimizeCss: true
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
}

export default nextConfig
