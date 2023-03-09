/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com'
      },
    ],
  },
};

// module.exports = {
//   nextConfig,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'm.media-amazon.com',
//       },
//     ],
//   },
// }