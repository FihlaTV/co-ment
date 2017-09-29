const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production' && process.argv.indexOf('-p') === -1;

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, '/src/index.html'),
  filename: 'index.html',
  inject: 'body',
});

const DefinePluginConfig = new webpack.DefinePlugin({
  ENVIRONMENT: (dev ? JSON.stringify('DEVELOPMENT') : JSON.stringify('PRODUCTION')),
});

const UglifyJsPluginConfig = new webpack.optimize.UglifyJsPlugin({
  beautify: false,
  mangle: {
    screw_ie8: true,
  },
  compress: {
    screw_ie8: true,
  },
  comments: false,
});

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devServer: {
    host: 'localhost',
    port: '3000',
    hot: true,
    overlay: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, '/src/index.jsx'),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader?retainLines=true'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
      {
        test: /\.(jpg|png|gif|bmp|svg|woff|woff2|ttf|eot)$/,
        loader: require.resolve('url-loader'),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/build'),
  },
  devtool: 'cheap-module-source-map',
  plugins: dev ?
  [
    HTMLWebpackPluginConfig,
    DefinePluginConfig,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin(
      [
        { from: './src/img', to: './img/', ignore: ['*.svg'] },
      ]),
  ] :
  [
    HTMLWebpackPluginConfig,
    DefinePluginConfig,
    UglifyJsPluginConfig,
    new CopyWebpackPlugin(
      [
        { from: './src/img', to: './img/', ignore: ['*.svg'] },
      ]),
  ],
};
