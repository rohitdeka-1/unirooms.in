import redis from "./redis.service.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60; // 30 minutes in seconds

export const recordFailedLoginAttempt = async (email) => {
    if (!redis) {
        console.warn("Redis not available - account lockout disabled");
        return 0;
    }
    
    const key = `login_attempts:${email}`;
    const attempts = await redis.incr(key);
    
    if (attempts === 1) {
        // Set expiry on first attempt
        await redis.expire(key, LOCKOUT_DURATION);
    }
    
    return attempts;
};

export const isAccountLocked = async (email) => {
    if (!redis) {
        return false;
    }
    
    const key = `login_attempts:${email}`;
    const attempts = await redis.get(key);
    
    return attempts && parseInt(attempts) >= MAX_LOGIN_ATTEMPTS;
};

export const resetLoginAttempts = async (email) => {
    if (!redis) {
        return;
    }
    
    const key = `login_attempts:${email}`;
    await redis.del(key);
};

export const getRemainingAttempts = async (email) => {
    if (!redis) {
        return MAX_LOGIN_ATTEMPTS;
    }
    
    const key = `login_attempts:${email}`;
    const attempts = await redis.get(key);
    const attemptsCount = attempts ? parseInt(attempts) : 0;
    
    return Math.max(0, MAX_LOGIN_ATTEMPTS - attemptsCount);
};
