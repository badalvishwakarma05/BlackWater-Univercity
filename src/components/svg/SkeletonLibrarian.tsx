import { Lantern } from "./Lantern";

interface Props {
  size?: number;
  className?: string;
}

/** The librarian. Formal. Ominous. Deceased since the last budget meeting. */
export function SkeletonLibrarian({ size = 220, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 220 300"
      width={size}
      height={(size * 300) / 220}
      className={className}
      role="img"
      aria-label="A skeleton librarian in half-moon spectacles and a moth-eaten shawl, one bony finger raised for silence, holding a candle."
    >
      {/* shawl */}
      <path d="M30 300c4-60 30-96 80-96s76 36 80 96z" fill="#4a2e3e" stroke="#1e1018" strokeWidth="2" />
      <path d="M58 220l52 50 52-50" fill="none" stroke="#6b4a5a" strokeWidth="6" />
      <circle cx="80" cy="260" r="5" fill="#091f22" />
      <circle cx="146" cy="276" r="4" fill="#091f22" />
      {/* ribcage peeking out */}
      <g stroke="#e8ddc2" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M110 214v60" />
        <path d="M96 226c-8 2-12 8-12 12M124 226c8 2 12 8 12 12" />
        <path d="M96 240c-8 2-12 8-12 12M124 240c8 2 12 8 12 12" />
      </g>
      {/* name badge */}
      <rect x="138" y="232" width="40" height="16" fill="#c8b995" stroke="#5a4320" transform="rotate(8 158 240)" />
      <text x="158" y="244" textAnchor="middle" fontSize="7" fontFamily="Special Elite, monospace" fill="#090807" transform="rotate(8 158 240)">
        LIBRARIAN
      </text>

      {/* neck */}
      <path d="M102 186h16v22h-16z" fill="#d8ceb4" stroke="#5a5240" />
      <path d="M102 194h16M102 202h16" stroke="#5a5240" />

      {/* skull */}
      <path d="M110 70c-30 0-46 20-44 46 1 16 8 26 16 30v24c0 6 4 10 10 10h36c6 0 10-4 10-10v-24c8-4 15-14 16-30 2-26-14-46-44-46z" fill="#e8ddc2" stroke="#2a2622" strokeWidth="2.4" />
      {/* hair bun of cobwebs with a pencil stuck through */}
      <circle cx="110" cy="66" r="18" fill="#b8b3a6" stroke="#6f6a5c" strokeWidth="1.5" />
      <path d="M96 60c8 4 20 4 28 0M98 70c8 3 16 3 24 0" stroke="#6f6a5c" strokeWidth="1" fill="none" />
      <path d="M86 52l52 22" stroke="#c39a43" strokeWidth="4" strokeLinecap="round" />
      <path d="M136 73l6 2" stroke="#e8a0a0" strokeWidth="4" />
      {/* eye sockets */}
      <ellipse cx="94" cy="118" rx="11" ry="12" fill="#0b1210" />
      <ellipse cx="126" cy="118" rx="11" ry="12" fill="#0b1210" />
      <circle cx="94" cy="120" r="2.4" fill="#9fe8c8" className="eye-glow" />
      <circle cx="126" cy="120" r="2.4" fill="#9fe8c8" className="eye-glow" />
      {/* half-moon spectacles */}
      <g stroke="#c39a43" strokeWidth="2" fill="rgba(232,221,194,.15)">
        <path d="M80 124h26c0 8-6 12-13 12s-13-4-13-12z" />
        <path d="M114 124h26c0 8-6 12-13 12s-13-4-13-12z" />
        <path d="M106 125h8" fill="none" />
        <path d="M80 124l-12-6M140 124l12-6" fill="none" />
      </g>
      {/* nose + teeth */}
      <path d="M110 136l-5 10h10z" fill="#0b1210" />
      <path d="M88 160h44v8H88z" fill="#f2ead6" stroke="#2a2622" strokeWidth="1.5" />
      <path d="M96 160v8M104 160v8M112 160v8M120 160v8" stroke="#2a2622" />

      {/* arm raised: "shhh" */}
      <g stroke="#e8ddc2" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M54 270c-10-30-6-60 10-80" />
        <path d="M64 190c10-14 18-24 30-30" />
      </g>
      <g stroke="#e8ddc2" strokeWidth="3.4" strokeLinecap="round">
        <path d="M94 160l8-22" />
        <path d="M92 162l6-6M90 166l6-4" />
      </g>
      <circle cx="64" cy="190" r="5" fill="#e8ddc2" />

      {/* candle hand */}
      <g transform="translate(160 160)">
        <Lantern size={36} ghostly />
      </g>
      <path d="M178 238c6-18 4-34 0-48" stroke="#e8ddc2" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
