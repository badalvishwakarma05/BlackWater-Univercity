import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { useExperience } from "../app/PirateExperienceProvider";
import { DEPARTMENTS, departmentName } from "../data/departments";
import { FACULTY, type FacultyMember } from "../data/faculty";
import { usePageTitle } from "../hooks/usePageTitle";
import { FacultyPortrait } from "../components/svg/FacultyPortrait";
import { CrookedButton } from "../components/ui/CrookedButton";
import { DemoLabel } from "../components/ui/DemoLabel";
import { TextAreaField } from "../components/ui/PirateInput";

/** Lives inside the contact popup; keeps its own little state. Sends nothing anywhere. */
function MessageInABottle({ member }: { member: FacultyMember }) {
  const { play } = useExperience();
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 5) {
      setError("Write at least a few words. Even a parrot manages that.");
      return;
    }
    setError(undefined);
    play("splash");
    setSent(true);
  };
  if (sent)
    return (
      <p className="anim-paper-drop mt-4 border-2 border-dashed border-wreck p-3 font-fell text-lg" role="status">
        Your bottle has been thrown into the sea towards {member.name}. Expected reply: never-ish. (Simulated: nothing was sent.)
      </p>
    );
  return (
    <form onSubmit={submit} noValidate className="mt-4 space-y-3">
      <TextAreaField label="Message in a bottle (simulated)" value={text} onChange={(e) => setText(e.target.value)} error={error} maxLength={400} rows={3} />
      <CrookedButton type="submit" variant="plank" size="sm" tilt={-1}>
        Cork it and throw
      </CrookedButton>
    </form>
  );
}

export default function FacultyPage() {
  usePageTitle("Crew Manifest");
  const { openPopup, play } = useExperience();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const deptParam = params.get("dept");
  const dept = DEPARTMENTS.some((d) => d.id === deptParam) ? deptParam : "all";

  const setDept = (id: string) => {
    play("paper");
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (id === "all") next.delete("dept");
        else next.set("dept", id);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  const crew = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FACULTY.filter((f) => (dept === "all" || f.dept === dept) && (!q || f.name.toLowerCase().includes(q) || f.designation.toLowerCase().includes(q)));
  }, [dept, query]);

  const contact = (f: FacultyMember) => {
    play("squawk");
    openPopup({
      key: `contact-${f.id}`,
      variant: "wax",
      title: `Send word to ${f.name}`,
      body: (
        <>
          <p className="font-type text-sm">{f.designation}</p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="font-bold">Office</dt>
            <dd>{f.office}</dd>
            <dt className="font-bold">Carrier parrot</dt>
            <dd>{f.parrot}</dd>
            <dt className="font-bold">Email</dt>
            <dd className="break-all font-type text-sm">{f.email}</dd>
          </dl>
          <p className="mt-2 font-type text-xs">Fictional contact details (the .example domain goes nowhere, by design).</p>
          <MessageInABottle member={f} />
        </>
      ),
    });
  };

  return (
    <div>
      <header className="page-wrap pt-10">
        <p className="kicker">Faculty directory · most of them are wanted somewhere</p>
        <h1 className="title-huge mt-2 rotate-1 text-ivory">
          Crew <span className="text-gold">Manifest</span>
        </h1>
        <p className="mt-3 max-w-2xl font-fell text-xl text-parchment">
          Our distinguished, exhausted faculty. Hover or focus a poster and each officer will do their one trick.
        </p>
        <DemoLabel dark className="mt-4">
          Entirely fictional people · illustrated, not photographed
        </DemoLabel>
      </header>

      <div className="page-wrap mt-8">
        <div className="tx-wood rounded-sm p-4 sm:p-5">
          <div className="grid items-end gap-4 md:grid-cols-[minmax(0,18rem)_1fr]">
            <div className="relative">
              <label htmlFor="crew-search" className="field-label text-ivory">
                Search by name or title
              </label>
              <Search size={18} className="pointer-events-none absolute bottom-3.5 left-3 text-ink" aria-hidden="true" />
              <input id="crew-search" type="search" className="pirate-input pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Grog, Admiral, Deadline…" />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by department">
              {[{ id: "all", name: "All crews" }, ...DEPARTMENTS].map((d) => (
                <button key={d.id} type="button" className={`category-tab ${dept === d.id ? "is-active" : ""}`} aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 font-type text-sm text-parchment" role="status">
          {crew.length} crew member{crew.length === 1 ? "" : "s"} found
          {dept !== "all" ? ` in ${departmentName(dept as string)}` : ""}
          {query.trim() ? ` matching “${query.trim()}”` : ""}
        </p>

        {crew.length === 0 ? (
          <p className="mt-10 text-center font-fell text-2xl italic text-parchment">No crew found. They may be hiding in the crow's nest.</p>
        ) : (
          <ul className="crew-grid mt-8">
            {crew.map((f, i) => (
              <li key={f.id}>
                <article className="portrait-card wanted-poster h-full p-4" style={{ transform: `rotate(${[-1.8, 1.2, -0.6, 2, -1.2, 0.8][i % 6]}deg)` }}>
                  <span className="pin" aria-hidden="true" />
                  <p className="text-center font-blackletter text-3xl leading-none">Wanted</p>
                  <p className="text-center font-type text-[0.62rem] uppercase tracking-[0.25em]">for crimes against punctuality</p>
                  <div className="mx-auto mt-2 w-full max-w-[13rem] border-4 border-wreck">
                    <FacultyPortrait spec={f.portrait} label={`Illustrated portrait of ${f.name}, a fictional faculty member`} className="block h-auto w-full" />
                  </div>
                  <h2 className="mt-3 text-center font-pirate text-2xl leading-tight">{f.name}</h2>
                  <p className="text-center font-fell italic">{f.designation}</p>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div>
                      <dt className="inline font-type text-xs uppercase">Department: </dt>
                      <dd className="inline font-fell">{departmentName(f.dept)}</dd>
                    </div>
                    <div>
                      <dt className="inline font-type text-xs uppercase">Research: </dt>
                      <dd className="inline font-fell">{f.research.join("; ")}</dd>
                    </div>
                    <div>
                      <dt className="inline font-type text-xs uppercase">Office: </dt>
                      <dd className="inline font-fell">{f.office}</dd>
                    </div>
                    <div>
                      <dt className="inline font-type text-xs uppercase">Bounty: </dt>
                      <dd className="inline font-fell">{f.bounty}</dd>
                    </div>
                  </dl>
                  <CrookedButton variant={i % 2 ? "parchment" : "rust"} size="sm" tilt={i % 2 ? 1 : -1} className="mt-4 w-full" onClick={() => contact(f)}>
                    Send word
                  </CrookedButton>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
