// In-memory rate limiter: stores request timestamps per IP
interface RateLimitStore {
  [ip: string]: number[]
}

const rateLimitStore: RateLimitStore = {}

// Configuration - easy to modify
export const RATE_LIMIT_CONFIG = {
  maxRequests: 3,
  windowMs: 5 * 60 * 1000, // 5 minutes
}

/**
 * Check if an IP is rate limited
 * Uses a sliding window approach
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = RATE_LIMIT_CONFIG.windowMs
  const maxRequests = RATE_LIMIT_CONFIG.maxRequests

  // Get timestamps for this IP
  let timestamps = rateLimitStore[ip] || []

  // Remove timestamps outside the window
  timestamps = timestamps.filter((time) => now - time < window)

  // Check if limit exceeded
  if (timestamps.length >= maxRequests) {
    return true
  }

  // Add current request
  timestamps.push(now)
  rateLimitStore[ip] = timestamps

  return false
}

/**
 * Get remaining requests for an IP
 */
export function getRemainingRequests(ip: string): number {
  const now = Date.now()
  const window = RATE_LIMIT_CONFIG.windowMs
  const maxRequests = RATE_LIMIT_CONFIG.maxRequests

  const timestamps = rateLimitStore[ip] || []
  const recentRequests = timestamps.filter((time) => now - time < window)

  return Math.max(0, maxRequests - recentRequests.length)
}
