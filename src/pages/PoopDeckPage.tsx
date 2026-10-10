import { useEffect, useRef, useState } from "react";
import { useExperience } from "../app/PirateExperienceProvider";
import { DEPARTMENTS, type Department } from "../data/departments";
import { NOTICES } from "../data/notices";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePersistedState } from "../hooks/usePersistedState";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { KEYS, isStringArray } from "../lib/storage";
import { HeroScene } from "../components/svg/HeroScene";
import { ChancellorPortrait } from "../components/svg/ChancellorPortrait";
import { WaxSeal } from "../components/svg/WaxSeal";
import { DeptIcon } from "../components/svg/Props";
import { KrakenTentacle } from "../components/svg/KrakenTentacle";
import { CrookedButton, CrookedLink } from "../components/ui/CrookedButton";
import { ParchmentPanel, type PanelMaterial } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { RopeDivider } from "../components/ui/RopeDivider";
import RainEffect from "../components/RainEffect";

const MAP_LOCATION: Record<Department["id"], string> = { cs: "cs", eng: "eng", bus: "admin", hum: "main", mar: "basement" };

/* ------------------------------------------------------------------ */

function Hero() {
  const { stormMode, play } = useExperience();
  return (
    <section className="hero relative overflow-hidden min-h-[min(100svh,960px)] flex items-center" aria-labelledby="hero-title">
      <HeroScene className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 pointer-events-none" style={{ position: "absolute", inset: 0 }}>
        <RainEffect speed={0.92} rainAmount={1.75} turbulence={2.1} background="transparent" />
      </div>
      <div className="hero-vignette pointer-events-none" aria-hidden="true" />

      {/* Balanced Cinematic Composition: Left 1/3 Content, Right 2/3 Dynamic Sea Backdrop */}
      <div className="w-full relative z-10 px-6 sm:px-10 lg:px-16 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[min(88svh,840px)]">
          {/* Left Third: Text & Interactive Stack */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-start text-left z-20 max-w-lg">
            
            {/* Main Header (Top-Left Stack with Subtle Gold Float & Pulsing Glow) */}
            <div className="hero-header-group anim-gold-float text-left">
              <p className="kicker text-sm sm:text-base font-bold text-gold tracking-widest uppercase anim-gold-pulse">
                A UNIVERSITY, ALLEGEDLY • EST. 1719?
              </p>
              <h1 id="hero-title" className="title-huge mt-2 text-left flex flex-col items-start leading-[0.95]">
                <span className="block text-ivory tracking-widest drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
                  {stormMode ? "MUTINOUS" : "BLACKWATER"}
                </span>
                <span className="block text-gold tracking-widest mt-1 text-ornate-gold">
                  UNIVERSITY
                </span>
              </h1>
              <p className="hero-tagline mt-3 text-left text-sm sm:text-base opacity-90 text-parchment font-fell italic">
                “Not All Treasure is Silver and Gold… Some of it is CGPA”
              </p>
            </div>

            {/* Mid-Left: Torn Parchment Quote Box (with Sharp Red Pin & Water Bobbing Motion) */}
            <figure className="hero-quote-left anim-quote-bob panel on-paper my-6 w-full relative">
              <div className="panel-bg tx-parchment torn-both" aria-hidden="true" />
              <blockquote className="panel-content text-center py-5 px-6 sm:px-8 flex flex-col items-center">
                <p className="text-lg sm:text-xl leading-relaxed font-fell text-[#1a110a] font-medium">
                  “This is the day you will always remember as the day you almost got a decent placement.”
                </p>
                <figcaption className="mt-3 font-type text-xs sm:text-sm text-[#483320] tracking-wide font-semibold">
                  — Captain Jack Sparrow (probably)
                </figcaption>
              </blockquote>
              {/* Sharp Red Pin */}
              <span className="pin-sharp shadow-xl drop-shadow-lg z-20" aria-hidden="true" />
            </figure>

            {/* Lower-Left: Clean Vertical Stack of 4 Action Buttons with Metallic Clink & Gold Hover Glow */}
            <div className="hero-nav-stack flex flex-col gap-3 w-full">
              <CrookedLink
                to="/admissions"
                variant="plank"
                size="lg"
                tilt={0}
                onMouseEnter={() => play("clink")}
                onClick={() => play("clink")}
                className="hero-action-btn font-pirate text-xl tracking-wider w-full justify-center text-center"
              >
                Join the Crew
              </CrookedLink>
              <CrookedLink
                to="/attendance"
                variant="plank"
                size="lg"
                tilt={0}
                onMouseEnter={() => play("clink")}
                onClick={() => play("clink")}
                className="hero-action-btn font-pirate text-xl tracking-wider w-full justify-center text-center"
              >
                Calculate My Academic Damage
              </CrookedLink>
              <CrookedLink
                to="/treasure-maps"
                variant="plank"
                size="lg"
                tilt={0}
                onMouseEnter={() => play("clink")}
                onClick={() => play("clink")}
                className="hero-action-btn font-pirate text-xl tracking-wider w-full justify-center text-center"
              >
                Find the Treasure
              </CrookedLink>
              <CrookedLink
                to="/faculty"
                variant="plank"
                size="lg"
                tilt={0}
                onMouseEnter={() => play("clink")}
                onClick={() => play("clink")}
                className="hero-action-btn font-pirate text-xl tracking-wider w-full justify-center text-center"
              >
                View the Crew Manifest
              </CrookedLink>
            </div>

          </div>

          {/* Right Two-Thirds: Dedicated to the Dynamic Moving Imagery */}
          <div className="hidden lg:block lg:col-span-7 xl:col-span-8 pointer-events-none" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ChancellorSection() {
  return (
    <section className="page-wrap relative mt-16" aria-labelledby="chancellor-title">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="relative mx-auto w-full max-w-[18rem] -rotate-3">
          <ChancellorPortrait className="h-auto w-full drop-shadow-[0_14px_18px_rgba(0,0,0,0.6)]" />
          <p className="mx-auto -mt-2 w-max rotate-2 bg-ink px-3 py-1 font-type text-xs text-parchment">THE CHANCELLOR (PROBABLY)</p>
        </div>

        <ParchmentPanel as="article" material="parchment" torn="bottom" tilt={1} tape={["left", "right"]} className="p-7 sm:p-10">
          <h2 id="chancellor-title" className="title-big text-wreck">The Chancellor's Message</h2>
          <p className="mt-1 font-type text-xs uppercase tracking-widest text-rust">Read aloud at every orientation · twice if it rains</p>
          <p className="mt-5 font-fell text-xl leading-relaxed">
            “Ahoy, future graduates. Our institution has survived storms, inspections, three budget cuts, and an incident involving a faculty
            member and an actual cannon. Your future is in safe-ish hands.”
          </p>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <svg viewBox="0 0 260 70" width="230" height="62" aria-hidden="true" className="-rotate-6">
                <path
                  d="M8 48c12-30 20-40 24-26s-10 30 4 20 18-34 26-20-4 22 10 12 12-20 22-8 6 14 18 4 10-18 20-6c8 10 16 2 26-6s14 6 22 2 18-10 30-4"
                  fill="none"
                  stroke="#090807"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path d="M20 60c60-8 140-10 230-4" fill="none" stroke="#8d1d28" strokeWidth="1.8" />
              </svg>
              <p className="font-fell italic">Mortimer “Mad Dog” Blackwater III, Chancellor (acting) (still)</p>
            </div>
            <div className="relative">
              <WaxSeal size={92} className="anim-seal-impact" title="Official seal of the Chancellor, featuring a tiny skull" />
            </div>
          </div>
        </ParchmentPanel>
      </div>

      {/* the accreditation certificate, with a rum stain right over the seal */}
      <ParchmentPanel material="parchment-dark" tilt={-2.5} nails={["tl", "tr"]} className="mx-auto mt-12 max-w-md p-6 text-center md:ml-auto md:mr-10">
        <p className="font-blackletter text-3xl">Certificate of Accreditation</p>
        <p className="mt-2 font-fell italic">This institution is hereby accredited by the Accreditation Board of the Seven Seas, for one (1) semester, or until the board sobers up.</p>
        <div className="relative mx-auto mt-3 w-max">
          <WaxSeal size={70} color="gold" label="ABSS" />
          <span className="rum-stain" style={{ left: -30, top: -26 }} aria-hidden="true" />
        </div>
        <p className="mt-2 font-type text-xs">(stain is decorative · certificate is fictional)</p>
      </ParchmentPanel>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const DEPT_LOOK: { material: PanelMaterial; tilt: number; extra: string }[] = [
  { material: "parchment", tilt: -1.5, extra: "torn-card" },
  { material: "plank", tilt: 1.2, extra: "" },
  { material: "canvas", tilt: -0.5, extra: "" },
  { material: "damp", tilt: 2, extra: "" },
  { material: "deep", tilt: -1.8, extra: "seaweed-fringe" },
];

function DepartmentsSection() {
  const { openPopup, play } = useExperience();

  const inspect = (d: Department) => {
    play("paper");
    openPopup({
      key: `dept-${d.id}`,
      variant: d.id === "mar" ? "treasure" : "wooden",
      title: d.name,
      illustration: <DeptIcon dept={d.id} size={84} />,
      body: (
        <>
          <p className="font-fell text-lg italic">“{d.motto}”</p>
          <p>
            <strong>Head of department:</strong> {d.head}
          </p>
          <p>
            <strong>Found at:</strong> {d.building}
          </p>
          <p className="mt-2 font-type text-sm uppercase tracking-wider">Courses on offer</p>
          <ul className="list-disc pl-5">
            {d.courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-3 font-type text-sm opacity-90">Confession: {d.confession}</p>
        </>
      ),
      actions: [
        { label: "Meet the crew", to: `/faculty?dept=${d.id}`, primary: true },
        { label: "Find it on the map", to: `/treasure-maps?loc=${MAP_LOCATION[d.id]}` },
      ],
    });
  };

  return (
    <section className="page-wrap mt-20" aria-labelledby="dept-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="dept-title" className="title-big rotate-[-1deg]">
          Academic Departments
          <span className="ml-3 align-middle font-type text-sm text-brine">(five, if you count the basement)</span>
        </h2>
      </div>
      <ul className="dept-grid mt-8">
        {DEPARTMENTS.map((d, i) => {
          const look = DEPT_LOOK[i];
          return (
            <li key={d.id} className={i === 1 ? "md:translate-y-8" : i === 3 ? "md:-translate-y-4" : ""}>
              <ParchmentPanel as="article" material={look.material} tilt={look.tilt} pin={i % 2 === 0} nails={i % 2 ? ["tl", "br"] : []} className={`h-full p-6 ${look.extra}`}>
                <DeptIcon dept={d.id} size={58} className={i % 2 ? "ml-auto" : ""} />
                <h3 className={`mt-2 font-pirate text-3xl leading-none ${look.material === "plank" || look.material === "deep" ? "text-gold" : "text-wreck"}`}>
                  {d.name}
                </h3>
                <p className="mt-3 font-fell text-lg">{d.motto}</p>
                <CrookedButton variant={i % 2 ? "gold" : "rust"} size="sm" tilt={i % 2 ? 1.5 : -1.5} className="mt-5" onClick={() => inspect(d)}>
                  Inspect the department
                </CrookedButton>
              </ParchmentPanel>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STATS = [
  { value: 98, suffix: "%", label: "of students have considered abandoning ship", look: "barrel" },
  { value: 72, suffix: "%", label: "of faculty meetings could have been replaced by a parrot", look: "parrot" },
  { value: 13, suffix: "", label: "barrels of coffee consumed before examination week", look: "coffee" },
  { value: 4, suffix: "", label: "verified working projectors across the institution", look: "projector" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced) {
      setN(to);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setN(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / 1400);
          // overshoots, then settles: the stats office cannot count either
          const eased = p < 0.8 ? (p / 0.8) * 1.08 : 1.08 - ((p - 0.8) / 0.2) * 0.08;
          setN(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, reduced]);
  return (
    <span ref={ref} aria-hidden="true">
      {n}
      {suffix}
    </span>
  );
}

function StatsSection() {
  return (
    <section className="relative mt-24 overflow-hidden py-14" aria-labelledby="stats-title">
      <div className="absolute inset-0 tx-deep" aria-hidden="true" />
      <KrakenTentacle width={120} className="pointer-events-none absolute -bottom-6 -left-4 opacity-60" />
      <KrakenTentacle width={90} flipped className="pointer-events-none absolute -bottom-10 right-6 hidden opacity-50 md:block" />
      <div className="page-wrap relative">
        <div className="flex flex-wrap items-center gap-4">
          <h2 id="stats-title" className="title-big text-ivory">University Statistics</h2>
          <DemoLabel dark>Satire · these numbers are invented</DemoLabel>
        </div>
        <ul className="stats-grid mt-10">
          {STATS.map((s, i) => (
            <li key={s.label} className={`stat-tile stat-${s.look}`} style={{ transform: `rotate(${[-2, 1.5, -0.6, 2.4][i]}deg)` }}>
              <p className="stat-number">
                <CountUp to={s.value} suffix={s.suffix} />
                <span className="sr-only">
                  {s.value}
                  {s.suffix}
                </span>
              </p>
              <p className="stat-label">{s.label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-xl font-type text-xs text-aged">
          Methodology: we asked a parrot. The parrot said “Arrr” 98 times out of 100. Peer review was performed by the same parrot.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function NoticesSection() {
  const { play } = useExperience();
  const [dismissed, setDismissed] = usePersistedState<string[]>("session", KEYS.dismissedNotices, [], isStringArray);
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = NOTICES.filter((n) => !dismissed.includes(n.id));

  return (
    <section className="page-wrap mt-24" aria-labelledby="notices-title">
      <div className="notice-board tx-wood p-5 sm:p-8">
        <span className="nail tl" aria-hidden="true" />
        <span className="nail tr" aria-hidden="true" />
        <span className="nail bl" aria-hidden="true" />
        <span className="nail br" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="notices-title" className="title-big text-gold">Notices From the Captain</h2>
          {dismissed.length > 0 && (
            <CrookedButton
              variant="ghost"
              size="sm"
              tilt={1}
              onClick={() => {
                play("paper");
                setDismissed([]);
              }}
            >
              Re-pin {dismissed.length} torn-down notice{dismissed.length > 1 ? "s" : ""}
            </CrookedButton>
          )}
        </div>
        {visible.length === 0 ? (
          <p className="mt-8 font-fell text-xl italic text-parchment">
            The board is bare. The captain will be furious, or asleep. Probably asleep.
          </p>
        ) : (
          <ul className="notices-grid mt-8">
            {visible.map((n, i) => {
              const open = expanded === n.id;
              const detailId = `notice-${n.id}-detail`;
              return (
                <li key={n.id}>
                  <ParchmentPanel as="article" material={n.material} tilt={[-2.4, 1.6, -0.8, 2.6, -1.4][i % 5]} pin className="p-5" torn={i % 2 ? "bottom" : undefined}>
                    <p className="font-type text-xs uppercase tracking-wider text-rust">
                      {n.date}
                      {n.probably && (
                        <span className="handwritten ml-2 text-base normal-case" aria-label="(probably)">
                          probably
                        </span>
                      )}
                    </p>
                    <h3 className="mt-2 font-fell text-xl font-bold leading-snug">{n.title}</h3>
                    {open && (
                      <p id={detailId} className="mt-3 font-fell anim-panel-open">
                        {n.detail}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="crooked-btn cb-ghost cb-sm"
                        aria-expanded={open}
                        aria-controls={open ? detailId : undefined}
                        onClick={() => {
                          play("paper");
                          setExpanded(open ? null : n.id);
                        }}
                        data-rum=""
                      >
                        {open ? "Fold it back up" : "Read the fine print"}
                      </button>
                      <button
                        type="button"
                        className="crooked-btn cb-ghost cb-sm"
                        onClick={() => {
                          play("paper");
                          setDismissed((d) => [...d, n.id]);
                        }}
                        aria-label={`Tear down notice: ${n.title}`}
                      >
                        Tear it down
                      </button>
                    </div>
                  </ParchmentPanel>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

const TICKER = [
  "Arrr, your submission has gone missing.",
  "The database has abandoned ship.",
  "This server be held together by rope and academic misconduct.",
  "The cloud has been replaced by fog.",
  "Please do not feed the database after midnight.",
  "The faculty is currently holding an emergency meeting about the missing projector.",
];

function Ticker() {
  const line = TICKER.join("  ☠  ");
  return (
    <div className="ticker mt-20" aria-hidden="true">
      <div className="ticker-track anim-marquee">
        <span>{line}  ☠  </span>
        <span>{line}  ☠  </span>
      </div>
    </div>
  );
}

export default function PoopDeckPage() {
  usePageTitle("The Poop Deck");
  return (
    <>
      <Hero />
      <ChancellorSection />
      <RopeDivider className="page-wrap mt-16" knots={3} />
      <DepartmentsSection />
      <StatsSection />
      <NoticesSection />
      <Ticker />
    </>
  );
}
