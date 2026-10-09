import { useId } from "react";

/** A gradient/clip id that is unique per instance and safe inside url(#…). */
export function useSvgId(prefix: string): string {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}
