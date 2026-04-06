import { AIResponse } from './game-engine';

interface CacheEntry {
  value: AIResponse;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000; // 5 minutes

export function getCache(key: string): AIResponse | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  
  return entry.value;
}

export function setCache(key: string, value: AIResponse): void {
  cache.set(key, {
    value,
    expiry: Date.now() + TTL,
  });
}

export function clearExpired(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiry) {
      cache.delete(key);
    }
  }
}

// Optional: Periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(clearExpired, 60 * 1000);
}
