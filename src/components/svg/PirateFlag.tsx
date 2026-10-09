import { SkullMark } from "./UniversitySkull";
import { useSvgId } from "./useSvgId";

interface FlagArtProps {
  animated?: boolean;
  fast?: boolean;
  withPole?: boolean;
}

/** The flag as an embeddable <g> in a 240×180 box. */
export function FlagArt({ animated = true, fast = false, withPole = true }: FlagArtProps) {
  const holes = useSvgId("holes");
  return (
    <g>
      <defs>
        <mask id={holes}>
          <rect x="0" y="0" width="240" height="180" fill="#fff" />
          <circle cx="196" cy="34" r="5" fill="#000" />
          <circle cx="58" cy="124" r="3.5" fill="#000" />
          <path d="M150 128l6 4-4 6-5-3z" fill="#000" />
          <circle cx="205" cy="104" r="3" fill="#000" />
        </mask>
      </defs>
      {withPole && (
        <>
          <path d="M8 2v178" stroke="#523826" strokeWidth="6" strokeLinecap="round" />
          <circle cx="8" cy="3" r="5" fill="#c39a43" />
        </>
      )}
      <g className={animated ? `anim-flag${fast ? " anim-flag-fast" : ""}` : undefined}>
        <path
          d="M11 12h206l7 16-10 14 13 18-12 18 14 22-17 16 9 21-13 7H11z"
          fill="#0b0a09"
          stroke="#2a2622"
          strokeWidth="2"
          mask={`url(#${holes})`}
        />
        {/* stitching where a previous captain repaired it badly */}
        <path d="M60 12l4 20M140 144l8-18" stroke="#3a3530" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* crossed bones (one of them is a quill; budget cuts) */}
        <g stroke="#e8ddc2" strokeLinecap="round">
          <path d="M70 136l84-40" strokeWidth="7" />
          <path d="M72 96l84 42" strokeWidth="7" />
        </g>
        <circle cx="68" cy="132" r="5" fill="#e8ddc2" />
        <circle cx="74" cy="140" r="5" fill="#e8ddc2" />
        <circle cx="158" cy="92" r="5" fill="#e8ddc2" />
        <circle cx="152" cy="100" r="5" fill="#e8ddc2" />
        <path d="M158 140l10 6-4-10z" fill="#c39a43" />
        <g transform="translate(62 8) scale(.82)">
          <SkullMark />
        </g>
      </g>
    </g>
  );
}

interface Props {
  width?: number;
  className?: string;
  title?: string;
  fast?: boolean;
}

export function PirateFlag({ width = 240, className = "", title, fast }: Props) {
  return (
    <svg
      viewBox="0 0 240 180"
      width={width}
      height={(width * 180) / 240}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible" }}
    >
      <FlagArt fast={fast} />
    </svg>
  );
}
