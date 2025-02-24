import webpack from 'webpack';
import { ConfigOptions } from './types';
import { getDevServerConfig } from './getDevServerConfig';
import { getPluginsConfig } from './getPluginsConfig';
import { getLoadersConfig } from './getLoadersConfig';
import { getResolversConfig } from './getResolversConfig';

export function webpackCreateConf(options: ConfigOptions): webpack.Configuration {
  const { mode, paths } = options;
  const isDev = options.mode !== 'production';

  return {
    mode: mode ?? 'development',
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: '[name].[contenthash].js',
      clean: true,
    },
    devtool: isDev ? 'eval-source-map' : false,
    devServer: isDev ? getDevServerConfig(options) : undefined,
    watch: isDev,
    watchOptions: isDev
      ? {
          aggregateTimeout: 500, // delay before reloading
          poll: 1000, // enable polling since fsevents are not supported in docker
        }
      : undefined,
    plugins: getPluginsConfig(options),
    module: {
      rules: getLoadersConfig(options),
    },
    resolve: getResolversConfig(options),
  };
}
