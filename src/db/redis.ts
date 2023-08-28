import * as redis from "redis";

export const redisClient = redis.createClient();

redisClient.connect();
redisClient.on("connect", (err) => {
  console.log("Connected to redis");
});
