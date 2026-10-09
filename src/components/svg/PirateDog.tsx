import { useSvgId } from "./useSvgId";

function Flame({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="flame" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0c-14-8-18-24-10-40 2 10 8 12 10 4 2-14 10-22 18-30-2 14 8 22 10 34 4-6 4-12 2-18 10 10 12 26 4 38-6 10-24 16-34 12z" fill="#e8622c" />
        <path d="M6 -4c-8-6-8-16-2-24 2 6 6 6 8 0 4 8 10 12 8 20-2 6-8 8-14 4z" fill="#ffc94a" />
      </g>
    </g>
  );
}

/**
 * An original parody: a pirate dog sits in a burning classroom, entirely at peace.
 * The projector is broken, the fan is cracked, the barrel is suspicious.
 */
export function PirateDog({ className = "" }: { className?: string }) {
  const wall = useSvgId("wall");
  const glow = useSvgId("fireglow");
  return (
    <svg
      viewBox="0 0 600 420"
      className={className}
      role="img"
      aria-label="A pirate dog in a tricorn hat sits calmly at a classroom desk holding a mug while the room burns: flames on the walls, burning papers, a broken projector sparking from the ceiling, a cracked fan, scattered books, and a suspicious barrel by the door. A speech bubble says: This be fine."
    >
      <defs>
        <linearGradient id={wall} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1a12" />
          <stop offset="1" stopColor="#6a3a20" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#ffb347" stopOpacity=".45" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="420" fill={`url(#${wall})`} />
      {/* plank wall */}
      <g stroke="#2a120a" strokeWidth="2" opacity=".6">
        <path d="M0 60h600M0 130h600M0 200h600M0 270h600" />
      </g>
      {/* floor */}
      <path d="M0 330h600v90H0z" fill="#382419" />
      <g stroke="#1a0f08" strokeWidth="2">
        <path d="M0 352h600M0 380h600M120 330l-30 90M300 330v90M480 330l30 90" />
      </g>

      {/* smoke along the ceiling */}
      <g fill="#1a1414" opacity=".85">
        <ellipse cx="80" cy="10" rx="120" ry="40" />
        <ellipse cx="300" cy="0" rx="180" ry="44" />
        <ellipse cx="520" cy="12" rx="140" ry="42" />
      </g>
      <g fill="#3a3030">
        <circle className="anim-smoke" cx="200" cy="80" r="16" />
        <circle className="anim-smoke" cx="430" cy="90" r="14" style={{ animationDelay: "-2s" }} />
      </g>

      {/* chalkboard, half burnt */}
      <rect x="150" y="70" width="230" height="120" fill="#1d3a2e" stroke="#523826" strokeWidth="8" />
      <text x="166" y="104" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="18" fill="#e8ddc2" opacity=".85">
        Attendance is
      </text>
      <text x="166" y="130" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="18" fill="#e8ddc2" opacity=".85">
        MANDATORY
      </text>
      <path d="M330 70c10 20 30 30 50 30v-30z" fill="#1a0f08" />
      <path d="M170 160c20-6 40 4 60-2" stroke="#e8ddc2" strokeWidth="2" fill="none" opacity=".6" />

      {/* cracked ceiling fan */}
      <g transform="translate(470 40)">
        <path d="M0 0v18" stroke="#2a2622" strokeWidth="3" />
        <ellipse cx="0" cy="22" rx="10" ry="5" fill="#4a4440" />
        <path d="M-6 22l-50 6 2 6 48-6z" fill="#77583a" stroke="#2a1a10" />
        <path d="M6 22l30 4-4 4-8 12-4-6-14-8z" fill="#77583a" stroke="#2a1a10" />
        <path d="M24 26l-6 8" stroke="#1a0f08" strokeWidth="1.5" />
      </g>

      {/* broken projector hanging by one cable */}
      <g transform="translate(300 30) rotate(16)">
        <path d="M0 -30v30" stroke="#2a2622" strokeWidth="3" />
        <rect x="-28" y="0" width="56" height="30" rx="4" fill="#8a8680" stroke="#2a2622" strokeWidth="2" />
        <circle cx="16" cy="15" r="9" fill="#2a3a40" stroke="#2a2622" strokeWidth="2" />
        <path d="M10 9l10 12M20 9l-6 6" stroke="#e8ddc2" strokeWidth="1" />
        <path d="M-20 8h18M-20 14h14" stroke="#2a2622" />
      </g>
      <g className="anim-spark" fill="#ffe9a8">
        <path d="M284 70l6 6-8 2 10 8" stroke="#ffe9a8" strokeWidth="2" fill="none" />
        <circle cx="296" cy="88" r="2" />
      </g>

      {/* flames */}
      <rect x="0" y="0" width="600" height="420" fill={`url(#${glow})`} />
      <Flame x={20} y={330} s={1.4} />
      <Flame x={70} y={300} s={1} delay={-0.3} />
      <Flame x={540} y={330} s={1.6} delay={-0.5} />
      <Flame x={500} y={260} s={1.1} delay={-0.2} />
      <Flame x={560} y={200} s={1.2} delay={-0.6} />
      <Flame x={30} y={180} s={1.1} delay={-0.4} />
      <Flame x={400} y={66} s={0.9} delay={-0.1} />
      <Flame x={120} y={60} s={0.8} delay={-0.7} />

      {/* the door + suspicious barrel */}
      <rect x="520" y="200" width="70" height="130" fill="#2a1a10" stroke="#1a0f08" strokeWidth="3" />
      <circle cx="530" cy="270" r="4" fill="#c39a43" />
      <g transform="translate(450 260)">
        <path d="M0 6c0-8 50-8 50 0v60c0 8-50 8-50 0z" fill="#6b4a2e" stroke="#1a0f08" strokeWidth="2" />
        <path d="M0 22c16 4 34 4 50 0M0 50c16 4 34 4 50 0" stroke="#2a2622" strokeWidth="4" fill="none" />
        <text x="25" y="42" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="16" fill="#e8ddc2">XXX</text>
        <path d="M30 2c6-12 16-14 20-24" stroke="#c8b995" strokeWidth="2" fill="none" />
        <circle cx="50" cy="-22" r="3" fill="#ffc94a" className="anim-spark" />
      </g>

      {/* scattered books */}
      <g>
        <rect x="70" y="350" width="40" height="12" fill="#8d1d28" stroke="#2a0a0e" transform="rotate(-12 90 356)" />
        <rect x="110" y="362" width="34" height="10" fill="#355b48" stroke="#13261d" transform="rotate(8 127 367)" />
        <rect x="380" y="356" width="38" height="11" fill="#c39a43" stroke="#5e4719" transform="rotate(-20 399 361)" />
        <path d="M400 380l22-6 4 10-22 6z" fill="#e8ddc2" stroke="#9f9274" />
      </g>

      {/* desk */}
      <rect x="170" y="268" width="220" height="16" fill="#523826" stroke="#1a0f08" strokeWidth="2" />
      <path d="M182 284v60M378 284v60" stroke="#382419" strokeWidth="10" />
      {/* burning papers on the desk */}
      <path d="M330 262l30-4 2 10-30 4z" fill="#e8ddc2" stroke="#9f9274" />
      <Flame x={344} y={262} s={0.45} delay={-0.2} />
      <path d="M190 264l28 2-2 6-28-2z" fill="#e8ddc2" stroke="#9f9274" />

      {/* chair */}
      <path d="M230 300h70v8h-70zM236 308v40M294 308v40M294 240v62" stroke="#382419" strokeWidth="6" fill="none" />

      {/* THE DOG: relaxed, worryingly so */}
      <g>
        {/* body */}
        <path d="M236 300c-6-40 8-70 36-74 26-2 40 24 34 70z" fill="#c8924e" stroke="#4a2e14" strokeWidth="2.4" />
        <path d="M256 300c0-18 4-34 12-40" stroke="#a8743a" strokeWidth="3" fill="none" />
        {/* head */}
        <path d="M232 196c-4-28 14-46 40-46 24 0 40 16 38 40-2 22-18 36-40 36-20 0-36-12-38-30z" fill="#d6a05c" stroke="#4a2e14" strokeWidth="2.4" />
        {/* floppy ears */}
        <path d="M236 176c-14 4-22 20-16 40 8-4 14-14 16-26z" fill="#8a5a2a" stroke="#4a2e14" strokeWidth="2" />
        <path d="M306 174c12 6 18 22 12 40-8-4-12-14-14-26z" fill="#8a5a2a" stroke="#4a2e14" strokeWidth="2" />
        {/* contented half-lidded eyes */}
        <path d="M252 190c4-3 10-3 14 0" stroke="#1a0f08" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M280 190c4-3 10-3 14 0" stroke="#1a0f08" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M252 186h14M280 186h14" stroke="#4a2e14" strokeWidth="1.5" />
        {/* snout + small smile */}
        <ellipse cx="272" cy="208" rx="18" ry="12" fill="#e8c08a" stroke="#4a2e14" strokeWidth="1.8" />
        <ellipse cx="272" cy="201" rx="6" ry="4" fill="#1a0f08" />
        <path d="M262 212c6 6 14 6 20 0" stroke="#1a0f08" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* tricorn with a skull */}
        <path d="M222 160c18-22 82-22 100 0-12-4-20-2-26 2-14-10-34-10-48 0-6-4-14-6-26-2z" fill="#161414" stroke="#c39a43" strokeWidth="2" />
        <path d="M240 146c8-22 56-22 64 0z" fill="#161414" />
        <circle cx="272" cy="140" r="5" fill="#e8ddc2" />
        <circle cx="270" cy="139" r="1.2" fill="#161414" />
        <circle cx="274" cy="139" r="1.2" fill="#161414" />
        {/* mug of "coffee" */}
        <g transform="translate(296 238)">
          <rect x="0" y="0" width="26" height="30" rx="3" fill="#e8ddc2" stroke="#4a2e14" strokeWidth="2" />
          <path d="M26 8c10 0 10 14 0 14" stroke="#4a2e14" strokeWidth="3" fill="none" />
          <text x="13" y="20" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="10" fill="#8d1d28">RUM</text>
          <path d="M6 -6c2-6 6-6 6-12M16 -6c2-6 6-6 6-12" stroke="#9f9274" strokeWidth="1.5" fill="none" opacity=".7" />
        </g>
        {/* paw holding the mug */}
        <ellipse cx="296" cy="252" rx="10" ry="8" fill="#d6a05c" stroke="#4a2e14" strokeWidth="1.8" />
      </g>

      {/* speech bubble */}
      <g transform="translate(36 210)">
        <path d="M0 0h150c8 0 12 4 12 12v30c0 8-4 12-12 12H60l-16 20 4-20H12C4 54 0 50 0 42V12C0 4 4 0 12 0z" fill="#e8ddc2" stroke="#090807" strokeWidth="2.5" transform="scale(-1 1) translate(-162 0)" />
        <text x="81" y="34" textAnchor="middle" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="22" fill="#090807">
          This be fine.
        </text>
      </g>
    </svg>
  );
}
