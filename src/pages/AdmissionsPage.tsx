import { useRef, useState, type FormEvent } from "react";
import { useExperience } from "../app/PirateExperienceProvider";
import { DEPARTMENTS, departmentName } from "../data/departments";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePersistedState } from "../hooks/usePersistedState";
import { useTimeouts } from "../hooks/useTimeouts";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { KEYS, isArrayOf, isRecord } from "../lib/storage";
import { makeTicketId } from "../lib/random";
import { BarbosaRegistrar } from "../components/svg/BarbosaRegistrar";
import { WaxSeal } from "../components/svg/WaxSeal";
import { CrookedButton } from "../components/ui/CrookedButton";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { CheckField, ErrorSummary, SelectField, TextField } from "../components/ui/PirateInput";

export const REGISTRAR_LINE = "The student does not choose the college… the college chooses the student. And sometimes the college chooses poorly.";

const QUALIFICATIONS = [
  "Higher secondary (12th standard) or equivalent",
  "Diploma",
  "Bachelor's degree",
  "Self-taught at sea",
  "Other (it's complicated)",
];

const TERMS = ["Monsoon Voyage (August)", "Winter Voyage (January)", "Whenever the tide allows"];

interface FormState {
  fullName: string;
  email: string;
  department: string;
  qualification: string;
  term: string;
  cgpa: string;
  agree: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { fullName: "", email: "", department: "", qualification: "", term: "", cgpa: "", agree: false };

const FIELD_IDS: Record<keyof FormState, string> = {
  fullName: "adm-name",
  email: "adm-email",
  department: "adm-dept",
  qualification: "adm-qual",
  term: "adm-term-0",
  cgpa: "adm-cgpa",
  agree: "adm-agree",
};

function validate(f: FormState): Errors {
  const e: Errors = {};
  const name = f.fullName.trim();
  if (name.length < 2) e.fullName = "Even pirates have names. Please enter yours (at least 2 letters).";
  else if (name.length > 80) e.fullName = "That name is longer than the ship. Please keep it under 80 characters.";
  else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) e.fullName = "Names may contain letters, spaces, apostrophes, dots and hyphens. No skulls.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "That email address would not survive a voyage. Check the @ and the dot.";
  if (!f.department) e.department = "Pick a department. 'Undecided' is not a deck.";
  if (!f.qualification) e.qualification = "Tell us your previous qualification, however damp.";
  if (!f.term) e.term = "Choose when ye wish to sail.";
  const raw = f.cgpa.trim();
  const score = Number(raw);
  if (!raw) e.cgpa = "Enter your score. We promise to judge it only a little.";
  else if (!Number.isFinite(score) || score < 0 || score > 10) e.cgpa = "CGPA must be a number between 0 and 10. Even ours.";
  else if (!/^\d{1,2}(\.\d{1,2})?$/.test(raw)) e.cgpa = "Use at most two decimal places, like 7.25.";
  if (!f.agree) e.agree = "Ye must acknowledge the pirate code. It's more what you'd call guidelines, but still.";
  return e;
}

interface Application {
  id: string;
  dept: string;
  term: string;
  decision: string;
  at: number;
}

const isApplication = (v: unknown): v is Application =>
  isRecord(v) && typeof v.id === "string" && typeof v.dept === "string" && typeof v.term === "string" && typeof v.decision === "string" && typeof v.at === "number";

function decide(cgpa: number): string {
  if (cgpa >= 8.5) return "ACCEPTED (SUSPICIOUSLY)";
  if (cgpa >= 6) return "PROBABLY ACCEPTED";
  return "ACCEPTED ANYWAY (WE NEED THE TUITION)";
}

