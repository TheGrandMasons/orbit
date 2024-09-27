/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'out', // Ensure the built static files go into 'out'
  basePath: process.env.NODE_ENV === 'production' ? '/<repository-name>' : '', // GitHub Pages path
  reactStrictMode: true, // Enforce strict mode
  pageExtensions: ['js', 'jsx'], // Support page file types in 'pages' directory
  output: 'export', // Required for static export in Next.js
};

module.exports = nextConfig; // Stick to CommonJS export since it's used by default with Next.js
