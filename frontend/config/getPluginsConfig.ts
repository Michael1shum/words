import webpack, { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ConfigOptions } from './types';

export function getPluginsConfig(options: ConfigOptions): Configuration['plugins'] {
  const isDev = options.mode !== 'production';
  const isProd = options.mode === 'production';

  const plugins: Configuration['plugins'] = [
    new HtmlWebpackPlugin({
      template: options.paths.html,
    }),
    new webpack.EnvironmentPlugin(['MODE']),
  ];

  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      })
    );
  }

  if (isDev) {
    plugins.push(new webpack.EnvironmentPlugin(['MODE']));
  }

  return plugins;
}
