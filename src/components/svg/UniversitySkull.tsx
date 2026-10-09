interface MarkProps {
  bone?: string;
  ink?: string;
  gold?: string;
}

/**
 * The arrogant, academically unqualified skull in a graduation cap.
 * Drawn in a 120×130 box so it can be embedded in other SVGs as a <g>.
 */
export function SkullMark({ bone = "#e8ddc2", ink = "#090807", gold = "#c39a43" }: MarkProps) {
  return (
    <g>
      {/* cranium */}
      <path
        d="M60 34C33 33 21 52 23 72c1 12 7 18 13 21v11c0 4 4 6 8 6h32c4 0 8-2 8-6V93c6-3 12-10 13-21 2-20-10-39-37-38z"
        fill={bone}
        stroke={ink}
        strokeWidth="2.5"
      />
      {/* crack */}
      <path d="M74 38l-3 8 5 4-4 7" fill="none" stroke={ink} strokeWidth="1.6" />
      {/* smug raised brow over the monocle eye */}
      <path d="M33 56c6-6 15-7 24-1" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      {/* big round eye (monocle side) */}
      <ellipse cx="45" cy="70" rx="10" ry="11" fill={ink} />
      <circle cx="48" cy="67" r="2" fill={bone} opacity=".55" />
      {/* narrowed contemptuous squint */}
      <path d="M65 71c6-8 15-9 21-2-6 6-14 7-21 2z" fill={ink} />
      <path d="M63 63l23-4" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
      {/* nose */}
      <path d="M60 78l-5 10h10z" fill={ink} />
      {/* smirking teeth */}
      <path d="M40 97c12 2 26 0 42-6" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M46 97.5v8M53 98v8M60 97.6v8M67 96.4v8M74 94v8" stroke={ink} strokeWidth="1.8" />
      {/* monocle + chain */}
      <circle cx="45" cy="70" r="13.5" fill="none" stroke={gold} strokeWidth="2.6" />
      <path d="M32.5 74c-6 10-6 20 0 28" fill="none" stroke={gold} strokeWidth="1.2" strokeDasharray="2 2" />
      {/* "D-" scrawled on the forehead */}
      <text x="78" y="56" fontFamily="IM Fell English, Georgia, serif" fontStyle="italic" fontSize="11" fill="#8d1d28" transform="rotate(-12 78 56)">
        D-
      </text>
      {/* mortarboard, worn rakishly */}
      <g transform="rotate(-11 60 30)">
        <path d="M37 33h46l-2 13c-12 4-30 4-42 0z" fill={ink} stroke={gold} strokeWidth="1.2" />
        <path d="M10 27l50-17 50 15-50 18z" fill={ink} stroke={gold} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 27.5l46 14" stroke="#2a2622" strokeWidth="1" />
        <circle cx="60" cy="26" r="2.6" fill={gold} />
        {/* frayed rope tassel */}
        <path d="M60 26c14 0 30 0 42 3l2 22" fill="none" stroke={gold} strokeWidth="2" />
        <path d="M101 50l-3 10M104 51l0 11M106 50l3 10M103 51l-1 12" stroke={gold} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

interface Props {
  size?: number;
  className?: string;
  title?: string;
}

export function UniversitySkull({ size = 120, className = "", title }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <SkullMark />
    </svg>
  );
}
