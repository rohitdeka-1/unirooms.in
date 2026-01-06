import { Redis } from "@upstash/redis";
import config from "../Config/env.config.js";
import chalk from "chalk";

// Check if Redis is configured
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

/**
 * Store refresh token in Redis
 * @param {string} userId 
 * @param {string} refreshToken
 * @param {number} expiresIn
 */


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
    // Don't throw - just log and return false to allow authentication to continue
    return false;
  }
};

/**
 * Get refresh token from Redis
 * @param {string} userId  
 * @returns {string|null}  
 */
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

/**
 * Delete refresh token from Redis (for logout)
 * @param {string} userId  
 */
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

/**
 * Verify if refresh token exists and matches
 * @param {string} userId  
 * @param {string} refreshToken  
 * @returns {boolean}  
 */
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
