/**
 * The ship's orchestra: every sound is synthesised live with the Web Audio
 * API. No recordings, no soundtracks, no lawyers. If audio is blocked or
 * unsupported, every function quietly does nothing.
 */
export type SoundName =
  | "creak"
  | "bell"
  | "rumble"
  | "cannon"
  | "chord"
  | "organ"
  | "clink"
  | "coins"
  | "door"
  | "spooky"
  | "splash"
  | "stamp"
  | "paper"
  | "squawk"
  | "ring"
  | "bubble"
  | "thud";

type AudioCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor: AudioCtor | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.3;
      master.connect(ctx.destination);
    }
    return ctx;
  } catch {
    return null;
  }
}

/** Call from a user gesture so later sounds are allowed to play. */
export function unlockAudio(): void {
  const c = getContext();
  if (c && c.state === "suspended") void c.resume().catch(() => undefined);
}

function makeNoise(c: AudioContext): AudioBufferSourceNode {
  if (!noiseBuffer) {
    const length = c.sampleRate * 2;
    noiseBuffer = c.createBuffer(1, length, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;
  return source;
}

interface ToneOptions {
  type?: OscillatorType;
  freq: number;
  endFreq?: number;
  start: number;
  dur: number;
  gain: number;
  attack?: number;
  vibrato?: { rate: number; depth: number };
}

function tone(c: AudioContext, out: AudioNode, o: ToneOptions): void {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.freq, o.start);
  if (o.endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.endFreq), o.start + o.dur);
  const attack = o.attack ?? 0.01;
  g.gain.setValueAtTime(0.0001, o.start);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.gain), o.start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, o.start + o.dur);
  if (o.vibrato) {
    const lfo = c.createOscillator();
    const depth = c.createGain();
    lfo.frequency.value = o.vibrato.rate;
    depth.gain.value = o.vibrato.depth;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(o.start);
    lfo.stop(o.start + o.dur + 0.05);
  }
  osc.connect(g).connect(out);
  osc.start(o.start);
  osc.stop(o.start + o.dur + 0.05);
}

interface NoiseOptions {
  start: number;
  dur: number;
  gain: number;
  filter: BiquadFilterType;
  freq: number;
  endFreq?: number;
  q?: number;
  attack?: number;
}

function noise(c: AudioContext, out: AudioNode, o: NoiseOptions): void {
  const src = makeNoise(c);
  const filter = c.createBiquadFilter();
  const g = c.createGain();
  filter.type = o.filter;
  filter.frequency.setValueAtTime(o.freq, o.start);
  if (o.endFreq) filter.frequency.exponentialRampToValueAtTime(Math.max(1, o.endFreq), o.start + o.dur);
  filter.Q.value = o.q ?? 0.8;
  const attack = o.attack ?? 0.005;
  g.gain.setValueAtTime(0.0001, o.start);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.gain), o.start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, o.start + o.dur);
  src.connect(filter).connect(g).connect(out);
  src.start(o.start, Math.random());
  src.stop(o.start + o.dur + 0.05);
}

