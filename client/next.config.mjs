/** @type {import('next').NextConfig} */

import 'dotenv/config'

const nextConfig = {
    env: {
        API_PATHNAME: process.env.API_PATHNAME,
        SECRET: process.env.SECRET
    },
    output: 'standalone',
    async redirects(){
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true
            }
        ]
    }
};

export default nextConfig;
