import { useCallback, useState } from "react";
import { readStore, writeStore, type StoreArea } from "../lib/storage";

/**
 * useState that mirrors itself into browser storage. Invalid or corrupted
 * stored values are ignored in favour of the fallback.
 */
export function usePersistedState<T>(
  area: StoreArea,
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStore(area, key, fallback, isValid));
  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeStore(area, key, resolved);
        return resolved;
      });
    },
    [area, key],
  );
  return [value, update];
}
