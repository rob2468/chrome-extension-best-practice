const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        entry: {
          // main: [
          //   env === 'development' &&
          //     require.resolve('react-dev-utils/webpackHotDevClient'),
          //   paths.appIndexJs,
          // ].filter(Boolean),
          // 页面
          main: './src/pages/popup/index.tsx',
          setting: './src/pages/setting/index.tsx',
          log: './src/pages/log/index.tsx',
          // content scripts
          content: './src/content-scripts/index.ts',
          // service worker
          background: './src/service-worker/index.ts',
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
          splitChunks: {
            ...webpackConfig.optimization.splitChunks,
            minSize: 150000,
          },
        },
        plugins: [
          ...webpackConfig.plugins,
          new htmlWebpackPlugin({
            title: 'popup',
            filename: 'popup.html',
            template: 'public/index.html',
            chunks: ['main'],
          }),
          new htmlWebpackPlugin({
            title: 'setting',
            filename: 'setting.html',
            template: 'public/index.html',
            chunks: ['setting'],
          }),
          new htmlWebpackPlugin({
            title: 'log',
            filename: 'log.html',
            template: 'public/index.html',
            chunks: ['log'],
          }),
        ],
      };
    },
  },
};
