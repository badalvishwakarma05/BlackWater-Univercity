import { useEffect, useState, type FormEvent } from "react";
import { useExperience } from "../app/PirateExperienceProvider";
import { BRIG_FAQS, CAMPUS_RULES, DISCIPLINARY_NOTICES, GRIEVANCE_RESPONSES, LOST_AND_FOUND, REWARDS } from "../data/brig";
import { usePageTitle } from "../hooks/usePageTitle";
import { makeTicketId, pick, pickDifferent } from "../lib/random";
import { Crab, Barrel } from "../components/svg/Props";
import { CrookedButton } from "../components/ui/CrookedButton";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { WoodenNotice } from "../components/ui/WoodenNotice";
import { DemoLabel } from "../components/ui/DemoLabel";
import { SelectField, TextAreaField } from "../components/ui/PirateInput";

function WantedPoster({ notice, reward, number, small = false }: { notice: string; reward: string; number: number; small?: boolean }) {
  return (
    <div className={`wanted-poster ${small ? "p-3" : "p-6 sm:p-8"} text-center`}>
      <p className={`font-blackletter leading-none ${small ? "text-3xl" : "text-6xl sm:text-7xl"}`}>Wanted</p>
      <p className={`font-type uppercase tracking-[0.3em] ${small ? "text-[0.6rem]" : "mt-1 text-xs"}`}>by order of the Brig · No. {String(number).padStart(3, "0")}</p>
      <div className={`mx-auto my-3 border-y-2 border-ink ${small ? "py-2" : "py-4"}`}>
        <p className={`font-fell leading-snug ${small ? "text-sm" : "text-2xl"}`}>{notice}</p>
      </div>
      <p className={`font-pirate ${small ? "text-base" : "text-2xl"}`}>Reward: {reward}</p>
    </div>
  );
}

function AppealProgress({ onDone }: { onDone: () => void }) {
  const steps = [8, 31, 24, 57, 49, 83, 76, 100];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= steps.length - 1) {
      const t = window.setTimeout(onDone, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setI((n) => n + 1), 420);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);
  const backwards = i > 0 && steps[i] < steps[i - 1];
  return (
    <div className="mt-4" role="status">
      <div className="loader-progress w-full">
        <div className="h-full rounded-[5px] transition-[width] duration-300" style={{ width: `${steps[i]}%`, background: "repeating-linear-gradient(60deg,#8d1d28 0 6px,#552024 6px 12px)" }} />
      </div>
      <p className="mt-1 font-type text-xs">
        Reviewing appeal… {steps[i]}% {backwards && "(a committee member changed their mind)"}
      </p>
    </div>
  );
}

const APPEAL_OUTCOMES = [
  "Appeal under review by a committee of three crabs. Two are in favour; one is a crab.",
  "Appeal rejected, with sympathy and a biscuit.",
  "Appeal accepted: marks increased by 0.5, then decreased by 0.5 for asking.",
  "Appeal escalated to the captain, who has chosen to ignore it.",
];

