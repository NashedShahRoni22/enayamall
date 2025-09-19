const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'enayamall.fahimsultan.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ["enayamall.fahimsultan.com"], // allow your image host
  },
};

export default nextConfig;
