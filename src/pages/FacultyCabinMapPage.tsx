import { useState, type KeyboardEvent } from "react";
import { COMPASS_UNLOCK_AT, useExperience } from "../app/PirateExperienceProvider";
import { usePageTitle } from "../hooks/usePageTitle";
import { SecretGate } from "../components/layout/SecretGate";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";

interface CabinSpot {
  id: string;
  name: string;
  x: number;
  y: number;
  note: string;
  kind: "cabin" | "room" | "door" | "vault" | "corridor";
}

const SPOTS: CabinSpot[] = [
  { id: "cabins", name: "Restricted Faculty Cabins", x: 150, y: 120, kind: "cabin", note: "Six cabins, six locks, zero office hours. Knocking is permitted. Answering is not." },
  { id: "staffroom", name: "The Legendary Staff Room", x: 430, y: 110, kind: "room", note: "Contains a biscuit tin last refilled in 1871 and the only comfortable chair aboard. Students who enter are never seen again (they get jobs as faculty)." },
  { id: "projector", name: "Room of the Last Working Projector", x: 690, y: 130, kind: "room", note: "Guarded day and night by the Keeper of the Broken Projector. Do not breathe on it. Do not mention HDMI." },
  { id: "accounts", name: "Accounting's Suspicious Second Entrance", x: 690, y: 330, kind: "door", note: "Officially a broom cupboard. The broom cupboard has a ledger, a lock, and a staircase going down." },
  { id: "vault", name: "The Treasure Vault (marked X)", x: 560, y: 430, kind: "vault", note: "Does not exist, according to Finance. Has a doormat, according to everyone else." },
  { id: "corridor", name: "The Forbidden Corridor", x: 300, y: 330, kind: "corridor", note: "A sign reads: DO NOT DEPLOY ON FRIDAY. Three interns ignored it. Their commits still echo." },
  { id: "conference", name: "The Conference Room", x: 150, y: 330, kind: "room", note: "Where meetings that could have been parrots are held. The whiteboard says 'AGENDA: ???' in permanent marker." },
  { id: "emails", name: "Cabin of Unanswered Emails", x: 300, y: 470, kind: "cabin", note: "The cabin where unanswered emails allegedly disappear. Knee-deep in envelopes. One of them is yours." },
  { id: "doors", name: "Suspicious Doors", x: 430, y: 300, kind: "door", note: "Three doors that open onto each other. A fourth door opens onto a wall. Nobody has tried the fifth." },
];

