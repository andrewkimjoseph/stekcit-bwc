/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
    env : {
        WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID
    }
}

module.exports = nextConfig
