// In-memory rate limiter: 3 requests per 5 minutes per IP
const requestMap = new Map<string, number[]>()

const RATE_LIMIT = 3
const WINDOW_MS = 5 * 60 * 1000 // 5 minutes

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  
  // Get requests for this IP
  let requests = requestMap.get(ip) || []
  
  // Remove requests older than the window
  requests = requests.filter((time) => now - time < WINDOW_MS)
  
  // Check if limit exceeded
  if (requests.length >= RATE_LIMIT) {
    return true
  }
  
  // Add current request
  requests.push(now)
  requestMap.set(ip, requests)
  
  // Cleanup: remove IP if no recent requests (optional optimization)
  if (requests.length === 0) {
    requestMap.delete(ip)
  }
  
  return false
}

// Get remaining requests for an IP (useful for debugging)
export function getRemainingRequests(ip: string): number {
  const now = Date.now()
  const requests = requestMap.get(ip) || []
  const recentRequests = requests.filter((time) => now - time < WINDOW_MS)
  return Math.max(0, RATE_LIMIT - recentRequests.length)
}
