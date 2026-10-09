import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useExperience } from "../app/PirateExperienceProvider";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTimeouts } from "../hooks/useTimeouts";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { randomInt, seededRandom, shuffle } from "../lib/random";
import { JarOfDirt } from "../components/svg/JarOfDirt";
import { WaxSeal } from "../components/svg/WaxSeal";
import { CrookedButton } from "../components/ui/CrookedButton";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { ErrorSummary, SelectField, TextField } from "../components/ui/PirateInput";

export const JAR_LINE = "I’ve got a jar of dirt! And inside that dirt? Your CGPA.";

const TERMS = ["Semester 1 · Monsoon Voyage 2025", "Semester 2 · Winter Voyage 2026", "Semester 3 · Monsoon Voyage 2026"];
const EXAM_TYPES = ["End-semester examination", "Mid-semester examination", "Supplementary (the plank itself)"];
const DEMO_IDS = ["BW-2026-0007", "BW-2025-0420", "BW-2024-1337"];
const ID_PATTERN = /^BW-(20\d{2})-(\d{4})$/;

const SUBJECTS = [
  { name: "Navigation & Discrete Mathematics", credits: 4 },
  { name: "Data Structures & Buried Arrays", credits: 4 },
  { name: "Applied Knot Theory", credits: 3 },
  { name: "Thermodynamics of Rum", credits: 3 },
  { name: "Ethics of Plunder", credits: 2 },
  { name: "Operating Ships", credits: 4 },
  { name: "Professional Swashbuckling Lab", credits: 2 },
  { name: "Sea Shanty Composition", credits: 2 },
  { name: "Cephalopod Diplomacy", credits: 3 },
];

interface SubjectResult {
  name: string;
  credits: number;
  marks: number;
  grade: string;
  points: number;
}

interface DemoRecord {
  id: string;
  term: string;
  examType: string;
  subjects: SubjectResult[];
  gpa: number;
  status: string;
  totalCredits: number;
}

function gradeFor(marks: number): { grade: string; points: number } {
  if (marks >= 90) return { grade: "O", points: 10 };
  if (marks >= 80) return { grade: "A+", points: 9 };
  if (marks >= 70) return { grade: "A", points: 8 };
  if (marks >= 60) return { grade: "B+", points: 7 };
  if (marks >= 50) return { grade: "B", points: 6 };
  if (marks >= 40) return { grade: "C", points: 5 };
  return { grade: "F", points: 0 };
}

/** Same inputs always produce the same illustrative record. Nothing is real. */
function buildRecord(id: string, term: string, examType: string): DemoRecord {
  const rng = seededRandom(`${id}|${term}|${examType}`);
  const subjects = shuffle(SUBJECTS, rng)
    .slice(0, 6)
    .map((s) => {
      const marks = Math.min(99, randomInt(34, 92, rng) + (rng() < 0.3 ? 6 : 0));
      return { ...s, marks, ...gradeFor(marks) };
    });
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const weighted = subjects.reduce((sum, s) => sum + s.points * s.credits, 0);
  const gpa = Math.round((weighted / totalCredits) * 100) / 100;
  const failed = subjects.some((s) => s.grade === "F");
  const status = failed
    ? "Walk the Plank: supplementary exam scheduled at high tide"
    : gpa >= 8.5
      ? "Sailing smoothly (suspiciously)"
      : gpa >= 6.5
        ? "Afloat"
        : "Taking on water";
  return { id, term, examType, subjects, gpa, status, totalCredits };
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  dx: `${Math.round(Math.cos((i / 16) * Math.PI * 2) * (60 + (i % 3) * 30))}px`,
  dy: `${Math.round(-60 - Math.abs(Math.sin((i / 16) * Math.PI * 2)) * 90)}px`,
  delay: `${(i % 5) * 0.12}s`,
}));

