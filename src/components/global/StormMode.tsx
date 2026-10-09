import type { CSSProperties } from "react";
import { useExperience } from "../../app/PirateExperienceProvider";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { BlackwaterShip } from "../svg/BlackwaterShip";
import { GoldCoin } from "../svg/GoldCoin";
import { WaveStrip } from "../svg/WaveStrip";
import { CrookedButton } from "../ui/CrookedButton";

const COINS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 7) % 100}%`,
  dur: `${5 + ((i * 13) % 6)}s`,
  delay: `${-((i * 7) % 9)}s`,
  spin: `${360 + ((i * 97) % 540)}deg`,
  size: 18 + ((i * 11) % 18),
}));

const SPRAY = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 23 + 5) % 100}%`,
  dx: `${((i * 17) % 60) - 30}px`,
  dur: `${1.8 + ((i * 3) % 10) / 10}s`,
  delay: `${-((i * 5) % 20) / 10}s`,
}));

/**
 * The Konami storm: a jet-black ship sails across the viewport, waves roll
 * along the bottom, coins fall, spray flies. It never blocks clicks.
 */
export function StormMode() {
  const { stormMode, setStormMode, abyss } = useExperience();
  const reduced = useReducedMotion();
  if (!stormMode || abyss) return null;

  return (
    <>
      <div className="storm-layer" aria-hidden="true">
        {!reduced && <div className="storm-lightning anim-lightning" />}
        {!reduced &&
          COINS.map((c, i) => (
            <div
              key={i}
              className="storm-coin coin-fall"
              style={{ left: c.left, ["--dur" as string]: c.dur, ["--delay" as string]: c.delay, ["--spin" as string]: c.spin } as CSSProperties}
            >
              <GoldCoin size={c.size} flip />
            </div>
          ))}
        <div className={`storm-ship ${reduced ? "is-docked" : "konami-ship"}`}>
          <BlackwaterShip variant="pearl" rocking={!reduced} />
        </div>
        {!reduced &&
          SPRAY.map((s, i) => (
            <span
              key={i}
              className="storm-spray anim-spray"
              style={{ left: s.left, ["--dx" as string]: s.dx, ["--dur" as string]: s.dur, ["--delay" as string]: s.delay } as CSSProperties}
            />
          ))}
        <div className="storm-waves">
          <WaveStrip color="#0a1d22" foam="#9fc7b4" height={70} speed={7} chop={1} />
          <WaveStrip color="#020809" foam="#608c76" height={44} speed={5} reverse chop={0.9} style={{ marginTop: -40 }} />
        </div>
        <div className="storm-banner">MUTINY!</div>
      </div>
      <div className="storm-calm">
        <CrookedButton variant="gold" size="sm" tilt={-2} onClick={() => setStormMode(false)} rum={false}>
          Calm the seas
        </CrookedButton>
      </div>
    </>
  );
}
