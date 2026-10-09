interface Props {
  size?: number;
  className?: string;
  /** "judging" raises one eyebrow even higher */
  mood?: "neutral" | "judging";
}

/** The registrar: theatrical, bearded, enormously hatted, and deeply judgmental. */
export function BarbosaRegistrar({ size = 240, className = "", mood = "judging" }: Props) {
  const browLift = mood === "judging" ? -6 : 0;
  return (
    <svg
      viewBox="0 0 240 260"
      width={size}
      height={(size * 260) / 240}
      className={className}
      role="img"
      aria-label="The admissions registrar: a grizzled pirate with a vast feathered hat, a braided beard, spectacles on the tip of his nose and a gold-toothed grin, holding a quill."
    >
      {/* coat */}
      <path d="M30 260c6-50 40-70 90-70s84 20 90 70z" fill="#163e49" stroke="#061316" strokeWidth="2" />
      <path d="M100 196l20 30 20-30" fill="#e8ddc2" stroke="#9f9274" strokeWidth="1.5" />
      <path d="M104 206c6 8 26 8 32 0M106 216c6 8 22 8 28 0" stroke="#9f9274" strokeWidth="1.5" fill="none" />
      {[230, 246].map((y) => (
        <g key={y}>
          <circle cx="92" cy={y} r="4" fill="#c39a43" />
          <circle cx="148" cy={y} r="4" fill="#c39a43" />
        </g>
      ))}

      {/* face */}
      <path d="M80 110c0-26 18-40 40-40s40 14 40 40v26c0 26-18 46-40 46s-40-20-40-46z" fill="#b98a66" stroke="#4a2e1c" strokeWidth="2" />
      <path d="M88 132c4 2 8 2 12 0M140 132c-4 2-8 2-12 0M92 148c-2 6 0 10 4 12" stroke="#7a5236" strokeWidth="1.4" fill="none" />

      {/* eyes: one squinting, one wide with judgment */}
      <path d="M92 122c4-3 10-3 14 0" stroke="#1a0f08" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="134" cy="122" rx="6" ry="5" fill="#f2e8d2" />
      <circle cx="135" cy="123" r="2.6" fill="#1a0f08" />
      {/* eyebrows */}
      <path d="M86 112c8-6 16-6 22-2" stroke="#4a4a40" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={`M126 ${110 + browLift}c6-8 14-8 20-2`} stroke="#4a4a40" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* nose + spectacles perched at its very tip */}
      <path d="M118 124c-4 12-6 18-2 22 4 2 8 0 10-2" fill="#a87856" stroke="#4a2e1c" strokeWidth="1.5" />
      <g stroke="#c39a43" strokeWidth="1.8" fill="rgba(232,221,194,.25)">
        <circle cx="111" cy="144" r="6" />
        <circle cx="128" cy="144" r="6" />
        <path d="M117 144h5" fill="none" />
      </g>

      {/* braided beard */}
      <path d="M82 146c-2 40 14 74 38 82 24-8 40-42 38-82-10 12-24 16-38 16s-28-4-38-16z" fill="#5a4a3a" stroke="#2a1f14" strokeWidth="2" />
      <path d="M100 196c0 16 2 30-2 44M140 196c0 16-2 30 2 44" stroke="#5a4a3a" strokeWidth="9" strokeLinecap="round" />
      <path d="M100 206h6M100 218h6M134 206h6M134 218h6" stroke="#2a1f14" strokeWidth="2" />
      <circle cx="98" cy="242" r="4" fill="#8d1d28" />
      <circle cx="142" cy="242" r="4" fill="#c39a43" />
      {/* the grin, with gold tooth */}
      <path d="M100 168c10 10 30 10 40 0-6 14-34 14-40 0z" fill="#2a0e08" />
      <path d="M104 169h32v4h-32z" fill="#e8ddc2" />
      <rect x="120" y="169" width="6" height="5" fill="#c39a43" />
      {/* mustache */}
      <path d="M96 162c8-6 18-6 24-2 6-4 16-4 24 2-8 0-14 4-24 2-10 2-16-2-24-2z" fill="#4a3c2e" />

      {/* the gigantic hat */}
      <ellipse cx="120" cy="80" rx="112" ry="22" fill="#2a1d14" stroke="#0e0905" strokeWidth="2" />
      <path d="M70 80c0-40 20-58 50-58s50 18 50 58z" fill="#3a2a1c" stroke="#0e0905" strokeWidth="2" />
      <path d="M70 70h100" stroke="#8d1d28" strokeWidth="8" />
      {/* plumes */}
      <path d="M150 40c30-30 70-34 86-20-30-2-50 10-64 28 20-14 44-14 58-6-26 0-46 10-62 24z" fill="#d8d0bc" stroke="#7a7466" strokeWidth="1.5" />
      <path d="M156 52c20-10 40-6 50 4" stroke="#9f9274" strokeWidth="1.5" fill="none" />
      <path d="M60 50c-20-20-40-22-56-14 20 0 34 8 44 22z" fill="#608c76" stroke="#2a4a3a" strokeWidth="1.5" />

      {/* hand with quill */}
      <g transform="translate(188 186) rotate(-20)">
        <ellipse cx="0" cy="12" rx="12" ry="10" fill="#b98a66" stroke="#4a2e1c" strokeWidth="1.5" />
        <path d="M2 8l30-60c4 6 4 14 0 20-8 14-18 26-28 42z" fill="#e8ddc2" stroke="#9f9274" strokeWidth="1.2" />
        <path d="M4 6l26-56" stroke="#9f9274" strokeWidth="1" />
      </g>
    </svg>
  );
}
