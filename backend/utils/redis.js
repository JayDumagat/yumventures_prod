const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.client = redis.createClient({
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || undefined,
                db: process.env.REDIS_DB || 0,
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        console.error('Redis connection refused');
                        return new Error('Redis server connection refused');
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        return new Error('Redis retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        return undefined;
                    }
                    return Math.min(options.attempt * 100, 3000);
                }
            });

            this.client.on('connect', () => {
                console.log('Connected to Redis');
                this.isConnected = true;
            });

            this.client.on('error', (err) => {
                console.error('Redis error:', err);
                this.isConnected = false;
            });

            this.client.on('end', () => {
                console.log('Redis connection ended');
                this.isConnected = false;
            });

            await new Promise((resolve, reject) => {
                this.client.once('connect', resolve);
                this.client.once('error', reject);
            });

            return this.client;
        } catch (error) {
            console.error('Failed to create Redis client:', error);
            throw error;
        }
    }

    getClient() {
        return this.client;
    }

    // Cache utility methods
    async get(key) {
        if (!this.isConnected) {
            console.warn('Redis not connected, skipping cache get');
            return null;
        }

        try {
            return new Promise((resolve, reject) => {
                this.client.get(key, (err, result) => {
                    if (err) {
                        console.error('Redis GET error:', err);
                        resolve(null); // Return null instead of rejecting
                    } else {
                        resolve(result ? JSON.parse(result) : null);
                    }
                });
            });
        } catch (error) {
            console.error('Cache GET error:', error);
            return null;
        }
    }

    async set(key, value, ttl = 3600) {
        if (!this.isConnected) {
            console.warn('Redis not connected, skipping cache set');
            return false;
        }

        try {
            return new Promise((resolve, reject) => {
                const stringValue = JSON.stringify(value);
                this.client.setex(key, ttl, stringValue, (err) => {
                    if (err) {
                        console.error('Redis SET error:', err);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            console.error('Cache SET error:', error);
            return false;
        }
    }

    async del(key) {
        if (!this.isConnected) {
            console.warn('Redis not connected, skipping cache delete');
            return false;
        }

        try {
            return new Promise((resolve, reject) => {
                this.client.del(key, (err, result) => {
                    if (err) {
                        console.error('Redis DEL error:', err);
                        resolve(false);
                    } else {
                        resolve(result > 0);
                    }
                });
            });
        } catch (error) {
            console.error('Cache DEL error:', error);
            return false;
        }
    }

    async exists(key) {
        if (!this.isConnected) {
            console.warn('Redis not connected, skipping cache exists check');
            return false;
        }

        try {
            return new Promise((resolve, reject) => {
                this.client.exists(key, (err, result) => {
                    if (err) {
                        console.error('Redis EXISTS error:', err);
                        resolve(false);
                    } else {
                        resolve(result === 1);
                    }
                });
            });
        } catch (error) {
            console.error('Cache EXISTS error:', error);
            return false;
        }
    }

    async invalidatePattern(pattern) {
        if (!this.isConnected) {
            console.warn('Redis not connected, skipping pattern invalidation');
            return false;
        }

        try {
            return new Promise((resolve, reject) => {
                this.client.keys(pattern, (err, keys) => {
                    if (err) {
                        console.error('Redis KEYS error:', err);
                        resolve(false);
                        return;
                    }

                    if (keys.length === 0) {
                        resolve(true);
                        return;
                    }

                    this.client.del(keys, (delErr, result) => {
                        if (delErr) {
                            console.error('Redis pattern DEL error:', delErr);
                            resolve(false);
                        } else {
                            resolve(result > 0);
                        }
                    });
                });
            });
        } catch (error) {
            console.error('Cache pattern invalidation error:', error);
            return false;
        }
    }

    async ping() {
        if (!this.isConnected) {
            return false;
        }

        try {
            return new Promise((resolve) => {
                this.client.ping((err, result) => {
                    resolve(err ? false : result === 'PONG');
                });
            });
        } catch (error) {
            console.error('Redis PING error:', error);
            return false;
        }
    }

    async quit() {
        if (this.client) {
            return new Promise((resolve) => {
                this.client.quit(() => {
                    console.log('Redis connection closed');
                    this.isConnected = false;
                    resolve();
                });
            });
        }
    }

    // Helper methods for generating cache keys
    static generateKey(prefix, ...parts) {
        return `${prefix}:${parts.join(':')}`;
    }

    static generateUserKey(userId) {
        return this.generateKey('user', userId);
    }

    static generateCategoryKey(categoryId = 'all') {
        return this.generateKey('category', categoryId);
    }

    static generateMenuItemKey(menuItemId = 'all') {
        return this.generateKey('menuitem', menuItemId);
    }

    static generateImageKey(filename) {
        return this.generateKey('image', filename);
    }
}

// Create singleton instance
const redisClient = new RedisClient();

module.exports = {
    redisClient,
    RedisClient
};