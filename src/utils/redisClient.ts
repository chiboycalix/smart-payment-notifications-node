import * as redis from "redis";
import chalk from "chalk";

export const client = redis.createClient();
export const redisClient = async () => {
  try {
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect()
    console.log(chalk.blue.bgRed.bold(`Redis Client Connected`));
    return client;
  } catch (error) {
    console.log(error.message, "error res");
    return error;
  }
}