function CabinMap({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const onKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };
  return (
    <svg viewBox="0 0 840 560" className="block h-auto w-full" role="group" aria-label="Secret floor plan of the faculty cabins. Each marked place is a button.">
      <rect x="10" y="10" width="820" height="540" fill="#c4b38a" stroke="#3a2a14" strokeWidth="3" />
      <g stroke="#2a1a0c" strokeWidth="1" opacity=".18">
        {Array.from({ length: 20 }, (_, i) => (
          <path key={`v${i}`} d={`M${10 + i * 42} 10v540`} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <path key={`h${i}`} d={`M10 ${10 + i * 42}h820`} />
        ))}
      </g>
      {/* walls (double lines) */}
      <g fill="none" stroke="#2a1a0c" strokeWidth="5">
        <rect x="40" y="40" width="760" height="480" />
        <path d="M40 220h220M340 220h120M540 220h260M260 40v130M540 40v180M260 260v260M540 260v100M380 400h160" />
      </g>
      <g fill="none" stroke="#c4b38a" strokeWidth="2">
        <rect x="40" y="40" width="760" height="480" />
      </g>
      {/* six little cabins */}
      <g fill="none" stroke="#2a1a0c" strokeWidth="2.5">
        {[60, 125, 190].map((x) => (
          <rect key={x} x={x} y="60" width="55" height="70" />
        ))}
        {[60, 125, 190].map((x) => (
          <rect key={`b${x}`} x={x} y="140" width="55" height="60" />
        ))}
      </g>
      {/* door arcs */}
      <g fill="none" stroke="#2a1a0c" strokeWidth="1.5">
        <path d="M260 220a40 40 0 0 1 40 40" />
        <path d="M460 220a40 40 0 0 1 40 40" />
        <path d="M640 360a30 30 0 0 0 30 30" />
      </g>
      {/* hidden corridors (dashed red) */}
      <g fill="none" stroke="#8d1d28" strokeWidth="3.5" strokeDasharray="10 8">
        <path d="M150 210c40 60 100 90 150 120" />
        <path d="M440 300c60 40 100 90 120 130" />
        <path d="M690 160c-20 80-10 130 0 170" />
        <path d="M300 340c0 50 0 90 0 130" />
      </g>
      <text x="600" y="250" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="13" fill="#8d1d28">
        hidden passage (do not tell students)
      </text>
      {/* the forbidden corridor sign */}
      <g transform="translate(220 380) rotate(-6)">
        <rect x="0" y="0" width="190" height="34" fill="#8d1d28" stroke="#2a0a0e" strokeWidth="2" />
        <text x="95" y="23" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="14" fill="#e8ddc2">
          DO NOT DEPLOY ON FRIDAY
        </text>
      </g>
      {/* suspicious doors with question marks */}
      {[
        [400, 250],
        [430, 260],
        [460, 250],
      ].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <rect x="-9" y="-14" width="18" height="28" fill="#77583a" stroke="#2a1a0c" strokeWidth="1.5" />
          <text y="5" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="14" fill="#e8ddc2">
            ?
          </text>
        </g>
      ))}
      {/* X marks the vault */}
      <path d="M540 410l40 40M580 410l-40 40" stroke="#8d1d28" strokeWidth="7" strokeLinecap="round" />
      {/* envelopes drifting in the email cabin */}
      <g fill="#e8ddc2" stroke="#2a1a0c" strokeWidth="1">
        {[
          [270, 450],
          [290, 490],
          [320, 460],
          [340, 495],
          [255, 485],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i * 17 - 20})`}>
            <rect x="-10" y="-6" width="20" height="12" />
            <path d="M-10 -6l10 7 10-7" fill="none" />
          </g>
        ))}
      </g>
      <text x="420" y="545" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="20" fill="#3a2a14">
        Faculty Deck · Secret Plan · burn after reading
      </text>

      {SPOTS.map((s) => {
        const on = s.id === selected;
        return (
          <g
            key={s.id}
            className="map-marker"
            transform={`translate(${s.x} ${s.y})`}
            role="button"
            tabIndex={0}
            aria-label={s.name}
            aria-pressed={on}
            onClick={() => onSelect(s.id)}
            onKeyDown={(e) => onKey(e, s.id)}
          >
            <circle r="30" fill="transparent" />
            {on && <circle r="24" fill="none" stroke="#8d1d28" strokeWidth="4" className="marker-pulse" />}
            <circle r="17" fill={on ? "#8d1d28" : "#e8ddc2"} stroke="#2a1a0c" strokeWidth="2.5" />
            <text y="6" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="18" fill={on ? "#e8ddc2" : "#2a1a0c"}>
              {s.kind === "vault" ? "X" : s.kind === "door" ? "?" : s.kind === "corridor" ? "!" : s.kind === "cabin" ? "C" : "R"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function FacultyCabinMapPage() {
  usePageTitle("Faculty Cabin Map");
  const { cabinUnlocked, compassSpins, play } = useExperience();
  const [selected, setSelected] = useState<string | null>(null);
  const spot = SPOTS.find((s) => s.id === selected);

  const select = (id: string) => {
    play("paper");
    setSelected(id);
  };

  return (
    <SecretGate
      unlocked={cabinUnlocked}
      title="Faculty Cabin Map"
      hint={
        <>
          <p>This chart is hidden inside the compass in the top-right corner.</p>
          <p className="mt-2 font-type text-sm">
            Spin it until it grows dizzy ({COMPASS_UNLOCK_AT} spins in one voyage). Spins this voyage: {compassSpins}.
          </p>
        </>
      }
    >
      <div className="page-wrap pt-10">
        <p className="kicker">Recovered from inside the compass · for faculty eyes only · you are not faculty</p>
        <h1 className="title-huge mt-2 rotate-1 text-gold">Secret Faculty Cabin Map</h1>
        <p className="mt-3 max-w-2xl font-fell text-xl text-parchment">Hidden corridors in red. Suspicious doors marked “?”. Choose a mark to read the cartographer's notes.</p>

        <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)]">
          <div className="map-frame">
            <div className="map-scroll">
              <div className="map-inner">
                <CabinMap selected={selected} onSelect={select} />
              </div>
            </div>
          </div>
          <div aria-live="polite">
            <ParchmentPanel material="parchment-dark" tilt={-1} pin torn="bottom" className="p-6">
              {spot ? (
                <div key={spot.id} className="anim-paper-drop">
                  <p className="kicker text-rust">Cartographer's note</p>
                  <h2 className="mt-1 font-pirate text-3xl leading-none">{spot.name}</h2>
                  <p className="mt-3 font-fell text-lg">{spot.note}</p>
                </div>
              ) : (
                <p className="font-fell text-xl italic">Select a mark on the plan to reveal what the faculty would rather you didn't know.</p>
              )}
            </ParchmentPanel>
            <ul className="mt-6 space-y-2">
              {SPOTS.map((s) => (
                <li key={s.id}>
                  <button type="button" className={`loc-item w-full text-left ${s.id === selected ? "is-selected" : ""}`} aria-pressed={s.id === selected} onClick={() => select(s.id)}>
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SecretGate>
  );
}
