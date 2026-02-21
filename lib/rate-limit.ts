import { Redis } from "@upstash/redis"

// Use Upstash Redis for thread-safe, atomic rate limiting
// Get credentials from environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

const RATE_LIMIT = 3
const WINDOW_MS = 5 * 60 // 5 minutes in seconds

/**
 * Check if an IP is rate limited using atomic Redis operations
 * This prevents race conditions where multiple concurrent requests could bypass the limit
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rate_limit:${ip}`

  try {
    // Increment the counter atomically and get the new value
    const current = await redis.incr(key)

    // If this is the first request, set expiration
    if (current === 1) {
      await redis.expire(key, WINDOW_MS)
    }

    // If we've exceeded the limit, deny the request
    return current > RATE_LIMIT
  } catch (error) {
    // If Redis is unavailable, log error but allow request (fail open)
    console.error("Rate limiter error:", error)
    return false
  }
}

/**
 * Get remaining requests for an IP (useful for headers or debugging)
 */
export async function getRemainingRequests(ip: string): Promise<number> {
  const key = `rate_limit:${ip}`

  try {
    const current = await redis.get<number>(key)
    const count = current || 0
    return Math.max(0, RATE_LIMIT - count)
  } catch (error) {
    console.error("Rate limiter error:", error)
    return RATE_LIMIT
  }
}
