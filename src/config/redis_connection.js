import redis from "redis";

let redisClient = redis.createClient({
  host: 'localhost', // or your Redis server
  port: 6379, // default Redis port
});

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

export default redisClient;