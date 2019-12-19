'use strict';

import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  keyPrefix: process.env.UP_STAGE === 'production' ? '' : 'dev-'
});

redis.on('connect', function () {
  console.log('Redis.info', 'Redis client connected');
});

redis.on('reconnecting', function reconnecting() {
  console.log('Redis.info', 'Connection reestablished');
});

async function setCache(cacheKey, value, expiredInSeconds){
  if(expiredInSeconds){
      redis.set(cacheKey, value, "EX", expiredInSeconds);
  }else{
      redis.set(cacheKey, value);
  }
}

async function getCache(key){
  let reply = await redis.get(key);
  return reply
}

async function removeCache(key) {
  await redis.del(key);
}


module.exports = {
  getCache,
  setCache,
  removeCache
}