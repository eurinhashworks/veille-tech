/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ['@tensorflow/tfjs-node', 'ml-regression'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    webpack: (config) => {
        config.externals = [...(config.externals || []), '@tensorflow/tfjs-node'];
        return config;
    },
    turbopack: {},
};

export default nextConfig;
