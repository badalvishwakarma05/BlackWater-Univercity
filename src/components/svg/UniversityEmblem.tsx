import { SkullMark } from "./UniversitySkull";
import { useSvgId } from "./useSvgId";

interface Props {
  size?: number;
  className?: string;
  title?: string;
}

/** The crest. Commissioned in 1719, allegedly, from a man who owed us money. */
export function UniversityEmblem({ size = 120, className = "", title }: Props) {
  const shield = useSvgId("shield");
  const banner = useSvgId("banner");
  return (
    <svg
      viewBox="0 0 160 180"
      width={size}
      height={(size * 180) / 160}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={shield} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#163e49" />
          <stop offset="1" stopColor="#061316" />
        </linearGradient>
        <path id={banner} d="M14 150c30 10 102 10 132 0" />
      </defs>
      {/* crossed oars behind the shield */}
      <g stroke="#77583a" strokeWidth="6" strokeLinecap="round">
        <path d="M18 20l124 118" />
        <path d="M142 20L18 138" />
      </g>
      <ellipse cx="16" cy="18" rx="7" ry="13" fill="#77583a" transform="rotate(-45 16 18)" />
      <ellipse cx="144" cy="18" rx="7" ry="13" fill="#77583a" transform="rotate(45 144 18)" />
      {/* the shield, chipped on the right */}
      <path
        d="M30 22h100l-2 12 4 3-2 31c0 34-22 56-50 70-28-14-50-36-50-70V22z"
        fill={`url(#${shield})`}
        stroke="#c39a43"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M30 70h100" stroke="#c39a43" strokeWidth="1.5" opacity=".5" />
      <path d="M80 22v112" stroke="#c39a43" strokeWidth="1.5" opacity=".35" />
      <g transform="translate(42 26) scale(.64)">
        <SkullMark />
      </g>
      {/* anchor in the lower quarter */}
      <g stroke="#c39a43" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".9">
        <path d="M80 104v22" />
        <path d="M72 110h16" />
        <path d="M68 118c3 6 7 9 12 9s9-3 12-9" />
      </g>
      {/* banner */}
      <path d="M8 140c32 12 112 12 144 0l-6 18c-30 10-102 10-132 0z" fill="#8d1d28" stroke="#3a0a0e" strokeWidth="2" />
      <text fontFamily="Pirata One, Georgia, serif" fontSize="12.5" fill="#e8ddc2" letterSpacing="1">
        <textPath href={`#${banner}`} startOffset="50%" textAnchor="middle">
          BLACKWATER · EST. 1719?
        </textPath>
      </text>
    </svg>
  );
}
