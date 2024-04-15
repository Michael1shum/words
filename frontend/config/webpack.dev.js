const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      client: {
        webSocketURL: 'ws://127.0.0.1:3000/ws',
      },
      static: {
        directory: path.join(__dirname, '..', 'public'),
      },
      compress: true,
      port: 3000,
      allowedHosts: 'all',
    },
    watch: {
      ignored: 'node_modules',
    },
  });
};
