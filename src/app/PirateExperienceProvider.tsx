import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { playSound, type SoundName } from "../lib/audio";
import { uid } from "../lib/random";
import {
  KEYS,
  isArrayOf,
  isBoolean,
  isNumber,
  isRecord,
  isStringArray,
  readStore,
  writeStore,
} from "../lib/storage";
import { COUNTABLE_PATHS, normalizePath } from "./routes";

/* ------------------------------------------------------------------ */
/* Rules of the experience (documented so nobody blames the parrot)   */
/* ------------------------------------------------------------------ */

/**
 * JAR OF DIRT VISIT RULE: a "visit" is the first time you set foot on a
 * given normal page during a browser session. Re-visiting the same page in
 * the same session adds nothing; a new session lets every page count again.
 * The total lives in localStorage and is capped so it can't grow forever.
 */
export const JAR_UNLOCK_AT = 6;
export const JAR_MAX = 999;
export const JAR_LEVELS = [
  { min: 1, label: "DIRT", message: "One handful of academic despair." },
  { min: 2, label: "MORE DIRT", message: "The jar remembers." },
  { min: 3, label: "PREMIUM DIRT", message: "This is premium dirt." },
  { min: 4, label: "STOLEN DIRT", message: "The administration would like this jar returned." },
  { min: JAR_UNLOCK_AT, label: "SECRET DIRT", message: "The dirt knows the secret." },
] as const;

/** Compass spins (per session) needed to reveal the Faculty Cabin Map. */
export const COMPASS_UNLOCK_AT = 5;

