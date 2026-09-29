import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IStorageService {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

class StorageService implements IStorageService {
  private inMemoryFallback: Map<string, string> = new Map();

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch {
      // fallback
    }
    const mem = this.inMemoryFallback.get(key);
    return mem ? (JSON.parse(mem) as T) : null;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    this.inMemoryFallback.set(key, serialized);
    try {
      await AsyncStorage.setItem(key, serialized);
    } catch {
      // fallback saved in memory
    }
  }

  async removeItem(key: string): Promise<void> {
    this.inMemoryFallback.delete(key);
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // fallback
    }
  }

  async clear(): Promise<void> {
    this.inMemoryFallback.clear();
    try {
      await AsyncStorage.clear();
    } catch {
      // fallback
    }
  }
}

export const storage = new StorageService();
