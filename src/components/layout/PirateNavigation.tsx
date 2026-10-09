import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { useExperience } from "../../app/PirateExperienceProvider";
import { LOWER_DECK_ROUTES, NAV_ROUTES, type RouteInfo } from "../../app/routes";
import { UniversityEmblem } from "../svg/UniversityEmblem";
import { NavGlyph } from "../svg/Props";

/** Each plank was nailed up by a different pirate on a different night. */
const PLANK_STYLE: { tilt: number; glyph: "before" | "after" | "top" | "none" }[] = [
  { tilt: -1.6, glyph: "before" },
  { tilt: 1.2, glyph: "after" },
  { tilt: -0.6, glyph: "top" },
  { tilt: 2, glyph: "before" },
  { tilt: -2.2, glyph: "none" },
  { tilt: 0.7, glyph: "after" },
  { tilt: 1.6, glyph: "before" },
  { tilt: -1, glyph: "top" },
  { tilt: 0.9, glyph: "after" },
];

function Plank({ route, index, label, onNavigate }: { route: RouteInfo; index: number; label: string; onNavigate?: () => void }) {
  const style = PLANK_STYLE[index % PLANK_STYLE.length];
  const glyphClass = style.glyph === "top" ? "glyph-top" : style.glyph === "after" ? "glyph-after" : "";
  return (
    <NavLink
      to={route.path}
      end={route.path === "/"}
      onClick={onNavigate}
      className={({ isActive }) => `nav-plank storm-wobble ${glyphClass} ${isActive ? "is-active" : ""}`}
      style={{ ["--tilt" as string]: `${style.tilt}deg` }}
    >
      {style.glyph !== "none" && <NavGlyph name={route.glyph} size={style.glyph === "top" ? 15 : 18} />}
      <span>{label}</span>
    </NavLink>
  );
}

/** The ship's wooden control panel. Vertical sidebar along the left side on desktop, collapsible manifest on mobile. */
export function PirateNavigation() {
  const { soundOn, toggleSound, stormMode } = useExperience();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const label = (r: RouteInfo) => (stormMode ? r.storm : r.label);

  // close the manifest when the ship changes deck
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <aside className="ship-header ship-sidebar tx-wood lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:w-72 lg:z-40 lg:flex lg:flex-col lg:overflow-y-auto lg:border-r-4 lg:border-[#382419] lg:shadow-[6px_0_24px_rgba(0,0,0,0.75)]">
      {/* Brand & Mobile Bar */}
      <div className="ship-header-row p-4 lg:flex-col lg:items-start lg:gap-4 border-b border-[#523826] lg:border-b-2">
        <Link to="/" className="ship-brand flex items-center gap-3" aria-label="Blackwater University: back to the Poop Deck">
          <UniversityEmblem size={52} className="ship-brand-emblem shrink-0 -rotate-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]" />
          <span className="min-w-0">
            <span className="ship-brand-name block font-pirate text-2xl text-gold leading-tight">Blackwater University</span>
            <span className="ship-brand-tag block text-xs font-type text-parchment opacity-85">a fine institution · since 1719?</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:w-full lg:justify-between lg:mt-2">
          <button
            type="button"
            className="header-tool flex items-center gap-2 px-3 py-1.5 rounded bg-[#382419] text-ivory text-xs font-type border border-[#77583a] hover:bg-[#523826] transition-colors"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Sound on. Mute the ship." : "Sound off. Unmute the ship."}
          >
            {soundOn ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            <span>{soundOn ? "Audio: ON" : "Audio: MUTED"}</span>
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="header-tool lg:hidden flex items-center gap-1 px-3 py-1.5 rounded bg-[#382419] text-ivory text-xs font-type border border-[#77583a]"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            <span>Manifest</span>
          </button>
        </div>
      </div>

      {/* Desktop Vertical Sidebar Navigation */}
      <nav aria-label="Main decks" className="hidden lg:flex lg:flex-col lg:flex-1 lg:p-4 lg:gap-6">
        <div>
          <p className="kicker mb-3 font-type text-xs uppercase tracking-widest text-brine">Main Decks</p>
          <ul className="nav-deck flex flex-col gap-2.5">
            {NAV_ROUTES.map((route, i) => (
              <li key={route.path} className="w-full">
                <Plank route={route} index={i} label={label(route)} />
              </li>
            ))}
          </ul>
        </div>

        <div className="lower-deck-vertical mt-auto pt-4 border-t border-[#523826]">
          <p className="kicker mb-2 font-type text-xs uppercase tracking-wider text-brine">Lower Decks</p>
          <ul className="flex flex-col gap-1.5 text-sm font-fell">
            {LOWER_DECK_ROUTES.map((route) => (
              <li key={route.path}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `block px-2 py-1 rounded transition-colors ${
                      isActive ? "text-gold font-bold bg-[#382419]" : "text-ivory hover:text-gold hover:bg-[#281810]"
                    }`
                  }
                >
                  ⚓ {label(route)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Manifest Panel */}
      {open && (
        <nav id={panelId} aria-label="Ship's manifest" className="manifest-panel tx-wood anim-panel-open lg:hidden p-4">
          <p className="kicker mb-2 font-type text-xs text-brine uppercase">Main decks</p>
          <ul className="flex flex-col gap-2">
            {NAV_ROUTES.map((route, i) => (
              <li key={route.path}>
                <Plank route={route} index={i} label={label(route)} onNavigate={() => setOpen(false)} />
              </li>
            ))}
          </ul>
          <p className="kicker mb-2 mt-4 font-type text-xs text-brine uppercase">Lower decks</p>
          <ul className="flex flex-col gap-1.5">
            {LOWER_DECK_ROUTES.map((route, i) => (
              <li key={route.path}>
                <Plank route={route} index={i + 4} label={label(route)} onNavigate={() => setOpen(false)} />
              </li>
            ))}
          </ul>
        </nav>
      )}
      {!open && <div id={panelId} hidden />}
    </aside>
  );
}
