/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FRED_API_KEY: process.env.FRED_API_KEY,
  },
}

module.exports = nextConfig
