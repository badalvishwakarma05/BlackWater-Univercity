/**
 * Small original props that wash up all over the ship: crabs, rats, barrels,
 * chests, daggers, bells, telephones and the little glyphs on the nav planks.
 */
import type { ReactElement } from "react";
import type { GlyphName } from "../../app/routes";

interface SizeProps {
  size?: number;
  className?: string;
}

export function Crab({ size = 70, className = "" }: SizeProps) {
  return (
    <svg viewBox="0 0 80 56" width={size} height={(size * 56) / 80} className={className} aria-hidden="true">
      <path d="M14 34l-10 8M16 38l-8 12M64 34l10 8M62 38l8 12M24 42l-4 12M56 42l4 12" stroke="#5a1a10" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="40" cy="34" rx="24" ry="14" fill="#c0503e" stroke="#4a1a10" strokeWidth="2" />
      <path d="M28 30c6 3 18 3 24 0" stroke="#e08070" strokeWidth="2" fill="none" />
      <path d="M32 22l-4-12M48 22l4-12" stroke="#4a1a10" strokeWidth="2.4" />
      <circle cx="28" cy="9" r="4" fill="#e8ddc2" stroke="#4a1a10" />
      <circle cx="52" cy="9" r="4" fill="#e8ddc2" stroke="#4a1a10" />
      <circle cx="28.5" cy="9.5" r="1.6" fill="#090807" />
      <circle cx="51.5" cy="9.5" r="1.6" fill="#090807" />
      <path d="M18 28C8 26 4 16 10 10c2 6 8 8 12 6-2 4 0 8-4 12z" fill="#c0503e" stroke="#4a1a10" strokeWidth="2" />
      <path d="M62 28c10-2 14-12 8-18-2 6-8 8-12 6 2 4 0 8 4 12z" fill="#c0503e" stroke="#4a1a10" strokeWidth="2" />
      <path d="M34 40c4 2 8 2 12 0" stroke="#4a1a10" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function Rat({ size = 70, className = "" }: SizeProps) {
  return (
    <svg viewBox="0 0 80 46" width={size} height={(size * 46) / 80} className={className} aria-hidden="true">
      <path d="M8 30c-8-2-8-12 0-14" stroke="#8a7a72" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="28" rx="24" ry="13" fill="#6f6a66" stroke="#2a2622" strokeWidth="2" />
      <path d="M52 22c8-6 18-4 22 4-4 4-12 6-20 4z" fill="#7a7470" stroke="#2a2622" strokeWidth="2" />
      <circle cx="54" cy="16" r="6" fill="#8a7a72" stroke="#2a2622" strokeWidth="1.5" />
      <circle cx="54" cy="16" r="3" fill="#d4a0a0" />
      <circle cx="66" cy="24" r="1.8" fill="#090807" />
      <circle cx="75" cy="27" r="1.6" fill="#d48080" />
      <path d="M74 28l6-2M74 29l6 2" stroke="#2a2622" strokeWidth=".8" />
      {/* tiny life ring */}
      <ellipse cx="34" cy="32" rx="22" ry="8" fill="none" stroke="#e8ddc2" strokeWidth="5" />
      <ellipse cx="34" cy="32" rx="22" ry="8" fill="none" stroke="#8d1d28" strokeWidth="5" strokeDasharray="8 8" />
    </svg>
  );
}

export function Barrel({ size = 100, className = "", label = "" }: SizeProps & { label?: string }) {
  return (
    <svg viewBox="0 0 100 120" width={size} height={(size * 120) / 100} className={className} aria-hidden="true">
      <path d="M14 14c0-10 72-10 72 0 8 30 8 62 0 92 0 10-72 10-72 0-8-30-8-62 0-92z" fill="#6b4a2e" stroke="#1a0f08" strokeWidth="2.5" />
      <g stroke="#2a1a10" strokeWidth="1.4" opacity=".7">
        <path d="M30 6c-4 36-4 72 0 108M50 4v112M70 6c4 36 4 72 0 108" />
      </g>
      <g stroke="#3a3a38" strokeWidth="6" fill="none">
        <path d="M10 28c26 6 54 6 80 0" />
        <path d="M10 92c26 6 54 6 80 0" />
      </g>
      <ellipse cx="50" cy="12" rx="36" ry="6" fill="#523826" stroke="#1a0f08" strokeWidth="2" />
      {label && (
        <text x="50" y="66" textAnchor="middle" fontFamily="Pirata One, serif" fontSize={label.length > 8 ? 11 : 15} fill="#e8ddc2" transform="rotate(-4 50 66)">
          {label}
        </text>
      )}
    </svg>
  );
}

export function TreasureChest({ size = 150, className = "", open = false }: SizeProps & { open?: boolean }) {
  return (
    <svg viewBox="0 0 160 130" width={size} height={(size * 130) / 160} className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      {open && (
        <g>
          <ellipse cx="80" cy="60" rx="60" ry="22" fill="#ffd56b" opacity=".35" className="anim-glow" />
          <g fill="#c39a43" stroke="#5e4719">
            <circle cx="56" cy="62" r="9" />
            <circle cx="74" cy="56" r="9" />
            <circle cx="92" cy="60" r="9" />
            <circle cx="108" cy="64" r="8" />
            <circle cx="66" cy="66" r="8" />
          </g>
          <path d="M84 40l10 8-10 8-10-8z" fill="#8d1d28" stroke="#3a0a0e" />
        </g>
      )}
      <path d="M14 64h132v54c0 6-4 10-10 10H24c-6 0-10-4-10-10z" fill="#6b4a2e" stroke="#1a0f08" strokeWidth="2.5" />
      <path d="M14 80h132M14 106h132" stroke="#c39a43" strokeWidth="4" />
      <path d="M40 64v64M120 64v64" stroke="#2a1a10" strokeWidth="1.5" opacity=".6" />
      {/* broken lock */}
      <rect x="70" y="72" width="20" height="22" rx="3" fill="#8e7138" stroke="#3a2a10" strokeWidth="2" />
      <path d="M76 72c0-10 12-12 14-4" stroke="#8e7138" strokeWidth="4" fill="none" />
      <circle cx="80" cy="82" r="3" fill="#1a0f08" />
      <g className={`chest-lid${open ? " is-open" : ""}`}>
        <path d="M14 64c0-30 132-30 132 0z" fill="#77583a" stroke="#1a0f08" strokeWidth="2.5" />
        <path d="M20 54c34-14 86-14 120 0" stroke="#c39a43" strokeWidth="4" fill="none" />
        <path d="M60 42l8 10M100 40l-6 12" stroke="#1a0f08" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function Dagger({ size = 160, className = "" }: SizeProps) {
  return (
    <svg viewBox="0 0 40 160" width={(size * 40) / 160} height={size} className={className} aria-hidden="true">
      <path d="M20 4l7 92H13z" fill="#c8c8c0" stroke="#4a4a44" strokeWidth="1.5" />
      <path d="M20 8v84" stroke="#fff" strokeWidth="1" opacity=".6" />
      <path d="M2 96h36l-3 8H5z" fill="#c39a43" stroke="#5e4719" strokeWidth="1.5" />
      <rect x="15" y="104" width="10" height="38" fill="#382419" stroke="#1a0f08" />
      <g stroke="#8d1d28" strokeWidth="2">
        <path d="M15 110l10 4M15 118l10 4M15 126l10 4M15 134l10 4" />
      </g>
      <circle cx="20" cy="148" r="8" fill="#e8ddc2" stroke="#2a2622" strokeWidth="1.5" />
      <circle cx="17" cy="147" r="1.6" fill="#090807" />
      <circle cx="23" cy="147" r="1.6" fill="#090807" />
    </svg>
  );
}

export function BellOutline({ size = 120, className = "" }: SizeProps) {
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} className={className} aria-hidden="true">
      <path d="M60 4v14" stroke="#8e7138" strokeWidth="3" />
      <g className="anim-bell">
        <path d="M60 18c-22 0-34 18-34 44v30l-12 16h92l-12-16V62c0-26-12-44-34-44z" fill="none" stroke="#c39a43" strokeWidth="3" />
        <path d="M30 96h60" stroke="#c39a43" strokeWidth="1.5" opacity=".6" />
        <circle cx="60" cy="118" r="8" fill="none" stroke="#c39a43" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function Telephone({ size = 200, className = "" }: SizeProps) {
  return (
    <svg viewBox="0 0 200 170" width={size} height={(size * 170) / 200} className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      {/* tangled cord */}
      <path
        d="M40 110c-20 10-30 30-10 40s30-20 10-24-20 30 0 34 34-10 50 0 0 30 20 20 30-30 50-10"
        stroke="#1a1414"
        strokeWidth="3"
        fill="none"
      />
      {/* body */}
      <path d="M40 120l14-60h92l14 60z" fill="#1c1a18" stroke="#090807" strokeWidth="2.5" />
      <path d="M48 120h104" stroke="#c39a43" strokeWidth="3" />
      {/* crack + duct tape */}
      <path d="M120 64l-8 20 10 8-6 16" stroke="#e8ddc2" strokeWidth="1.2" fill="none" opacity=".6" />
      <rect x="62" y="96" width="34" height="10" fill="#9a9e98" opacity=".9" transform="rotate(-14 79 101)" />
      {/* rotary dial */}
      <circle cx="100" cy="90" r="22" fill="#c39a43" stroke="#5e4719" strokeWidth="2" />
      <circle cx="100" cy="90" r="8" fill="#e8ddc2" stroke="#5e4719" />
      {Array.from({ length: 9 }, (_, i) => i * 32 - 60).map((deg) => (
        <circle key={deg} cx={100 + 15 * Math.cos((deg * Math.PI) / 180)} cy={90 + 15 * Math.sin((deg * Math.PI) / 180)} r="3.2" fill="#1c1a18" />
      ))}
      {/* receiver, off the hook */}
      <g transform="rotate(-24 150 40)">
        <path d="M120 40c0-12 60-12 60 0" stroke="#1c1a18" strokeWidth="12" fill="none" strokeLinecap="round" />
        <rect x="112" y="34" width="18" height="16" rx="5" fill="#1c1a18" />
        <rect x="170" y="34" width="18" height="16" rx="5" fill="#1c1a18" />
      </g>
      <path d="M58 60V48h84v12" stroke="#2a2622" strokeWidth="5" fill="none" />
    </svg>
  );
}

const DEPT_PATHS: Record<string, ReactElement> = {
  cs: (
    <g>
      <rect x="8" y="12" width="48" height="32" rx="3" fill="#102f35" stroke="#c39a43" strokeWidth="2.5" />
      <text x="14" y="32" fontFamily="Special Elite, monospace" fontSize="12" fill="#608c76">{">_☠"}</text>
      <path d="M4 50h56l-4 6H8z" fill="#77583a" stroke="#2a1a10" strokeWidth="1.5" />
      <path d="M50 10l10-8" stroke="#c8c8c0" strokeWidth="2.5" />
    </g>
  ),
  eng: (
    <g>
      <circle cx="32" cy="32" r="16" fill="none" stroke="#c39a43" strokeWidth="6" strokeDasharray="6 4" />
      <circle cx="32" cy="32" r="9" fill="#382419" stroke="#c39a43" strokeWidth="2.5" />
      <path d="M32 26v14M27 30h10M26 36c2 3 4 4 6 4s4-1 6-4" stroke="#e8ddc2" strokeWidth="1.8" fill="none" />
      <path d="M4 58c10-6 18-6 28 0s18 6 28 0" stroke="#608c76" strokeWidth="2.5" fill="none" />
    </g>
  ),
  bus: (
    <g>
      <path d="M32 6v48M14 54h36" stroke="#c39a43" strokeWidth="3" />
      <path d="M10 18h44" stroke="#c39a43" strokeWidth="3" />
      <path d="M10 18l-6 16h12zM54 18l-6 16h12z" fill="#77583a" stroke="#c39a43" strokeWidth="1.5" />
      <circle cx="10" cy="30" r="4" fill="#c39a43" />
      <path d="M50 30h8" stroke="#8d1d28" strokeWidth="2" />
      <text x="47" y="46" fontSize="10" fill="#8d1d28" fontFamily="Pirata One">?</text>
    </g>
  ),
  hum: (
    <g>
      <path d="M8 46c0-20 6-30 20-36l4 6c-10 6-14 14-14 30z" fill="#e8ddc2" stroke="#9f9274" />
      <path d="M50 4L22 50" stroke="#e8ddc2" strokeWidth="3" />
      <path d="M50 4c4 10 0 20-10 26" stroke="#e8ddc2" strokeWidth="2" fill="none" />
      <rect x="8" y="46" width="48" height="12" rx="6" fill="#c8b995" stroke="#77583a" strokeWidth="1.5" />
      <path d="M14 52h30" stroke="#5a4320" strokeWidth="1.2" />
    </g>
  ),
  mar: (
    <g>
      <path d="M8 32c10-12 30-14 42 0-12 14-32 12-42 0z" fill="none" stroke="#e8ddc2" strokeWidth="2.5" />
      <path d="M50 32l10-8v16z" fill="none" stroke="#e8ddc2" strokeWidth="2.5" />
      <path d="M20 26v12M28 24v16M36 26v12" stroke="#e8ddc2" strokeWidth="1.6" />
      <circle cx="14" cy="30" r="2" fill="#608c76" />
      <path d="M4 56c8-4 16-4 24 0s16 4 24 0" stroke="#608c76" strokeWidth="2.5" fill="none" />
    </g>
  ),
};

export function DeptIcon({ dept, size = 64, className = "" }: SizeProps & { dept: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      {DEPT_PATHS[dept] ?? DEPT_PATHS.cs}
    </svg>
  );
}

/** Hand-scratched glyphs for the navigation planks. */
export function NavGlyph({ name, size = 18, className = "" }: SizeProps & { name: GlyphName }) {
  const common = { stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let body: ReactElement;
  switch (name) {
    case "deck":
      body = <path d="M3 15h18M5 15l2 5h10l2-5M12 3v12M12 4l6 6h-6" {...common} />;
      break;
    case "crew":
      body = <path d="M12 3c-4 0-6 3-6 6 0 2 1 3 2 4v3h8v-3c1-1 2-2 2-4 0-3-2-6-6-6zM9 9h.1M15 9h.1M4 21l16-4M4 17l16 4" {...common} />;
      break;
    case "coin":
      body = <path d="M12 3a9 9 0 1 0 .1 0zM12 7v10M9 9.5c0-1 1.3-1.8 3-1.8s3 .8 3 1.8-1.2 1.6-3 2-3 1-3 2 1.3 1.8 3 1.8 3-.8 3-1.8" {...common} />;
      break;
    case "map":
      body = <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15M14 11l3 3M17 11l-3 3" {...common} />;
      break;
    case "plank":
      body = <path d="M2 14h17l3 3M2 14v3h17M6 14v3M11 14v3M15 14v3M18 8c0-2-1-4-3-4M18 8l-2 2" {...common} />;
      break;
    case "brig":
      body = <path d="M4 4h16v16H4zM8 4v16M12 4v16M16 4v16M4 12h16" {...common} />;
      break;
    case "rum":
      body = <path d="M9 3h6M10 3v4c-3 1-4 4-4 7v6h12v-6c0-3-1-6-4-7V3M7 14h10" {...common} />;
      break;
    case "manifest":
      body = <path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5M15 16l2 2 3-4" {...common} />;
      break;
    case "phone":
      body = <path d="M5 4c-2 4 0 10 6 14 4 3 7 3 9 1l-3-4-3 1c-2-1-4-3-5-5l1-3-4-4zM16 3c2 1 4 3 5 5" {...common} />;
      break;
    case "fire":
      body = <path d="M12 21c-4 0-7-3-7-7 0-4 4-6 4-11 3 2 5 5 5 8 1-1 2-3 2-4 2 2 3 5 3 7 0 4-3 7-7 7z" {...common} />;
      break;
    case "jar":
      body = <path d="M8 3h8M8 6h8M7 6c-2 2-2 4-2 6v7c0 1 1 2 2 2h10c1 0 2-1 2-2v-7c0-2 0-4-2-6M5 14c4-2 10 2 14 0" {...common} />;
      break;
    case "barrel":
      body = <path d="M6 3h12c2 6 2 12 0 18H6c-2-6-2-12 0-18zM4.6 8h14.8M4.6 16h14.8" {...common} />;
      break;
    case "scroll":
      body = <path d="M6 4h12v14c0 2-1 3-3 3H5c2 0 3-1 3-3V6c0-1-1-2-2-2zM10 9h5M10 13h5" {...common} />;
      break;
    case "door":
      body = <path d="M6 21V4h12v17M4 21h16M14 12h.1M9 8l3 2" {...common} />;
      break;
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {body}
    </svg>
  );
}
