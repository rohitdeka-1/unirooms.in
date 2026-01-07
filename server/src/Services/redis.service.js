import { Redis } from "@upstash/redis";
import config from "../Config/env.config.js";
import chalk from "chalk";


const isRedisConfigured = config.UPSTASH_REDIS_REST_URL && config.UPSTASH_REDIS_REST_TOKEN;

let redis = null;

if (isRedisConfigured) {
  redis = new Redis({
    url: config.UPSTASH_REDIS_REST_URL,
    token: config.UPSTASH_REDIS_REST_TOKEN,
  });

  redis
    .ping()
    .then(() => {
      console.log(chalk.magenta("✅ Redis connected successfully"));
    })
    .catch((error) => {
      console.error(chalk.red("❌ Redis connection failed:"), error.message);
    });
} else {
  console.warn(chalk.yellow("⚠️  Redis not configured - refresh token storage disabled"));
  console.warn(chalk.yellow("   Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable Redis"));
}




export const storeRefreshToken = async (userId, refreshToken, expiresIn = 7 * 24 * 60 * 60) => {
  if (!redis) {
    console.warn(chalk.yellow("⚠️  Redis not available - skipping refresh token storage"));
    return false;
  }
  
  try {
    const key = `refresh_token:${userId}`;
    await redis.set(key, refreshToken, { ex: expiresIn });
    console.log(chalk.green(`✅ Refresh token stored for user: ${userId}`));
    return true;
  } catch (error) {
    console.error(chalk.red("❌ Error storing refresh token:"), error.message);
    
    return false;
  }
};


export const getRefreshToken = async (userId) => {
  try {
    const key = `refresh_token:${userId}`;
    const token = await redis.get(key);
    return token;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};


export const deleteRefreshToken = async (userId) => {
  try {
    const key = `refresh_token:${userId}`;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error("Error deleting refresh token:", error);
    throw new Error("Failed to delete refresh token");
  }
};


export const verifyRefreshToken = async (userId, refreshToken) => {
  try {
    const storedToken = await getRefreshToken(userId);
    return storedToken === refreshToken;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return false;
  }
};

export default redis;
