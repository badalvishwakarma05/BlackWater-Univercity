import { useEffect, useMemo, useState } from "react";
import { useExperience } from "../app/PirateExperienceProvider";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTimeouts } from "../hooks/useTimeouts";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { makeTicketId } from "../lib/random";
import { GoldCoin } from "../components/svg/GoldCoin";
import { Dagger } from "../components/svg/Props";
import { WaxSeal } from "../components/svg/WaxSeal";
import { CrookedButton } from "../components/ui/CrookedButton";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { DemoLabel } from "../components/ui/DemoLabel";
import { TextField } from "../components/ui/PirateInput";

export const FINANCE_LINE = "Every man has a price… yours is 1.5 lakh + 18% GST.";

const GST_RATE = 0.18;
const LATE_PER_DAY = 250;

interface ToggleFee {
  id: string;
  label: string;
  note: string;
  amount: number;
}

const TOGGLE_FEES: ToggleFee[] = [
  { id: "tuition", label: "Tuition", note: "for the privilege of being shouted at in Latin", amount: 95000 },
  { id: "library", label: "Library", note: "includes one (1) haunted bookmark", amount: 4500 },
  { id: "laboratory", label: "Laboratory", note: "covers explosions up to medium size", amount: 12000 },
  { id: "examination", label: "Examination", note: "per attempt; plank sold separately", amount: 6500 },
  { id: "admin", label: "Miscellaneous administration", note: "for the administration of miscellany", amount: 4000 },
];

const HOSTEL_OPTIONS = [
  { id: "none", label: "No hostel (I live on a raft)", amount: 0 },
  { id: "hammock", label: "Hammock Row (shared, damp)", amount: 28000 },
  { id: "cabin", label: "Private cabin with porthole", amount: 52000 },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const money = (n: number) => inr.format(Math.round(n));

interface Line {
  label: string;
  amount: number;
}

function PaymentStatus() {
  const steps = [
    "Contacting the treasurer…",
    "Treasurer located. Treasurer is counting… treasurer has lost count.",
    "Recounting on fingers, toes, and one borrowed hook…",
    "STATUS: Received by a parrot. Awaiting the captain's signature, which is a drawing of a fish.",
  ];
  const [shown, setShown] = useState(1);
  useEffect(() => {
    if (shown >= steps.length) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), 1100);
    return () => window.clearTimeout(t);
  }, [shown, steps.length]);
  return (
    <div className="mt-4 space-y-1 font-type text-sm" role="status" aria-live="polite">
      {steps.slice(0, shown).map((s, i) => (
        <p key={s} className={i === steps.length - 1 ? "font-bold text-blood" : ""}>
          {i < shown - 1 || i === steps.length - 1 ? "✓ " : "… "}
          {s}
        </p>
      ))}
      {shown >= steps.length && <p className="stamp anim-stamp mt-2" style={{ ["--stamp-delay" as string]: "0.1s" }}>UNHELPFULLY PENDING</p>}
    </div>
  );
}

