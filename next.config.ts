// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Fallback for Node.js modules not available in the browser
//       config.resolve.fallback = {
//         fs: false,
//         net: false,
//         tls: false,
//         http: false,
//         https: false,
//         path: false,
//         stream: false,
//       };

//       // Add rule for worker-loader
//       config.module.rules.push({
//         test: /\.worker\.(js|ts)$/,
//         use: { loader: "worker-loader" },
//       });

//       // Add rule for .wasm files
//       config.module.rules.push({
//         test: /\.wasm$/,
//         type: "javascript/auto",
//         use: {
//           loader: "file-loader",
//           options: {
//             name: "[name].[contenthash].[ext]",
//             publicPath: "/_next/static/wasm/",
//             outputPath: "static/wasm/",
//           },
//         },
//       });
//     }

//     config.experiments = {
//       ...config.experiments,
//       asyncWebAssembly: true,
//       syncWebAssembly: true,
//     };

//     return config;
//   },
// };

// export default nextConfig;

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
        test: /\.worker\.(js|ts)$/,
        use: { loader: "worker-loader" },
      });

      // Add rule for .wasm files
      config.module.rules.push({
        test: /\.wasm$/,
        type: "javascript/auto",
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[contenthash].[ext]",
            publicPath: "/_next/static/wasm/",
            outputPath: "static/wasm/",
          },
        },
      });
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
