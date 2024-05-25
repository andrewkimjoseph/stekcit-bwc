/** @type {import('next').NextConfig} */

import dotenv from 'dotenv'

const nextConfig = {
    env :{
        WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID
    }
};

export default nextConfig;
