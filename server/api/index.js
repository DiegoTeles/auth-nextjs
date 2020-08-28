const apiRouter = require('express').Router()

require('./auth/api')(apiRouter)

module.exports = () => apiRouter
