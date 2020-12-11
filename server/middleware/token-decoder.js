const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.cookies && req.cookies['beero.legalCustomerToken']

  if (token) {
    req.token = token
    req.decodedToken = jwt.decode(token)
  }

  next()
}
