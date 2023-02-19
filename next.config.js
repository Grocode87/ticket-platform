/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/koachella",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
