const axios = require('axios')
const http = require('../../shared/http')
const debug = require('../../shared/debug-logger')

const loginLogger = {
  info: debug('LOGIN', 'INFO'),
  error: debug('LOGIN', 'ERROR'),
}
const signupLogger = {
  info: debug('SIGNUP', 'INFO'),
  error: debug('SIGNUP', 'ERROR'),
}

const { API_URL, AUTH_COOKIE_DOMAIN, NODE_ENV } = process.env

const cookieConfiguration = NODE_ENV !== 'development'
  ? { path: '/', domain: AUTH_COOKIE_DOMAIN }
  : undefined

exports.signup = async function signupController(req, res, next) {
  try {
    const options = {
      method: 'POST',
      url: '/signup',
      data: req.body,
    }

    const response = await http({
      req,
      options,
      useSessionToken: false,
    })

    res.status(200).json(response)
    signupLogger.info('User %d signed up')
  } catch (error) {
    next({ error, logger: signupLogger.error })
  }
}

exports.login = async function loginController(req, res, next) {
  try {
    const response = await axios.post(`${API_URL}/login`, req.body)

    const { result } = response.data

    res.cookie('ALGUMA_COISA', result.token, cookieConfiguration)
    res.status(204).end()

    loginLogger.info('User %d logged in', result.customer.id)
  } catch (error) {
    next({ error, logger: loginLogger.error })
  }
}


exports.logout = function logoutController(req, res) {
  res.clearCookie('ALGUMA_COISA', cookieConfiguration)
  res.redirect('/')
}
