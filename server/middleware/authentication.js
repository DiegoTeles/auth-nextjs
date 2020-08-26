const axios = require('axios')
const _ = require('lodash')

const { BASE_URL } = process.env
const http = axios.create({ baseURL: BASE_URL })

const logger = {
    info: debug('AUTHENTICATION_MIDDLEWARE', 'INFO'),
    error: debug('AUTHENTICATION_MIDDLEWARE', 'ERROR')
}

async function getRequestUserData(req) {
    const { token } = req
    const { data: { result } } = await http({
        method: 'GET',
        url: '/getUserData',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return result
}

module.exports = async (req, res, next) => {
    try {
        const { token, decodedToken } = req

        if (token && decodedToken) {
            const { jti: jwtId } = decodedToken

            if (jwtId) {
                let userToInject = _.omit(decodedToken, 'iat', 'exp', 'jti')

                try {
                    userToInject = await getRequestUserData(req)
                } catch (error) {
                    throw error
                }

                req.user = userToInject

                return next()
            }
        }

        throw new Error('Unauthorized');
    } catch (error) {
        next({ error, logger: logger.error })
    }
}