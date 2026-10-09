import type { KeyboardEvent, ReactElement } from "react";
import type { BuildingShape, CampusLocation } from "../../data/campusLocations";
import { useSvgId } from "./useSvgId";

/** An eight-point compass rose, slightly drunk. */
export function CompassRose({ x, y, r = 60 }: { x: number; y: number; r?: number }) {
  const points = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <g transform={`translate(${x} ${y}) rotate(-7)`} aria-hidden="true">
      <circle r={r} fill="none" stroke="#5a4320" strokeWidth="1.5" />
      <circle r={r * 0.82} fill="none" stroke="#5a4320" strokeWidth=".8" strokeDasharray="3 3" />
      {points.map((deg) => (
        <path
          key={deg}
          d={deg % 90 === 0 ? `M0 ${-r} L${r * 0.12} 0 L0 ${r * 0.12} L${-r * 0.12} 0Z` : `M0 ${-r * 0.62} L${r * 0.08} 0 L0 ${r * 0.08} L${-r * 0.08} 0Z`}
          fill={deg % 90 === 0 ? (deg === 0 ? "#8d1d28" : "#3a2a14") : "#8e7138"}
          transform={`rotate(${deg})`}
        />
      ))}
      <text y={-r - 8} textAnchor="middle" fontFamily="Pirata One, serif" fontSize="22" fill="#3a2a14">
        N
      </text>
      <text x={r + 10} y={6} fontFamily="IM Fell English, serif" fontSize="12" fill="#3a2a14">
        E-ish
      </text>
    </g>
  );
}

export function SeaMonster({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true" opacity=".85">
      <path d="M0 30c10-30 30-30 40 0s30 30 40 0 30-30 40 0" fill="none" stroke="#3a2a14" strokeWidth="5" strokeLinecap="round" />
      <path d="M120 30c6-26 26-34 36-20 6 8 0 18-8 16" fill="#6a7a5a" stroke="#3a2a14" strokeWidth="2.5" />
      <circle cx="146" cy="14" r="3" fill="#3a2a14" />
      <path d="M150 24l8 4" stroke="#3a2a14" strokeWidth="2" />
      <text x="20" y="62" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="15" fill="#5a4320">
        here be lecturers
      </text>
    </g>
  );
}

function Pictogram({ shape }: { shape: BuildingShape }): ReactElement {
  const ink = "#2a1a0c";
  switch (shape) {
    case "tower":
      return (
        <g>
          <path d="M-22 18v-34l22-22 22 22v34z" fill="#c8a870" stroke={ink} strokeWidth="2.5" />
          <path d="M-8 18v-14h16v14M-14 -10h6v6h-6zM8 -10h6v6h-6z" fill="none" stroke={ink} strokeWidth="2" />
          <path d="M0 -38v-14l12 5-12 5" fill="#8d1d28" stroke={ink} strokeWidth="1.5" />
        </g>
      );
    case "block":
      return (
        <g>
          <path d="M-28 18v-26h56v26z" fill="#b89868" stroke={ink} strokeWidth="2.5" />
          <path d="M-28 -8l10-10h36l10 10" fill="none" stroke={ink} strokeWidth="2" />
          <circle cx="0" cy="4" r="7" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="3 2" />
        </g>
      );
    case "screen":
      return (
        <g>
          <rect x="-22" y="-18" width="44" height="30" fill="#7a9a8a" stroke={ink} strokeWidth="2.5" />
          <path d="M-10 18h20M0 12v6" stroke={ink} strokeWidth="2.5" />
          <text x="-14" y="2" fontFamily="Special Elite, monospace" fontSize="12" fill={ink}>
            {">_"}
          </text>
        </g>
      );
    case "books":
      return (
        <g>
          <path d="M-26 16v-30l26-12 26 12v30z" fill="#c8a870" stroke={ink} strokeWidth="2.5" />
          <path d="M-14 16v-20M-6 16v-24M2 16v-22M10 16v-18" stroke="#8d1d28" strokeWidth="5" />
        </g>
      );
    case "bunks":
      return (
        <g>
          <path d="M-26 18v-28h52v28z" fill="#b89868" stroke={ink} strokeWidth="2.5" />
          <path d="M-20 -2h40M-20 10h40" stroke={ink} strokeWidth="2" />
          <path d="M-26 -10l26-14 26 14" fill="none" stroke={ink} strokeWidth="2.5" />
          <path d="M30 -4c6 4 12 4 18 0" stroke={ink} strokeWidth="1.5" fill="none" />
        </g>
      );
    case "pot":
      return (
        <g>
          <path d="M-20 -6h40c0 18-8 26-20 26s-20-8-20-26z" fill="#4a4440" stroke={ink} strokeWidth="2.5" />
          <path d="M-8 -14c2-6 6-6 6-12M6 -14c2-6 6-6 6-12" stroke={ink} strokeWidth="1.8" fill="none" />
          <path d="M-26 -6h52" stroke={ink} strokeWidth="3" />
        </g>
      );
    case "desk":
      return (
        <g>
          <path d="M-26 18v-26h52v26z" fill="#c8a870" stroke={ink} strokeWidth="2.5" />
          {[-16, -2, 12].map((x) => (
            <rect key={x} x={x} y="-2" width="8" height="6" fill={ink} />
          ))}
          <path d="M-20 -16h40" stroke={ink} strokeWidth="3" />
          <circle cx="24" cy="-22" r="5" fill="#3a3a38" />
        </g>
      );
    case "coins":
      return (
        <g>
          <path d="M-24 18v-24h48v24z" fill="#b89868" stroke={ink} strokeWidth="2.5" />
          <circle cx="-8" cy="-14" r="7" fill="#c39a43" stroke={ink} strokeWidth="1.5" />
          <circle cx="6" cy="-16" r="7" fill="#c39a43" stroke={ink} strokeWidth="1.5" />
          <text x="-14" y="12" fontFamily="Special Elite, monospace" fontSize="11" fill={ink}>
            NO
          </text>
        </g>
      );
    case "cabins":
      return (
        <g>
          {[-22, 0, 22].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <path d="M-9 18v-18l9-9 9 9v18z" fill="#c8a870" stroke={ink} strokeWidth="2" />
              <rect x="-3" y="6" width="6" height="12" fill={ink} />
            </g>
          ))}
        </g>
      );
    case "skull":
      return (
        <g>
          <path d="M0 -24c-14 0-22 8-22 20 0 6 3 11 8 13v8h28v-8c5-2 8-7 8-13 0-12-8-20-22-20z" fill="#e8ddc2" stroke={ink} strokeWidth="2.5" />
          <circle cx="-8" cy="-4" r="5" fill={ink} />
          <circle cx="8" cy="-4" r="5" fill={ink} />
          <path d="M-2 6h4" stroke={ink} strokeWidth="2" />
        </g>
      );
  }
}

