import { useSvgId } from "./useSvgId";

const WIG_CURLS: [number, number, number][] = [
  [66, 112, 14], [60, 134, 14], [62, 156, 13], [68, 178, 12], [76, 196, 10],
  [154, 112, 14], [160, 134, 14], [158, 156, 13], [152, 178, 12], [144, 196, 10],
  [80, 92, 14], [100, 84, 14], [120, 84, 14], [140, 92, 14],
];

/** The Chancellor: eyepatch AND monocle, because one eye is never enough authority. */
export function ChancellorPortrait({ className = "", size = 220 }: { className?: string; size?: number }) {
  const bg = useSvgId("chbg");
  const frame = useSvgId("chframe");
  return (
    <svg
      viewBox="0 0 220 270"
      width={size}
      height={(size * 270) / 220}
      className={className}
      role="img"
      aria-label="Portrait of the pirate chancellor: a towering powdered wig under a feathered tricorn, an eyepatch, a monocle, a magnificent mustache, and bottle caps pinned on as medals."
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#355b48" />
          <stop offset="1" stopColor="#091f22" />
        </radialGradient>
        <linearGradient id={frame} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6c372" />
          <stop offset=".5" stopColor="#8e7138" />
          <stop offset="1" stopColor="#c39a43" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="135" rx="96" ry="122" fill={`url(#${bg})`} />

      {/* robe + hood */}
      <path d="M26 262c8-52 46-72 84-72s76 20 84 72z" fill="#8d1d28" stroke="#2a0a0e" strokeWidth="2" />
      <path d="M78 196c10 22 54 22 64 0l10 14c-16 26-68 26-84 0z" fill="#c39a43" stroke="#5e4719" strokeWidth="1.5" />
      <path d="M110 214v48" stroke="#2a0a0e" strokeWidth="2" />
      {/* bottle-cap medals */}
      {[
        [74, 230, "#c39a43"],
        [90, 240, "#9f9274"],
        [140, 236, "#608c76"],
      ].map(([x, y, c]) => (
        <g key={`${x}`}>
          <path d={`M${x} ${Number(y) - 14}v10`} stroke="#e8ddc2" strokeWidth="3" />
          <circle cx={x} cy={y} r="7" fill={c as string} stroke="#2a1a10" strokeWidth="1.5" strokeDasharray="2 1" />
        </g>
      ))}

      {/* powdered wig */}
      <g fill="#e8e2d0" stroke="#9f9274" strokeWidth="1.5">
        {WIG_CURLS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>

      {/* face */}
      <path d="M78 130c0-30 14-46 32-46s32 16 32 46c0 30-14 54-32 54s-32-24-32-54z" fill="#c99a74" stroke="#5a3a24" strokeWidth="2" />
      <path d="M94 176c8 6 24 6 32 0" stroke="#8a5a3a" strokeWidth="1.5" fill="none" />

      {/* eyepatch + strap */}
      <path d="M78 104c20 6 44 18 64 28" stroke="#090807" strokeWidth="3" />
      <ellipse cx="96" cy="128" rx="11" ry="9" fill="#090807" />
      {/* monocle eye */}
      <ellipse cx="126" cy="128" rx="7" ry="6" fill="#f4ecd8" />
      <circle cx="127" cy="129" r="3" fill="#090807" />
      <circle cx="126" cy="128" r="11" fill="none" stroke="#c39a43" strokeWidth="2.5" />
      <path d="M136 134c8 12 10 30 4 46" stroke="#c39a43" strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
      {/* eyebrows of authority */}
      <path d="M115 113c6-6 16-6 22 0" stroke="#e8e2d0" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* rum-blossomed nose */}
      <ellipse cx="111" cy="146" rx="9" ry="8" fill="#b4574a" />
      <circle cx="108" cy="143" r="2" fill="#e8a090" opacity=".7" />

      {/* the mustache */}
      <path
        d="M110 158c-10-6-24-6-34 4-6 6-12 6-16 0 2 10 12 14 22 10 10-4 18-8 28-6 10-2 18 2 28 6 10 4 20 0 22-10-4 6-10 6-16 0-10-10-24-10-34-4z"
        fill="#3a2a1c"
        stroke="#1a0f08"
        strokeWidth="1"
      />
      <path d="M102 172c4 2 12 2 16 0" stroke="#5a2a1a" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* tricorn with an unreasonable feather */}
      <path d="M50 92c20-26 100-26 120 0-14-6-24-4-30 2-20-14-40-14-60 0-6-6-16-8-30-2z" fill="#161414" stroke="#c39a43" strokeWidth="2.5" />
      <path d="M70 76c12-30 68-30 80 0z" fill="#161414" stroke="#2a2622" strokeWidth="2" />
      <path d="M140 66c20-40 50-50 70-44-24 2-40 14-50 30 14-12 30-14 42-10-20 2-36 14-46 30z" fill="#8d1d28" stroke="#3a0a0e" strokeWidth="1.5" />
      <g transform="translate(102 56) scale(.22)" opacity=".9">
        <path d="M40 0C18 0 4 14 5 32c1 10 6 16 11 19v12h48V51c5-3 10-9 11-19C76 14 62 0 40 0z" fill="#e8ddc2" />
        <ellipse cx="26" cy="32" rx="8" ry="9" fill="#161414" />
        <ellipse cx="53" cy="32" rx="8" ry="7" fill="#161414" />
      </g>

      {/* goblet in hand */}
      <g transform="translate(160 214) rotate(10)">
        <path d="M0 0h22c0 12-4 18-11 18S0 12 0 0z" fill="#c39a43" stroke="#5e4719" strokeWidth="1.5" />
        <path d="M11 18v10M4 30h14" stroke="#c39a43" strokeWidth="3" />
        <ellipse cx="11" cy="1" rx="10" ry="2.5" fill="#5a1a10" />
        <path d="M-6 26c4-8 14-10 20-4" stroke="#c99a74" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>

      {/* gilded frame, chipped */}
      <ellipse cx="110" cy="135" rx="100" ry="126" fill="none" stroke={`url(#${frame})`} strokeWidth="12" />
      <ellipse cx="110" cy="135" rx="94" ry="120" fill="none" stroke="#3a2a10" strokeWidth="2" />
      <path d="M196 70l10-6M18 190l-8 4" stroke="#091f22" strokeWidth="6" />
    </svg>
  );
}