export function jarLevelFor(visits: number): number {
  return JAR_LEVELS.filter((l) => visits >= l.min).length;
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type PopupVariant = "parchment" | "wooden" | "wax" | "dialogue" | "treasure" | "error" | "rum";

export interface PopupAction {
  label: string;
  to?: string;
  onClick?: () => void;
  primary?: boolean;
  /** Defaults to true: close the popup after the action runs */
  closes?: boolean;
}

export interface PopupConfig {
  id: string;
  key?: string;
  variant: PopupVariant;
  title: string;
  body: ReactNode;
  illustration?: ReactNode;
  speaker?: string;
  actions?: PopupAction[];
  dismissible?: boolean;
  size?: "sm" | "md" | "lg";
  onClose?: () => void;
}

export type PopupInput = Omit<PopupConfig, "id"> & { id?: string };

export interface ToastConfig {
  id: string;
  title: string;
  message?: string;
  tone?: "info" | "warn" | "treasure" | "storm";
  action?: { label: string; to?: string; onClick?: () => void };
  duration?: number;
}

export type ToastInput = Omit<ToastConfig, "id">;

export interface ChatLink {
  label: string;
  to: string;
}

export interface ChatMessage {
  id: string;
  from: "dutchman" | "mortal";
  text: string;
  links?: ChatLink[];
}

export const TICKET_STATUSES = [
  "Lost at sea",
  "Received by a parrot",
  "Under investigation by a crab",
  "Escalated to the captain",
  "Closed because the office is on fire",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface Ticket {
  id: string;
  type: string;
  summary: string;
  status: TicketStatus;
  createdAt: number;
}

const isTicket = (v: unknown): v is Ticket =>
  isRecord(v) &&
  typeof v.id === "string" &&
  typeof v.type === "string" &&
  typeof v.summary === "string" &&
  typeof v.createdAt === "number" &&
  (TICKET_STATUSES as readonly string[]).includes(v.status as string);

const isChatLink = (v: unknown): v is ChatLink => isRecord(v) && typeof v.label === "string" && typeof v.to === "string";

const isChatMessage = (v: unknown): v is ChatMessage =>
  isRecord(v) &&
  typeof v.id === "string" &&
  (v.from === "dutchman" || v.from === "mortal") &&
  typeof v.text === "string" &&
  (v.links === undefined || isArrayOf(isChatLink)(v.links));

const clampCount = (n: number, max: number) => Math.max(0, Math.min(max, Math.floor(n)));

interface Experience {
  introDone: boolean;
  finishIntro: () => void;

  soundOn: boolean;
  toggleSound: () => void;
  play: (sound: SoundName) => void;

  visits: number;
  jarLevel: number;
  codeUnlocked: boolean;
  registerVisit: (pathname: string) => void;

  compassSpins: number;
  recordCompassSpin: () => number;
  cabinUnlocked: boolean;
  unlockCabin: () => void;

  stormMode: boolean;
  setStormMode: (on: boolean) => void;

  /** The 404 abyss hides the global deck furniture */
  abyss: boolean;
  setAbyss: (on: boolean) => void;

  popups: PopupConfig[];
  openPopup: (popup: PopupInput) => string;
  closePopup: (id: string) => void;

  toasts: ToastConfig[];
  notify: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;

  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessages: (messages: Omit<ChatMessage, "id">[]) => void;
  resetChat: () => void;

  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "createdAt">) => void;
  updateTicket: (id: string, status: TicketStatus) => void;
  clearTickets: () => void;

  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const ExperienceContext = createContext<Experience | null>(null);

export function useExperience(): Experience {
  const value = useContext(ExperienceContext);
  if (!value) throw new Error("useExperience must be used inside <PirateExperienceProvider>");
  return value;
}

export const DUTCHMAN_GREETING = "What do you want from me, mortal?";
const greeting = (): ChatMessage => ({ id: "greeting", from: "dutchman", text: DUTCHMAN_GREETING });

export function PirateExperienceProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(() => readStore("session", KEYS.introSeen, false, isBoolean));
  const [soundOn, setSoundOn] = useState(() => readStore("local", KEYS.sound, true, isBoolean));
  const [visits, setVisits] = useState(() => clampCount(readStore("local", KEYS.visits, 0, isNumber), JAR_MAX));
  const [codeUnlocked, setCodeUnlocked] = useState(() => readStore("local", KEYS.codeUnlocked, false, isBoolean));
  const [compassSpins, setCompassSpins] = useState(() =>
    clampCount(readStore("session", KEYS.compassSpins, 0, isNumber), 999),
  );
  const [cabinUnlocked, setCabinUnlocked] = useState(() => readStore("local", KEYS.cabinUnlocked, false, isBoolean));
  const [stormMode, setStormModeState] = useState(() => readStore("session", KEYS.storm, false, isBoolean));
  const [abyss, setAbyss] = useState(false);
  const [popups, setPopups] = useState<PopupConfig[]>([]);
  const [toasts, setToasts] = useState<ToastConfig[]>([]);
  const [chatOpen, setChatOpenState] = useState(() => readStore("session", KEYS.chatOpen, false, isBoolean));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const stored = readStore("session", KEYS.chat, [] as ChatMessage[], isArrayOf(isChatMessage));
    return stored.length ? stored : [greeting()];
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => readStore("local", KEYS.tickets, [] as Ticket[], isArrayOf(isTicket)));

  const soundRef = useRef(soundOn);
  const popupsRef = useRef<PopupConfig[]>([]);
  const toastTimers = useRef(new Map<string, number>());

  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    document.documentElement.classList.toggle("storm-mode", stormMode);
  }, [stormMode]);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
    };
  }, []);

  const finishIntro = useCallback(() => {
    writeStore("session", KEYS.introSeen, true);
    setIntroDone(true);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      writeStore("local", KEYS.sound, !prev);
      return !prev;
    });
  }, []);

  const play = useCallback((sound: SoundName) => {
    if (soundRef.current) playSound(sound);
  }, []);

  const registerVisit = useCallback((pathname: string) => {
    const path = normalizePath(pathname);
    if (!COUNTABLE_PATHS.has(path)) return;
    // The per-session ledger makes this idempotent, so StrictMode's
    // double-invoked effects and rerenders can't add extra dirt.
    const seen = readStore("session", KEYS.visitedRoutes, [] as string[], isStringArray);
    if (seen.includes(path)) return;
    writeStore("session", KEYS.visitedRoutes, [...seen, path]);
    const next = clampCount(readStore("local", KEYS.visits, 0, isNumber) + 1, JAR_MAX);
    writeStore("local", KEYS.visits, next);
    setVisits(next);
    if (next >= JAR_UNLOCK_AT && !readStore("local", KEYS.codeUnlocked, false, isBoolean)) {
      writeStore("local", KEYS.codeUnlocked, true);
      setCodeUnlocked(true);
    }
  }, []);

  const recordCompassSpin = useCallback(() => {
    const next = clampCount(readStore("session", KEYS.compassSpins, 0, isNumber) + 1, 999);
    writeStore("session", KEYS.compassSpins, next);
    setCompassSpins(next);
    return next;
  }, []);

  const unlockCabin = useCallback(() => {
    writeStore("local", KEYS.cabinUnlocked, true);
    setCabinUnlocked(true);
  }, []);

  const setStormMode = useCallback((on: boolean) => {
    writeStore("session", KEYS.storm, on);
    setStormModeState(on);
  }, []);

  const openPopup = useCallback((input: PopupInput) => {
    const key = input.key ?? input.title;
    const existing = popupsRef.current.find((p) => p.key === key);
    if (existing) return existing.id;
    const popup: PopupConfig = { ...input, key, id: input.id ?? uid() };
    popupsRef.current = [...popupsRef.current, popup];
    setPopups(popupsRef.current);
    return popup.id;
  }, []);

  const closePopup = useCallback((id: string) => {
    const closing = popupsRef.current.find((p) => p.id === id);
    if (!closing) return;
    popupsRef.current = popupsRef.current.filter((p) => p.id !== id);
    setPopups(popupsRef.current);
    closing.onClose?.();
  }, []);

  const dismissToast = useCallback((id: string) => {
    const timer = toastTimers.current.get(id);
    if (timer) window.clearTimeout(timer);
    toastTimers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (input: ToastInput) => {
      const id = uid();
      setToasts((prev) => {
        if (prev.some((t) => t.title === input.title && t.message === input.message)) return prev;
        return [...prev.slice(-3), { ...input, id }];
      });
      const timer = window.setTimeout(() => dismissToast(id), input.duration ?? (input.action ? 9000 : 6000));
      toastTimers.current.set(id, timer);
    },
    [dismissToast],
  );

  const setChatOpen = useCallback((open: boolean) => {
    writeStore("session", KEYS.chatOpen, open);
    setChatOpenState(open);
  }, []);

  const addChatMessages = useCallback((messages: Omit<ChatMessage, "id">[]) => {
    setChatMessages((prev) => {
      const next = [...prev, ...messages.map((m) => ({ ...m, id: uid() }))].slice(-40);
      writeStore("session", KEYS.chat, next);
      return next;
    });
  }, []);

  const resetChat = useCallback(() => {
    const fresh = [greeting()];
    writeStore("session", KEYS.chat, fresh);
    setChatMessages(fresh);
  }, []);

  const addTicket = useCallback((ticket: Omit<Ticket, "createdAt">) => {
    setTickets((prev) => {
      const next = [{ ...ticket, createdAt: Date.now() }, ...prev].slice(0, 30);
      writeStore("local", KEYS.tickets, next);
      return next;
    });
  }, []);

  const updateTicket = useCallback((id: string, status: TicketStatus) => {
    setTickets((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, status } : t));
      writeStore("local", KEYS.tickets, next);
      return next;
    });
  }, []);

  const clearTickets = useCallback(() => {
    writeStore("local", KEYS.tickets, []);
    setTickets([]);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(() => readStore("local", "bw_auth", false, isBoolean));

  const login = useCallback(() => {
    writeStore("local", "bw_auth", true);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    writeStore("local", "bw_auth", false);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<Experience>(
    () => ({
      introDone,
      finishIntro,
      soundOn,
      toggleSound,
      play,
      visits,
      jarLevel: jarLevelFor(visits),
      codeUnlocked,
      registerVisit,
      compassSpins,
      recordCompassSpin,
      cabinUnlocked,
      unlockCabin,
      stormMode,
      setStormMode,
      abyss,
      setAbyss,
      popups,
      openPopup,
      closePopup,
      toasts,
      notify,
      dismissToast,
      chatOpen,
      setChatOpen,
      chatMessages,
      addChatMessages,
      resetChat,
      tickets,
      addTicket,
      updateTicket,
      clearTickets,
      isAuthenticated,
      login,
      logout,
    }),
    [
      introDone,
      finishIntro,
      soundOn,
      toggleSound,
      play,
      visits,
      codeUnlocked,
      registerVisit,
      compassSpins,
      recordCompassSpin,
      cabinUnlocked,
      unlockCabin,
      stormMode,
      setStormMode,
      abyss,
      popups,
      openPopup,
      closePopup,
      toasts,
      notify,
      dismissToast,
      chatOpen,
      setChatOpen,
      chatMessages,
      addChatMessages,
      resetChat,
      tickets,
      addTicket,
      updateTicket,
      clearTickets,
      isAuthenticated,
      login,
      logout,
    ],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
