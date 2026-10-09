import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { PirateDog } from "../components/svg/PirateDog";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { TextField } from "../components/ui/PirateInput";

export const DEFAULT_THRESHOLD = 75;
const NEAR_BAND = 5;

export interface AttendanceResult {
  percentage: number;
  /** extra consecutive classes to attend to reach the threshold (0 if already there; null if impossible) */
  needed: number | null;
  /** classes that can be missed while staying at or above the threshold */
  canSkip: number;
  tier: "below" | "near" | "above";
}

/** Pure, testable attendance maths. */
export function calculateAttendance(held: number, attended: number, threshold: number): AttendanceResult {
  const percentage = (attended / held) * 100;
  let needed: number | null = 0;
  let canSkip = 0;
  if (percentage < threshold) {
    if (threshold >= 100) needed = null;
    else needed = Math.max(0, Math.ceil((threshold * held - 100 * attended) / (100 - threshold) - 1e-9));
  } else {
    canSkip = threshold > 0 ? Math.max(0, Math.floor((100 * attended - threshold * held) / threshold + 1e-9)) : 0;
  }
  const tier = percentage >= threshold ? "above" : percentage >= threshold - NEAR_BAND ? "near" : "below";
  return { percentage, needed, canSkip, tier };
}

const MESSAGES = {
  below: "The plank is waiting, matey.",
  near: "A few more classes and ye may yet survive.",
  above: "The captain reluctantly recognizes your existence.",
} as const;

const isWhole = (s: string) => /^\d+$/.test(s.trim());

export default function AttendancePage() {
  usePageTitle("Attendance");
  const [held, setHeld] = useState("40");
  const [attended, setAttended] = useState("26");
  const [threshold, setThreshold] = useState(String(DEFAULT_THRESHOLD));

  const errors: { held?: string; attended?: string; threshold?: string } = {};
  const h = Number(held);
  const a = Number(attended);
  const t = Number(threshold);
  if (!isWhole(held) || h < 1) errors.held = "Classes held must be a whole number of at least 1.";
  else if (h > 2000) errors.held = "Nobody has sat through more than 2000 classes. Not even the parrot.";
  if (!isWhole(attended)) errors.attended = "Classes attended must be a whole number (0 or more).";
  else if (!errors.held && a > h) errors.attended = "Ye cannot attend more classes than were held. We checked.";
  if (!/^\d+(\.\d+)?$/.test(threshold.trim()) || t < 1 || t > 100) errors.threshold = "The threshold must be a number from 1 to 100.";

  const valid = !errors.held && !errors.attended && !errors.threshold;
  const result = valid ? calculateAttendance(h, a, t) : null;

  return (
    <div>
      <header className="page-wrap pt-10">
        <p className="kicker">Lower decks · Attendance office · currently on fire</p>
        <h1 className="title-huge mt-2 -rotate-1 text-ivory">
          The Classroom <span className="text-[#e8622c]">Is On Fire</span>
        </h1>
      </header>

      <div className="page-wrap mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <figure className="relative">
          <div className="burning-frame overflow-hidden rounded-sm">
            <PirateDog className="block h-auto w-full" />
          </div>
          <p className="attendance-sign" aria-label="65% attendance">
            65% ATTENDANCE
          </p>
          <figcaption className="mt-14 font-fell italic text-parchment sm:mt-10">
            An original parody. The dog has 65% attendance and has made peace with it. You do not have to.
          </figcaption>
        </figure>

        <ParchmentPanel as="section" material="parchment-dark" tilt={1} nails={["tl", "tr"]} className="charred p-6 sm:p-8" aria-labelledby="calc-title">
          <h2 id="calc-title" className="font-pirate text-3xl">
            Attendance Calculator
          </h2>
          <p className="mt-1 font-fell">Updates as ye type. Mathematics, unlike the classroom, is not on fire.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField label="Classes held" inputMode="numeric" value={held} onChange={(e) => setHeld(e.target.value)} error={errors.held} />
            <TextField label="Classes attended" inputMode="numeric" value={attended} onChange={(e) => setAttended(e.target.value)} error={errors.attended} />
            <TextField
              className="sm:col-span-2"
              label="Required threshold (%)"
              inputMode="decimal"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              error={errors.threshold}
              hint={`Illustrative default: ${DEFAULT_THRESHOLD}%. Change it to match your own institution's rule.`}
            />
          </div>

          <div className="mt-6" aria-live="polite">
            {result ? (
              <div className={`attendance-result tier-${result.tier}`}>
                <p className="font-type text-xs uppercase tracking-widest">Your attendance</p>
                <p className="font-pirate text-6xl leading-none">{result.percentage.toFixed(2)}%</p>
                <p className="mt-3 font-fell text-2xl italic">“{MESSAGES[result.tier]}”</p>
                <ul className="mt-4 space-y-1 font-type text-sm">
                  {result.tier === "above" ? (
                    <li>
                      You are at or above {t}%. You could miss <strong>{result.canSkip}</strong> more class{result.canSkip === 1 ? "" : "es"} and still
                      stay there. (We do not recommend it.)
                    </li>
                  ) : result.needed === null ? (
                    <li>Reaching 100% is impossible now: those classes have sailed. Even the captain cannot attend the past.</li>
                  ) : (
                    <li>
                      Attend the next <strong>{result.needed}</strong> class{result.needed === 1 ? "" : "es"} in a row to reach {t}%.
                    </li>
                  )}
                  <li>
                    Attended {a} of {h}. Missed {h - a}.
                  </li>
                </ul>
              </div>
            ) : (
              <p className="font-fell text-lg italic">Fix the figures above and the calculator will stop smouldering.</p>
            )}
          </div>
          <p className="mt-5 font-type text-xs">
            Percentage = attended ÷ held × 100. Classes needed = ⌈(threshold × held − 100 × attended) ÷ (100 − threshold)⌉.
          </p>
          <DemoLabel className="mt-3">Calculator only · no attendance records are read or stored</DemoLabel>
        </ParchmentPanel>
      </div>
    </div>
  );
}
