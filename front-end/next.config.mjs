/** @type {import('next').NextConfig} */

const nextConfig = {
    env :{
        WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID
    }
};

export default nextConfig;
