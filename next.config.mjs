/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false
        return config;
    },
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com'],
    },

};

export default nextConfig;
