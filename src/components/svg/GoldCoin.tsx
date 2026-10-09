import { useSvgId } from "./useSvgId";

interface Props {
  size?: number;
  className?: string;
  flip?: boolean;
}

export function GoldCoin({ size = 40, className = "", flip = false }: Props) {
  const g = useSvgId("coin");
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={g} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#f6e3a1" />
          <stop offset=".45" stopColor="#c39a43" />
          <stop offset="1" stopColor="#6e5527" />
        </radialGradient>
      </defs>
      <g className={flip ? "coin-flip" : undefined} style={{ transformOrigin: "20px 20px" }}>
        <path
          d="M20 2.2c9.6-.3 17.6 7.6 17.8 17.4.2 9.9-7.7 18.2-17.6 18.2C10.3 37.9 2.3 30 2.2 20.3 2 10.6 10.2 2.5 20 2.2z"
          fill={`url(#${g})`}
          stroke="#5a4320"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="20" r="13.5" fill="none" stroke="#8e7138" strokeWidth="1" strokeDasharray="2 1.6" />
        <path
          d="M20 11.5c-4 0-6.6 2.7-6.6 6.1 0 2 1 3.5 2.4 4.2v2.9h8.4v-2.9c1.4-.7 2.4-2.2 2.4-4.2 0-3.4-2.6-6.1-6.6-6.1z"
          fill="#8e7138"
        />
        <circle cx="17.6" cy="17.8" r="1.6" fill="#4b3818" />
        <circle cx="22.6" cy="18.2" r="1.3" fill="#4b3818" />
        <path d="M18 27.5h4M19 25v3M21 25v3" stroke="#4b3818" strokeWidth=".9" />
        <path d="M31 7.5l3.2 2.4" stroke="#4b3818" strokeWidth="1.2" />
        <ellipse cx="13" cy="11" rx="4" ry="1.6" fill="#fff6d0" opacity=".45" transform="rotate(-35 13 11)" />
      </g>
    </svg>
  );
}
