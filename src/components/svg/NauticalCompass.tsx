import { useSvgId } from "./useSvgId";

interface Props {
  size?: number;
  className?: string;
  /** Needle rotation in degrees. Accumulates so it can spin many turns. */
  angle?: number;
  idle?: boolean;
}

const TICKS = Array.from({ length: 24 }, (_, i) => i * 15 + (i % 5 === 0 ? 3 : 0));

/** An old, damaged, questionably calibrated brass compass with a skull in the middle. */
export function NauticalCompass({ size = 88, className = "", angle = 0, idle = true }: Props) {
  const brass = useSvgId("brass");
  const face = useSvgId("face");
  return (
    <svg viewBox="0 0 100 124" width={size} height={(size * 124) / 100} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={brass} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#f0d58e" />
          <stop offset=".5" stopColor="#a8823a" />
          <stop offset="1" stopColor="#4e3a18" />
        </radialGradient>
        <radialGradient id={face} cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#efe4c8" />
          <stop offset=".8" stopColor="#c8b995" />
          <stop offset="1" stopColor="#8e7a52" />
        </radialGradient>
      </defs>
      {/* dangling chain + rope */}
      <g className="compass-chain">
        <g fill="none" stroke="#7a6a48" strokeWidth="2">
          <ellipse cx="50" cy="101" rx="2.6" ry="4" />
          <ellipse cx="50" cy="107" rx="4" ry="2.6" />
          <ellipse cx="50" cy="113" rx="2.6" ry="4" />
        </g>
        <path d="M50 116c-3 3-1 6 1 8" stroke="#a0804e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      {/* irregular brass rim with verdigris */}
      <path
        d="M50 3c25 .5 46 20 45.5 46.5C95 76 74 97.5 49 97 23 96.5 3.5 75 4 49.5 4.5 24 25 2.5 50 3z"
        fill={`url(#${brass})`}
        stroke="#3a2a10"
        strokeWidth="1.5"
      />
      <circle cx="22" cy="78" r="6" fill="#608c76" opacity=".55" />
      <circle cx="80" cy="18" r="4" fill="#608c76" opacity=".45" />
      <path d="M86 70l6 4" stroke="#3a2a10" strokeWidth="1.5" />
      {/* face */}
      <circle cx="50" cy="50" r="37" fill={`url(#${face})`} stroke="#3a2a10" strokeWidth="1.5" />
      <ellipse cx="62" cy="64" rx="9" ry="6" fill="#8a6a3a" opacity=".2" />
      {TICKS.map((deg) => (
        <path
          key={deg}
          d={deg % 90 === 0 ? "M50 15v6" : "M50 15v3"}
          stroke="#3a2a10"
          strokeWidth={deg % 90 === 0 ? 1.6 : 0.9}
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* imperfect directional letters: W is upside down, E is smug, there is a fifth direction */}
      <g fontFamily="IM Fell English, Georgia, serif" fill="#2a1f10" fontSize="10" textAnchor="middle">
        <text x="50" y="30">N</text>
        <text x="73" y="54" transform="rotate(8 73 54)">E</text>
        <text x="49" y="78">S</text>
        <text x="27" y="46" transform="rotate(180 27 46)">W</text>
        <text x="69" y="34" fontSize="7" fill="#8d1d28">?</text>
      </g>
      {/* scratches */}
      <g stroke="#6a5534" strokeWidth=".6" opacity=".7">
        <path d="M24 38l14 9M64 70l12-5M30 64l6 8M58 22l9 3" />
      </g>
      {/* the needle */}
      <g className="compass-needle" style={{ transform: `rotate(${angle}deg)` }}>
        <g className={idle ? "compass-idle" : undefined}>
          <path d="M50 16l5 34h-10z" fill="#8d1d28" stroke="#3a0a0e" strokeWidth=".8" />
          <path d="M50 84l5-34h-10z" fill="#2c3a3a" stroke="#0a1010" strokeWidth=".8" />
        </g>
      </g>
      {/* central skull */}
      <circle cx="50" cy="50" r="7.5" fill="#c39a43" stroke="#3a2a10" />
      <path d="M50 44.5c-3.2 0-5 2-5 4.6 0 1.5.8 2.6 1.9 3.2v2h6.2v-2c1.1-.6 1.9-1.7 1.9-3.2 0-2.6-1.8-4.6-5-4.6z" fill="#e8ddc2" />
      <circle cx="48.2" cy="49" r="1.1" fill="#090807" />
      <circle cx="51.9" cy="49" r="1.1" fill="#090807" />
      {/* cracked glass */}
      <path d="M22 30l14 12 -4 10 10 8M72 24l-8 14 6 6" stroke="#fff" strokeWidth=".7" fill="none" opacity=".6" />
      <ellipse cx="38" cy="30" rx="12" ry="5" fill="#fff" opacity=".18" transform="rotate(-30 38 30)" />
      {/* hanging ring */}
      <circle cx="50" cy="2.5" r="3" fill="none" stroke="#a8823a" strokeWidth="2" />
    </svg>
  );
}
