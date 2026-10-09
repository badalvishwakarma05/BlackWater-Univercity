import { useState, type FormEvent, type ReactNode } from "react";
import { AlertOctagon, Coins, Crown, HelpCircle, Monitor, Wrench } from "lucide-react";
import { TICKET_STATUSES, useExperience, type TicketStatus } from "../app/PirateExperienceProvider";
import { usePageTitle } from "../hooks/usePageTitle";
import { makeTicketId, pick, pickDifferent, uid } from "../lib/random";
import { ParrotMascot } from "../components/svg/ParrotMascot";
import { Telephone } from "../components/svg/Props";
import { CrookedButton } from "../components/ui/CrookedButton";
import { DemoLabel } from "../components/ui/DemoLabel";
import { CheckField, SelectField, TextAreaField, TextField } from "../components/ui/PirateInput";

/* ------------------------------------------------------------------ */
/* Shared bits for the six hotline forms                               */
/* ------------------------------------------------------------------ */

function useFileTicket() {
  const { addTicket, play } = useExperience();
  return (type: string, summary: string, status: TicketStatus) => {
    const id = makeTicketId("MH");
    addTicket({ id, type, summary: summary.slice(0, 140), status });
    play("ring");
    return id;
  };
}

function Filed({ id, children, onClose }: { id: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="anim-paper-drop" role="status">
      <p className="font-type text-sm">Ticket {id} created · see the tracker below</p>
      <div className="mt-2 text-lg">{children}</div>
      <button type="button" className="popup-action is-primary mt-4" onClick={onClose} data-autofocus>
        Hang up
      </button>
    </div>
  );
}

interface FormProps {
  onClose: () => void;
}

function EmergencyForm({ onClose }: FormProps) {
  const file = useFileTicket();
  const [kind, setKind] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState<string | null>(null);
  if (done) return <Filed id={done} onClose={onClose}>Emergency logged. A crab has been dispatched. The crab is walking sideways towards your problem.</Filed>;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!kind) return setError("Choose the kind of emergency.");
    setDone(file("Academic emergency", `${kind}${details.trim() ? `: ${details.trim()}` : ""}`, "Under investigation by a crab"));
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <SelectField label="Nature of the emergency" value={kind} onChange={(e) => setKind(e.target.value)} error={error}>
        <option value="">Choose…</option>
        {["Exam tomorrow, not started", "Lab partner fell overboard", "Laptop swallowed by the sea", "Assignment portal is on fire", "Other"].map((o) => (
          <option key={o}>{o}</option>
        ))}
      </SelectField>
      <TextAreaField label="Details (optional)" value={details} onChange={(e) => setDetails(e.target.value)} rows={3} maxLength={300} />
      <CrookedButton type="submit" variant="rust" size="sm">
        Sound the alarm
      </CrookedButton>
    </form>
  );
}

function FeesComplaintForm({ onClose }: FormProps) {
  const file = useFileTicket();
  const [outrage, setOutrage] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState<{ id: string; outrage: number } | null>(null);
  if (done)
    return (
      <Filed id={done.id} onClose={onClose}>
        Thank you for your feedback. To cover the cost of reading it, your fees have been increased by ₹{done.outrage * 100} (demo). Finance is
        thrilled to hear from you.
      </Filed>
    );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 5) return setError("Tell Finance what upset ye (at least 5 characters). They are eager to listen, and charge.");
    setDone({ id: file("Fee complaint", `Outrage ${outrage}/10: ${text.trim()}`, pick(TICKET_STATUSES)), outrage });
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="outrage" className="field-label">
          How outraged are ye? <span className="font-type">{outrage}/10</span>
        </label>
        <input id="outrage" type="range" min={1} max={10} value={outrage} onChange={(e) => setOutrage(Number(e.target.value))} className="w-full accent-[#8d1d28]" />
      </div>
      <TextAreaField label="Your complaint" value={text} onChange={(e) => setText(e.target.value)} error={error} rows={3} maxLength={300} />
      <CrookedButton type="submit" variant="gold" size="sm">
        Complain (fees may apply)
      </CrookedButton>
    </form>
  );
}

const EQUIPMENT = ["Projector", "Ceiling fan", "Chair (wobbly)", "Whiteboard marker (dry)", "HDMI cable", "The entire wall"];

