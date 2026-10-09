import { useSvgId } from "./useSvgId";

interface Props {
  size?: number;
  className?: string;
  /** 0–1 how full of academic despair the jar is */
  level?: number;
  label?: string;
  lidOpen?: boolean;
  settling?: boolean;
  bubbling?: boolean;
}

const PARTICLES: [number, number, number][] = [
  [34, 0.18, 1.6],
  [44, 0.42, 1.2],
  [58, 0.3, 1.8],
  [66, 0.62, 1.3],
  [39, 0.7, 1.1],
  [52, 0.84, 1.5],
  [62, 0.12, 1],
  [30, 0.52, 1.4],
  [70, 0.4, 1.1],
  [48, 0.08, 1.2],
];

/**
 * The legendary jar. Interior spans y=40..118 inside the glass.
 * The dirt height animates with the level; a rough lid can flip open.
 */
export function JarOfDirt({ size = 90, className = "", level = 0.4, label = "DIRT", lidOpen = false, settling = false, bubbling = true }: Props) {
  const clip = useSvgId("jarclip");
  const dirt = useSvgId("dirt");
  const glass = useSvgId("glass");
  const clamped = Math.max(0, Math.min(1, level));
  const top = 118 - clamped * 72;
  return (
    <svg viewBox="0 0 100 130" width={size} height={(size * 130) / 100} className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={clip}>
          <path d="M26 40c-6 4-8 10-8 18v52c0 6 4 10 10 10h44c6 0 10-4 10-10V58c0-8-2-14-8-18z" />
        </clipPath>
        <linearGradient id={dirt} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4a2e" />
          <stop offset=".4" stopColor="#4a3020" />
          <stop offset="1" stopColor="#2a1a10" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9fc7b4" stopOpacity=".35" />
          <stop offset=".5" stopColor="#c8e0d4" stopOpacity=".12" />
          <stop offset="1" stopColor="#6f9584" stopOpacity=".4" />
        </linearGradient>
      </defs>

      {/* glass back */}
      <path d="M26 40c-6 4-8 10-8 18v52c0 6 4 10 10 10h44c6 0 10-4 10-10V58c0-8-2-14-8-18z" fill="#0d2226" opacity=".55" />

      {/* the dirt */}
      <g clipPath={`url(#${clip})`}>
        <g className={settling ? "dirt-settling" : undefined}>
          <path
            d={`M14 ${top + 3} q 8 -6 16 -1 t 16 0 t 16 -2 t 16 2 t 12 0 V 130 H 14 Z`}
            fill={`url(#${dirt})`}
            style={{ transition: "d 1s ease" }}
          />
          {clamped > 0 &&
            PARTICLES.map(([x, depth, r], i) => (
              <circle key={i} cx={x} cy={top + 6 + depth * (118 - top)} r={r} fill={i % 2 ? "#8a6a48" : "#2a1a10"} opacity=".8" />
            ))}
          <path d={`M30 ${top + 12}l3 2M54 ${top + 20}l-2 3M64 ${top + 9}l2 2`} stroke="#9a7a52" strokeWidth="1" />
        </g>
        {bubbling && clamped > 0.1 && (
          <g fill="#c8b995" opacity=".7">
            <circle className="dirt-bubble" cx="40" cy={top + 4} r="1.4" style={{ animationDelay: "0s" }} />
            <circle className="dirt-bubble" cx="60" cy={top + 4} r="1" style={{ animationDelay: "1.4s" }} />
            <circle className="dirt-bubble" cx="50" cy={top + 4} r="1.2" style={{ animationDelay: "2.5s" }} />
          </g>
        )}
      </g>

      {/* glass front with dirty, uneven highlights and scratches */}
      <path
        d="M26 40c-6 4-8 10-8 18v52c0 6 4 10 10 10h44c6 0 10-4 10-10V58c0-8-2-14-8-18z"
        fill={`url(#${glass})`}
        stroke="#3f5f55"
        strokeWidth="2.2"
      />
      <path d="M24 60c-1 14-1 30 1 44" stroke="#e8f4ee" strokeWidth="3" strokeLinecap="round" opacity=".35" fill="none" />
      <path d="M28 54c0 4 0 6 1 8" stroke="#e8f4ee" strokeWidth="2" strokeLinecap="round" opacity=".5" fill="none" />
      <path d="M74 70c1 10 1 20 0 28" stroke="#e8f4ee" strokeWidth="1.4" opacity=".2" fill="none" />
      <path d="M40 62l8 6M62 96l7-3M35 104l4 5" stroke="#e8f4ee" strokeWidth=".6" opacity=".45" />
      <ellipse cx="66" cy="112" rx="6" ry="2.5" fill="#4a3020" opacity=".35" />

      {/* neck */}
      <path d="M28 30h44v10H28z" fill="#1d3a36" opacity=".6" stroke="#3f5f55" strokeWidth="1.6" />

      {/* rope around the neck */}
      <g>
        <path d="M24 37c12 3 40 3 52 0" stroke="#7a5a32" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M24 37c12 3 40 3 52 0" stroke="#b18a52" strokeWidth="5" fill="none" strokeDasharray="3 3" strokeLinecap="round" />
        <path d="M70 39c3 6 2 12-1 16M73 39c4 5 5 10 4 15" stroke="#b18a52" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>

      {/* rough lid (hinges at top-left) */}
      <g className={`jar-lid${lidOpen ? " is-open" : ""}`}>
        <path d="M22 22h56l2 4-1 6H21l-1-5z" fill="#5a4a3a" stroke="#1c140c" strokeWidth="1.6" />
        <path d="M24 22l2-5h48l3 5z" fill="#73614b" stroke="#1c140c" strokeWidth="1.4" />
        <circle cx="34" cy="27" r="1.6" fill="#8a3a1a" opacity=".7" />
        <circle cx="60" cy="25" r="2.4" fill="#8a3a1a" opacity=".55" />
        <path d="M48 17l4-3" stroke="#1c140c" strokeWidth="1.4" />
      </g>

      {/* handwritten label */}
      <g transform="rotate(-6 50 80)">
        <path d="M30 70l40-2 2 22-41 2z" fill="#d6c79c" stroke="#5a4320" strokeWidth="1" />
        <text
          x="51"
          y="84"
          textAnchor="middle"
          fontFamily="IM Fell English, Georgia, serif"
          fontStyle="italic"
          fontSize={label.length > 9 ? 6.4 : label.length > 5 ? 7.4 : 10}
          fill="#2a1a10"
          fontWeight="700"
        >
          {label}
        </text>
      </g>
    </svg>
  );
}
