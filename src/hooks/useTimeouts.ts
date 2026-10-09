import { useCallback, useEffect, useRef } from "react";

/** setTimeout that is automatically cleared when the component unmounts. */
export function useTimeouts() {
  const timers = useRef(new Set<number>());
  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach((t) => window.clearTimeout(t));
      set.clear();
    };
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
    return id;
  }, []);
  const clearAll = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.clear();
  }, []);
  return { later, clearAll };
}
