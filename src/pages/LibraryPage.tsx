import { useEffect, useId, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { BookOpen, Download, Lock } from "lucide-react";
import { useExperience } from "../app/PirateExperienceProvider";
import { RESOURCES, RESOURCE_CATEGORIES, type LibraryResource, type ResourceCategory } from "../data/resources";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePersistedState } from "../hooks/usePersistedState";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { KEYS, isString } from "../lib/storage";
import { seededRandom } from "../lib/random";
import { Lantern } from "../components/svg/Lantern";
import { SkeletonLibrarian } from "../components/svg/SkeletonLibrarian";
import { ModalShell } from "../components/interactions/ModalShell";
import { CrookedButton } from "../components/ui/CrookedButton";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { SelectField } from "../components/ui/PirateInput";

export const LIBRARIAN_LINES = [
  "You will always remember this as the day you almost accessed the digital resources.",
  "The library is closed… forever.",
] as const;

/** Digital resources close at 10:00 PM local time and reopen at 6:00 AM ("forever" is a figure of speech). */
export const CLOSING_HOUR = 22;
export const OPENING_HOUR = 6;
export const isLibraryClosed = (hour: number) => hour >= CLOSING_HOUR || hour < OPENING_HOUR;

const CLOCK_OVERRIDES: { id: string; label: string; hour?: number; minute?: number }[] = [
  { id: "real", label: "Use my real local clock" },
  { id: "1030pm", label: "Pretend it is 10:30 PM", hour: 22, minute: 30 },
  { id: "3am", label: "Pretend it is 3:00 AM", hour: 3, minute: 0 },
  { id: "3pm", label: "Pretend it is 3:00 PM", hour: 15, minute: 0 },
];

function useLocalNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

