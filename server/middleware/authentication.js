const axios = require('axios')
const _ = require('loadash')
const { UNAUTHORIZED } = require('http-status-codes');
const debug = require('../shared/debug-loger')
const handleUnauthorizedRequest = require('../shared/unauthorized-request-handler')

const { BASE_URL } = process.env
const http = axios.create({ baseURL: BASE_URL })
const logger = {
    info: debug('AUTHENTICATION_MIDDLEWARE', 'INFO'),
    error: debug('AUTHENTICATION_MIDDLEWARE', 'ERROR')
}

async function getRequestUserData(req) {
    const { cache, token, decodeToken: { id: customerId } } = req;
    const cacheKey = 'customer';
    const cacheUser = await cache.get(cacheKey);

    if (!cacheUser) {
        logger.info(`cache miss for customer ${customerId}`)

        const { data: { result } } = await http({
            method: 'GET',
            url: '/v1/customer',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        await cache.get(cacheKey, result)

        return result
    }

    return cacheUser;
}

module.exports = async (req, res, next) => {
    try {
        const { token, decodeToken } = req;

        if (token && decodeToken) {
            const { jti: jwtId, id: customerId } = decodeToken;

            if (jwtId) {
                let customerToInject = _.omit(decodeToken, 'iat', 'exp', 'jti');
                try {
                    customerToInject = await getRequestUserData(req);
                } catch (error) {

                    logger.error(`Unexpected error when retrieving customer ${customerId} data\n%0`, error)
                    throw error

                }

                req.customer = customerToInject

                return next()
            }
        }

        handleUnauthorizedRequest(req, res);

    } catch (error) {
        next({ error, logger: logger.error })
    }
}