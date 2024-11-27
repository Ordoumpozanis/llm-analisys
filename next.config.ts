import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallback for Node.js modules not available in the browser
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        path: false,
        stream: false,
      };

      // Add rule for worker-loader
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      });
    }

    return config;
  },
};

export default nextConfig;