/* ---------- the big clock ---------- */
function LibraryClock({ hour, minute }: { hour: number; minute: number }) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const numerals = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XIII"];
  return (
    <svg viewBox="0 0 200 270" className="h-auto w-full max-w-[12rem]" role="img" aria-label={`The library clock reads ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}>
      <path d="M30 60c0-40 140-40 140 0v190H30z" fill="#382419" stroke="#1a0f08" strokeWidth="3" />
      <path d="M40 66c0-30 120-30 120 0" fill="none" stroke="#8e7138" strokeWidth="3" />
      <circle cx="100" cy="100" r="58" fill="#d8cca9" stroke="#8e7138" strokeWidth="6" />
      {numerals.map((n, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        return (
          <text
            key={n + i}
            x={100 + Math.cos(a) * 44}
            y={100 + Math.sin(a) * 44 + 4}
            textAnchor="middle"
            fontFamily="IM Fell English, serif"
            fontSize={i === 11 ? 9 : 10}
            fill={i === 11 ? "#8d1d28" : "#2a1a0c"}
            transform={`rotate(${i % 4 === 1 ? 8 : i % 4 === 3 ? -6 : 0} ${100 + Math.cos(a) * 44} ${100 + Math.sin(a) * 44})`}
          >
            {n}
          </text>
        );
      })}
      <g style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: "100px 100px", transition: "transform .6s" }}>
        <path d="M100 100V66" stroke="#090807" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: "100px 100px", transition: "transform .6s" }}>
        <path d="M100 104V52" stroke="#090807" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 52l-4 8h8z" fill="#090807" />
      </g>
      <circle cx="100" cy="100" r="4" fill="#c39a43" />
      <path d="M58 70l20 18 -6 14 14 10" stroke="#fff" strokeWidth=".8" fill="none" opacity=".5" />
      {/* pendulum */}
      <g className="anim-swing" style={{ transformOrigin: "100px 160px" }}>
        <path d="M100 160v60" stroke="#8e7138" strokeWidth="2.5" />
        <circle cx="100" cy="226" r="11" fill="#c39a43" stroke="#5e4719" strokeWidth="2" />
      </g>
      <rect x="44" y="164" width="112" height="78" fill="none" stroke="#1a0f08" strokeWidth="2" opacity=".6" />
    </svg>
  );
}

/* ---------- crooked bookshelves ---------- */
function Bookshelf() {
  const reduced = useReducedMotion();
  const books = useMemo(() => {
    const rng = seededRandom("blackwater-shelves");
    const colors = ["#8d1d28", "#355b48", "#523826", "#163e49", "#8e7138", "#552024", "#608c76", "#382419"];
    const rows: { x: number; w: number; h: number; c: string; tilt: number; wiggle: boolean }[][] = [];
    for (let r = 0; r < 3; r++) {
      const row = [];
      let x = 18;
      while (x < 560) {
        const w = 12 + Math.floor(rng() * 16);
        const h = 54 + Math.floor(rng() * 34);
        row.push({ x, w, h, c: colors[Math.floor(rng() * colors.length)], tilt: rng() < 0.12 ? (rng() < 0.5 ? -9 : 7) : 0, wiggle: rng() < 0.14 });
        x += w + 2 + (rng() < 0.08 ? 22 : 0);
      }
      rows.push(row);
    }
    return rows;
  }, []);
  return (
    <svg viewBox="0 0 580 380" className="h-auto w-full" aria-hidden="true">
      <rect x="4" y="4" width="572" height="372" fill="#1c120c" stroke="#382419" strokeWidth="8" />
      {books.map((row, r) => {
        const base = 112 + r * 118;
        return (
          <g key={r} transform={`rotate(${[-1.2, 0.8, -0.5][r]} 290 ${base})`}>
            {row.map((b, i) => (
              <g
                key={i}
                className={b.wiggle && !reduced ? "book-wiggle" : undefined}
                style={b.wiggle ? ({ ["--delay" as string]: `${-(i % 7)}s`, ["--dur" as string]: `${6 + (i % 5)}s` } as CSSProperties) : undefined}
              >
                <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill={b.c} stroke="#090807" strokeWidth="1.2" transform={b.tilt ? `rotate(${b.tilt} ${b.x + b.w / 2} ${base})` : undefined} />
                {b.w > 18 && <path d={`M${b.x + 3} ${base - b.h + 10}h${b.w - 6}M${b.x + 3} ${base - 14}h${b.w - 6}`} stroke="#c39a43" strokeWidth="1.2" opacity=".7" />}
              </g>
            ))}
            <rect x="8" y={base} width="564" height="12" fill="#523826" stroke="#1a0f08" strokeWidth="2" />
          </g>
        );
      })}
      {/* chained reference books */}
      <path d="M40 150c60 30 140 30 220 4" stroke="#8a8680" strokeWidth="3" strokeDasharray="6 4" fill="none" />
      <path d="M300 270c60 24 140 24 240 0" stroke="#8a8680" strokeWidth="3" strokeDasharray="6 4" fill="none" />
      {/* a skeleton silhouette slumped on the top shelf, still reading */}
      <g transform="translate(470 40)" fill="#0b0806" opacity=".85">
        <circle cx="20" cy="14" r="12" />
        <path d="M10 26h20l6 30h-32z" />
        <rect x="30" y="34" width="22" height="16" fill="#8d1d28" />
      </g>
      <path d="M150 0v40" stroke="#ddd" strokeWidth=".6" opacity=".3" />
      <path d="M140 40c4-8 16-8 20 0" stroke="#ddd" strokeWidth=".6" fill="none" opacity=".3" />
    </svg>
  );
}

const DUST = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 41 + 9) % 100}%`,
  top: `${30 + ((i * 23) % 60)}%`,
  dx: `${((i * 19) % 60) - 30}px`,
  dur: `${7 + (i % 6)}s`,
  delay: `${-(i % 7)}s`,
}));

