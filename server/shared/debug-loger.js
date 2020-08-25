const debug = require('debug')

module.exports = (...args) => debug(
    ['DEBUG_LOGGER', ...args].join(':')
)