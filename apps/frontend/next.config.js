/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'project-hub-files.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'project-hub-files.s3.ap-south-1.amazonaws.com' },
    ],
  },
};

module.exports = nextConfig;
