const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config')

const devConfig = (env = {}) => merge(baseConfig(env), {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    main: [
      'regenerator-runtime/runtime.js',
      path.resolve(__dirname, '../dev/main.ts')
    ]
  },
  output: {
    publicPath: 'http://localhost:3000/'
  },
  devServer: {
    host: 'localhost',
    open: false,
    port: 3000,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'vue-store dev',
      hash: false,
      template: path.resolve(__dirname,'../dev') + '/index.html',
      filename: 'index.html',
      inject: true,
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }),
  ]
})

module.exports = new Promise(res => res(devConfig({ dev: true })))
