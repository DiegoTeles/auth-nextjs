const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.cookies && req.cookies['ALGUMA_COISA']

    if (token) {
        req.token = token
        req.decodeToken = jwt.decode(token)
    }
}