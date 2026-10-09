import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { COMPASS_UNLOCK_AT, useExperience } from "../../app/PirateExperienceProvider";
import { NORMAL_ROUTES, SECRET_ROUTES, normalizePath } from "../../app/routes";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useTimeouts } from "../../hooks/useTimeouts";
import { pick } from "../../lib/random";
import { NauticalCompass } from "../svg/NauticalCompass";
import { PirateTooltip } from "../interactions/PirateTooltip";
import { TreasureUnlock } from "../interactions/TreasureUnlock";

export const COMPASS_TOOLTIP = "It doesn’t point north… it points to what you want most.";

const CABIN = SECRET_ROUTES.find((r) => r.path === "/faculty-cabin-map")!;

/**
 * The spinning compass. Each click spins the needle and sails to a random
 * real page (never the one you're on). Spin it enough times in one session
 * and it reveals the secret Faculty Cabin Map.
 */
export function GlobalCompass() {
  const { abyss, recordCompassSpin, cabinUnlocked, unlockCabin, openPopup, play } = useExperience();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const { later } = useTimeouts();
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (abyss) return null;

  const spin = () => {
    if (spinning) return;
    play("clink");
    const count = recordCompassSpin();
    setSpinning(true);
    const extra = 720 + Math.floor(Math.random() * 720);

    if (count >= COMPASS_UNLOCK_AT && !cabinUnlocked) {
      // Point firmly south-west, towards nothing on any official map.
      setAngle((a) => {
        const target = a + extra;
        return target + (225 - (target % 360));
      });
      setMessage("The needle shudders… and points somewhere that isn't on any map.");
      later(
        () => {
          unlockCabin();
          play("chord");
          setSpinning(false);
          setMessage(null);
          openPopup({
            key: "cabin-unlocked",
            variant: "treasure",
            title: "The compass has found something",
            illustration: <TreasureUnlock caption="Secret chart recovered" />,
            body: (
              <>
                <p>
                  Spun {count} times, the needle finally gave up pretending to know where north is, and pointed at a
                  folded chart stuffed inside its own casing.
                </p>
                <p>
                  It is the <strong>Secret Faculty Cabin Map</strong>: hidden corridors, suspicious doors, and the cabin where
                  unanswered emails allegedly disappear.
                </p>
              </>
            ),
            actions: [
              { label: "Follow the needle", to: CABIN.path, primary: true },
              { label: "Not now, I fear the faculty" },
            ],
          });
        },
        reduced ? 250 : 1350,
      );
      return;
    }

    const here = normalizePath(pathname);
    const pool = [...NORMAL_ROUTES, ...(cabinUnlocked ? [CABIN] : [])].filter((r) => r.path !== here);
    const destination = pick(pool);
    setAngle((a) => a + extra);
    const dizzy = !cabinUnlocked && count >= COMPASS_UNLOCK_AT - 2 ? " The needle seems… dizzy. It is remembering something." : "";
    setMessage(`The needle insists on: ${destination.label}.${dizzy}`);
    later(() => navigate(destination.path), reduced ? 500 : 1150);
    later(
      () => {
        setSpinning(false);
        setMessage(null);
      },
      reduced ? 1600 : 2700,
    );
  };

  return (
    <div className="global-compass global-fixed">
      <PirateTooltip text={COMPASS_TOOLTIP} placement="left">
        {(tooltipId) => (
          <button
            type="button"
            className="compass-btn"
            onClick={spin}
            aria-label="Spin the compass. It sails you to a random page."
            aria-describedby={tooltipId}
            aria-disabled={spinning || undefined}
          >
            <NauticalCompass angle={angle} idle={!spinning} />
          </button>
        )}
      </PirateTooltip>
      <div role="status" aria-live="polite">
        {message && <p className="compass-message">{message}</p>}
      </div>
    </div>
  );
}
