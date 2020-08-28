const { INTERNAL_SERVER_ERROR } = require('http-status-codes')
const pick = require('lodash/pick')
const globalLogger = require('../shared/debug-logger')('ERROR_HANDLER')

const logError = ({ logger, request, error }) => {
  logger('===== Request Error')
  logger('-- Request')
  logger('%O', request)
  logger('--')
  logger('-- Error')
  logger('%O', error)
  logger('=====')
}

const getHttpError = error => {
  /* eslint-disable no-param-reassign */
  error = {
    config: pick(error.config, ['headers', 'method', 'url', 'params']),
    response: pick(error.response, ['status', 'headers', 'data']),
  }
  return error
  /* eslint-enable no-param-reassign */
}

const getRequest = req => {
  const request = {
    headers: req.headers,
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    params: req.params,
    body: req.body,
    customer: req.customer,
    token: req.token,
  }

  return request
}

module.exports = () => (err, req, res, next) => {
  if (!err) {
    return next()
  }

  const { error, status = INTERNAL_SERVER_ERROR, logger = globalLogger } = err

  const request = getRequest(req)

  if (!error) {
    logger('It doesn\'t have an error object!!')
    logError({ logger, request, error: {} })
    return res.sendStatus(INTERNAL_SERVER_ERROR)
  }

  if (error.response) {
    logError({ logger, request, error: getHttpError(error) })
    return res.status(error.response.status).json(error.response.data)
  }

  logError({ logger, request, error })
  res.sendStatus(status)
}
