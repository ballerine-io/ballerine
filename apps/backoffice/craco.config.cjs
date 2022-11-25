const { ProvidePlugin } = require('webpack');

module.exports = {
  webpack: {
    configure: config => {
      config.resolve.fallback = Object.assign(config.resolve.fallback || {}, {
        ...config.resolve.fallback,
        fs: false,
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
      });

      return config;
    },
    plugins: {
      add: [
        new ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
  eslint: {
    pluginOptions: {
      failOnError: false,
    },
  },
};
