import { StorageData, DEFAULT_SETTINGS } from "./types";

export class Storage {
  static async get<K extends keyof StorageData>(
    key: K,
  ): Promise<StorageData[K] | undefined> {
    const result = await chrome.storage.sync.get(key);
    return result[key];
  }

  static async getAll(): Promise<StorageData> {
    const data = await chrome.storage.sync.get(null);
    return { ...DEFAULT_SETTINGS, ...data };
  }

  static async set<K extends keyof StorageData>(
    key: K,
    value: StorageData[K],
  ): Promise<void> {
    await chrome.storage.sync.set({ [key]: value });
  }

  static async setMultiple(data: Partial<StorageData>): Promise<void> {
    await chrome.storage.sync.set(data);
  }

  static async clear(): Promise<void> {
    await chrome.storage.sync.clear();
  }

  static async remove(keys: (keyof StorageData)[]): Promise<void> {
    await chrome.storage.sync.remove(keys as string[]);
  }

  static onChanged(
    callback: (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => void,
  ): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "sync") {
        callback(changes);
      }
    });
  }
}
