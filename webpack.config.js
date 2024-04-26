const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const config = require('config');
const { options } = require('pg/lib/defaults');

const { DECLUTTER_ENV, ENV_DEFAULT } = config.get('app');
console.log(path.join(__dirname, './node_modules/cirrus-ui/dist/'));
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
        test: /\.css$/i,
        exclude: {
          and: [/node_modules/],
          not: [path.join(__dirname, './node_modules/cirrus-ui/dist/')],
        },
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
