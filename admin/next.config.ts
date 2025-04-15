import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3002',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;