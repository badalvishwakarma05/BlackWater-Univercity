import { useEffect, useRef } from "react";

export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
}

/** Calls `onComplete` whenever ↑ ↑ ↓ ↓ ← → ← → B A is entered outside of form fields. */
export function useKonamiCode(onComplete: () => void): void {
  const callback = useRef(onComplete);
  useEffect(() => {
    callback.current = onComplete;
  });

  useEffect(() => {
    let position = 0;
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) {
        position = 0;
        return;
      }
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === KONAMI_SEQUENCE[position]) {
        position += 1;
        if (position === KONAMI_SEQUENCE.length) {
          position = 0;
          callback.current();
        }
      } else if (key === "ArrowUp") {
        // "↑↑↑" still leaves us two steps in; "↑↑↓…↑" restarts at one.
        position = position === 2 ? 2 : 1;
      } else {
        position = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
