import { useState } from "react";
import { JAR_UNLOCK_AT, useExperience } from "../app/PirateExperienceProvider";
import { usePageTitle } from "../hooks/usePageTitle";
import { SecretGate } from "../components/layout/SecretGate";
import { TreasureChest } from "../components/svg/Props";
import { WaxSeal } from "../components/svg/WaxSeal";
import { CrookedButton } from "../components/ui/CrookedButton";
import { ParchmentPanel } from "../components/ui/ParchmentPanel";

/**
 * Decorative "pirate source code". This string is only displayed; it is not
 * part of the application's real implementation.
 */
const DECORATIVE_SNIPPET = `// TODO: Fix this before the accreditation inspection.
// FIXME: The backend has joined the navy.
// NOTE: Never let the parrot touch production.

function calculateCGPA(student) {
  const dirt = jar.dig(student);        // works on my ship
  if (dirt.isCursed) return 6.5;        // still got the job
  return Math.min(10, dirt.weight * RUM_CONSTANT);
}

// HACK: progress bars go backwards to build character
while (!rum.isGone()) rum.drink();      // never terminates. rum is always gone.`;

const RULES = [
  "Never deploy on a Friday. Or a full moon. Or near the Kraken.",
  "If it compiles, ship it. If it doesn't, ship it anyway and blame the tide.",
  "The parrot may review code, but may never approve it.",
  "Every bug is a feature until the inspector arrives.",
  "Comments are for landlubbers. (This rule is a comment.)",
  "Backups are kept in a bottle, thrown overboard, nightly.",
  "When in doubt, add another skull.",
];

function ArchitectureDiagram() {
  const box = (x: number, y: number, w: number, label: string, sub: string, fill = "#e3d4a8") => (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height="58" rx="4" fill={fill} stroke="#2a1a0c" strokeWidth="2.5" transform="rotate(-1)" />
      <text x={w / 2} y="26" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="18" fill="#2a1a0c">
        {label}
      </text>
      <text x={w / 2} y="44" textAnchor="middle" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="11" fill="#5a4320">
        {sub}
      </text>
    </g>
  );
  return (
    <svg
      viewBox="0 0 720 330"
      className="h-auto w-full"
      role="img"
      aria-label="Fictional architecture diagram: your browser ship talks to a parrot load balancer, then to the React rigging. The backend box is crossed out because it joined the navy. Data is kept in browser storage. Sounds come from a synthesised orchestra. Kraken Cloud Services is drawn with a dashed line labelled never connected."
    >
      <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#2a1a0c" />
        </marker>
      </defs>
      {box(20, 30, 170, "Your Browser", "a small leaky ship")}
      {box(270, 30, 180, "Parrot Load Balancer", "squawks requests at random")}
      {box(530, 30, 170, "React Rigging", "the actual website")}
      {box(40, 200, 190, "Backend", "has joined the navy", "#c8b48a")}
      {box(290, 200, 180, "Browser Storage", "the only database we trust")}
      {box(530, 200, 170, "Web Audio Orchestra", "synthesised creaks")}
      <g stroke="#2a1a0c" strokeWidth="2.5" fill="none" markerEnd="url(#arrowhead)">
        <path d="M192 58h74" />
        <path d="M452 58h74" />
        <path d="M600 92c0 40-120 60-200 104" />
        <path d="M620 92v104" />
      </g>
      <path d="M40 200l190 58M230 200L40 258" stroke="#8d1d28" strokeWidth="4" />
      <path d="M140 92c0 30 -6 60 -4 104" stroke="#8d1d28" strokeWidth="2" strokeDasharray="6 6" fill="none" />
      <text x="150" y="150" fontFamily="Special Elite, monospace" fontSize="11" fill="#8d1d28">
        (deserted)
      </text>
      <g transform="translate(250 300)">
        <text fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="13" fill="#355b48">
          Kraken Cloud Services · - - - - - - never connected - - - - - -
        </text>
      </g>
    </svg>
  );
}

