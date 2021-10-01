import redisClient from '../shared/redis-client'

export default (req, res, next) => {
  const { decodedToken } = req
  const jwId = decodedToken && decodedToken.jwId
  const tokenExpiration = decodedToken && decodedToken.exp
  const keyPrefix = jwId ? `${jwId}.` : ''

  req.cache = {
    set: async (
      key,
      value,
      { isGlobal, expireAt } = { isGlobal: false, expireAt: tokenExpiration }
    ) => {
      const cacheKey = isGlobal ? key : `${keyPrefix}${key}`

      await redisClient.setAsync(cacheKey, JSON.stringify(value))
      expireAt && (await redisClient.setExpireAsync(cacheKey, expireAt))
    },
    get: async (key, { isGlobal } = { isGlobal: false }) => {
      const cacheKey = isGlobal ? key : `${keyPrefix}${key}`

      return JSON.parse(await redisClient.getAsync(cacheKey))
    }
  }

  next()
}