function render(name: SoundName, c: AudioContext, out: AudioNode): void {
  const t = c.currentTime + 0.02;
  switch (name) {
    case "bell": {
      const base = 196;
      [1, 2.0, 2.76, 5.4, 8.93].forEach((ratio, i) => {
        tone(c, out, { freq: base * ratio, start: t, dur: 3.6 - i * 0.5, gain: 0.5 / (i + 1), attack: 0.004 });
      });
      break;
    }
    case "creak": {
      const osc = c.createOscillator();
      const filter = c.createBiquadFilter();
      const g = c.createGain();
      osc.type = "sawtooth";
      const steps = 14;
      for (let i = 0; i < steps; i++) {
        osc.frequency.setValueAtTime(55 + Math.random() * 60 + i * 3, t + (i * 1.3) / steps);
      }
      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 6;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      osc.connect(filter).connect(g).connect(out);
      osc.start(t);
      osc.stop(t + 1.5);
      break;
    }
    case "rumble":
      noise(c, out, { start: t, dur: 2.8, gain: 0.9, filter: "lowpass", freq: 110, endFreq: 60, attack: 0.7 });
      tone(c, out, { freq: 42, endFreq: 34, start: t, dur: 2.6, gain: 0.4, attack: 0.6 });
      break;
    case "cannon":
      noise(c, out, { start: t, dur: 1.3, gain: 1, filter: "lowpass", freq: 2600, endFreq: 90 });
      tone(c, out, { freq: 95, endFreq: 28, start: t, dur: 0.8, gain: 0.95 });
      break;
    case "chord": {
      [55, 82.4, 130.8, 155.6].forEach((f, i) => {
        tone(c, out, { type: "sawtooth", freq: f, start: t + i * 0.05, dur: 3, gain: 0.08, attack: 0.5 });
      });
      tone(c, out, { freq: 41.2, start: t, dur: 3, gain: 0.25, attack: 0.6 });
      break;
    }
    case "organ": {
      const chords = [
        [146.8, 174.6, 220, 277.2],
        [138.6, 164.8, 207.7, 261.6],
      ];
      chords.forEach((notes, ci) => {
        notes.forEach((f) => {
          tone(c, out, { type: "square", freq: f, start: t + ci * 0.9, dur: 1.2, gain: 0.04, attack: 0.08, vibrato: { rate: 6, depth: 2 } });
          tone(c, out, { freq: f / 2, start: t + ci * 0.9, dur: 1.2, gain: 0.08, attack: 0.08 });
        });
      });
      break;
    }
    case "clink":
      [2400, 3650, 5200].forEach((f, i) => tone(c, out, { freq: f, start: t, dur: 0.45 - i * 0.1, gain: 0.18 / (i + 1), attack: 0.002 }));
      break;
    case "coins":
      for (let i = 0; i < 7; i++) {
        const f = 2000 + Math.random() * 2400;
        tone(c, out, { freq: f, start: t + i * 0.06 + Math.random() * 0.03, dur: 0.25, gain: 0.12, attack: 0.002 });
      }
      break;
    case "door":
      render("creak", c, out);
      noise(c, out, { start: t + 0.9, dur: 0.5, gain: 0.9, filter: "lowpass", freq: 380 });
      tone(c, out, { freq: 70, endFreq: 38, start: t + 0.9, dur: 0.55, gain: 0.9 });
      break;
    case "spooky":
      tone(c, out, { freq: 440, endFreq: 300, start: t, dur: 2.6, gain: 0.16, attack: 0.4, vibrato: { rate: 5, depth: 12 } });
      tone(c, out, { freq: 523, endFreq: 360, start: t + 0.3, dur: 2.4, gain: 0.08, attack: 0.5, vibrato: { rate: 4.3, depth: 9 } });
      break;
    case "splash":
      noise(c, out, { start: t, dur: 0.9, gain: 0.6, filter: "bandpass", freq: 1500, endFreq: 260, q: 1.2 });
      break;
    case "stamp":
      noise(c, out, { start: t, dur: 0.14, gain: 0.8, filter: "lowpass", freq: 320 });
      tone(c, out, { freq: 130, endFreq: 48, start: t, dur: 0.18, gain: 0.7 });
      break;
    case "paper":
      noise(c, out, { start: t, dur: 0.18, gain: 0.35, filter: "highpass", freq: 2200 });
      noise(c, out, { start: t + 0.07, dur: 0.12, gain: 0.25, filter: "highpass", freq: 3000 });
      break;
    case "squawk":
      tone(c, out, { type: "sawtooth", freq: 900, endFreq: 1700, start: t, dur: 0.16, gain: 0.12 });
      tone(c, out, { type: "sawtooth", freq: 1600, endFreq: 800, start: t + 0.15, dur: 0.22, gain: 0.12 });
      break;
    case "ring":
      for (let i = 0; i < 2; i++) {
        tone(c, out, { freq: 440, start: t + i * 0.55, dur: 0.4, gain: 0.12, vibrato: { rate: 20, depth: 8 } });
        tone(c, out, { freq: 480, start: t + i * 0.55, dur: 0.4, gain: 0.12 });
      }
      break;
    case "bubble":
      for (let i = 0; i < 3; i++) {
        tone(c, out, { freq: 280 + i * 90, endFreq: 900 + i * 120, start: t + i * 0.13, dur: 0.12, gain: 0.12 });
      }
      break;
    case "thud":
      tone(c, out, { freq: 65, endFreq: 34, start: t, dur: 0.45, gain: 0.9 });
      break;
  }
}

/** Plays a generated sound. Never throws; silently skips when audio is unavailable. */
export function playSound(name: SoundName): void {
  const c = getContext();
  if (!c || !master) return;
  const out = master;
  try {
    if (c.state === "running") {
      render(name, c, out);
      return;
    }
    const askedAt = performance.now();
    void c
      .resume()
      .then(() => {
        // Only play if the resume happened promptly (i.e. during a user gesture),
        // otherwise a stale sound would burst out later.
        if (performance.now() - askedAt < 400) render(name, c, out);
      })
      .catch(() => undefined);
  } catch {
    /* the orchestra has drowned; carry on */
  }
}
