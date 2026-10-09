/** The placement cell's recruiter: bandana, hook, and a corporate tie that fits nobody. */
export function PirateRecruiter({ size = 220, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 220 280"
      width={size}
      height={(size * 280) / 220}
      className={className}
      role="img"
      aria-label="A pirate recruiter in a too-small blazer and an absurdly wide, crooked corporate tie, grinning with a gold tooth and holding a clipboard with a hook."
    >
      {/* blazer, two sizes too small */}
      <path d="M36 280c4-56 30-84 74-84s70 28 74 84z" fill="#22303a" stroke="#0a1014" strokeWidth="2" />
      <path d="M70 200c10 30 14 50 14 80M150 200c-10 30-14 50-14 80" stroke="#0a1014" strokeWidth="2" fill="none" />
      {/* striped shirt */}
      <path d="M84 198l26 60 26-60z" fill="#e8ddc2" />
      <g stroke="#8d1d28" strokeWidth="3">
        <path d="M88 206h44M92 216h36M96 226h28M100 236h20" />
      </g>
      {/* the tie: too wide, too short, crooked */}
      <g transform="rotate(14 110 210)">
        <path d="M102 200h18l-4 8z" fill="#c39a43" stroke="#5e4719" strokeWidth="1.5" />
        <path d="M100 208h22l10 30-21 12-21-12z" fill="#c39a43" stroke="#5e4719" strokeWidth="1.5" />
        <g fill="#090807" opacity=".75">
          <circle cx="104" cy="220" r="2.5" />
          <circle cx="118" cy="226" r="2.5" />
          <circle cx="110" cy="238" r="2.5" />
        </g>
      </g>
      {/* face */}
      <path d="M74 120c0-30 16-46 36-46s36 16 36 46-14 66-36 66-36-36-36-66z" fill="#c08a5e" stroke="#4a2e1c" strokeWidth="2" />
      {/* stubble */}
      <path d="M80 150c4 30 18 36 30 36s26-6 30-36c-8 10-18 14-30 14s-22-4-30-14z" fill="#3a2a1c" opacity=".45" />
      {/* eyepatch */}
      <path d="M72 102l76 12" stroke="#090807" strokeWidth="3" />
      <ellipse cx="94" cy="122" rx="10" ry="9" fill="#090807" />
      {/* other eye, enthusiastic */}
      <ellipse cx="128" cy="122" rx="7" ry="7" fill="#f4ecd8" />
      <circle cx="129" cy="123" r="3.4" fill="#090807" />
      <path d="M118 108c6-4 14-4 20 2" stroke="#2a1f14" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* nose */}
      <path d="M110 126c-3 10-4 16 2 18" stroke="#6a4226" strokeWidth="2" fill="none" />
      {/* salesman grin */}
      <path d="M90 156c10 10 32 10 42 0-4 14-38 14-42 0z" fill="#2a0e08" />
      <path d="M93 157h36v4H93z" fill="#f4ecd8" />
      <rect x="104" y="157" width="6" height="5" fill="#c39a43" />
      {/* bandana */}
      <path d="M72 104c2-28 18-40 38-40s36 12 38 40c-20-8-56-8-76 0z" fill="#8d1d28" stroke="#3a0a0e" strokeWidth="2" />
      <path d="M146 96c10 2 18 8 22 16-8-2-14-2-20 0z" fill="#8d1d28" stroke="#3a0a0e" strokeWidth="1.5" />
      <g fill="#e8ddc2">
        <circle cx="90" cy="84" r="2.5" />
        <circle cx="110" cy="78" r="2.5" />
        <circle cx="130" cy="84" r="2.5" />
      </g>
      {/* earring */}
      <circle cx="74" cy="140" r="5" fill="none" stroke="#c39a43" strokeWidth="2.5" />
      {/* clipboard + hook */}
      <g transform="translate(150 196) rotate(10)">
        <rect x="0" y="0" width="48" height="62" rx="3" fill="#77583a" stroke="#2a1a10" strokeWidth="2" />
        <rect x="5" y="8" width="38" height="50" fill="#e8ddc2" />
        <rect x="16" y="-4" width="16" height="10" rx="2" fill="#9f9274" stroke="#2a1a10" />
        <text x="24" y="24" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="11" fill="#8d1d28">OFFER</text>
        <path d="M10 32h28M10 40h22M10 48h26" stroke="#5a4a3a" strokeWidth="1.5" />
        <path d="M-6 52c-10 0-14-10-8-16" stroke="#b8b3a6" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
