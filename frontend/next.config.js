/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    output: 'standalone', // For production Docker builds
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    },
    images: {
        domains: ['localhost'],
    },
}

module.exports = nextConfig
