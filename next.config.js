const webpack = require('webpack')

module.exports = {
  webpack: (config, options) => {
    config.node = { fs: 'empty' }

    return config
  },
}
