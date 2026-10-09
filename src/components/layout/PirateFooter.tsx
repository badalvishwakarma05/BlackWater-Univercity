import { useState } from "react";
import { Link } from "react-router";
import { useExperience } from "../../app/PirateExperienceProvider";
import { LOWER_DECK_ROUTES, NAV_ROUTES } from "../../app/routes";
import { DEPARTMENTS } from "../../data/departments";
import { useTimeouts } from "../../hooks/useTimeouts";
import { BlackwaterShip } from "../svg/BlackwaterShip";
import { Crab } from "../svg/Props";
import { WaxSeal } from "../svg/WaxSeal";
import { WaveStrip } from "../svg/WaveStrip";

/** The footer: a plank with a nail through the copyright, and a crab who handles enquiries. */
export function PirateFooter() {
  const { stormMode, play } = useExperience();
  const [crab, setCrab] = useState(false);
  const { later, clearAll } = useTimeouts();

  const summonCrab = () => {
    clearAll();
    play("squawk");
    setCrab(true);
    later(() => setCrab(false), 4500);
  };

  return (
    <footer className="pirate-footer tx-wood">
      <WaveStrip className="absolute inset-x-0 -top-8" height={34} color="#382419" foam="#77583a" speed={30} chop={0.3} />
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-end gap-3">
            <BlackwaterShip width={150} rocking />
            <WaxSeal size={58} className="-rotate-12" title="Departmental seal of Blackwater University (with tiny skull)" />
          </div>
          <p className="mt-3 max-w-xs font-fell italic text-parchment">
            “Not all treasure is silver and gold… some of it is CGPA.” Blackwater University is entirely fictional. So is its accreditation.
          </p>
          <div className="relative mt-5 inline-block">
            <button type="button" className="crooked-btn cb-ghost cb-sm" onClick={summonCrab} aria-describedby="crab-tip" data-rum="">
              Contact the Administration
            </button>
            {crab && (
              <div className="absolute -top-24 left-0 flex items-end gap-1 anim-crab-enter" role="status">
                <Crab size={64} className="anim-crab" />
                <span id="crab-tip" className="mb-8 rounded border-2 border-ink bg-ivory px-2 py-1 font-type text-xs text-ink shadow-[3px_3px_0_rgba(0,0,0,.5)] -rotate-3">
                  The administration is unavailable
                </span>
              </div>
            )}
          </div>
        </div>

        <nav aria-label="Quick links" className="footer-links">
          <h2 className="font-pirate text-2xl text-gold">{stormMode ? "ESCAPE ROUTES" : "Quick links"}</h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 font-fell">
            {[...NAV_ROUTES, ...LOWER_DECK_ROUTES].map((r) => (
              <li key={r.path}>
                <Link to={r.path}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Departments" className="footer-links">
          <h2 className="font-pirate text-2xl text-gold">Departments</h2>
          <ul className="mt-2 font-fell">
            {DEPARTMENTS.map((d) => (
              <li key={d.id}>
                <Link to={`/faculty?dept=${d.id}`}>{d.name}</Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-type text-xs text-aged">Office hours: Mondays, 2:00 to 2:05 PM, tide permitting.</p>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl">
        <p className="footer-plank">
          <span className="footer-nail" aria-hidden="true" />
          Copyright © Blackwater University. All treasure reserved. All liabilities blamed on the previous captain.
        </p>
        <p className="mt-4 font-type text-xs text-aged">
          A satirical, fictional website. No real students, fees, results, employers, or pirates were harmed. Forms are simulations and
          store nothing beyond your own browser.
        </p>
      </div>
    </footer>
  );
}
