const axios = require('axios')
const pkg = require('../../package.json')

const http = axios.create({ baseURL: process.env.BEECAMBIO_API_URL })
const USER_AGENT = `${pkg.name}/${pkg.version}`

// @TODO: Extract this guy to './http.js'
module.exports = req => options => (
  http({
    ...options,
    headers: {
      Authorization: `Bearer ${req.token}`,
      'x-request-id': req.id,
      'user-agent': USER_AGENT,
    },
  })
)
