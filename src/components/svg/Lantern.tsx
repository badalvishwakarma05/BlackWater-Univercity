import { useSvgId } from "./useSvgId";

interface Props {
  size?: number;
  className?: string;
  lit?: boolean;
  /** Ghostly green, for haunted occasions */
  ghostly?: boolean;
}

export function Lantern({ size = 60, className = "", lit = true, ghostly = false }: Props) {
  const glow = useSvgId("lglow");
  const flame = ghostly ? "#9fe8c8" : "#ffcf6b";
  const core = ghostly ? "#e8fff4" : "#fff4c9";
  return (
    <svg viewBox="0 0 60 116" width={size} height={(size * 116) / 60} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor={flame} stopOpacity=".75" />
          <stop offset="1" stopColor={flame} stopOpacity="0" />
        </radialGradient>
      </defs>
      {lit && <circle cx="30" cy="58" r="30" fill={`url(#${glow})`} className="anim-glow" />}
      <g stroke="#3b2f22" strokeWidth="2" fill="none">
        <ellipse cx="30" cy="4" rx="2.5" ry="4" />
        <ellipse cx="30" cy="11" rx="2.5" ry="4" transform="rotate(90 30 11)" />
        <ellipse cx="30" cy="18" rx="2.5" ry="4" />
      </g>
      <circle cx="30" cy="24" r="4" fill="none" stroke="#4b3a26" strokeWidth="2.4" />
      <path d="M17 34l4-6h18l4 6z" fill="#2f2a24" stroke="#120f0c" />
      <path d="M15 34h30v4H15z" fill="#4a3b2a" />
      <rect
        x="17"
        y="38"
        width="26"
        height="46"
        fill={lit ? "rgba(255,210,120,.18)" : "rgba(30,40,40,.5)"}
        stroke="#1c1712"
        strokeWidth="2"
      />
      {lit && (
        <g className="anim-flicker">
          <path d="M30 52c-5 7-7 11-7 15 0 4 3 7 7 7s7-3 7-7c0-4-2-8-7-15z" fill={flame} />
          <path d="M30 60c-2 4-3 6-3 8s1 3 3 3 3-1 3-3-1-4-3-8z" fill={core} />
        </g>
      )}
      <path d="M30 38v46M17 61h26" stroke="#1c1712" strokeWidth="1.6" />
      <path d="M20 40l20 40" stroke="#e8ddc2" strokeWidth=".6" opacity=".35" />
      <path d="M13 84h34l-3 7H16z" fill="#2f2a24" stroke="#120f0c" />
      <path d="M26 91h8v5h-8z" fill="#2a221a" />
      <circle cx="40" cy="45" r="2" fill="#7a5a2e" opacity=".8" />
    </svg>
  );
}
