interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface RateLimitInfo {
  lastCall: number;
  callCount: number;
}

class TokenCache {
  private static instance: TokenCache;
  private cache: Map<string, CacheItem<any>>;
  private rateLimits: Map<string, RateLimitInfo>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT_WINDOW = 1000; // 1 second
  private readonly MAX_CALLS_PER_WINDOW = 5;

  private constructor() {
    this.cache = new Map();
    this.rateLimits = new Map();
  }

  public static getInstance(): TokenCache {
    if (!TokenCache.instance) {
      TokenCache.instance = new TokenCache();
    }
    return TokenCache.instance;
  }

  public async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public async checkRateLimit(apiKey: string): Promise<boolean> {
    const now = Date.now();
    const limitInfo = this.rateLimits.get(apiKey) || { lastCall: 0, callCount: 0 };

    if (now - limitInfo.lastCall > this.RATE_LIMIT_WINDOW) {
      // Reset if window has passed
      limitInfo.callCount = 1;
      limitInfo.lastCall = now;
    } else if (limitInfo.callCount >= this.MAX_CALLS_PER_WINDOW) {
      // Wait until next window if rate limit exceeded
      const waitTime = this.RATE_LIMIT_WINDOW - (now - limitInfo.lastCall);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      limitInfo.callCount = 1;
      limitInfo.lastCall = Date.now();
    } else {
      // Increment counter within current window
      limitInfo.callCount++;
    }

    this.rateLimits.set(apiKey, limitInfo);
    return true;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const tokenCache = TokenCache.getInstance();
