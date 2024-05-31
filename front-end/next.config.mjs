/** @type {import('next').NextConfig} */

const nextConfig = {
    env :{
        WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID
    },
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false
      }
      return config
    }
};

export default nextConfig;