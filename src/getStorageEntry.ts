import type { PersistentStorage } from "./types/PersistentStorage.ts";

function getStorage(session = false) {
  if (typeof window === "undefined") return;
  return session ? sessionStorage : localStorage;
}

export type StorageEntryOptions<T> = {
  key: string;
  session?: boolean;
  serialize?: (value: T) => string;
  deserialize?: (serializedValue: string) => T;
};

export function getStorageEntry<T>({
  key,
  session,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: StorageEntryOptions<T>): PersistentStorage<T> {
  let storage = getStorage(session);

  if (!storage) {
    return {
      read: () => null,
      write: () => {},
    };
  }

  return {
    read() {
      try {
        let serializedValue = storage.getItem(key);

        if (serializedValue !== null) return deserialize(serializedValue);
      } catch {}

      return null;
    },
    write(value: T) {
      try {
        storage.setItem(key, serialize(value));
      } catch {}
    },
  };
}
