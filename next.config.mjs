/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // penting untuk GitHub Pages
  images: {
    unoptimized: true,
  },
  basePath: '/laporan_pendapatan_terapis', // sesuaikan dengan nama repo kamu
  assetPrefix: '/laporan_pendapatan_terapis/',
};

export default nextConfig;
