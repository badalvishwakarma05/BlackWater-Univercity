import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useExperience } from "../app/PirateExperienceProvider";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePersistedState } from "../hooks/usePersistedState";
import { KEYS, isArrayOf, isRecord } from "../lib/storage";
import { makeTicketId, pick } from "../lib/random";
import { Barrel, Rat } from "../components/svg/Props";
import { WaveStrip } from "../components/svg/WaveStrip";
import { CrookedButton } from "../components/ui/CrookedButton";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { ErrorSummary, SelectField, TextAreaField, TextField } from "../components/ui/PirateInput";

const BLOCKS = ["Block A · The Leaky Deck", "Block B · Hammock Row", "Block C · Crow's Nest Annex", "Block D · Bilge Quarters"];

export const COMPLAINT_CATEGORIES = [
  "The Kraken ate my laundry",
  "My roommate is a ghost (and also plays PUBG at 3 AM)",
  "Someone released the Black Pearl’s rats in the mess",
  "Electricity",
  "Water",
  "Plumbing",
  "Food",
  "Maintenance",
];

const URGENCY = ["Mild inconvenience", "Taking on water", "Abandon ship"];

const ESTIMATES = [
  "2 to 3 business tides",
  "when the Kraken returns your laundry",
  "before graduation (not necessarily yours)",
  "next full moon, weather permitting",
  "immediately after the cannon is repaired",
];

const UNDERWATER = "Your complaint has been sent to the appropriate department. The appropriate department is currently underwater.";

interface Complaint {
  ticket: string;
  block: string;
  room: string;
  category: string;
  urgency: string;
  description: string;
  estimate: string;
}

const isComplaint = (v: unknown): v is Complaint =>
  isRecord(v) && ["ticket", "block", "room", "category", "urgency", "description", "estimate"].every((k) => typeof v[k] === "string");

const ROOMS = [
  { no: "101", x: 20, y: 20, w: 110, h: 80 },
  { no: "102", x: 136, y: 16, w: 90, h: 86 },
  { no: "103", x: 232, y: 22, w: 120, h: 78 },
  { no: "104", x: 358, y: 18, w: 96, h: 84 },
  { no: "105", x: 24, y: 150, w: 100, h: 86 },
  { no: "106", x: 130, y: 152, w: 120, h: 80 },
  { no: "107", x: 256, y: 148, w: 92, h: 88 },
  { no: "108", x: 354, y: 154, w: 100, h: 80 },
];

function RoomMap({ selected, onPick }: { selected: string; onPick: (room: string) => void }) {
  const key = (e: KeyboardEvent<SVGGElement>, no: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick(no);
    }
  };
  return (
    <svg viewBox="0 0 474 256" className="h-auto w-full" role="group" aria-label="Badly drawn hostel room map. Pick a room to fill in the room number.">
      <rect x="4" y="4" width="466" height="248" fill="#d8cca9" stroke="#2a1a0c" strokeWidth="3" transform="rotate(-0.6 237 128)" />
      <path d="M10 124c100 6 300-6 456 4" stroke="#2a1a0c" strokeWidth="2" strokeDasharray="10 6" fill="none" />
      <text x="190" y="132" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="12" fill="#5a4320">
        corridor (wet)
      </text>
      {ROOMS.map((r, i) => {
        const on = r.no === selected;
        return (
          <g key={r.no} role="button" tabIndex={0} aria-label={`Room ${r.no}`} aria-pressed={on} className="map-marker" onClick={() => onPick(r.no)} onKeyDown={(e) => key(e, r.no)}>
            <path
              d={`M${r.x} ${r.y + 3} l${r.w - 2} -3 l2 ${r.h} l${-r.w} 2 z`}
              fill={on ? "#c39a43" : "#efe2bc"}
              stroke="#2a1a0c"
              strokeWidth="2.4"
              transform={`rotate(${[-1, 1.5, -0.5, 1, 0.8, -1.2, 1.4, -0.6][i]} ${r.x + r.w / 2} ${r.y + r.h / 2})`}
            />
            <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 6} textAnchor="middle" fontFamily="Pirata One, serif" fontSize="22" fill="#2a1a0c">
              {r.no}
            </text>
            {r.no === "104" && (
              <text x={r.x + 8} y={r.y + r.h - 8} fontSize="10" fontFamily="Special Elite, monospace" fill="#8d1d28">
                ghost?
              </text>
            )}
            {r.no === "107" && <circle cx={r.x + r.w - 14} cy={r.y + 16} r="7" fill="#4a6a7a" opacity=".6" />}
          </g>
        );
      })}
    </svg>
  );
}