export default function BootyFeesPage() {
  usePageTitle("Booty & Fees");
  const { openPopup, notify, play } = useExperience();
  const reduced = useReducedMotion();
  const { later } = useTimeouts();
  const [selected, setSelected] = useState<Record<string, boolean>>(() => Object.fromEntries(TOGGLE_FEES.map((f) => [f.id, true])));
  const [hostel, setHostel] = useState("hammock");
  const [lateDays, setLateDays] = useState("0");
  const [shaking, setShaking] = useState(false);
  const [paying, setPaying] = useState(false);

  const lateValid = /^\d{1,3}$/.test(lateDays.trim()) && Number(lateDays) <= 365;
  const lateError = lateValid ? undefined : "Days late must be a whole number from 0 to 365. (Beyond that, ye are a legend, not a student.)";

  const lines: Line[] = useMemo(() => {
    const out: Line[] = TOGGLE_FEES.filter((f) => selected[f.id]).map((f) => ({ label: f.label, amount: f.amount }));
    const h = HOSTEL_OPTIONS.find((o) => o.id === hostel);
    if (h && h.amount > 0) out.splice(1, 0, { label: `Hostel: ${h.label}`, amount: h.amount });
    const days = lateValid ? Number(lateDays) : 0;
    if (days > 0) out.push({ label: `Late penalty (${days} day${days > 1 ? "s" : ""} × ${money(LATE_PER_DAY)})`, amount: days * LATE_PER_DAY });
    return out;
  }, [selected, hostel, lateDays, lateValid]);

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  const pay = () => {
    if (paying) return;
    if (!lateValid) {
      notify({ title: "The ledger refuses to balance", message: "Fix the days-late figure first. Finance can only count whole days.", tone: "warn" });
      return;
    }
    if (subtotal === 0) {
      notify({ title: "Ye can't pay for nothing.", message: "Select at least one fee. Finance is visibly disappointed.", tone: "warn" });
      return;
    }
    setPaying(true);
    play("organ");
    play("coins");
    setShaking(true);
    later(() => setShaking(false), 1300);
    const receiptNo = makeTicketId("BW-TRS");
    const snapshot = { lines, subtotal, gst, total };
    later(
      () => {
        setPaying(false);
        openPopup({
          key: `receipt-${receiptNo}`,
          variant: "rum",
          title: "A Suspicious Treasury Receipt",
          size: "lg",
          body: (
            <>
              <p className="font-fell text-2xl italic leading-snug text-blood">“{FINANCE_LINE}”</p>
              <div className="mt-4 border-2 border-dashed border-wreck p-3 font-type text-sm">
                <p>Receipt {receiptNo} · {new Date().toLocaleDateString()}</p>
                <ul className="mt-2">
                  {snapshot.lines.map((l) => (
                    <li key={l.label} className="flex items-baseline justify-between gap-4">
                      <span>{l.label}</span>
                      <span>{money(l.amount)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 flex justify-between border-t border-wreck pt-1">
                  <span>Subtotal</span>
                  <span>{money(snapshot.subtotal)}</span>
                </p>
                <p className="flex items-baseline justify-between">
                  <span>Gold &amp; Seafaring Tax (18%)</span>
                  <span>{money(snapshot.gst)}</span>
                </p>
                <p className="flex items-baseline justify-between font-bold">
                  <span>Total demanded</span>
                  <span>{money(snapshot.total)}</span>
                </p>
              </div>
              <PaymentStatus />
              <p className="mt-4 font-type text-xs">
                Fictional payment demonstration. No money moved, no card was requested, no gateway was contacted, and no real transaction
                occurred.
              </p>
            </>
          ),
          actions: [{ label: "Back away slowly", primary: true }],
        });
      },
      reduced ? 200 : 900,
    );
  };

  return (
    <div>
      <header className="page-wrap pt-10">
        <p className="kicker">The Treasury of Blackwater · Finance &amp; Plunder Department</p>
        <h1 className="title-huge mt-2 rotate-[-1.5deg] text-gold">Booty &amp; Fees</h1>
        <p className="mt-3 max-w-2xl font-fell text-xl text-parchment">
          The finance department is suspiciously eager to help you calculate what you owe. Choose your fees below; the ledger updates as
          you go.
        </p>
        <DemoLabel dark className="mt-4">
          Demonstration amounts · not real fees · fictional currency in ₹ form
        </DemoLabel>
      </header>

      <div className="page-wrap mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* the wooden ledger */}
        <section aria-labelledby="ledger-title" className="ledger tx-wood rounded-sm p-4 sm:p-6">
          <span className="nail tl" aria-hidden="true" />
          <span className="nail tr" aria-hidden="true" />
          <h2 id="ledger-title" className="font-pirate text-3xl text-gold">
            The Ledger of Obligations
          </h2>
          <ParchmentPanel material="lined" className="mt-4 p-5 pl-14" tilt={-0.4}>
            <fieldset>
              <legend className="font-fellsc text-lg">Select fee categories</legend>
              <ul className="mt-3 space-y-3">
                {TOGGLE_FEES.map((f) => (
                  <li key={f.id} className="check-row">
                    <input
                      id={`fee-${f.id}`}
                      type="checkbox"
                      checked={!!selected[f.id]}
                      onChange={(e) => setSelected((s) => ({ ...s, [f.id]: e.target.checked }))}
                    />
                    <label htmlFor={`fee-${f.id}`} className="flex flex-1 flex-wrap justify-between gap-x-3">
                      <span>
                        <span className="font-bold">{f.label}</span> <span className="font-fell text-sm italic">({f.note})</span>
                      </span>
                      <span className="font-type">{money(f.amount)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="font-fellsc text-lg">Hostel arrangement</legend>
              <div className="mt-2 space-y-2">
                {HOSTEL_OPTIONS.map((o) => (
                  <label key={o.id} className="check-row" htmlFor={`hostel-${o.id}`}>
                    <input id={`hostel-${o.id}`} type="radio" name="hostel" value={o.id} checked={hostel === o.id} onChange={() => setHostel(o.id)} />
                    <span className="flex flex-1 flex-wrap justify-between gap-x-3">
                      <span>{o.label}</span>
                      <span className="font-type">{money(o.amount)}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <TextField
              className="mt-6 max-w-xs"
              label={`Days late (penalty ${money(LATE_PER_DAY)}/day)`}
              inputMode="numeric"
              value={lateDays}
              onChange={(e) => setLateDays(e.target.value)}
              error={lateError}
              hint="Compounded by guilt, not by interest."
            />
          </ParchmentPanel>
          <p className="mt-4 font-type text-xs text-parchment">
            Notice: the Finance Department denies having a second treasure vault. Please stop asking.
          </p>
        </section>

        {/* invoice + calculator */}
        <div className="relative flex flex-col gap-8">
          <div className="pointer-events-none absolute -top-10 right-10 z-10 rotate-[24deg]" aria-hidden="true">
            <Dagger size={150} />
          </div>
          <ParchmentPanel as="section" material="parchment" tilt={1.2} torn="bottom" className="invoice p-6 pt-8 sm:p-8" aria-labelledby="invoice-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="invoice-title" className="font-blackletter text-4xl leading-none">
                  Invoice
                </h2>
                <p className="mt-1 font-type text-xs">Issued by the Quartermaster · payable immediately · or sooner</p>
              </div>
              <WaxSeal size={64} color="gold" label="PAY" />
            </div>
            <table className="mt-5 w-full font-type text-sm">
              <caption className="sr-only">Itemised demonstration fee breakdown</caption>
              <thead>
                <tr className="border-b-2 border-ink text-left">
                  <th scope="col" className="py-1">
                    Item
                  </th>
                  <th scope="col" className="py-1 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-3 font-fell italic">
                      Nothing selected. Finance is weeping quietly.
                    </td>
                  </tr>
                ) : (
                  lines.map((l) => (
                    <tr key={l.label} className="border-b border-dashed border-wreck/50">
                      <td className="py-1.5 pr-3">{l.label}</td>
                      <td className="py-1.5 text-right">{money(l.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className="pt-3 text-left font-normal">
                    Subtotal
                  </th>
                  <td className="pt-3 text-right">{money(subtotal)}</td>
                </tr>
                <tr>
                  <th scope="row" className="text-left font-normal">
                    Gold &amp; Seafaring Tax (GST 18%)
                  </th>
                  <td className="text-right">{money(gst)}</td>
                </tr>
                <tr className="text-lg">
                  <th scope="row" className="pt-2 text-left">
                    Estimated total
                  </th>
                  <td className="pt-2 text-right font-bold" aria-live="polite">
                    {money(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </ParchmentPanel>

          <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            {/* the calculator with missing buttons */}
            <div className="calculator" aria-hidden="true">
              <div className="calculator-screen">{money(total).replace("₹", "₹ ")}</div>
              <div className="calculator-keys">
                {["7", "8", "", "÷", "4", "", "6", "×", "1", "2", "3", "", "0", ".", "=", "+"].map((k, i) =>
                  k ? (
                    <span key={i} className={k === "=" ? "is-taped" : ""}>
                      {k}
                    </span>
                  ) : (
                    <span key={i} className="is-missing" />
                  ),
                )}
              </div>
            </div>

            <div>
              <div className={`coin-pile ${shaking ? "coins-shaking" : ""}`} aria-hidden="true">
                <GoldCoin size={44} />
                <GoldCoin size={36} />
                <GoldCoin size={48} />
                <GoldCoin size={32} />
                <GoldCoin size={40} />
              </div>
              <CrookedButton variant="gold" size="lg" tilt={-1.5} onClick={pay} disabled={paying} className="mt-4">
                {paying ? "Summoning the treasurer…" : "Hand over the booty (simulated)"}
              </CrookedButton>
              <p className="mt-2 font-type text-xs text-parchment">No card details. No gateway. No real payment. Just theatre.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
