import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import { X } from "lucide-react";
import { JAR_LEVELS, JAR_UNLOCK_AT, useExperience } from "../../app/PirateExperienceProvider";
import { JarOfDirt } from "../svg/JarOfDirt";

function fillFor(visits: number): number {
  if (visits <= 0) return 0.03;
  return Math.min(0.94, 0.12 + (Math.min(visits, JAR_UNLOCK_AT) / JAR_UNLOCK_AT) * 0.72 + Math.max(0, visits - JAR_UNLOCK_AT) * 0.01);
}

/**
 * The Jar of Dirt. It gains a handful for every new deck visited per voyage
 * (browser session), remembers across voyages, and at the threshold it opens
 * and coughs up the secret parchment that leads to /the-code.
 */
export function GlobalJarOfDirt() {
  const { abyss, visits, jarLevel, codeUnlocked, notify, play } = useExperience();
  const [open, setOpen] = useState(false);
  const [settleKey, setSettleKey] = useState(0);
  const [revealKey, setRevealKey] = useState(0);
  const prevVisits = useRef(visits);
  const prevUnlocked = useRef(codeUnlocked);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popId = useId();

  // Re-trigger the settling animation whenever new dirt arrives.
  useEffect(() => {
    if (visits > prevVisits.current) setSettleKey((k) => k + 1);
    prevVisits.current = visits;
  }, [visits]);

  // The moment of revelation.
  useEffect(() => {
    if (codeUnlocked && !prevUnlocked.current) {
      setRevealKey((k) => k + 1);
      play("chord");
      notify({
        title: "The jar has opened!",
        message: "The dirt knows the secret. A cursed parchment has crawled out of the jar.",
        tone: "treasure",
        action: { label: "Read the parchment", to: "/the-code" },
        duration: 12000,
      });
    }
    prevUnlocked.current = codeUnlocked;
  }, [codeUnlocked, notify, play]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector('[aria-modal="true"]')) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && e.target instanceof Node && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (abyss) return null;

  const level = JAR_LEVELS[jarLevel - 1];
  const label = level ? level.label : "EMPTY";
  const message = level ? level.message : "Empty. Explore the decks and the jar will fill with academic despair.";

  return (
    <div className="global-jar global-fixed" ref={wrapRef}>
      {open && (
        <div id={popId} role="dialog" aria-label="Jar of Dirt" className="jar-popover panel on-paper anim-panel-open">
          <div className="panel-bg tx-parchment torn-top" aria-hidden="true" />
          <button
            type="button"
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border-2 border-ink"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
            aria-label="Close the jar"
          >
            <X size={16} aria-hidden="true" />
          </button>
          <p className="font-pirate text-2xl leading-none">The Jar of Dirt</p>
          <p className="mt-2 font-fell text-lg italic">“{message}”</p>
          <p className="mt-2 font-type text-sm">
            Handfuls collected: <strong>{visits}</strong>
            {!codeUnlocked && (
              <>
                {" "}
                · {Math.min(visits, JAR_UNLOCK_AT)}/{JAR_UNLOCK_AT} until the jar speaks
              </>
            )}
          </p>
          <p className="mt-1 font-type text-xs opacity-80">
            One handful for every new deck ye set foot on per voyage (browser session). The jar remembers between voyages.
          </p>
          {codeUnlocked && (
            <Link
              to="/the-code"
              onClick={() => setOpen(false)}
              className="crooked-btn cb-rust cb-sm mt-3"
              style={{ ["--tilt" as string]: "-1.5deg" }}
              data-rum=""
            >
              Read the secret parchment
            </Link>
          )}
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        className={`jar-btn ${settleKey ? "jar-wobble" : ""}`}
        key={`jar-${settleKey}`}
        onClick={() => {
          play("bubble");
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-label={`Jar of Dirt: ${visits} handful${visits === 1 ? "" : "s"}. ${message}`}
      >
        <JarOfDirt level={fillFor(visits)} label={label} settling={settleKey > 0} lidOpen={codeUnlocked} />
        <span className="jar-count" aria-hidden="true">
          {visits > 99 ? "99+" : visits}
        </span>
        {revealKey > 0 && <span key={revealKey} className="jar-secret-scroll parchment-escape" aria-hidden="true" />}
      </button>
    </div>
  );
}