export default function HostelComplaintsPage() {
  usePageTitle("Hostel Complaints");
  const { play } = useExperience();
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Complaint | null>(null);
  const [log, setLog] = usePersistedState<Complaint[]>("session", KEYS.complaints, [], isArrayOf(isComplaint));
  const [barrelShake, setBarrelShake] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!block) found["hc-block"] = "Choose your hostel block.";
    if (!/^\d{1,3}[A-Za-z]?$/.test(room.trim())) found["hc-room"] = "Room number should be 1–3 digits, optionally with a letter (e.g. 104 or 12B). Or pick one on the map.";
    if (!category) found["hc-category"] = "Choose a complaint category.";
    const len = description.trim().length;
    if (len < 10) found["hc-desc"] = "Describe the problem in at least 10 characters. 'Help' is heartfelt but brief.";
    else if (len > 500) found["hc-desc"] = "Keep it under 500 characters. The barrel is small.";
    setErrors(found);
    if (Object.keys(found).length) {
      play("thud");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const complaint: Complaint = {
      ticket: makeTicketId("HC"),
      block,
      room: room.trim().toUpperCase(),
      category,
      urgency: urgency || "Not specified",
      description: description.trim(),
      estimate: pick(ESTIMATES),
    };
    play("splash");
    setConfirmed(complaint);
    setLog((l) => [complaint, ...l].slice(0, 5));
    setBarrelShake((k) => k + 1);
    requestAnimationFrame(() => confirmRef.current?.focus());
  };

  const another = () => {
    setConfirmed(null);
    setCategory("");
    setDescription("");
    setUrgency("");
  };

  const errorList = Object.entries(errors).map(([id, message]) => ({ id, message }));

  return (
    <div>
      <header className="page-wrap pt-10">
        <p className="kicker">Hostel maintenance log · damaged · damp · disputed</p>
        <h1 className="title-huge mt-2 rotate-1 text-ivory">
          Report the <span className="text-blood [text-shadow:2px_2px_0_#000]">Mutiny</span>
        </h1>
        <p className="mt-3 max-w-2xl font-fell text-xl text-parchment">Hostel complaints are logged here, then placed lovingly in a barrel and pushed out to sea.</p>
        <DemoLabel dark className="mt-4">
          Simulated submission · kept only in this browser tab
        </DemoLabel>
      </header>

      {/* flooded strip with floating rats */}
      <div className="relative mt-8 h-24 overflow-hidden" aria-hidden="true">
        <WaveStrip className="absolute inset-x-0 bottom-0" height={60} color="#102f35" foam="#608c76" speed={16} />
        <div className="absolute bottom-6 left-[12%] anim-rat-paddle">
          <Rat size={64} className="anim-rat" />
        </div>
        <div className="absolute bottom-4 left-[52%] anim-rat-paddle" style={{ animationDelay: "-5s" }}>
          <Rat size={52} className="anim-rat" />
        </div>
        <div className="absolute bottom-7 left-[80%] anim-rat-paddle" style={{ animationDelay: "-9s" }}>
          <Rat size={44} className="anim-rat" />
        </div>
      </div>

      <div className="page-wrap mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <ParchmentPanel as="section" material="lined" tilt={-0.6} className="cracked p-6 pl-14 sm:p-8 sm:pl-16" aria-labelledby="hc-title">
          <h2 id="hc-title" className="font-pirate text-3xl">
            Maintenance Log: New Entry
          </h2>
          <div ref={confirmRef} tabIndex={-1} className="outline-none" aria-live="polite">
            {confirmed && (
              <div className="anim-paper-drop mt-4 border-4 border-double border-blood p-4" role="status">
                <p className="font-type text-sm">Ticket {confirmed.ticket}</p>
                <p className="mt-1 font-fell text-xl font-bold">{UNDERWATER}</p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="font-bold">Block</dt>
                  <dd>{confirmed.block}</dd>
                  <dt className="font-bold">Room</dt>
                  <dd>{confirmed.room}</dd>
                  <dt className="font-bold">Category</dt>
                  <dd>{confirmed.category}</dd>
                  <dt className="font-bold">Urgency</dt>
                  <dd>{confirmed.urgency}</dd>
                  <dt className="font-bold">Complaint</dt>
                  <dd className="italic">“{confirmed.description}”</dd>
                  <dt className="font-bold">Est. fix</dt>
                  <dd>{confirmed.estimate}</dd>
                </dl>
                <CrookedButton variant="plank" size="sm" className="mt-4" onClick={another} tilt={-1}>
                  File another complaint
                </CrookedButton>
              </div>
            )}
          </div>
          {!confirmed && (
            <form onSubmit={submit} noValidate className="mt-4 space-y-5">
              <div ref={summaryRef} tabIndex={-1} className="outline-none">
                <ErrorSummary errors={errorList} title="The maintenance log refuses this entry:" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField id="hc-block" label="Hostel block" value={block} onChange={(e) => setBlock(e.target.value)} error={errors["hc-block"]}>
                  <option value="">Choose a block…</option>
                  {BLOCKS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </SelectField>
                <TextField id="hc-room" label="Room number" value={room} onChange={(e) => setRoom(e.target.value)} error={errors["hc-room"]} placeholder="e.g. 104" autoComplete="off" />
              </div>
              <SelectField id="hc-category" label="Complaint category" value={category} onChange={(e) => setCategory(e.target.value)} error={errors["hc-category"]}>
                <option value="">Choose what went wrong…</option>
                {COMPLAINT_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </SelectField>
              <TextAreaField
                id="hc-desc"
                label="Complaint description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors["hc-desc"]}
                maxLength={600}
                hint={`${description.trim().length}/500 characters. No personal details needed.`}
              />
              <fieldset>
                <legend className="field-label">Urgency (optional)</legend>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {URGENCY.map((u) => (
                    <label key={u} className="check-row font-fell">
                      <input type="radio" name="urgency" value={u} checked={urgency === u} onChange={() => setUrgency(u)} />
                      {u}
                    </label>
                  ))}
                  {urgency && (
                    <button type="button" className="link-ink font-type text-xs" onClick={() => setUrgency("")}>
                      clear
                    </button>
                  )}
                </div>
              </fieldset>
              <CrookedButton type="submit" variant="rust" size="lg" tilt={1.2}>
                Drop it in the barrel
              </CrookedButton>
            </form>
          )}
        </ParchmentPanel>

        <div className="space-y-8">
          <section className="tx-wood rounded-sm p-5" aria-labelledby="map-title">
            <span className="nail tl" aria-hidden="true" />
            <span className="nail tr" aria-hidden="true" />
            <h2 id="map-title" className="font-pirate text-2xl text-gold">
              Room Map (drawn by a resident, from memory)
            </h2>
            <p className="font-type text-xs text-parchment">Pick a room to fill in the room number.</p>
            <div className="mt-3 -rotate-1">
              <RoomMap
                selected={room.trim()}
                onPick={(no) => {
                  play("paper");
                  setRoom(no);
                }}
              />
            </div>
          </section>

          <section className="flex items-end gap-4" aria-labelledby="barrel-title">
            <Barrel key={barrelShake} size={110} label="COMPLAINTS" className={barrelShake ? "anim-shake" : ""} />
            <div>
              <h2 id="barrel-title" className="font-pirate text-2xl text-gold">
                The Complaint Barrel
              </h2>
              <p className="font-fell text-parchment">
                {log.length === 0 ? "Empty. Suspiciously so." : `Holding ${log.length} complaint${log.length > 1 ? "s" : ""} from this voyage.`}
              </p>
              {log.length > 0 && (
                <ul className="mt-2 space-y-1 font-type text-xs text-parchment">
                  {log.map((c) => (
                    <li key={c.ticket}>
                      {c.ticket} · Room {c.room} · {c.category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* notes on a rope */}
          <aside className="rope-notes" aria-label="Notes from the warden">
            <div className="rope-line" aria-hidden="true" />
            <ul className="mt-[-4px] grid grid-cols-2 gap-3">
              {["Hot water: Tuesdays, 3:00 to 3:01 AM.", "Do not touch the laundry line. It bites.", "Lights out at 11. The ghost in 104 disagrees.", "Rats are not pets. They are tenants."].map((n, i) => (
                <li key={n} className="sticky-note anim-swing-slow p-3 text-sm" style={{ animationDelay: `${-i * 1.3}s` }}>
                  {n}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