/* ---------- the closing-time overlay ---------- */
function LibraryClosedOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const titleId = useId();
  const bodyId = useId();
  return (
    <ModalShell
      labelledBy={titleId}
      describedBy={bodyId}
      onDismiss={onClose}
      zIndex={120}
      role="alertdialog"
      className="popup-size-lg"
      backdropClassName="library-closed-backdrop"
      decor={
        <div className="library-doors" aria-hidden="true">
          <div className="library-door left door-left tx-wood" />
          <div className="library-door right door-right tx-wood" />
        </div>
      }
    >
      <div className="popup-inner tx-parchment-dark on-paper anim-paper-slap relative" style={{ animationDelay: "0.8s" }}>
        <div className="grid items-end gap-4 sm:grid-cols-[200px_1fr]">
          <div className="anim-skeleton-enter mx-auto w-44 sm:w-full">
            <SkeletonLibrarian className="h-auto w-full" />
          </div>
          <div>
            <p className="popup-speaker">The Librarian (deceased) speaks</p>
            <h2 id={titleId} className="popup-title">
              Digital resources are closed
            </h2>
            <div id={bodyId} className="space-y-3 font-fell text-xl italic leading-snug">
              <p>“{LIBRARIAN_LINES[0]}”</p>
              <p className="font-blackletter text-3xl not-italic">“{LIBRARIAN_LINES[1]}”</p>
            </div>
            <p className="mt-3 font-type text-xs">Closed from 10:00 PM to 6:00 AM, your local time. The library page itself stays open; only digital access is refused.</p>
            <div className="popup-actions">
              <button type="button" className="popup-action is-primary" onClick={onClose} data-autofocus>
                Leave quietly
              </button>
              <button
                type="button"
                className="popup-action"
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
              >
                Flee to the Poop Deck
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

export default function LibraryPage() {
  usePageTitle("Rum & Resources");
  const { openPopup, notify, play } = useExperience();
  const reduced = useReducedMotion();
  const now = useLocalNow();
  const [params] = useSearchParams();
  const [override, setOverride] = usePersistedState<string>("session", KEYS.libraryClock, "real", isString);
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [closedOpen, setClosedOpen] = useState(false);

  // ?hour=22 in the URL also works for testing, without touching the device clock.
  const urlHour = params.get("hour");
  const parsedUrlHour = urlHour !== null && /^\d{1,2}$/.test(urlHour) && Number(urlHour) < 24 ? Number(urlHour) : null;
  const chosen = CLOCK_OVERRIDES.find((o) => o.id === override) ?? CLOCK_OVERRIDES[0];
  const hour = parsedUrlHour ?? chosen.hour ?? now.getHours();
  const minute = parsedUrlHour !== null ? 0 : (chosen.minute ?? now.getMinutes());
  const closed = isLibraryClosed(hour);
  const simulated = parsedUrlHour !== null || chosen.id !== "real";

  const visible = category === "all" ? RESOURCES : RESOURCES.filter((r) => r.category === category);

  const refuse = () => {
    play("door");
    play("spooky");
    setClosedOpen(true);
  };

  const accessDemo = (r: LibraryResource) => {
    if (closed) return refuse();
    play("paper");
    openPopup({
      key: `res-${r.id}`,
      variant: "parchment",
      title: r.title,
      body: (
        <>
          <p className="font-type text-sm">{r.type}</p>
          <p className="mt-2 text-lg">{r.description}</p>
          <p className="mt-3">
            This is a <strong>demonstration entry</strong>. No file exists in the archive, so the librarian slides you a sternly blank
            page instead.
          </p>
        </>
      ),
      actions: [{ label: "Accept the blank page", primary: true }],
    });
  };

  const guardFile = (e: MouseEvent<HTMLAnchorElement>) => {
    if (closed) {
      e.preventDefault();
      refuse();
    } else {
      play("paper");
    }
  };

  return (
    <div className="library-deck relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {!reduced &&
          DUST.map((d, i) => (
            <span
              key={i}
              className="dust-mote anim-dust"
              style={{ left: d.left, top: d.top, ["--dx" as string]: d.dx, ["--dur" as string]: d.dur, ["--delay" as string]: d.delay } as CSSProperties}
            />
          ))}
      </div>

      <header className="page-wrap relative pt-6">
        <div className="pointer-events-none absolute left-6 top-0 hidden sm:block" aria-hidden="true">
          <div className="anim-swing">
            <Lantern size={46} />
          </div>
        </div>
        <div className="pointer-events-none absolute right-28 top-0 hidden md:block" aria-hidden="true">
          <div className="anim-swing-slow">
            <Lantern size={38} ghostly />
          </div>
        </div>
        <div className="pt-8 text-center">
          <p className="kicker">The haunted maritime archive · silence is enforced by a skeleton</p>
          <h1 className="title-huge mt-2 text-ivory">
            Rum <span className="text-gold">&amp;</span> Resources
          </h1>
        </div>
      </header>

      <div className="page-wrap relative mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.6fr)]">
        <div className="-rotate-1">
          <Bookshelf />
        </div>
        <div className="flex flex-col items-center gap-4">
          <LibraryClock hour={hour} minute={minute} />
          <div className={`library-status ${closed ? "is-closed" : ""}`} role="status">
            {closed ? (
              <>
                <Lock size={16} aria-hidden="true" /> CLOSED… forever <span className="block text-xs">(reopens 6:00 AM, allegedly)</span>
              </>
            ) : (
              <>
                <BookOpen size={16} aria-hidden="true" /> OPEN <span className="block text-xs">Digital access until 10:00 PM, your local time</span>
              </>
            )}
          </div>
          {simulated && <p className="font-type text-xs text-gold">Time-travel active: the clock is pretending.</p>}
        </div>
      </div>

      {/* librarian desk + testing hourglass */}
      <div className="page-wrap relative mt-10 grid gap-8 md:grid-cols-2">
        <section className="librarian-desk tx-wood rounded-sm p-6" aria-labelledby="desk-title">
          <h2 id="desk-title" className="font-pirate text-3xl text-gold">
            The Librarian's Desk
          </h2>
          <p className="mt-2">A bell, a stamp, a stack of overdue notices, and a skeleton who is technically still employed.</p>
          <CrookedButton
            variant="gold"
            size="sm"
            className="mt-4"
            tilt={-2}
            onClick={() => {
              play("bell");
              notify({ title: "Ding.", message: "The librarian is deceased. Please do not ring again. (You may ring again.)" });
            }}
          >
            Ring for service
          </CrookedButton>
        </section>
        <ParchmentPanel as="section" material="parchment" tilt={0.8} className="p-6" aria-labelledby="hourglass-title">
          <h2 id="hourglass-title" className="font-pirate text-2xl">
            The Hourglass of Testing
          </h2>
          <p className="mt-1 text-sm">
            Try the 10 PM rule without changing your device clock. You can also add <code className="font-type">?hour=22</code> to the address.
          </p>
          <SelectField className="mt-3" label="Library clock" value={chosen.id} onChange={(e) => setOverride(e.target.value)}>
            {CLOCK_OVERRIDES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
                {o.id === "real" ? ` (${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")})` : ""}
              </option>
            ))}
          </SelectField>
        </ParchmentPanel>
      </div>

      {/* catalogue */}
      <section className="page-wrap relative mt-14" aria-labelledby="catalogue-title">
        <div className="flex flex-wrap items-center gap-4">
          <h2 id="catalogue-title" className="title-mid text-gold">
            The Catalogue
          </h2>
          <DemoLabel dark>Mostly demo entries · only scrolls marked “actual scroll” have real files</DemoLabel>
        </div>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {[{ id: "all" as const, label: "Everything" }, ...RESOURCE_CATEGORIES].map((c) => (
            <button
              key={c.id}
              type="button"
              className={`category-tab ${category === c.id ? "is-active" : ""}`}
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r, i) => (
            <li key={r.id}>
              <article className="index-card h-full" style={{ transform: `rotate(${[-1, 0.8, -0.4, 1.3, -1.6][i % 5]}deg)` }}>
                <p className="font-type text-[0.7rem] uppercase tracking-wider text-rust">
                  {RESOURCE_CATEGORIES.find((c) => c.id === r.category)?.label} · {r.type}
                </p>
                <h3 className="mt-1 font-fell text-xl font-bold leading-snug">{r.title}</h3>
                <p className="mt-2 font-fell">{r.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.file ? (
                    <>
                      <a href={r.file} target="_blank" rel="noopener" onClick={guardFile} className="crooked-btn cb-rust cb-sm" style={{ ["--tilt" as string]: "-1deg" }} data-rum="">
                        <BookOpen size={16} aria-hidden="true" /> Open the scroll
                      </a>
                      <a href={r.file} download onClick={guardFile} className="crooked-btn cb-ghost cb-sm" style={{ ["--tilt" as string]: "1deg" }}>
                        <Download size={16} aria-hidden="true" /> Download
                      </a>
                    </>
                  ) : (
                    <CrookedButton variant="parchment" size="sm" tilt={1} onClick={() => accessDemo(r)}>
                      Request digital access
                    </CrookedButton>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {closedOpen && <LibraryClosedOverlay onClose={() => setClosedOpen(false)} />}
    </div>
  );
}
