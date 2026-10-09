/**
 * Defensive browser storage. Every read is validated, every failure is
 * swallowed, and if the browser refuses storage entirely we fall back to
 * an in-memory map so the ship keeps sailing (it just forgets things).
 */
export type StoreArea = "local" | "session";

const memoryFallback = new Map<string, string>();
const probed: Partial<Record<StoreArea, Storage | null>> = {};

function getArea(area: StoreArea): Storage | null {
  if (area in probed) return probed[area] ?? null;
  let store: Storage | null = null;
  try {
    const candidate = area === "local" ? window.localStorage : window.sessionStorage;
    const probe = "__bw_probe__";
    candidate.setItem(probe, "1");
    candidate.removeItem(probe);
    store = candidate;
  } catch {
    store = null;
  }
  probed[area] = store;
  return store;
}

export function readStore<T>(
  area: StoreArea,
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
): T {
  let raw: string | null | undefined;
  try {
    const store = getArea(area);
    raw = store ? store.getItem(key) : memoryFallback.get(`${area}:${key}`);
  } catch {
    raw = memoryFallback.get(`${area}:${key}`);
  }
  if (raw == null) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(area: StoreArea, key: string, value: unknown): void {
  let raw: string;
  try {
    raw = JSON.stringify(value);
  } catch {
    return;
  }
  try {
    const store = getArea(area);
    if (store) {
      store.setItem(key, raw);
      return;
    }
  } catch {
    /* quota exceeded or privacy mode: fall through to memory */
  }
  memoryFallback.set(`${area}:${key}`, raw);
}

export function removeStore(area: StoreArea, key: string): void {
  memoryFallback.delete(`${area}:${key}`);
  try {
    getArea(area)?.removeItem(key);
  } catch {
    /* nothing to be done; the sea takes what it wants */
  }
}

export const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
export const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";
export const isString = (v: unknown): v is string => typeof v === "string";
export const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((item) => typeof item === "string");

export function isArrayOf<T>(guard: (item: unknown) => item is T) {
  return (v: unknown): v is T[] => Array.isArray(v) && v.every(guard);
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export const KEYS = {
  introSeen: "bw.intro.seen",
  sound: "bw.sound.enabled",
  visits: "bw.jar.visits",
  visitedRoutes: "bw.jar.routesThisSession",
  codeUnlocked: "bw.secret.codeUnlocked",
  cabinUnlocked: "bw.secret.cabinUnlocked",
  compassSpins: "bw.compass.spinsThisSession",
  storm: "bw.storm.active",
  chat: "bw.dutchman.conversation",
  chatOpen: "bw.dutchman.open",
  tickets: "bw.hotline.tickets",
  dismissedNotices: "bw.notices.dismissed",
  applications: "bw.admissions.simulated",
  complaints: "bw.hostel.complaints",
  libraryClock: "bw.library.clockOverride",
} as const;
