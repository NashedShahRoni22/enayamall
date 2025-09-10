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
    domains: ["enayamall.com"],
  },
};

export default nextConfig;
