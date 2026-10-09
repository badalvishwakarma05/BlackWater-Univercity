import { useSvgId } from "./useSvgId";

interface Props {
  width?: number;
  className?: string;
  flipped?: boolean;
}

const SUCKERS: [number, number, number][] = [
  [52, 196, 5],
  [50, 178, 4.6],
  [52, 160, 4.4],
  [56, 143, 4],
  [62, 127, 3.6],
  [68, 112, 3.2],
  [74, 97, 2.8],
  [78, 82, 2.4],
  [80, 68, 2],
];

export function KrakenTentacle({ width = 120, className = "", flipped = false }: Props) {
  const g = useSvgId("tent");
  return (
    <svg
      viewBox="0 0 120 220"
      width={width}
      height={(width * 220) / 120}
      className={className}
      aria-hidden="true"
      style={flipped ? { transform: "scaleX(-1)" } : undefined}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1c2b33" />
          <stop offset=".5" stopColor="#3b3550" />
          <stop offset="1" stopColor="#5e4a6b" />
        </linearGradient>
      </defs>
      <g className="anim-tentacle">
        <path
          d="M40 220c-6-40 0-70 14-96 12-22 26-40 26-62 0-16-10-28-22-28-9 0-14 7-12 14 2 6 9 6 10 1-6 0-5-7 2-6 8 1 12 9 10 18-3 14-14 28-26 44-16 22-26 50-22 115z"
          fill={`url(#${g})`}
          stroke="#0d1418"
          strokeWidth="2"
        />
        {SUCKERS.map(([cx, cy, r]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={r} fill="#c9a6b8" stroke="#5e4a6b" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={r * 0.45} fill="#7d5b70" />
          </g>
        ))}
      </g>
    </svg>
  );
}