export default function AdmissionsPage() {
  usePageTitle("Join the Crew");
  const { openPopup, play } = useExperience();
  const reduced = useReducedMotion();
  const { later } = useTimeouts();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Application | null>(null);
  const [history, setHistory] = usePersistedState<Application[]>("session", KEYS.applications, [], isArrayOf(isApplication));
  const summaryRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (attempted) setErrors(validate(next));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (processing) return;
    setAttempted(true);
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      play("thud");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setProcessing(true);
    play("paper");
    later(
      () => {
        const app: Application = {
          id: makeTicketId("BW-ADM"),
          dept: departmentName(form.department),
          term: form.term,
          decision: decide(Number(form.cgpa)),
          at: Date.now(),
        };
        setProcessing(false);
        setResult(app);
        setHistory((h) => [app, ...h].slice(0, 5));
        play("stamp");
        openPopup({
          key: `registrar-${app.id}`,
          variant: "dialogue",
          speaker: "The Registrar",
          title: "The Registrar has reviewed your papers",
          illustration: <BarbosaRegistrar size={200} />,
          body: (
            <>
              <p className="font-fell text-xl italic leading-snug">“{REGISTRAR_LINE}”</p>
              <div className="relative mt-4 border-2 border-dashed border-wreck p-3 font-type text-sm">
                <p>Application: {app.id}</p>
                <p>Deck: {app.dept}</p>
                <p>Sailing: {app.term}</p>
                <span className="stamp anim-stamp absolute -right-2 -top-4 bg-transparent text-base" style={{ ["--stamp-delay" as string]: "0.45s" }}>
                  {app.decision}
                </span>
              </div>
              <p className="mt-3 font-type text-xs">Simulated application. Nothing was sent anywhere; no real admission decision was made.</p>
            </>
          ),
          actions: [
            { label: "Accept my fate", primary: true },
            { label: "Inspect the tuition invoice", to: "/fees" },
          ],
        });
      },
      reduced ? 300 : 1600,
    );
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setAttempted(false);
    setResult(null);
  };

  const errorList = (Object.keys(errors) as (keyof FormState)[]).map((k) => ({ id: FIELD_IDS[k], message: errors[k] as string }));

  return (
    <div className="admissions-deck">
      <header className="page-wrap pt-10">
        <p className="kicker">Recruitment office · Admissions department · same desk</p>
        <h1 className="title-huge mt-2 -rotate-1 text-gold">JOIN THE CREW</h1>
        <p className="mt-3 max-w-xl rotate-[0.6deg] font-fell text-2xl italic text-parchment">Your future awaits. So does a questionable tuition invoice.</p>
        <DemoLabel dark className="mt-4">
          Simulated application · stored only in this browser tab
        </DemoLabel>
      </header>

      <div className="page-wrap mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* the registrar's side of the desk */}
        <div className="flex flex-col gap-8">
          <div className="relative flex items-end gap-2">
            <BarbosaRegistrar size={210} className="shrink-0 drop-shadow-[0_12px_14px_rgba(0,0,0,0.6)]" mood={attempted && errorList.length ? "judging" : "neutral"} />
            <div className="speech-bubble mb-24 -rotate-2">
              {processing
                ? "Hmm. Hmmmmm. Let me squint at this."
                : attempted && errorList.length
                  ? "Incomplete paperwork. I am theatrically disappointed."
                  : "Name? Deck? Will to live? Fill it in, whelp."}
            </div>
          </div>

          <ParchmentPanel material="parchment-dark" tilt={-1.5} torn="bottom" pin className="p-6">
            <h2 className="font-pirate text-3xl">Entry Requirements</h2>
            <p className="font-type text-xs">(revised by the captain, in ink, at night)</p>
            <ul className="mt-4 space-y-3 font-fell text-lg">
              <li>
                <span className="strike-scrawl">Three letters of recommendation</span> <span className="handwritten">One parrot reference</span>
              </li>
              <li>
                <span className="strike-scrawl">Minimum 90% in mathematics</span> <span className="handwritten">Ability to count doubloons</span>
              </li>
              <li>
                <span className="strike-scrawl">Proof of swimming ability</span> <span className="handwritten">Proof of floating ability</span>
              </li>
              <li>
                <span className="strike-scrawl">Entrance examination</span> <span className="handwritten">Entrance plank</span>
              </li>
              <li>Willingness to sign the pirate code ✓</li>
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <span className="stamp text-lg">PROBABLY ACCEPTED</span>
              <WaxSeal size={64} color="green" label="ADM" />
            </div>
          </ParchmentPanel>
        </div>

        {/* the form, rope-bound */}
        <div className="rope-frame relative" style={{ transform: "rotate(0.6deg)" }}>
          <ParchmentPanel material="parchment" className="p-6 sm:p-8">
            {result ? (
              <div className="anim-paper-drop">
                <h2 className="title-mid">Application lodged</h2>
                <p className="mt-2 font-type">{result.id}</p>
                <p className="stamp mt-4 text-xl">{result.decision}</p>
                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-fell text-lg">
                  <dt className="font-bold">Deck</dt>
                  <dd>{result.dept}</dd>
                  <dt className="font-bold">Sailing</dt>
                  <dd>{result.term}</dd>
                </dl>
                <p className="mt-4">
                  A letter will be sent by parrot. The parrot is fictional, as is this admission. Expect nothing; enjoy the suspense.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <CrookedButton variant="plank" onClick={reset} tilt={-1}>
                    Start another application
                  </CrookedButton>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate aria-describedby="adm-privacy" className="space-y-5">
                <h2 className="title-mid">Application to Sail</h2>
                <p id="adm-privacy" className="font-type text-xs">
                  We ask only what this simulation needs. Nothing is sent anywhere; your name and email are not stored.
                </p>
                <div ref={summaryRef} tabIndex={-1} className="outline-none">
                  {attempted && <ErrorSummary errors={errorList} />}
                </div>

                <TextField
                  id={FIELD_IDS.fullName}
                  label="Full name"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  error={errors.fullName}
                  placeholder="e.g. Anne Bonny-ish"
                />
                <TextField
                  id={FIELD_IDS.email}
                  label="Email (for the parrot)"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  error={errors.email}
                  placeholder="you@example.com"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField id={FIELD_IDS.department} label="Intended department" value={form.department} onChange={(e) => update("department", e.target.value)} error={errors.department}>
                    <option value="">Choose a deck…</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField
                    id={FIELD_IDS.qualification}
                    label="Previous qualification"
                    value={form.qualification}
                    onChange={(e) => update("qualification", e.target.value)}
                    error={errors.qualification}
                  >
                    <option value="">Choose one…</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <fieldset aria-describedby={errors.term ? "adm-term-error" : undefined}>
                  <legend className="field-label">Preferred admission term</legend>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {TERMS.map((t, i) => (
                      <label key={t} className="check-row font-fell" htmlFor={`adm-term-${i}`}>
                        <input
                          id={`adm-term-${i}`}
                          type="radio"
                          name="term"
                          value={t}
                          checked={form.term === t}
                          onChange={() => update("term", t)}
                          aria-invalid={errors.term ? true : undefined}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                  {errors.term && (
                    <p id="adm-term-error" className="field-error">
                      {errors.term}
                    </p>
                  )}
                </fieldset>

                <TextField
                  id={FIELD_IDS.cgpa}
                  label="Academic score / CGPA (out of 10)"
                  inputMode="decimal"
                  value={form.cgpa}
                  onChange={(e) => update("cgpa", e.target.value)}
                  error={errors.cgpa}
                  hint="Convert a percentage by dividing by 9.5, or by consulting a parrot."
                  placeholder="e.g. 7.25"
                />

                <CheckField
                  id={FIELD_IDS.agree}
                  label="I acknowledge the (fictional) pirate code: no mutiny during lectures, rum is not a citation, and the captain is always right, even when wrong."
                  checked={form.agree}
                  onChange={(e) => update("agree", e.target.checked)}
                  error={errors.agree}
                />

                {processing && (
                  <div className="space-y-1" role="status">
                    <div className="loader-progress w-full">
                      <div className="loader-progress-fill" />
                    </div>
                    <p className="font-type text-xs">The registrar is reading. Progress may go backwards. This is normal.</p>
                  </div>
                )}

                <div className="pt-2">
                  <CrookedButton type="submit" variant="tape" size="lg" tilt={-1.2} disabled={processing}>
                    {processing ? "Squinting at your papers…" : "Submit application (simulated)"}
                  </CrookedButton>
                </div>
              </form>
            )}
          </ParchmentPanel>
        </div>
      </div>

      {history.length > 0 && (
        <section className="page-wrap mt-12" aria-labelledby="adm-history">
          <h2 id="adm-history" className="font-pirate text-3xl text-gold">
            Your simulated applications this voyage
          </h2>
          <ul className="mt-4 flex flex-wrap gap-4">
            {history.map((h, i) => (
              <li key={h.id} className="sticky-note w-64 p-4" style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
                <p className="font-type text-sm">{h.id}</p>
                <p className="font-fell">{h.dept}</p>
                <p className="font-fell text-sm italic">{h.term}</p>
                <p className="mt-1 font-type text-xs font-bold text-blood">{h.decision}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
