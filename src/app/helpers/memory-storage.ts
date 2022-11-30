export class MemoryStorage<K, T> {
    private cache = new Map<K, T>();

    get length(): number {
        return this.cache.size;
    }

    forEach(callback: (value: T, key: K) => void): void {
        this.cache.forEach(callback);
    }

    clear(): void {
        this.cache.clear();
    }

    getItem(key: K): T | undefined {
        return this.cache.get(key);
    }

    removeItem(key: K): void {
        this.cache.delete(key);
    }

    setItem(key: K, value: T): void {
        this.cache.set(key, value);
    }
}
