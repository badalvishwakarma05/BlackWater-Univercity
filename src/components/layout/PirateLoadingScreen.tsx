import { useEffect, useMemo, useRef, useState } from "react";
import { useExperience } from "../../app/PirateExperienceProvider";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { BellOutline } from "../svg/Props";
import { CannonBlast } from "../svg/CannonBlast";
import { PirateFlag } from "../svg/PirateFlag";
import { UniversityEmblem } from "../svg/UniversityEmblem";

export const INTRO_QUOTE = "The code is more what you’d call… guidelines than actual rules.";
export const TAGLINE = "Not All Treasure is Silver and Gold… Some of it is CGPA";

type Stage = "dark" | "loading" | "typing" | "flag" | "cannon" | "emblem" | "title" | "exit";
const ORDER: Stage[] = ["dark", "loading", "typing", "flag", "cannon", "emblem", "title", "exit"];

/** Frames for a tired pirate typing the quote, including one typo he notices. */
function buildFrames(text: string): string[] {
  const frames: string[] = [];
  const typoAt = text.indexOf("guidelines") + 4;
  for (let i = 1; i <= text.length; i++) {
    frames.push(text.slice(0, i));
    if (i === typoAt) {
      frames.push(text.slice(0, i) + "l");
      frames.push(text.slice(0, i) + "l");
      frames.push(text.slice(0, i));
    }
  }
  return frames;
}

/**
 * THE CURSED MANIFEST: the first-visit intro. Shown once per browser
 * session, always skippable, never blocks for more than ~16 seconds, and
 * collapses to a short still version for reduced-motion visitors.
 */
