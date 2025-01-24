/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
      serverComponentsExternalPackages: ['libreoffice-convert'],
    },
  }
  
  export default nextConfig