const debug = require('debug')

module.exports = (...args) => debug(
  ['AUTH-NEXT', ...args].join(':'),
)
