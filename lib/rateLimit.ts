// In-Memory Sliding Window Rate Limiter & Attempt Logger
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const loginAttemptsMap = new Map<string, { attempts: number; lockedUntil?: number }>();

export function checkRateLimit(key: string, limit = 10, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function logAttempt(key: string, success: boolean) {
  const record = loginAttemptsMap.get(key) || { attempts: 0 };
  if (success) {
    loginAttemptsMap.delete(key);
  } else {
    record.attempts++;
    if (record.attempts >= 5) {
      record.lockedUntil = Date.now() + 5 * 60 * 1000; // Lock for 5 mins
    }
    loginAttemptsMap.set(key, record);
  }
}

export function getAttemptStatus(key: string) {
  return loginAttemptsMap.get(key) || { attempts: 0 };
}