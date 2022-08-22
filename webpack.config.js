const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

require('dotenv').config();

module.exports = (env) => {
  const appName = `${process.env.APP_NAME}${
    env.production ? '' : ' (Development)'
  }`;

  if (env.production) {
    console.warn(
      '\x1b[31m\x1b[1m%s\x1b[0m\x1b[0m',
      '** Building for production **\r\n'
    );
  } else {
    console.warn(
      '\x1b[36m\x1b[1m%s\x1b[0m\x1b[0m',
      '** Building for development **\r\n'
    );
  }

  return {
    entry: './src/main.js',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    devtool: env.production ? false : 'eval-source-map',
    devServer: {
      static: './dist',
      hot: true
    },
    plugins: [
      new Dotenv({
        safe: true
      }),
      new HtmlWebpackPlugin({
        title: appName,
        template: './src/index.html'
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(ogg|mp3|wav|mpe?g)$/i,
          loader: 'file-loader',
          options: {
            outputPath: 'audio',
            name: '[name].[contenthash].[ext]'
          }
        }
      ]
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  };
};
