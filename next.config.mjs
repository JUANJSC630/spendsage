/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["oslo"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