const SEA_HATCH: [number, number][] = [
  [40, 40], [140, 30], [880, 60], [950, 140], [30, 300], [60, 520], [140, 620], [300, 640], [520, 640], [700, 630],
  [930, 300], [960, 420], [820, 640], [40, 420], [960, 620],
];

const ROUTES = [
  "M300 220 Q 380 260 470 300",
  "M470 300 Q 580 260 680 250",
  "M680 250 Q 740 320 760 380",
  "M470 300 Q 520 380 580 440",
  "M470 300 Q 420 400 380 470",
  "M380 470 Q 290 470 200 430",
  "M470 300 Q 460 210 450 130",
  "M450 130 Q 520 120 590 150",
  "M760 380 Q 820 470 860 560",
];

interface MapProps {
  locations: CampusLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** The campus, as charted by a seasick cartographer. Every marker is a keyboard-operable button. */
export function CampusTreasureMap({ locations, selectedId, onSelect }: MapProps) {
  const rough = useSvgId("rough");
  const paper = useSvgId("mappaper");
  const onKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };
  return (
    <svg viewBox="0 0 1000 680" className="block h-auto w-full" role="group" aria-label="Interactive treasure map of the Blackwater campus. Each landmark is a button.">
      <defs>
        <filter id={rough}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
        <radialGradient id={paper} cx="50%" cy="45%" r="70%">
          <stop offset="0" stopColor="#e3d4a8" />
          <stop offset=".7" stopColor="#cdb98a" />
          <stop offset="1" stopColor="#9a8358" />
        </radialGradient>
      </defs>

      {/* torn parchment */}
      <path
        d="M14 22l40-10 60 6 80-8 120 8 90-6 140 8 110-6 120 8 100-6 110 4-4 80 6 120-6 140 4 110-6 120 4 50-60 8-120-6-100 8-140-6-120 8-100-6-110 6-90-8-6-90 6-110-4-130 6-120-6-110z"
        fill={`url(#${paper})`}
        stroke="#6a5128"
        strokeWidth="2"
      />
      {/* water stains */}
      <circle cx="820" cy="120" r="60" fill="#7a5a2a" opacity=".1" />
      <circle cx="820" cy="120" r="60" fill="none" stroke="#7a5a2a" strokeWidth="3" opacity=".18" />
      <circle cx="160" cy="560" r="44" fill="#7a5a2a" opacity=".08" />
      <ellipse cx="560" cy="600" rx="70" ry="30" fill="#4a6a5a" opacity=".1" />

      {/* sea hatching */}
      <g stroke="#4a6a7a" strokeWidth="2" fill="none" opacity=".55">
        {SEA_HATCH.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y}q6-6 12 0t12 0t12 0`} />
        ))}
      </g>

      {/* the island */}
      <g filter={`url(#${rough})`}>
        <path
          d="M150 160c40-70 160-90 260-80 70 6 110-20 190-10 110 14 200 60 230 140 26 70-10 120 10 190 20 70-40 120-130 130-80 8-120 40-210 40-100 0-180-20-240-70-60-50-100-110-90-190 6-60 -40-90-20-150z"
          fill="#d6c494"
          stroke="#5a4320"
          strokeWidth="3.5"
        />
        <path
          d="M150 160c40-70 160-90 260-80 70 6 110-20 190-10 110 14 200 60 230 140 26 70-10 120 10 190 20 70-40 120-130 130-80 8-120 40-210 40-100 0-180-20-240-70-60-50-100-110-90-190 6-60 -40-90-20-150z"
          fill="none"
          stroke="#4a6a7a"
          strokeWidth="2"
          strokeDasharray="6 8"
          transform="translate(-12 10) scale(1.02)"
          opacity=".6"
        />
        {/* skull island for the basement */}
        <path d="M820 540c20-30 70-30 84 0 12 26-6 50-42 52-34 2-56-24-42-52z" fill="#c8b48a" stroke="#5a4320" strokeWidth="3" />
      </g>

      {/* trees */}
      <g fill="#5a6a44" stroke="#2a3a24" strokeWidth="1.5">
        {[
          [240, 300],
          [260, 330],
          [700, 470],
          [720, 500],
          [640, 340],
          [330, 380],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y - 16}l10 18h-20z`} />
        ))}
      </g>

      {/* the suspiciously judgmental statue */}
      <g transform="translate(372 262)" aria-hidden="true">
        <rect x="-6" y="0" width="12" height="8" fill="#9a9488" stroke="#2a1a0c" />
        <circle cx="0" cy="-8" r="6" fill="#9a9488" stroke="#2a1a0c" />
        <path d="M-3 -9l2-1M2 -10l2 1" stroke="#2a1a0c" strokeWidth="1.5" />
        <text x="10" y="-12" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="11" fill="#5a4320">
          judging you
        </text>
      </g>

      {/* dashed routes */}
      <g fill="none" stroke="#8d1d28" strokeWidth="2.5" strokeDasharray="8 8" opacity=".75">
        {ROUTES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d="M800 480l40 60" stroke="#5a4320" strokeWidth="2" strokeDasharray="2 5" aria-hidden="true" />

      {/* X marks */}
      <g stroke="#8d1d28" strokeWidth="5" strokeLinecap="round" aria-hidden="true">
        <path d="M250 180l18 18M268 180l-18 18" />
        <path d="M530 520l14 14M544 520l-14 14" />
      </g>
      <text x="236" y="216" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="12" fill="#8d1d28" aria-hidden="true">
        x marks the study spot
      </text>

      <CompassRose x={95} y={110} r={52} />
      <g transform="translate(20 590) scale(.8)"><SeaMonster x={0} y={0} /></g>

      {/* cartouche */}
      <g transform="translate(500 640) rotate(-1.5)" aria-hidden="true">
        <rect x="-170" y="-24" width="340" height="44" fill="#e3d4a8" stroke="#5a4320" strokeWidth="2" />
        <text textAnchor="middle" y="-2" fontFamily="Pirata One, serif" fontSize="20" fill="#3a2a14">
          Campus of Blackwater
        </text>
        <text textAnchor="middle" y="14" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="11" fill="#5a4320">
          surveyed drunkenly, 1719 · not to scale · not to be trusted
        </text>
      </g>

      {/* markers */}
      {locations.map((loc) => {
        const selected = loc.id === selectedId;
        return (
          <g
            key={loc.id}
            className="map-marker"
            transform={`translate(${loc.x} ${loc.y})`}
            role="button"
            tabIndex={0}
            aria-label={`${loc.name}. ${loc.purpose}`}
            aria-pressed={selected}
            onClick={() => onSelect(loc.id)}
            onKeyDown={(e) => onKey(e, loc.id)}
          >
            <circle r="44" fill="transparent" />
            {selected && <circle r="34" fill="none" stroke="#8d1d28" strokeWidth="4" className="marker-pulse" />}
            {selected && <circle r="34" fill="none" stroke="#8d1d28" strokeWidth="3" />}
            <Pictogram shape={loc.shape} />
            <g transform="translate(0 40)">
              <rect
                x={-loc.name.length * 4.3 - 6}
                y="-15"
                width={loc.name.length * 8.6 + 12}
                height="22"
                fill={selected ? "#8d1d28" : "#efe2bc"}
                stroke="#5a4320"
                strokeWidth="1.5"
                transform="rotate(-2)"
              />
              <text
                textAnchor="middle"
                y="1"
                fontFamily="IM Fell English, Georgia, serif"
                fontSize="15"
                fill={selected ? "#e8ddc2" : "#2a1a0c"}
                transform="rotate(-2)"
              >
                {loc.name}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
