const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = (env) => {
  console.log('dev env', env);
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, '..', 'public '),
      },
      compress: true,
      port: 3000,
      allowedHosts: 'all',
    },
    watch: {
      ignored: 'node_modules',
    },
    watchOptions: {
      aggregateTimeout: 500, // delay before reloading
      poll: 1000, // enable polling since fsevents are not supported in docker
    },
  });
};
