interface Props {
  size?: number;
  className?: string;
  /** Wears a call-centre headset when on duty at the Mutiny Hotline */
  headset?: boolean;
  title?: string;
}

export function ParrotMascot({ size = 140, className = "", headset = false, title }: Props) {
  return (
    <svg
      viewBox="0 0 140 170"
      width={size}
      height={(size * 170) / 140}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible" }}
    >
      {/* perch */}
      <path d="M10 140h120" stroke="#523826" strokeWidth="8" strokeLinecap="round" />
      <path d="M30 140v30M110 140v30" stroke="#382419" strokeWidth="5" />
      {/* tail */}
      <path d="M62 120l-14 44 10-2 8-40z" fill="#1e5aa8" stroke="#0c2a50" strokeWidth="1.5" />
      <path d="M70 120l-4 48 9-4 2-42z" fill="#c8302a" stroke="#5a0c08" strokeWidth="1.5" />
      {/* body */}
      <path d="M48 70c-6 30 2 56 22 66 20-4 30-26 26-52-4-20-38-34-48-14z" fill="#2f9a4a" stroke="#0f3a1a" strokeWidth="2" />
      {/* wing */}
      <path d="M56 84c-6 18 0 36 14 46 6-12 8-30 0-46-4-6-10-6-14 0z" fill="#c8302a" stroke="#5a0c08" strokeWidth="1.5" />
      <path d="M58 100c4 6 8 10 12 12M58 112c4 4 8 8 12 8" stroke="#1e5aa8" strokeWidth="3" fill="none" />
      {/* feet */}
      <path d="M64 134v8M78 134v8M60 142h8M74 142h8" stroke="#c39a43" strokeWidth="3" strokeLinecap="round" />
      {/* head */}
      <g className="parrot-head">
        <path d="M52 66c-6-24 8-42 28-42 18 0 28 14 26 30-2 14-14 24-30 24-12 0-20-4-24-12z" fill="#3cb85a" stroke="#0f3a1a" strokeWidth="2" />
        <path d="M66 26c4-10 12-14 20-12-6 4-8 8-8 12M74 24c6-8 14-8 18-4" stroke="#c8302a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="86" cy="44" rx="8" ry="9" fill="#f4ecd8" stroke="#0f3a1a" strokeWidth="1.5" />
        <circle cx="88" cy="45" r="3.6" fill="#090807" />
        <circle cx="89" cy="43.5" r="1" fill="#fff" />
        {/* beak */}
        <path d="M98 50c14 0 20 10 16 22-2-6-8-8-14-6-2-6-4-10-2-16z" fill="#e8a33c" stroke="#5a3a10" strokeWidth="1.5" />
        <path d="M98 62c4 2 6 6 4 10-4 0-6-4-4-10z" fill="#3a2a1a" />
        {/* tiny eyepatch strap on the other side, for authenticity */}
        <path d="M60 36l26-6" stroke="#090807" strokeWidth="1.5" opacity=".7" />
        {headset && (
          <g>
            <path d="M58 54c0-24 12-34 30-34" stroke="#2a2622" strokeWidth="4" fill="none" />
            <rect x="52" y="50" width="10" height="16" rx="4" fill="#2a2622" />
            <path d="M58 66c4 10 18 14 34 10" stroke="#2a2622" strokeWidth="2.4" fill="none" />
            <circle cx="94" cy="76" r="3.4" fill="#8d1d28" />
          </g>
        )}
      </g>
    </svg>
  );
}
