/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FRED_API_KEY: process.env.FRED_API_KEY,
  },
  webpack: (config) => {
    config.externals.push({
      '@std/testing/mock': 'mock',
      '@std/testing/bdd': 'bdd',
      '@gadicc/fetch-mock-cache/runtimes/deno.ts': 'deno.ts',
      '@gadicc/fetch-mock-cache/stores/fs.ts': 'fs.ts',
    });
    return config;
  },
};

module.exports = nextConfig;