export default function BrigPage() {
  usePageTitle("The Brig");
  const { openPopup, play } = useExperience();
  const [notice, setNotice] = useState(DISCIPLINARY_NOTICES[0]);
  const [reward, setReward] = useState(REWARDS[0]);
  const [posterNo, setPosterNo] = useState(17);
  const [wall, setWall] = useState<{ notice: string; reward: string; number: number }[]>([]);

  const [grievance, setGrievance] = useState("");
  const [grievanceText, setGrievanceText] = useState("");
  const [grievanceError, setGrievanceError] = useState<string>();
  const [grievanceReply, setGrievanceReply] = useState<{ id: string; text: string } | null>(null);

  const [appealExam, setAppealExam] = useState("");
  const [appealReason, setAppealReason] = useState("");
  const [appealStatement, setAppealStatement] = useState("");
  const [appealErrors, setAppealErrors] = useState<Record<string, string>>({});
  const [appealState, setAppealState] = useState<"idle" | "reviewing" | "done">("idle");
  const [appealOutcome, setAppealOutcome] = useState("");

  const regenerate = () => {
    play("paper");
    setNotice((n) => pickDifferent(DISCIPLINARY_NOTICES, n));
    setReward((r) => pickDifferent(REWARDS, r));
    setPosterNo((n) => n + 1);
  };

  const pinIt = () => {
    play("stamp");
    setWall((w) => (w.some((p) => p.number === posterNo) ? w : [{ notice, reward, number: posterNo }, ...w].slice(0, 6)));
  };

  const fileGrievance = (e: FormEvent) => {
    e.preventDefault();
    if (!grievance) {
      setGrievanceError("Choose what ye are aggrieved about. 'Everything' is not on the list, though it should be.");
      return;
    }
    setGrievanceError(undefined);
    play("splash");
    setGrievanceReply({ id: makeTicketId("BRG"), text: pick(GRIEVANCE_RESPONSES) });
  };

  const fileAppeal = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!appealExam) errs.exam = "Choose the examination you are appealing.";
    if (!appealReason) errs.reason = "Choose a reason. 'Vibes' is not yet accepted.";
    if (appealStatement.trim().length < 20) errs.statement = "Write at least 20 characters. The committee likes to feel it has been given something to ignore.";
    setAppealErrors(errs);
    if (Object.keys(errs).length) return;
    play("paper");
    setAppealState("reviewing");
  };

  return (
    <div className="brig-deck">
      <header className="relative overflow-hidden pb-10 pt-12">
        <div className="iron-bars absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="page-wrap relative">
          <p className="kicker">Student services &amp; discipline · bottom deck · mind the bilge</p>
          <h1 className="title-huge mt-2 -rotate-2 text-ivory">The Brig</h1>
          <div className="mt-4 max-w-xl">
            <WoodenNotice title="Abandon hope, all ye who enter" tilt={1.2} headingLevel={2}>
              <p>…to file a grievance, appeal a grade, claim lost property, or be told off. Office open whenever the guard is awake.</p>
            </WoodenNotice>
          </div>
        </div>
      </header>

      {/* disciplinary notice generator */}
      <section className="page-wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]" aria-labelledby="wanted-title">
        <div>
          <h2 id="wanted-title" className="title-mid text-gold">
            Disciplinary Notice Generator
          </h2>
          <p className="mt-2 font-fell text-lg text-parchment">The Brig produces a fresh accusation on demand. Accuracy not guaranteed.</p>
          <div className="relative mt-6 -rotate-1" aria-live="polite">
            <span className="pin" aria-hidden="true" />
            <WantedPoster notice={notice} reward={reward} number={posterNo} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <CrookedButton variant="rust" onClick={regenerate} tilt={-1.5}>
              Generate another notice
            </CrookedButton>
            <CrookedButton variant="parchment" onClick={pinIt} tilt={1.5}>
              Pin it to the wall
            </CrookedButton>
          </div>
        </div>
        <div>
          <h3 className="font-pirate text-2xl text-parchment">The Wall of Shame {wall.length > 0 && `(${wall.length})`}</h3>
          {wall.length === 0 ? (
            <p className="mt-2 font-fell italic text-aged">Bare stone. Pin a poster to begin the shaming.</p>
          ) : (
            <ul className="mt-3 grid grid-cols-2 gap-4">
              {wall.map((p, i) => (
                <li key={p.number} style={{ transform: `rotate(${[-3, 2, -1, 3, -2, 1][i % 6]}deg)` }}>
                  <WantedPoster small notice={p.notice} reward={p.reward} number={p.number} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* grievances + lost and found */}
      <div className="page-wrap mt-16 grid items-start gap-10 lg:grid-cols-2">
        <ParchmentPanel as="section" material="canvas" tilt={-0.6} className="p-6 sm:p-8" aria-labelledby="grievance-title">
          <div className="flex items-start justify-between gap-4">
            <h2 id="grievance-title" className="font-pirate text-3xl">
              Student Grievances
            </h2>
            <Barrel size={64} label="GRIEVE" className="-mt-2 shrink-0" />
          </div>
          <form onSubmit={fileGrievance} noValidate className="mt-3 space-y-4">
            <SelectField label="What ails ye?" value={grievance} onChange={(e) => setGrievance(e.target.value)} error={grievanceError}>
              <option value="">Choose a grievance…</option>
              {["The food", "A faculty member", "Facilities", "A fellow pirate", "The parrot", "Something else entirely"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </SelectField>
            <TextAreaField
              label="Details (optional)"
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              maxLength={400}
              hint="Kept only on this page. Nothing is sent anywhere."
            />
            <CrookedButton type="submit" variant="plank" size="sm" tilt={1}>
              Post into the grievance barrel
            </CrookedButton>
          </form>
          <div aria-live="polite">
            {grievanceReply && (
              <div key={grievanceReply.id} className="anim-paper-drop mt-5 border-2 border-dashed border-wreck p-3">
                <p className="font-type text-xs">Reference {grievanceReply.id}</p>
                <p className="font-fell text-lg">{grievanceReply.text}</p>
              </div>
            )}
          </div>
        </ParchmentPanel>

        <section className="tx-wood rounded-sm p-6 sm:p-8" aria-labelledby="lost-title">
          <h2 id="lost-title" className="font-pirate text-3xl text-gold">
            Lost &amp; Found Crate
          </h2>
          <p className="mt-1 font-fell text-parchment">Items recovered from the bilge, the crow's nest, and one from inside the cannon.</p>
          <ul className="mt-4 space-y-3">
            {LOST_AND_FOUND.map((l, i) => (
              <li key={l.item} className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-black/30 p-3" style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
                <span className="font-fell text-lg">{l.item}</span>
                <CrookedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    play("clink");
                    openPopup({
                      key: `lost-${l.item}`,
                      variant: "wooden",
                      title: "Claim processed",
                      illustration: <Crab size={90} className="anim-crab" />,
                      body: (
                        <>
                          <p className="font-type text-sm">Item: {l.item}</p>
                          <p className="mt-2 text-lg">{l.response}</p>
                        </>
                      ),
                    });
                  }}
                >
                  Claim
                </CrookedButton>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* academic appeals */}
      <ParchmentPanel as="section" material="parchment-dark" tilt={0.5} torn="both" className="page-wrap mt-16 max-w-3xl p-6 sm:p-10" aria-labelledby="appeal-title">
        <h2 id="appeal-title" className="title-mid">
          Academic Appeals
        </h2>
        <DemoLabel className="mt-2">Simulated · no real appeal is filed</DemoLabel>
        {appealState === "idle" && (
          <form onSubmit={fileAppeal} noValidate className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectField label="Examination" value={appealExam} onChange={(e) => setAppealExam(e.target.value)} error={appealErrors.exam}>
              <option value="">Choose…</option>
              {["Navigation 101", "Data Structures & Buried Arrays", "Thermodynamics of Rum", "Ethics of Plunder"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </SelectField>
            <SelectField label="Reason" value={appealReason} onChange={(e) => setAppealReason(e.target.value)} error={appealErrors.reason}>
              <option value="">Choose…</option>
              {["Marking error", "The parrot ate my answer sheet", "Medical (scurvy)", "Other"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </SelectField>
            <TextAreaField
              className="sm:col-span-2"
              label="Statement of appeal"
              value={appealStatement}
              onChange={(e) => setAppealStatement(e.target.value)}
              error={appealErrors.statement}
              maxLength={800}
              hint={`${appealStatement.trim().length}/20 characters minimum`}
            />
            <div className="sm:col-span-2">
              <CrookedButton type="submit" variant="rust" tilt={-1}>
                Submit appeal
              </CrookedButton>
            </div>
          </form>
        )}
        {appealState === "reviewing" && (
          <AppealProgress
            onDone={() => {
              setAppealOutcome(pick(APPEAL_OUTCOMES));
              setAppealState("done");
              play("stamp");
            }}
          />
        )}
        {appealState === "done" && (
          <div className="anim-paper-drop mt-5" role="status">
            <p className="font-fell text-xl">{appealOutcome}</p>
            <CrookedButton
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                setAppealState("idle");
                setAppealStatement("");
              }}
            >
              File another appeal
            </CrookedButton>
          </div>
        )}
      </ParchmentPanel>

      {/* rules + FAQ */}
      <div className="page-wrap mt-16 grid items-start gap-10 lg:grid-cols-2">
        <WoodenNotice title="Campus Rules" tilt={-1} as="section">
          <ol className="mt-2 list-decimal space-y-2 pl-6 font-fell text-lg">
            {CAMPUS_RULES.map((r) => (
              <li key={r.rule}>
                {r.amended ? (
                  <>
                    <span className="strike-scrawl">{r.rule}</span> <span className="handwritten text-gold">{r.amended}</span>
                  </>
                ) : (
                  r.rule
                )}
              </li>
            ))}
          </ol>
        </WoodenNotice>

        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className="title-mid text-gold">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-3">
            {BRIG_FAQS.map((f, i) => (
              <details key={f.q} className="faq-item" style={{ transform: `rotate(${i % 2 ? 0.7 : -0.7}deg)` }}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
