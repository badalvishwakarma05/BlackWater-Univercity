import { useState, type CSSProperties } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useExperience } from "../app/PirateExperienceProvider";
import { CAREER_TIPS, DEPT_PLACEMENT, EMPLOYERS, PLACEMENT_STATS, PREP_RESOURCES, RECRUITMENT_NOTICES } from "../data/placements";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { pickDifferent } from "../lib/random";
import { JarOfDirt } from "../components/svg/JarOfDirt";
import { PirateRecruiter } from "../components/svg/PirateRecruiter";
import { WaxSeal } from "../components/svg/WaxSeal";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { CheckField, TextField } from "../components/ui/PirateInput";

export const PLACEMENTS_TITLE = "I’ve got a jar of dirt… and a 6.5 CGPA. Still got the job.";

const BURST = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  return {
    dx: `${Math.round(Math.cos(angle) * (70 + (i % 4) * 25))}px`,
    dy: `${Math.round(Math.sin(angle) * 60 - 90 - (i % 3) * 20)}px`,
    delay: `${(i % 4) * 0.05}s`,
  };
});

function EligibilityCalculator() {
  const [cgpa, setCgpa] = useState("6.5");
  const [backlogs, setBacklogs] = useState("0");
  const [attendance, setAttendance] = useState("65");
  const [swims, setSwims] = useState(false);

  const c = Number(cgpa);
  const b = Number(backlogs);
  const at = Number(attendance);
  const errors = {
    cgpa: /^\d{1,2}(\.\d{1,2})?$/.test(cgpa.trim()) && c >= 0 && c <= 10 ? undefined : "CGPA must be between 0 and 10 (two decimals max).",
    backlogs: /^\d{1,2}$/.test(backlogs.trim()) ? undefined : "Backlogs must be a whole number from 0 to 99.",
    attendance: /^\d{1,3}(\.\d+)?$/.test(attendance.trim()) && at >= 0 && at <= 100 ? undefined : "Attendance must be a percentage from 0 to 100.",
  };
  const valid = !errors.cgpa && !errors.backlogs && !errors.attendance;

  return (
    <ParchmentPanel as="section" material="lined" tilt={-0.5} className="p-6 pl-14 sm:p-8 sm:pl-16" aria-labelledby="elig-title">
      <h2 id="elig-title" className="font-pirate text-3xl">
        Eligibility Calculator
      </h2>
      <p className="font-fell">Which fictional employers would even look at ye?</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <TextField label="CGPA (0–10)" inputMode="decimal" value={cgpa} onChange={(e) => setCgpa(e.target.value)} error={errors.cgpa} />
        <TextField label="Active backlogs" inputMode="numeric" value={backlogs} onChange={(e) => setBacklogs(e.target.value)} error={errors.backlogs} />
        <TextField label="Attendance %" inputMode="decimal" value={attendance} onChange={(e) => setAttendance(e.target.value)} error={errors.attendance} />
      </div>
      <CheckField className="mt-4" label="I can swim (Kraken Cloud Services insists)" checked={swims} onChange={(e) => setSwims(e.target.checked)} />
      <div className="mt-5" aria-live="polite">
        {valid ? (
          <ul className="space-y-2">
            {EMPLOYERS.map((emp) => {
              const reasons: string[] = [];
              if (c < emp.minCgpa) reasons.push(`needs CGPA ${emp.minCgpa}+`);
              if (b > emp.maxBacklogs) reasons.push(`allows at most ${emp.maxBacklogs} backlog${emp.maxBacklogs === 1 ? "" : "s"}`);
              if (at < emp.minAttendance) reasons.push(`needs ${emp.minAttendance}% attendance`);
              if (emp.requiresSwimming && !swims) reasons.push("requires swimming");
              const ok = reasons.length === 0;
              return (
                <li key={emp.id} className="flex items-start gap-2">
                  {ok ? <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-seaweed" aria-hidden="true" /> : <XCircle size={20} className="mt-0.5 shrink-0 text-blood" aria-hidden="true" />}
                  <span>
                    <strong>{emp.name}</strong>: {ok ? "Eligible. Godspeed." : `Not eligible (${reasons.join(", ")}).`}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="font-fell italic">Correct the figures above to consult the recruiters.</p>
        )}
      </div>
    </ParchmentPanel>
  );
}

export default function PlacementsPage() {
  usePageTitle("Placements");
  const { play } = useExperience();
  const reduced = useReducedMotion();
  const [tip, setTip] = useState<string | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  const shake = () => {
    play("bubble");
    setTip((t) => pickDifferent(CAREER_TIPS, t ?? undefined));
    setBurstKey((k) => k + 1);
  };

  const maxPct = Math.max(...DEPT_PLACEMENT.map((d) => d.pct));

  return (
    <div>
      <header className="page-wrap pt-10">
        <p className="kicker">The Treasure Vault of Questionable Offers · Placement Cell</p>
        <h1 className="placements-title mt-3">{PLACEMENTS_TITLE}</h1>
        <DemoLabel dark className="mt-5">
          All employers, figures and packages are fictional demonstration data
        </DemoLabel>
      </header>

      {/* jar, contract, recruiter */}
      <section className="page-wrap mt-10 grid items-end gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.8fr)]" aria-label="Career tips from the jar">
        <div className="flex flex-col items-center">
          <div className="relative">
            <button type="button" className="big-jar" onClick={shake} aria-describedby="jar-tip" data-rum="">
              <span className="sr-only">Shake the jar of dirt for a career tip</span>
              <JarOfDirt size={210} level={0.72} label="CAREER DIRT" settling={burstKey > 0} key={burstKey} />
            </button>
            {!reduced &&
              burstKey > 0 &&
              BURST.map((p, i) => (
                <span
                  key={`${burstKey}-${i}`}
                  className="dirt-particle"
                  style={{ left: "48%", top: "28%", ["--dx" as string]: p.dx, ["--dy" as string]: p.dy, animationDelay: p.delay } as CSSProperties}
                  aria-hidden="true"
                />
              ))}
          </div>
          <p className="mt-2 font-type text-xs text-parchment">Click the jar. It knows things.</p>
        </div>

        <div>
          <div id="jar-tip" aria-live="polite" className="min-h-[7rem]">
            {tip ? (
              <ParchmentPanel key={tip} material="parchment" tilt={-1.5} pin className="anim-paper-drop p-5">
                <p className="font-type text-xs uppercase tracking-widest text-rust">The jar says</p>
                <p className="mt-1 font-fell text-2xl italic leading-snug">“{tip}”</p>
              </ParchmentPanel>
            ) : (
              <p className="font-fell text-xl italic text-parchment">The jar is silent. Shake it.</p>
            )}
          </div>
          <ParchmentPanel material="parchment-dark" tilt={1.8} torn="bottom" className="contract mt-6 p-5">
            <p className="text-center font-blackletter text-2xl">Contract of Employment</p>
            <p className="text-center font-type text-[0.65rem] uppercase tracking-widest">(suspicious)</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 font-fell text-sm">
              <li>The Employee shall work hard, or at least hardly.</li>
              <li>Salary is payable in coin, compliments, or exposure to sea air.</li>
              <li>The Employer may change these terms at any tide.</li>
              <li className="text-[0.62rem] leading-tight">
                By reading this clause the Employee agrees to a 14-year bond, one cursed medallion, and to never say “it works on my machine” in
                standup.
              </li>
            </ol>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-fell italic">Sign here: ______________</p>
                <p className="font-type text-[0.6rem]">(in blood or blue ink)</p>
              </div>
              <WaxSeal size={52} color="black" label="HR" />
            </div>
          </ParchmentPanel>
        </div>

        <div className="flex justify-center">
          <PirateRecruiter size={230} className="drop-shadow-[0_12px_14px_rgba(0,0,0,0.6)]" />
        </div>
      </section>

      {/* dashboard */}
      <section className="relative my-16 py-12" aria-labelledby="dash-title">
        <div className="tx-deep seaweed-fringe absolute inset-0" aria-hidden="true" />
        <div className="page-wrap relative">
          <div className="flex flex-wrap items-center gap-4">
            <h2 id="dash-title" className="title-mid text-gold">
              Placement Dashboard
            </h2>
            <DemoLabel dark>Demonstration figures · not real outcomes</DemoLabel>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLACEMENT_STATS.map((s, i) => (
              <li key={s.label} className="dash-tile" style={{ transform: `rotate(${[-1, 1.2, -0.4, 0.9][i]}deg)` }}>
                <p className="font-type text-xs uppercase tracking-wider">{s.label}</p>
                <p className="font-pirate text-5xl leading-none text-gold">{s.value}</p>
                <p className="mt-1 font-fell text-sm italic">{s.note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <figure className="rounded-sm border-2 border-weathered bg-black/30 p-5">
              <figcaption className="font-pirate text-2xl">Share of crew placed, by department (demo %)</figcaption>
              <ul className="mt-4 space-y-3">
                {DEPT_PLACEMENT.map((d) => (
                  <li key={d.dept} className="bar-row" title={`${d.dept}: ${d.pct}% (demo)`}>
                    <span className="bar-label">{d.dept}</span>
                    <span className="bar-track" aria-hidden="true">
                      <span className="bar-fill" style={{ width: `${(d.pct / maxPct) * 100}%` }} />
                    </span>
                    <span className="bar-value">{d.pct}%</span>
                  </li>
                ))}
              </ul>
              <details className="mt-4 font-type text-sm">
                <summary className="cursor-pointer">View as a table</summary>
                <table className="mt-2 w-full">
                  <thead>
                    <tr className="text-left">
                      <th scope="col">Department</th>
                      <th scope="col" className="text-right">
                        Placed (demo %)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEPT_PLACEMENT.map((d) => (
                      <tr key={d.dept}>
                        <td>{d.dept}</td>
                        <td className="text-right">{d.pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </figure>

            <div className="notice-board tx-wood p-5">
              <span className="nail tl" aria-hidden="true" />
              <span className="nail tr" aria-hidden="true" />
              <h3 className="font-pirate text-2xl text-gold">Recruitment Notices</h3>
              <ul className="mt-3 space-y-3">
                {RECRUITMENT_NOTICES.map((n, i) => (
                  <li key={n.company} className="sticky-note p-3" style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
                    <p className="font-bold">{n.company}</p>
                    <p className="text-sm">{n.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* employers */}
      <section className="page-wrap" aria-labelledby="emp-title">
        <h2 id="emp-title" className="title-mid text-ivory">
          Visiting Employers <span className="font-type text-sm text-brine">(all fictional)</span>
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EMPLOYERS.map((e, i) => (
            <li key={e.id}>
              <article className="business-card h-full" style={{ transform: `rotate(${[-1.4, 1, -0.6, 1.8, -1][i]}deg)` }}>
                <span className="pin" aria-hidden="true" />
                <h3 className="font-pirate text-2xl leading-none">{e.name}</h3>
                <p className="mt-1 font-fell italic">“{e.motto}”</p>
                <p className="mt-3 font-type text-sm">Role: {e.role}</p>
                <p className="font-type text-sm">
                  Demo package: ₹{e.packageLpa} LPA + {e.perk}
                </p>
                <p className="mt-2 font-type text-xs opacity-80">
                  Wants: CGPA {e.minCgpa}+, ≤{e.maxBacklogs} backlogs, {e.minAttendance}%+ attendance{e.requiresSwimming ? ", swimming" : ""}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* prep + resume + eligibility */}
      <div className="page-wrap mt-16 grid items-start gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <ParchmentPanel as="section" material="canvas" tilt={0.8} className="p-6" aria-labelledby="prep-title">
            <h2 id="prep-title" className="font-pirate text-3xl">
              Interview Preparation
            </h2>
            <ul className="mt-3 space-y-3">
              {PREP_RESOURCES.map((p) => (
                <li key={p.title}>
                  <p className="font-bold">{p.title}</p>
                  <p className="text-sm">{p.detail}</p>
                </li>
              ))}
            </ul>
          </ParchmentPanel>
          <ParchmentPanel as="section" material="damp" tilt={-1.2} pin className="p-6" aria-labelledby="resume-title">
            <h2 id="resume-title" className="font-pirate text-3xl">
              Resume Review
            </h2>
            <p className="mt-2">
              Hours: Tuesdays at low tide. Bring two copies, one of them waterproof. The reviewer will circle every adjective in red ink and
              ask, “but what did ye actually build?”
            </p>
            <p className="mt-2 font-type text-sm">Tip: one page. Projects with outcomes. No photographs of your parrot.</p>
          </ParchmentPanel>
        </div>
        <EligibilityCalculator />
      </div>
    </div>
  );
}
