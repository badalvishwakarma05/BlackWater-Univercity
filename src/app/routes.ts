export type GlyphName =
  | "deck"
  | "crew"
  | "coin"
  | "map"
  | "plank"
  | "brig"
  | "rum"
  | "manifest"
  | "phone"
  | "fire"
  | "jar"
  | "barrel"
  | "scroll"
  | "door";

export interface RouteInfo {
  path: string;
  label: string;
  /** What the label becomes when the Konami storm seizes the ship */
  storm: string;
  blurb: string;
  glyph: GlyphName;
}

/** Main navigation, in the exact order the captain carved into the mast. */
export const NAV_ROUTES: RouteInfo[] = [
  { path: "/", label: "The Poop Deck", storm: "THE POOP DECK (BESIEGED)", blurb: "Home port", glyph: "deck" },
  { path: "/admissions", label: "Join the Crew", storm: "PRESS-GANG OFFICE", blurb: "Admissions", glyph: "crew" },
  { path: "/fees", label: "Booty & Fees", storm: "PLUNDER LEDGER", blurb: "Fees", glyph: "coin" },
  { path: "/treasure-maps", label: "Treasure Maps", storm: "CHARTS OF DOOM", blurb: "Campus directory", glyph: "map" },
  { path: "/results", label: "Walk the Plank", storm: "THE PLANK AWAITS", blurb: "Results", glyph: "plank" },
  { path: "/brig", label: "The Brig", storm: "THE DUNGEON DECK", blurb: "Student services", glyph: "brig" },
  { path: "/library", label: "Rum & Resources", storm: "THE HAUNTED HOLD", blurb: "Library", glyph: "rum" },
  { path: "/faculty", label: "Crew Manifest", storm: "MOST WANTED", blurb: "Faculty", glyph: "manifest" },
  { path: "/mutiny-hotline", label: "Mutiny Hotline", storm: "OPEN REVOLT LINE", blurb: "Support", glyph: "phone" },
];

/** Lower decks: real pages that didn't fit on the main mast. */
export const LOWER_DECK_ROUTES: RouteInfo[] = [
  { path: "/attendance", label: "Attendance", storm: "ROLL CALL OF THE DAMNED", blurb: "Attendance calculator", glyph: "fire" },
  { path: "/placements", label: "Placements", storm: "THE VAULT OF OFFERS", blurb: "Placement cell", glyph: "jar" },
  { path: "/hostel/complaints", label: "Hostel Complaints", storm: "REPORT THE MUTINY", blurb: "Hostel maintenance", glyph: "barrel" },
];

export const SECRET_ROUTES: RouteInfo[] = [
  { path: "/the-code", label: "The Code", storm: "THE FORBIDDEN CODE", blurb: "Secret", glyph: "scroll" },
  { path: "/faculty-cabin-map", label: "Faculty Cabin Map", storm: "THE HIDDEN CABINS", blurb: "Secret", glyph: "door" },
];

export const NORMAL_ROUTES: RouteInfo[] = [...NAV_ROUTES, ...LOWER_DECK_ROUTES];

const ALL_KNOWN = [...NORMAL_ROUTES, ...SECRET_ROUTES];

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.replace(/\/+$/, "");
  return pathname;
}

export function findRoute(pathname: string): RouteInfo | undefined {
  const path = normalizePath(pathname);
  return ALL_KNOWN.find((r) => r.path === path);
}

export const COUNTABLE_PATHS = new Set(NORMAL_ROUTES.map((r) => r.path));
