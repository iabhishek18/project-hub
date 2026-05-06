/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['project-hub-files.s3.amazonaws.com', 'project-hub-files.s3.ap-south-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
