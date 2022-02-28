const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.js')
const path = require('path')

const resolve = pathStr => path.resolve(__dirname, pathStr)

const buildConfig = (env = {}) => merge(baseConfig(env), {
  entry: {
    index: resolve('../src/index.ts')
  },
  output: {
    filename: `[name].js`,
    path: resolve('../dist'),
    publicPath: '/dist/',
    library: 'vue-store',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  plugins: [],
  devtool: 'eval-source-map',
  externals: {
    vue: 'vue'
  },
})

module.exports = new Promise(res => {
  res(buildConfig({ dev: false }))
})
