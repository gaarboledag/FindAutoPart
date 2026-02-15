/** @type {import('next').NextConfig} */

// Extract origin (protocol + domain) from API URL for CSP
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const apiOrigin = (() => {
    try { return new URL(apiUrl).origin; } catch { return ''; }
})();

const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    output: 'standalone',
    env: {
        NEXT_PUBLIC_API_URL: apiUrl,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Security Headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "img-src 'self' data: blob: https:",
                            "font-src 'self' https://fonts.gstatic.com",
                            `connect-src 'self' ${apiOrigin} wss: ws: https://*.r2.cloudflarestorage.com`,
                            "media-src 'self' https://assets.mixkit.co",
                            "frame-src 'none'",
                            "object-src 'none'",
                        ].join('; '),
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig
