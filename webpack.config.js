const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const config = require('config');
const { options } = require('pg/lib/defaults');

const { DECLUTTER_ENV, ENV_DEFAULT } = config.get('app');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './client/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'views', 'index.ejs'),
    }),
    new webpack.EnvironmentPlugin({
      DECLUTTER_ENV: DECLUTTER_ENV || ENV_DEFAULT,
      BASE_URL: 'http://localhost:3000'
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: { configFile: 'tsconfig.fe.json' },
        }]
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
