const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const path = require('path')
const pkg = require('./package.json')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  onDemandEntries: {
    maxInactiveAge: 8.64e+7,
    pagesBufferLength: 10,
  },
  distDir: '../.next',
  poweredByHeader: false,
  webpack: (config, options) => {
    config.node = { fs: 'empty' }

    config.resolve.modules.push(path.resolve(__dirname, 'src'))

    config.plugins.push(new webpack.EnvironmentPlugin(process.env))
    config.plugins.push(new CaseSensitivePathsPlugin())

    if (!options.isServer) {
      config.plugins.push(new webpack.IgnorePlugin(/\.server/g))
    }

    config.plugins.push(new webpack.DefinePlugin({
      __SERVER__: JSON.stringify(options.isServer),
      __CLIENT__: JSON.stringify(!options.isServer),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __VERSION__: JSON.stringify(pkg.version),
    }))

    return config
  },
}
