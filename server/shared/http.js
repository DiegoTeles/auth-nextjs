const axios = require('axios')
const pkg = require('../../package.json')

const _http = axios.create({ baseURL: process.env.BEECAMBIO_API_URL })
const USER_AGENT = `${pkg.name}/${pkg.version}`

module.exports = function http({
  req,
  options = {},
  useSessionToken = true,
}) {
  const headers = {
    'x-request-id': req.id,
    'user-agent': USER_AGENT,
  }

  if (useSessionToken) {
    headers.Authorization = `Bearer ${req.token}`
  }

  return _http({ ...options, headers })
}
