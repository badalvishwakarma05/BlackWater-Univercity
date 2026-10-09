export function pick<T>(list: readonly T[], rng: () => number = Math.random): T {
  return list[Math.floor(rng() * list.length) % list.length];
}

/** Picks an item that differs from `current`, when the list allows it. */
export function pickDifferent<T>(list: readonly T[], current: T | undefined, rng: () => number = Math.random): T {
  if (list.length < 2) return list[0];
  const options = list.filter((item) => item !== current);
  return pick(options, rng);
}

/** Deterministic PRNG so the same demo student ID always yields the same demo record. */
export function seededRandom(seedText: string): () => number {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(min: number, max: number, rng: () => number = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function makeTicketId(prefix: string): string {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${randomInt(1000, 9999)}-${letter}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function shuffle<T>(list: readonly T[], rng: () => number = Math.random): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
