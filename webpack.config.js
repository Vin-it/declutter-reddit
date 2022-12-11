const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const config = require('config');

const { DECLUTTER_ENV, ENV_DEFAULT } = config.get('app');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './client/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'views', 'index.ejs'),
    }),
    new webpack.EnvironmentPlugin({
      DECLUTTER_ENV: DECLUTTER_ENV || ENV_DEFAULT,
    }),
  ],
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
