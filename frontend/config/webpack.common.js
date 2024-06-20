const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const MODE = process.env.MODE;

module.exports = (env) => {
  let title = 'Production';

  if (MODE) {
    title = MODE === 'PROD' ? 'Production' : 'Development';
  }
  return {
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.json$/,
          use: 'json-loader',
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new webpack.EnvironmentPlugin(['MODE']),
      new HtmlWebpackPlugin({ template: 'public/index.html', title }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, '..', 'src/components/'),
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '..', 'dist'),
      clean: true,
    },
  };
};