export function PirateLoadingScreen() {
  const { finishIntro, play } = useExperience();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>(reduced ? "title" : "dark");
  const [frame, setFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const frames = useMemo(() => buildFrames(INTRO_QUOTE), []);
  const skipRef = useRef<HTMLButtonElement>(null);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    finishIntro();
  };

  const leave = () => setStage("exit");

  // Fail-safe: the intro may never hold the ship hostage.
  useEffect(() => {
    const t = window.setTimeout(finish, 16000);
    skipRef.current?.focus();
    return () => window.clearTimeout(t);
  }, []);

  // Once exiting, let the fade play and then hand over the ship.
  useEffect(() => {
    if (stage !== "exit") return;
    const t = window.setTimeout(finish, reduced ? 0 : 550);
    return () => window.clearTimeout(t);
  }, [stage, reduced]);

  // Reduced motion: show the still title card briefly, then continue.
  useEffect(() => {
    if (!reduced) return;
    const t = window.setTimeout(() => setStage("exit"), 2600);
    return () => window.clearTimeout(t);
  }, [reduced]);

  // Stage timeline (typing advances itself below).
  useEffect(() => {
    if (reduced) return;
    const timings: Partial<Record<Stage, number>> = { dark: 1100, loading: 1700, flag: 900, cannon: 520, emblem: 950, title: 1900 };
    const wait = timings[stage];
    if (wait === undefined) return;
    const t = window.setTimeout(() => {
      const next = ORDER[ORDER.indexOf(stage) + 1];
      if (next === "cannon") play("cannon");
      if (next === "emblem") play("thud");
      setStage(next);
    }, wait);
    return () => window.clearTimeout(t);
  }, [stage, reduced, play]);

  // The bell tolls (only audible if the visitor has already interacted).
  useEffect(() => {
    if (stage === "dark") play("bell");
    if (stage === "loading") play("creak");
  }, [stage, play]);

  // Progress that occasionally goes backwards, as is tradition.
  useEffect(() => {
    if (stage !== "loading") return;
    const steps = [12, 34, 29, 58, 71, 66, 88, 100];
    let i = 0;
    const t = window.setInterval(() => {
      setProgress(steps[Math.min(i, steps.length - 1)]);
      i += 1;
      if (i >= steps.length) window.clearInterval(t);
    }, 200);
    return () => window.clearInterval(t);
  }, [stage]);

  // Irregular typing.
  useEffect(() => {
    if (stage !== "typing") return;
    if (frame >= frames.length - 1) {
      const t = window.setTimeout(() => setStage("flag"), 650);
      return () => window.clearTimeout(t);
    }
    const shown = frames[frame];
    const last = shown[shown.length - 1];
    let delay = 28 + Math.random() * 62;
    if (last === "…" || last === "," || last === ".") delay += 380;
    else if (last === " ") delay += 30;
    if (Math.random() < 0.05) delay += 260;
    if (frames[frame + 1] && frames[frame + 1].length < shown.length) delay += 300;
    const t = window.setTimeout(() => setFrame((f) => f + 1), delay);
    return () => window.clearTimeout(t);
  }, [stage, frame, frames]);

  const reached = (s: Stage) => ORDER.indexOf(stage) >= ORDER.indexOf(s);
  const typed = reduced || reached("flag") ? INTRO_QUOTE : stage === "typing" ? frames[frame] : "";

  return (
    <div
      className={`loader-overlay ${stage === "exit" ? "anim-loader-exit" : ""} ${stage === "cannon" ? "anim-screen-shake" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Blackwater University introduction"
      onKeyDown={(e) => {
        if (e.key === "Escape") leave();
        if (e.key === "Tab") {
          e.preventDefault();
          skipRef.current?.focus();
        }
      }}
    >
      <p className="sr-only">
        {INTRO_QUOTE} Blackwater University. {TAGLINE}
      </p>

      {/* 1. the faint ship's bell */}
      {!reduced && !reached("flag") && <BellOutline size={96} className="opacity-60" />}

      {/* 2. weathered loading indicator */}
      {!reduced && (stage === "loading" || stage === "typing") && (
        <div aria-hidden="true" className="flex flex-col items-center gap-2">
          <div className="loader-progress">
            <div className="h-full rounded-[5px] transition-[width] duration-200" style={{ width: `${progress}%`, background: "repeating-linear-gradient(60deg,#b18a52 0 6px,#6d4f2c 6px 12px)" }} />
          </div>
          <p className="font-type text-xs text-aged">
            Hoisting sails… {progress}% {progress === 29 || progress === 66 ? "(the tide took some)" : ""}
          </p>
        </div>
      )}

      {/* 3–4. the quote, typed by a tired pirate */}
      {(reached("typing") || reduced) && (
        <p className="loader-quote" aria-hidden="true">
          {typed}
          {stage === "typing" && <span className="type-caret" />}
        </p>
      )}

      {/* 5. flag silhouette */}
      {(reached("flag") || reduced) && !reached("emblem") && !reduced && (
        <div className="anim-flag-emerge" aria-hidden="true" style={{ filter: "brightness(0.55) contrast(1.2)" }}>
          <PirateFlag width={220} fast />
        </div>
      )}

      {/* 6. cannon */}
      {stage === "cannon" && (
        <>
          <div className="loader-flash anim-screen-flash" aria-hidden="true" />
          <CannonBlast size={240} className="anim-cannon absolute" />
        </>
      )}

      {/* 7–8. emblem crash + name */}
      {(reached("emblem") || reduced) && (
        <div className="flex flex-col items-center gap-3" aria-hidden="true">
          <div className="loader-emblem-wrap">
            <span className="loader-ink anim-ink-splat" />
            <div className={reduced ? "" : "anim-emblem-crash"}>
              <UniversityEmblem size={150} />
            </div>
          </div>
          {(reached("title") || reduced) && (
            <div className="anim-title-burn">
              <p className="loader-title">Blackwater University</p>
              <p className="loader-tagline mt-2">“{TAGLINE}”</p>
            </div>
          )}
        </div>
      )}

      <div className="loader-skip">
        <button ref={skipRef} type="button" className="crooked-btn cb-ghost cb-sm" style={{ ["--tilt" as string]: "-2deg" }} onClick={leave}>
          {reached("title") ? "Board the ship →" : "Skip the theatrics"}
        </button>
      </div>
    </div>
  );
}
