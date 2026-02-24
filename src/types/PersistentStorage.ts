export type PersistentStorage<T> = {
  read: () => T | null | Promise<T | null>;
  write?: (value: T) => void | Promise<void>;
};
