import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { useExperience } from "../app/PirateExperienceProvider";
import { CAMPUS_LOCATIONS } from "../data/campusLocations";
import { usePageTitle } from "../hooks/usePageTitle";
import { CampusTreasureMap } from "../components/svg/TreasureMap";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";
import { CrookedLink } from "../components/ui/CrookedButton";

export default function TreasureMapsPage() {
  usePageTitle("Treasure Maps");
  const { play, cabinUnlocked } = useExperience();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);
  const initial = params.get("loc");
  const selectedId = CAMPUS_LOCATIONS.some((l) => l.id === initial) ? initial : null;
  const selected = CAMPUS_LOCATIONS.find((l) => l.id === selectedId) ?? null;

  const select = (id: string, focusReport = false) => {
    play("paper");
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        next.set("loc", id);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
    if (focusReport) requestAnimationFrame(() => reportRef.current?.focus());
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CAMPUS_LOCATIONS;
    return CAMPUS_LOCATIONS.filter((l) => [l.name, l.purpose, l.landmark].some((s) => s.toLowerCase().includes(q)));
  }, [query]);

  return (
    <div>
      <header className="page-wrap pt-10">
        <p className="kicker">Campus directory · charted by a seasick cartographer</p>
        <h1 className="title-huge mt-2 rotate-1 text-ivory">
          Treasure <span className="text-gold">Maps</span>
        </h1>
        <p className="mt-3 max-w-2xl font-fell text-xl text-parchment">
          Find your way around. Tap or click a landmark on the chart, or search the list below the map if you prefer words to cartography.
        </p>
      </header>

      <div className="page-wrap mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)]">
        <div className="map-frame">
          <p className="mb-2 font-type text-xs text-parchment md:hidden">Drag sideways to explore the chart →</p>
          <div className="map-scroll">
            <div className="map-inner">
              <CampusTreasureMap locations={CAMPUS_LOCATIONS} selectedId={selectedId} onSelect={(id) => select(id)} />
            </div>
          </div>
        </div>

        <div ref={reportRef} tabIndex={-1} className="outline-none" aria-live="polite">
          <ParchmentPanel material="parchment-dark" tilt={-1.2} pin torn="bottom" className="p-6">
            <p className="kicker text-rust">Spyglass report</p>
            {selected ? (
              <div key={selected.id} className="anim-paper-drop">
                <h2 className="mt-1 font-pirate text-4xl leading-none">{selected.name}</h2>
                {selected.restricted && <p className="stamp mt-3">RESTRICTED</p>}
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="font-type text-xs uppercase tracking-wider">Purpose</dt>
                    <dd className="font-fell text-lg">{selected.purpose}</dd>
                  </div>
                  <div>
                    <dt className="font-type text-xs uppercase tracking-wider">Description</dt>
                    <dd className="font-fell text-lg">{selected.description}</dd>
                  </div>
                  <div>
                    <dt className="font-type text-xs uppercase tracking-wider">Route hint</dt>
                    <dd className="font-fell text-lg italic">{selected.route}</dd>
                  </div>
                  <div>
                    <dt className="font-type text-xs uppercase tracking-wider">Nearby landmark</dt>
                    <dd className="font-fell text-lg">{selected.landmark}</dd>
                  </div>
                </dl>
                {selected.link && (
                  <CrookedLink to={selected.link.to} variant="rust" size="sm" tilt={-1} className="mt-5">
                    {selected.link.label}
                  </CrookedLink>
                )}
                {selected.restricted && (
                  <p className="mt-4 font-fell italic">
                    Rumour says the faculty keep a secret chart of their own cabins. The compass knows where it is, if spun until it grows
                    dizzy.
                    {cabinUnlocked && (
                      <>
                        {" "}
                        <Link to="/faculty-cabin-map" className="link-ink">
                          Ye already have it.
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 font-fell text-xl italic">Select a landmark on the chart or in the list, and the spyglass will report back.</p>
            )}
          </ParchmentPanel>
        </div>
      </div>

      <section className="page-wrap mt-12" aria-labelledby="loc-list-title">
        <div className="tx-wood rounded-sm p-5 sm:p-7">
          <h2 id="loc-list-title" className="font-pirate text-3xl text-gold">
            The Landmark Register
          </h2>
          <div className="relative mt-4 max-w-md">
            <label htmlFor="loc-search" className="field-label text-ivory">
              Search the chart
            </label>
            <Search size={18} className="pointer-events-none absolute bottom-3.5 left-3 text-ink" aria-hidden="true" />
            <input
              id="loc-search"
              type="search"
              className="pirate-input pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="library, food, despair…"
            />
          </div>
          <p className="mt-2 font-type text-xs text-parchment" role="status">
            {filtered.length} of {CAMPUS_LOCATIONS.length} landmarks shown
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l, i) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => select(l.id, true)}
                  aria-pressed={l.id === selectedId}
                  className={`loc-item w-full text-left ${l.id === selectedId ? "is-selected" : ""}`}
                  style={{ transform: `rotate(${[-0.8, 0.6, -0.3, 1][i % 4]}deg)` }}
                >
                  <span className="block font-fell text-lg font-bold">{l.name}</span>
                  <span className="block font-fell text-sm">{l.purpose}</span>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && <p className="mt-3 font-fell italic text-parchment">No landmark matches. It may have sunk.</p>}
        </div>
      </section>
    </div>
  );
}