function EquipmentForm({ onClose }: FormProps) {
  const file = useFileTicket();
  const [items, setItems] = useState<string[]>([]);
  const [room, setRoom] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  if (done) return <Filed id={done} onClose={onClose}>Report received. A crab is investigating. It has requested a smaller screwdriver.</Filed>;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (items.length === 0) errs.items = "Tick at least one broken thing. There are many to choose from.";
    if (!room.trim()) errs.room = "Which room? Even 'the cursed one' helps.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setDone(file("Broken equipment", `${room.trim()}: ${items.join(", ")}`, "Under investigation by a crab"));
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <fieldset>
        <legend className="field-label">What is broken?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {EQUIPMENT.map((eq) => (
            <CheckField
              key={eq}
              label={eq}
              checked={items.includes(eq)}
              onChange={(e) => setItems((s) => (e.target.checked ? [...s, eq] : s.filter((x) => x !== eq)))}
            />
          ))}
        </div>
        {errors.items && <p className="field-error">{errors.items}</p>}
      </fieldset>
      <TextField label="Room" value={room} onChange={(e) => setRoom(e.target.value)} error={errors.room} placeholder="e.g. Lecture Hall 3 (the damp one)" />
      <CrookedButton type="submit" variant="plank" size="sm">
        Report the wreckage
      </CrookedButton>
    </form>
  );
}

const IT_STEPS = [
  "Have ye tried turning the ship off and on again?",
  "Is the ship plugged in? (Check the anchor.)",
  "Have ye tried shouting at it in a stern voice?",
];

function ImaginaryItForm({ onClose }: FormProps) {
  const file = useFileTicket();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState<string | null>(null);
  if (done)
    return (
      <Filed id={done} onClose={onClose}>
        IT has received your issue. Please note that IT is imaginary. Your ticket has been handed to a parrot, who is the closest thing we
        have.
      </Filed>
    );
  const answer = (a: string) => {
    const next = [...answers, a];
    setAnswers(next);
    if (step + 1 < IT_STEPS.length) setStep(step + 1);
    else setDone(file("Imaginary IT", `Troubleshooting: ${next.join(" / ")}`, "Received by a parrot"));
  };
  return (
    <div>
      <p className="font-type text-xs">Step {step + 1} of {IT_STEPS.length}</p>
      <p className="mt-1 text-xl" aria-live="polite">
        {IT_STEPS[step]}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <CrookedButton variant="tape" size="sm" onClick={() => answer("Yes")}>
          Yes
        </CrookedButton>
        <CrookedButton variant="tape" size="sm" tilt={1.5} onClick={() => answer("No")}>
          No
        </CrookedButton>
        <CrookedButton variant="ghost" size="sm" tilt={-1} onClick={() => answer("What is a ship")}>
          What is a ship?
        </CrookedButton>
      </div>
    </div>
  );
}

const CAPTAIN_ADDENDA = [
  "He did, however, enjoy your handwriting.",
  "He has forwarded it to the previous captain, who is at the bottom of the sea.",
  "He asks that you resubmit it in the form of a sea shanty.",
  "He has framed it. It hangs in the brig.",
];

function CaptainForm({ onClose }: FormProps) {
  const file = useFileTicket();
  const [q, setQ] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState<{ id: string; addendum: string } | null>(null);
  if (done)
    return (
      <Filed id={done.id} onClose={onClose}>
        The captain has reviewed your request and chosen to ignore it. {done.addendum}
      </Filed>
    );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim().length < 5) return setError("Ask a proper question, at least 5 characters. The captain respects effort, in theory.");
    setDone({ id: file("Question for the captain", q.trim(), "Escalated to the captain"), addendum: pick(CAPTAIN_ADDENDA) });
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextAreaField label="Your question for the captain" value={q} onChange={(e) => setQ(e.target.value)} error={error} rows={3} maxLength={300} />
      <CrookedButton type="submit" variant="rust" size="sm">
        Send it up to the quarterdeck
      </CrookedButton>
    </form>
  );
}

