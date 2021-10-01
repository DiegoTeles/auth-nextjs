import redis from 'redis';
import redisMock from 'redis-mock';
import { promisify } from 'util';
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB, NODE_ENV } =
  process.env;
  
const dev = NODE_ENV !== 'production';

let redisClient;

if (dev) {
  redisClient = redisMock.createClient();
  redisClient.setExpireAsync = () => Promise.resolve();
} else {
  redisClient = redis.createClient({
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
    port: REDIS_PORT,
    db: REDIS_DB,
  });
  redisClient.setExpireAsync = promisify(redisClient.expireat).bind(
    redisClient
  );
}

redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.setAsync = promisify(redisClient.set).bind(redisClient);

export default redisClient;
