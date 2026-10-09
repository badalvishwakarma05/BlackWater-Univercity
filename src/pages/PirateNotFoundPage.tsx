import { useEffect, type CSSProperties } from "react";
import { useLocation } from "react-router";
import { Volume2 } from "lucide-react";
import { useExperience } from "../app/PirateExperienceProvider";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SkeletonCaptain } from "../components/svg/SkeletonCaptain";
import { Barrel } from "../components/svg/Props";
import { CrookedLink } from "../components/ui/CrookedButton";

export const ABYSS_LINE = "Do you fear death? Or do you fear a 404 error more?";

const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 47 + 3) % 100}%`,
  size: 4 + ((i * 7) % 12),
  dur: `${9 + ((i * 5) % 10)}s`,
  delay: `${-((i * 3) % 14)}s`,
}));

const DEBRIS = [
  { top: "18%", dur: "70s", delay: "-10s", kind: "plank" },
  { top: "62%", dur: "90s", delay: "-40s", kind: "barrel" },
  { top: "38%", dur: "110s", delay: "-70s", kind: "bottle" },
];

/** THE ABYSS: a dedicated full-viewport 404 with one clear way home. */
export default function PirateNotFoundPage() {
  usePageTitle("Lost in the Abyss (404)");
  const { setAbyss, play } = useExperience();
  const reduced = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    setAbyss(true);
    return () => setAbyss(false);
  }, [setAbyss]);

  return (
    <main className="abyss" id="main">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="abyss-rays" />
        {!reduced &&
          BUBBLES.map((b, i) => (
            <span
              key={i}
              className="abyss-bubble anim-bubble"
              style={{ left: b.left, width: b.size, height: b.size, ["--dur" as string]: b.dur, ["--delay" as string]: b.delay } as CSSProperties}
            />
          ))}
        {!reduced &&
          DEBRIS.map((d, i) => (
            <div key={i} className="abyss-debris anim-debris" style={{ top: d.top, ["--dur" as string]: d.dur, ["--delay" as string]: d.delay } as CSSProperties}>
              {d.kind === "barrel" ? (
                <Barrel size={60} />
              ) : d.kind === "plank" ? (
                <svg width="120" height="20" viewBox="0 0 120 20">
                  <rect x="2" y="4" width="116" height="12" fill="#3a2a1c" stroke="#120c08" strokeWidth="2" />
                  <circle cx="108" cy="10" r="2" fill="#6f6a5c" />
                </svg>
              ) : (
                <svg width="60" height="24" viewBox="0 0 60 24">
                  <rect x="2" y="4" width="42" height="16" rx="7" fill="#355b48" opacity=".75" stroke="#13261d" />
                  <rect x="44" y="8" width="12" height="8" fill="#3a2a1c" />
                  <rect x="10" y="8" width="20" height="8" fill="#c8b995" opacity=".8" />
                </svg>
              )}
            </div>
          ))}
      </div>

      <div className="abyss-layout">
        <div className="abyss-captain anim-abyss-emerge">
          <div className="anim-float-deep">
            <SkeletonCaptain className="h-auto w-full" />
          </div>
        </div>

        <div className="abyss-copy">
          <p className="abyss-404" aria-hidden="true">
            4<span className="abyss-zero">0</span>4
          </p>
          <h1 className="sr-only">404: page not found</h1>
          <div className="abyss-parchment panel on-paper">
            <div className="panel-bg tx-parchment-dark torn-both" aria-hidden="true" />
            <div className="panel-content">
              <p className="font-type text-xs uppercase tracking-widest text-rust">From the captain of the deep</p>
              <p className="mt-2 font-fell text-2xl italic leading-snug sm:text-3xl">“{ABYSS_LINE}”</p>
              <p className="mt-3 font-fell">
                The deck <code className="break-all font-type text-sm">{pathname}</code> sank long ago, or never existed. Either way, the sea
                has it now.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CrookedLink to="/" variant="plank" size="lg" tilt={-2} rum={false}>
              Return to The Poop Deck
            </CrookedLink>
            <button
              type="button"
              className="header-tool"
              onClick={() => {
                play("rumble");
                play("bubble");
              }}
            >
              <Volume2 size={16} aria-hidden="true" /> Listen to the deep
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
