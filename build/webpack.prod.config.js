const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.js')
const copyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

const buildConfig = (env = {}) => merge(baseConfig(env), {
  entry: {
    index: path.resolve(__dirname, '../src/index.ts')
  },
  output: {
    filename: `[name].js`,
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    library: '@v/store',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  plugins: [
    new copyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../src/types'), to: 'types/' },
      ],
    })
  ],
  devtool: 'eval-source-map',
  externals: [{ vue: 'vue' }, nodeExternals()]
})

module.exports = new Promise(res => {
  res(buildConfig({ dev: false }))
})