export default function SecretCodePage() {
  usePageTitle("The Code");
  const { codeUnlocked, visits, setStormMode, stormMode, play, notify } = useExperience();
  const [chestOpen, setChestOpen] = useState(false);
  const [secretShown, setSecretShown] = useState(false);

  return (
    <SecretGate
      unlocked={codeUnlocked}
      title="The Code"
      hint={
        <>
          <p>This journal is sealed inside the Jar of Dirt.</p>
          <p className="mt-2 font-type text-sm">
            The jar opens when it has gathered {JAR_UNLOCK_AT} handfuls (one for every new deck visited per voyage). Current handfuls: {visits}.
          </p>
        </>
      }
    >
      <div className="page-wrap pt-10">
        <p className="kicker">Recovered from the jar · cursed captain's journal · do not read aloud</p>
        <h1 className="title-huge mt-2 -rotate-2 text-gold">The Code</h1>
        <p className="mt-3 max-w-2xl font-fell text-xl italic text-parchment">
          A developer confession, found inside the dirt. “The code is more what you'd call… guidelines than actual rules.”
        </p>

        <div className="journal mt-10 grid gap-8 lg:grid-cols-2">
          <ParchmentPanel material="parchment-dark" tilt={-0.8} className="p-6 sm:p-8">
            <h2 className="font-blackletter text-4xl">Confession</h2>
            <p className="mt-3 font-fell text-lg leading-relaxed">
              I, the Captain, Chief Technology Officer and Keeper of the Last Semicolon, confess that this website was built by pirates who
              believe CSS is a type of naval artillery. The backend joined the navy in the first sprint. Everything you see runs in your own
              browser. The jar of dirt is a counter. The Dutchman is a lookup table. I am sorry about the progress bars.
            </p>
            <h3 className="mt-6 font-pirate text-3xl">The Captain's Rules of Development</h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-6 font-fell text-lg">
              {RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
            <h3 className="mt-6 font-pirate text-2xl">Programming Principles</h3>
            <p className="font-type text-xs">(a suspiciously short list)</p>
            <ol className="mt-2 list-decimal pl-6 font-fell text-lg">
              <li>It compiled once.</li>
              <li>Blame the previous captain.</li>
            </ol>
          </ParchmentPanel>

          <div className="space-y-8">
            <ParchmentPanel material="chart" tilt={1} pin className="p-5">
              <h2 className="font-pirate text-3xl">Fictional Architecture</h2>
              <div className="mt-3">
                <ArchitectureDiagram />
              </div>
            </ParchmentPanel>

            <figure className="code-scroll" aria-labelledby="code-cap">
              <figcaption id="code-cap" className="font-type text-xs text-parchment">
                decorative pirate source code · not the real implementation
              </figcaption>
              <pre className="mt-2">
                <code>{DECORATIVE_SNIPPET}</code>
              </pre>
            </figure>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              className="rounded-md p-2"
              onClick={() => {
                play(chestOpen ? "thud" : "coins");
                setChestOpen((o) => !o);
              }}
              aria-expanded={chestOpen}
              aria-controls="chest-message"
              data-rum=""
            >
              <span className="sr-only">{chestOpen ? "Close the broken treasure chest" : "Pry open the broken treasure chest"}</span>
              <TreasureChest size={190} open={chestOpen} />
            </button>
            <p className="font-type text-xs text-parchment">A broken treasure chest. The lock gave up years ago.</p>
            <div id="chest-message" aria-live="polite" className="min-h-[4rem]">
              {chestOpen && (
                <p className="anim-paper-drop mt-3 font-fell text-2xl italic text-gold">“The real treasure was the bugs we shipped along the way.”</p>
              )}
            </div>
          </div>

          <ParchmentPanel material="parchment" tilt={-1.4} torn="bottom" className="p-6 text-center">
            <WaxSeal size={70} className="mx-auto" color="black" label="XX" />
            <h2 className="mt-2 font-pirate text-3xl">One more secret</h2>
            {!secretShown ? (
              <CrookedButton
                variant="rust"
                className="mt-4"
                onClick={() => {
                  play("chord");
                  setSecretShown(true);
                }}
              >
                Break the seal
              </CrookedButton>
            ) : (
              <div className="anim-letter-unfold mt-3" aria-live="polite">
                <p className="font-fell text-lg">On any deck (outside a form field), enter:</p>
                <p className="mt-2 font-type text-2xl tracking-widest" aria-label="Up, up, down, down, left, right, left, right, B, A">
                  ↑ ↑ ↓ ↓ ← → ← → B A
                </p>
                <p className="mt-2 font-fell italic">…and a black ship will come for the website.</p>
                <p className="mt-2 font-fell text-sm">The compass hides a secret too. Spin it until it grows dizzy.</p>
                <CrookedButton
                  variant="gold"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setStormMode(!stormMode);
                    if (!stormMode) {
                      play("cannon");
                      notify({ title: "MUTINY ON THE MAINFRAME!", message: "Summoned from the journal. Press 'Calm the seas' to end it.", tone: "storm" });
                    }
                  }}
                >
                  {stormMode ? "Calm the storm" : "Summon the storm now"}
                </CrookedButton>
              </div>
            )}
          </ParchmentPanel>
        </div>
      </div>
    </SecretGate>
  );
}
