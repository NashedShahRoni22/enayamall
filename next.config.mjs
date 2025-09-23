const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.enayamall.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ["admin.enayamall.com"], // allow your image host
  },
};

export default nextConfig;
