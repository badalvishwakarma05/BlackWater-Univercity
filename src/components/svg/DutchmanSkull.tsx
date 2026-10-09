import { useSvgId } from "./useSvgId";

interface Props {
  size?: number;
  className?: string;
  talking?: boolean;
}

const BARNACLES: [number, number, number][] = [
  [30, 22, 4],
  [37, 17, 3],
  [24, 31, 3.2],
  [70, 26, 3.6],
  [76, 34, 2.6],
  [64, 18, 2.4],
  [22, 52, 2.8],
  [79, 50, 3],
];

/** THE DUTCHMAN: a barnacle-encrusted skull of questionable helpfulness. */
export function DutchmanSkull({ size = 72, className = "", talking = false }: Props) {
  const glow = useSvgId("dglow");
  const bone = useSvgId("dbone");
  return (
    <svg viewBox="0 0 100 104" width={size} height={(size * 104) / 100} className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#7fffd0" stopOpacity=".95" />
          <stop offset=".5" stopColor="#3bd1a0" stopOpacity=".45" />
          <stop offset="1" stopColor="#3bd1a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={bone} cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#efe6cf" />
          <stop offset=".7" stopColor="#c8bc98" />
          <stop offset="1" stopColor="#7f775c" />
        </radialGradient>
      </defs>
      {/* subtle aura */}
      <circle cx="50" cy="48" r="48" fill="#3bd1a0" opacity=".08" className="anim-glow" />

      {/* seaweed strands hanging off */}
      <path className="seaweed" d="M20 44c-6 8 2 14-4 22s0 14-3 20" stroke="#355b48" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path className="seaweed alt" d="M78 40c6 8-1 14 4 22" stroke="#608c76" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* cranium */}
      <path
        d="M50 8C27 8 15 24 16 44c1 11 5 18 11 22l1 10h44l1-10c6-4 10-11 11-22 1-20-11-36-34-36z"
        fill={`url(#${bone})`}
        stroke="#2a2a22"
        strokeWidth="2"
      />
      <path d="M58 10l-3 9 5 4-3 6" stroke="#4a4436" strokeWidth="1.4" fill="none" />

      {/* uneven eye sockets */}
      <path d="M26 40c2-8 14-10 19-3 3 6-1 13-9 13-6 0-11-4-10-10z" fill="#0b1210" />
      <path d="M57 38c4-6 15-5 17 2 2 8-5 11-11 10-6 0-9-6-6-12z" fill="#0b1210" />
      <circle cx="36" cy="43" r="9" fill={`url(#${glow})`} className="eye-glow" />
      <circle cx="65" cy="43" r="7" fill={`url(#${glow})`} className="eye-glow" />
      <circle cx="36" cy="43" r="2" fill="#d7fff0" />
      <circle cx="65" cy="43" r="1.6" fill="#d7fff0" />

      {/* nose */}
      <path d="M50 52l-4 8h8z" fill="#0b1210" />

      {/* barnacles */}
      {BARNACLES.map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} fill="#d5ccb4" stroke="#6f6a5c" strokeWidth="1" />
          <circle cx={x} cy={y} r={r * 0.4} fill="#4d4a40" />
        </g>
      ))}

      {/* rusted earring */}
      <circle cx="15" cy="58" r="5.5" fill="none" stroke="#8a4a22" strokeWidth="2.4" />
      <circle cx="17" cy="62" r="1.4" fill="#5e2a10" />

      {/* upper teeth */}
      <path d="M32 64h36v6H32z" fill="#e2d8bd" stroke="#2a2a22" strokeWidth="1.4" />
      <path d="M38 64v6M44 64v6M50 64v6M56 64v6M62 64v6" stroke="#2a2a22" strokeWidth="1" />

      {/* chipped jaw that moves when the Dutchman speaks */}
      <g className={`jaw${talking ? " talking" : ""}`}>
        <path d="M30 72h40l-2 12c-4 6-12 9-18 9s-14-3-18-9l-1-5 3-2z" fill={`url(#${bone})`} stroke="#2a2a22" strokeWidth="1.8" />
        <path d="M34 73h32v5H34z" fill="#e2d8bd" stroke="#2a2a22" strokeWidth="1.2" />
        <path d="M40 73v5M46 73v5M52 73v5M58 73v5" stroke="#2a2a22" strokeWidth="1" />
        <path d="M62 84l4 3-3 2" fill="#0b1210" />
        <circle cx="40" cy="86" r="2" fill="#d5ccb4" stroke="#6f6a5c" />
      </g>
    </svg>
  );
}