export default function ResultsPage() {
  usePageTitle("Walk the Plank");
  const { play } = useExperience();
  const reduced = useReducedMotion();
  const { later } = useTimeouts();
  const [studentId, setStudentId] = useState("");
  const [term, setTerm] = useState("");
  const [examType, setExamType] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"idle" | "digging" | "shown">("idle");
  const [record, setRecord] = useState<DemoRecord | null>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (phase === "digging") return;
    const normalized = studentId.trim().toUpperCase();
    const found: Record<string, string> = {};
    if (!normalized) found["res-id"] = "Enter a student identifier. The logbook cannot search for 'nobody'.";
    else if (!ID_PATTERN.test(normalized))
      found["res-id"] = "Arrr, that identifier be in no logbook format we recognise. Use the form BW-YYYY-NNNN, e.g. BW-2026-0007.";
    else {
      const year = Number(ID_PATTERN.exec(normalized)?.[1]);
      if (year < 2015 || year > 2026) found["res-id"] = "That year of enrolment is outside our records (2015 to 2026). The older logbooks sank.";
    }
    if (!term) found["res-term"] = "Choose an examination term.";
    if (!examType) found["res-type"] = "Choose an examination type.";
    setErrors(found);
    if (Object.keys(found).length) {
      play("thud");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStudentId(normalized);
    setPhase("digging");
    setRecord(null);
    play("bubble");
    later(
      () => {
        setRecord(buildRecord(normalized, term, examType));
        setPhase("shown");
        play("paper");
        requestAnimationFrame(() => resultRef.current?.focus());
      },
      reduced ? 700 : 2600,
    );
  };

  const again = () => {
    setPhase("idle");
    setRecord(null);
    requestAnimationFrame(() => idRef.current?.focus());
  };

  const errorList = Object.entries(errors).map(([id, message]) => ({ id, message }));

  return (
    <div>
      {/* results board hanging from ropes */}
      <header className="page-wrap pt-6">
        <div className="hanging-board">
          <span className="hanging-rope left" aria-hidden="true" />
          <span className="hanging-rope right" aria-hidden="true" />
          <div className="tx-plank anim-swing-slow rounded-sm px-6 py-5 text-center">
            <p className="kicker text-parchment">Examination results portal · unstable · leaking</p>
            <h1 className="title-huge text-gold">Walk the Plank</h1>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center font-fell text-xl text-parchment">
          The ship's logbook is connected to a broken academic database. Enter a demonstration student identifier and the jar will dig up a
          record.
        </p>
        <div className="mt-3 text-center">
          <DemoLabel dark>Demonstration data only · no real examination records</DemoLabel>
        </div>
      </header>

      <div className="page-wrap mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <ParchmentPanel as="section" material="lined" tilt={-0.8} className="p-6 pl-14 sm:p-8 sm:pl-16" aria-labelledby="lookup-title">
          <h2 id="lookup-title" className="font-pirate text-3xl">
            Consult the Logbook
          </h2>
          <form onSubmit={onSubmit} noValidate className="mt-4 space-y-5">
            <div ref={summaryRef} tabIndex={-1} className="outline-none">
              <ErrorSummary errors={errorList} title="The logbook rejects your query:" />
            </div>
            <TextField
              id="res-id"
              ref={idRef}
              label="Student identifier"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              error={errors["res-id"]}
              autoComplete="off"
              spellCheck={false}
              placeholder="BW-2026-0007"
              hint={
                <>
                  Demo identifiers:{" "}
                  {DEMO_IDS.map((d, i) => (
                    <span key={d}>
                      <button type="button" className="link-ink" onClick={() => setStudentId(d)}>
                        {d}
                      </button>
                      {i < DEMO_IDS.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  . Any BW-YYYY-NNNN works.
                </>
              }
            />
            <SelectField id="res-term" label="Examination term" value={term} onChange={(e) => setTerm(e.target.value)} error={errors["res-term"]}>
              <option value="">Choose a term…</option>
              {TERMS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </SelectField>
            <SelectField id="res-type" label="Examination type" value={examType} onChange={(e) => setExamType(e.target.value)} error={errors["res-type"]}>
              <option value="">Choose a type…</option>
              {EXAM_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </SelectField>
            <CrookedButton type="submit" variant="rust" size="lg" tilt={-1.2} disabled={phase === "digging"}>
              {phase === "digging" ? "Digging…" : "View Results"}
            </CrookedButton>
          </form>
        </ParchmentPanel>

        <div ref={resultRef} tabIndex={-1} className="outline-none" aria-live="polite">
          {phase === "idle" && (
            <div className="results-empty">
              <JarOfDirt size={130} level={0.35} label="CGPA?" />
              <p className="font-fell text-xl italic text-parchment">The jar waits. It has always waited.</p>
            </div>
          )}

          {phase === "digging" && (
            <div className="results-empty" role="status">
              <div className="relative">
                <JarOfDirt size={170} level={0.8} label="YOUR CGPA" lidOpen settling />
                {!reduced &&
                  PARTICLES.map((p, i) => (
                    <span
                      key={i}
                      className="dirt-particle"
                      style={{ left: "45%", top: "30%", ["--dx" as string]: p.dx, ["--dy" as string]: p.dy, animationDelay: p.delay } as CSSProperties}
                      aria-hidden="true"
                    />
                  ))}
              </div>
              <p className="jar-line">{JAR_LINE}</p>
            </div>
          )}

          {phase === "shown" && record && (
            <div className="anim-paper-drop">
              <p className="jar-line mb-4 text-center">{JAR_LINE}</p>
              <ParchmentPanel material="damp" tilt={0.8} nails={["tl", "tr"]} className="record p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-type text-xs uppercase tracking-widest">Ship's manifest · academic record</p>
                    <h2 className="font-pirate text-3xl">{record.id}</h2>
                    <p className="font-fell">
                      {record.term} · {record.examType}
                    </p>
                  </div>
                  <WaxSeal size={64} color="black" label="EXAM" />
                </div>
                <p className="mt-2">
                  <DemoLabel>Illustrative demo record · generated, not retrieved</DemoLabel>
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[30rem] font-type text-sm">
                    <caption className="sr-only">Demonstration results for {record.id}</caption>
                    <thead>
                      <tr className="border-b-2 border-ink text-left">
                        <th scope="col" className="py-1 pr-2">Subject</th>
                        <th scope="col" className="py-1 pr-2 text-right">Credits</th>
                        <th scope="col" className="py-1 pr-2 text-right">Marks</th>
                        <th scope="col" className="py-1 pr-2 text-center">Grade</th>
                        <th scope="col" className="py-1 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.subjects.map((s) => (
                        <tr key={s.name} className="border-b border-dashed border-wreck/60">
                          <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                            {s.name}
                          </th>
                          <td className="py-1.5 pr-2 text-right">{s.credits}</td>
                          <td className="py-1.5 pr-2 text-right">{s.marks}</td>
                          <td className={`py-1.5 pr-2 text-center font-bold ${s.grade === "F" ? "text-blood" : ""}`}>
                            {s.grade}
                            {s.grade === "F" && <span className="sr-only"> (fail)</span>}
                          </td>
                          <td className="py-1.5 text-right">{s.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-type text-xs uppercase tracking-widest">Demo GPA ({record.totalCredits} credits)</p>
                    <p className="font-pirate text-5xl leading-none">{record.gpa.toFixed(2)}</p>
                  </div>
                  <p className={`stamp max-w-[17rem] text-center text-xs leading-snug ${record.status.startsWith("Walk") ? "" : "gold"}`}>{record.status}</p>
                </div>
                <p className="mt-6 font-type text-xs">
                  GPA = Σ(grade points × credits) ÷ Σ credits. Grade points: O 10, A+ 9, A 8, B+ 7, B 6, C 5, F 0.
                </p>
              </ParchmentPanel>
              <div className="mt-6">
                <CrookedButton variant="plank" onClick={again} tilt={1}>
                  Repeat lookup
                </CrookedButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
