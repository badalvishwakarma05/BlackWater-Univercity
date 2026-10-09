import { useSvgId } from "./useSvgId";

interface Props {
  size?: number;
  className?: string;
  color?: "red" | "gold" | "green" | "black";
  label?: string;
  /** Departmental seals come with a tiny skull. It is mandatory. */
  tinySkull?: boolean;
  title?: string;
}

const COLORS = {
  red: ["#c23b45", "#8d1d28", "#4a0b10"],
  gold: ["#e6c372", "#c39a43", "#5e4719"],
  green: ["#7fae95", "#355b48", "#13261d"],
  black: ["#4a4a48", "#1c1b1a", "#000000"],
} as const;

export function WaxSeal({ size = 80, className = "", color = "red", label = "BU", tinySkull = true, title }: Props) {
  const g = useSvgId("seal");
  const [light, mid, dark] = COLORS[color];
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <radialGradient id={g} cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor={light} />
          <stop offset=".55" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      <path
        d="M41 3c5 1 8 4 13 4s9 0 12 5-1 8 2 13 8 8 7 14-6 8-7 13-1 11-6 14-10 0-15 3-9 8-15 7-7-6-12-8-11-2-14-7 0-10-3-15-7-8-6-14 7-7 9-12 0-11 5-14 10 0 14-3 8-7 14-7z"
        fill={`url(#${g})`}
        stroke={dark}
        strokeWidth="1"
      />
      <circle cx="40" cy="40" r="24" fill="none" stroke={dark} strokeWidth="2" opacity=".65" />
      <circle cx="40" cy="40" r="20.5" fill="none" stroke={light} strokeWidth=".8" opacity=".55" strokeDasharray="1.5 2" />
      <g stroke={dark} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".85">
        <path d="M40 30v20" />
        <path d="M34 34h12" />
        <path d="M31 45c2 5 6 7 9 7s7-2 9-7" />
      </g>
      <circle cx="40" cy="28" r="2.4" fill="none" stroke={dark} strokeWidth="1.6" />
      <text x="40" y="62" textAnchor="middle" fontFamily="Pirata One, Georgia, serif" fontSize="9" fill={dark} opacity=".9">
        {label}
      </text>
      {tinySkull && (
        <g transform="translate(51 20) scale(.32)" opacity=".9">
          <path d="M10 0C4 0 0 4 0 10c0 3 2 6 4 7v5h12v-5c2-1 4-4 4-7 0-6-4-10-10-10z" fill={light} />
          <circle cx="6.5" cy="10" r="2.6" fill={dark} />
          <circle cx="13.5" cy="10" r="2.6" fill={dark} />
        </g>
      )}
      <ellipse cx="28" cy="20" rx="8" ry="3" fill="#fff" opacity=".18" transform="rotate(-30 28 20)" />
    </svg>
  );
}