function MeetingForm({ onClose }: FormProps) {
  const file = useFileTicket();
  const [where, setWhere] = useState("");
  const [parrots, setParrots] = useState("0");
  const [level, setLevel] = useState("Mildly suspicious");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  if (done) return <Filed id={done} onClose={onClose}>Report filed. Unfortunately, it was filed in the meeting you reported, and the meeting has now sunk.</Filed>;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!where) errs.where = "Where is this meeting taking place?";
    if (!/^\d{1,2}$/.test(parrots.trim())) errs.parrots = "Number of parrots must be a whole number from 0 to 99.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setDone(file("Suspicious faculty meeting", `${where}, ${parrots} parrot(s), ${level.toLowerCase()}`, pick(["Lost at sea", "Closed because the office is on fire"] as const)));
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <SelectField label="Location" value={where} onChange={(e) => setWhere(e.target.value)} error={errors.where}>
        <option value="">Choose…</option>
        {["Faculty cabins", "The legendary staff room", "Behind the cafeteria", "Inside the cannon", "Unknown (we heard chanting)"].map((o) => (
          <option key={o}>{o}</option>
        ))}
      </SelectField>
      <TextField label="Parrots present" inputMode="numeric" value={parrots} onChange={(e) => setParrots(e.target.value)} error={errors.parrots} />
      <fieldset>
        <legend className="field-label">Suspicion level</legend>
        <div className="flex flex-wrap gap-4">
          {["Mildly suspicious", "Very suspicious", "They were wearing robes"].map((l) => (
            <label key={l} className="check-row">
              <input type="radio" name="suspicion" checked={level === l} onChange={() => setLevel(l)} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <CrookedButton type="submit" variant="parchment" size="sm">
        Blow the whistle
      </CrookedButton>
    </form>
  );
}

/* ------------------------------------------------------------------ */

const ACTIONS = [
  { id: "emergency", label: "Report an academic emergency", icon: AlertOctagon, Form: EmergencyForm, variant: "error" as const },
  { id: "fees", label: "Complain about fees", icon: Coins, Form: FeesComplaintForm, variant: "rum" as const },
  { id: "equipment", label: "Report broken classroom equipment", icon: Wrench, Form: EquipmentForm, variant: "wooden" as const },
  { id: "it", label: "Contact imaginary IT", icon: Monitor, Form: ImaginaryItForm, variant: "parchment" as const },
  { id: "captain", label: "Ask the captain a question", icon: Crown, Form: CaptainForm, variant: "wax" as const },
  { id: "meeting", label: "Report a suspicious faculty meeting", icon: HelpCircle, Form: MeetingForm, variant: "dialogue" as const },
];

const PARROT_LINES = [
  "Your call is important to us. Not very, but somewhat.",
  "Squawk! Please hold. The hold music is also a parrot.",
  "You are caller number 4,812. Squawk.",
  "All our operators are currently parrots.",
  "This call may be recorded for training purposes. The parrot will learn your words.",
];

const STATUS_TONE: Record<TicketStatus, string> = {
  "Lost at sea": "text-[#7fb5c9]",
  "Received by a parrot": "text-[#7fd08a]",
  "Under investigation by a crab": "text-[#e08070]",
  "Escalated to the captain": "text-gold",
  "Closed because the office is on fire": "text-[#ff9b6b]",
};

const UNANSWERED = [
  "Wi-Fi in Block D?",
  "Who ate my labelled stew",
  "Projector, again",
  "Why is the library haunted",
  "Refund for the plank",
  "Lost: will to live",
  "The parrot is swearing in lectures",
  "Hot water??",
  "Is the Kraken a student",
];

export default function MutinyHotlinePage() {
  usePageTitle("Mutiny Hotline");
  const { openPopup, closePopup, tickets, updateTicket, clearTickets, notify, play } = useExperience();
  const [parrotLine, setParrotLine] = useState(PARROT_LINES[0]);

  const launch = (a: (typeof ACTIONS)[number]) => {
    play("ring");
    const id = uid();
    const close = () => closePopup(id);
    openPopup({
      id,
      key: `hotline-${a.id}`,
      variant: a.variant,
      title: a.label,
      speaker: a.variant === "dialogue" ? "Parrot operator, line 3" : undefined,
      illustration: a.variant === "dialogue" ? <ParrotMascot size={150} headset /> : undefined,
      body: <a.Form onClose={close} />,
    });
  };

  const checkStatus = (ticketId: string, current: TicketStatus) => {
    play("squawk");
    const next = pickDifferent(TICKET_STATUSES, current);
    updateTicket(ticketId, next);
    notify({ title: `Ticket ${ticketId}`, message: `New status: ${next}.` });
  };

  return (
    <div>
      <header className="page-wrap pt-10">
        <p className="kicker">Support centre · below the waterline · lines open (technically)</p>
        <h1 className="title-huge mt-2 -rotate-1 text-ivory">
          Mutiny <span className="text-gold">Hotline</span>
        </h1>
        <DemoLabel dark className="mt-4">
          Fictional support centre · ticket statuses are jokes, not service commitments
        </DemoLabel>
      </header>

      <section className="page-wrap mt-8 grid items-center gap-8 md:grid-cols-[auto_1fr]" aria-label="The switchboard operator">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="anim-phone-ring rounded-md"
            onClick={() => {
              play("ring");
              setParrotLine((l) => pickDifferent(PARROT_LINES, l));
            }}
            aria-label="Pick up the ringing telephone"
            data-rum=""
          >
            <Telephone size={170} />
          </button>
          <ParrotMascot size={130} headset title="The parrot call operator, wearing a headset" />
        </div>
        <div className="speech-bubble max-w-md text-xl" aria-live="polite">
          {parrotLine}
        </div>
      </section>

      {/* tangled wires */}
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="mt-6 h-12 w-full" aria-hidden="true">
        <path d="M0 30c80-40 120 40 200 0s100-30 160 10 120-50 200-10 60 40 140 0 120-30 200 10 80-20 140-10 100 30 160 0" stroke="#1a1414" strokeWidth="4" fill="none" />
        <path d="M0 40c60 20 140-30 220 0s120 20 180-20 140 40 220 10 100-30 180 0 140 20 200-10 120 10 200 20" stroke="#8d1d28" strokeWidth="3" fill="none" />
        <path d="M0 20c100 30 160-10 240 10s140-30 220 0 120 30 200-10 160 10 240 20 140-20 300-10" stroke="#c39a43" strokeWidth="2" fill="none" />
      </svg>

      <section className="page-wrap mt-6" aria-labelledby="switch-title">
        <h2 id="switch-title" className="title-mid text-gold">
          The Switchboard
        </h2>
        <ul className="switchboard mt-6">
          {ACTIONS.map((a, i) => (
            <li key={a.id}>
              <button type="button" className="switch-plate" onClick={() => launch(a)} style={{ transform: `rotate(${[-1.5, 1, -0.5, 2, -2, 0.8][i]}deg)` }} data-rum="">
                <span className="switch-jack" aria-hidden="true" />
                <a.icon size={26} aria-hidden="true" />
                <span>{a.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="page-wrap mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <section className="tx-wood rounded-sm p-5 sm:p-7" aria-labelledby="tracker-title">
          <span className="nail tl" aria-hidden="true" />
          <span className="nail tr" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="tracker-title" className="font-pirate text-3xl text-gold">
              Ticket Tracker
            </h2>
            {tickets.length > 0 && (
              <CrookedButton
                variant="ghost"
                size="sm"
                rum={false}
                onClick={() =>
                  openPopup({
                    key: "clear-tickets",
                    variant: "error",
                    title: "Burn every ticket?",
                    body: <p>This removes all {tickets.length} demo tickets saved in this browser. The parrot will forget them too.</p>,
                    actions: [
                      {
                        label: "Burn them",
                        primary: true,
                        onClick: () => {
                          clearTickets();
                          play("cannon");
                        },
                      },
                      { label: "Keep them" },
                    ],
                  })
                }
              >
                Clear all tickets
              </CrookedButton>
            )}
          </div>
          <p className="mt-1 font-type text-xs text-parchment">Saved in this browser only (localStorage). Statuses are fictional demo states.</p>
          {tickets.length === 0 ? (
            <p className="mt-6 font-fell text-xl italic text-parchment">No tickets yet. Use the switchboard to create one.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {tickets.map((t) => (
                <li key={t.id} className="ticket-row">
                  <div className="min-w-0 flex-1">
                    <p className="font-type text-sm text-gold">
                      {t.id} · {t.type}
                    </p>
                    <p className="truncate font-fell">{t.summary}</p>
                    <p className={`status-chip mt-1 ${STATUS_TONE[t.status]}`}>{t.status}</p>
                    <p className="mt-1 font-type text-[0.68rem] text-aged">Filed {new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                  <CrookedButton variant="parchment" size="sm" tilt={1} onClick={() => checkStatus(t.id, t.status)} aria-label={`Check status of ticket ${t.id}`}>
                    Check status
                  </CrookedButton>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="wall-title">
          <h2 id="wall-title" className="font-pirate text-3xl text-ivory">
            The Wall of Unanswered Complaints
          </h2>
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {UNANSWERED.map((u, i) => (
              <li key={u} className="sticky-note p-2 text-sm leading-tight" style={{ transform: `rotate(${[-6, 4, -2, 7, -4, 3, -7, 5, -1][i]}deg)` }}>
                {u}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
