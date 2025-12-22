import NodeCache from 'node-cache';

/**
 * Singleton Cache Service
 * Default TTL: 1 hour
 * Check periodicity: 120 seconds
 */
class CacheService {
    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache({
            stdTTL: 3600, // 1 hour
            checkperiod: 120,
            useClones: false
        });
    }

    public get<T>(key: string): T | undefined {
        return this.cache.get<T>(key);
    }

    public set<T>(key: string, value: T, ttl?: number): boolean {
        if (ttl) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }

    public delete(key: string): number {
        return this.cache.del(key);
    }

    public flush(): void {
        this.cache.flushAll();
    }

    /**
     * Generate a cache key from an object (e.g., API request body)
     */
    public generateKey(params: any): string {
        return JSON.stringify(params);
    }
}

export const cacheService = new CacheService();
export default cacheService;
