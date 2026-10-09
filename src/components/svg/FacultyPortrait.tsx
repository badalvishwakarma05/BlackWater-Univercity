export interface PortraitSpec {
  skin: string;
  coat: string;
  hat: "tricorn" | "bandana" | "captain" | "mortarboard" | "none";
  hatColor?: string;
  hair: "long" | "bun" | "short" | "wild" | "none";
  hairColor: string;
  facialHair: "beard" | "handlebar" | "stubble" | "none";
  accessory: "parrot" | "monocle" | "spectacles" | "eyepatch" | "spyglass" | "none";
  earring?: boolean;
  scar?: boolean;
}

interface Props {
  spec: PortraitSpec;
  className?: string;
  label: string;
}

/**
 * A parametric, entirely fictional faculty portrait. Each accessory sits in its
 * own group (fp-*) so the poster can animate it on hover.
 */
export function FacultyPortrait({ spec, className = "", label }: Props) {
  const { skin, coat, hat, hair, hairColor, facialHair, accessory } = spec;
  const hatColor = spec.hatColor ?? "#161414";
  return (
    <svg viewBox="0 0 160 180" className={className} role="img" aria-label={label}>
      <rect width="160" height="180" fill="#b3a27a" />
      <rect width="160" height="180" fill="#5a4320" opacity=".18" />
      <circle cx="80" cy="80" r="70" fill="#d6c79c" opacity=".55" />

      {/* hair behind the head */}
      {hair === "long" && <path d="M40 80c-4 50 6 80 14 90h52c8-10 18-40 14-90z" fill={hairColor} />}
      {hair === "wild" && (
        <g fill={hairColor}>
          <circle cx="44" cy="72" r="16" />
          <circle cx="116" cy="72" r="16" />
          <circle cx="40" cy="98" r="14" />
          <circle cx="120" cy="98" r="14" />
        </g>
      )}

      {/* shoulders / coat */}
      <path d="M14 180c4-34 30-50 66-50s62 16 66 50z" fill={coat} stroke="#1a0f08" strokeWidth="2" />
      <path d="M62 132l18 26 18-26" fill="#e8ddc2" stroke="#9f9274" strokeWidth="1.2" />

      {/* neck + face */}
      <path d="M68 116h24v20H68z" fill={skin} stroke="#3a2414" strokeWidth="1.5" />
      <path d="M48 80c0-26 14-40 32-40s32 14 32 40c0 24-14 44-32 44s-32-20-32-44z" fill={skin} stroke="#3a2414" strokeWidth="2" />
      <path d="M44 84c-6 0-6 12 2 12M116 84c6 0 6 12-2 12" fill={skin} stroke="#3a2414" strokeWidth="1.5" />

      {hair === "short" && <path d="M48 74c0-22 14-34 32-34s32 12 32 34c-8-12-20-16-32-16s-24 4-32 16z" fill={hairColor} />}
      {hair === "bun" && (
        <g fill={hairColor}>
          <path d="M48 76c0-22 14-36 32-36s32 14 32 36c-10-14-22-18-32-18s-22 4-32 18z" />
          <circle cx="80" cy="34" r="12" />
        </g>
      )}
      {hair === "long" && <path d="M48 76c2-22 14-36 32-36s30 14 32 36c-10-10-20-14-32-14s-22 4-32 14z" fill={hairColor} />}

      {/* eyes */}
      <ellipse cx="66" cy="82" rx="4.5" ry="4" fill="#f4ecd8" />
      <circle cx="67" cy="83" r="2.2" fill="#090807" />
      <ellipse cx="94" cy="82" rx="4.5" ry="4" fill="#f4ecd8" />
      <circle cx="95" cy="83" r="2.2" fill="#090807" />
      {/* tired eyebags (faculty) */}
      <path d="M61 89c3 2 7 2 10 0M89 89c3 2 7 2 10 0" stroke="#7a5236" strokeWidth="1.2" fill="none" />
      <path d="M58 74c5-3 11-3 16 0M86 74c5-3 11-3 16 0" stroke="#2a1f14" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {/* nose + mouth */}
      <path d="M80 86c-3 8-4 12 1 13" stroke="#3a2414" strokeWidth="1.8" fill="none" />
      <path d="M70 108c6 3 14 3 20 0" stroke="#3a1a10" strokeWidth="2" fill="none" strokeLinecap="round" />
      {spec.scar && <path d="M100 70l-8 22" stroke="#8d1d28" strokeWidth="1.6" />}

      {/* facial hair */}
      {facialHair === "beard" && (
        <path d="M50 96c0 24 14 38 30 38s30-14 30-38c-6 10-16 14-30 14s-24-4-30-14z" fill={hairColor} stroke="#1a0f08" strokeWidth="1" />
      )}
      {facialHair === "stubble" && <path d="M54 100c4 18 14 24 26 24s22-6 26-24c-6 8-16 10-26 10s-20-2-26-10z" fill="#2a1f14" opacity=".35" />}
      {(facialHair === "handlebar" || facialHair === "beard") && (
        <g className="fp-mustache">
          <path
            d="M80 102c-6-4-16-4-22 2-4 4-8 4-10 0 1 6 8 9 14 6 6-3 12-5 18-4 6-1 12 1 18 4 6 3 13 0 14-6-2 4-6 4-10 0-6-6-16-6-22-2z"
            fill={facialHair === "handlebar" ? "#2a1f14" : hairColor}
            stroke="#1a0f08"
            strokeWidth=".8"
          />
        </g>
      )}

      {/* accessories */}
      {accessory === "monocle" && (
        <g className="fp-monocle">
          <circle cx="94" cy="82" r="8.5" fill="rgba(232,221,194,.18)" stroke="#c39a43" strokeWidth="2.2" />
          <path d="M101 88c6 10 6 22 0 32" stroke="#c39a43" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        </g>
      )}
      {accessory === "spectacles" && (
        <g className="fp-specs" stroke="#2a1f14" strokeWidth="2" fill="rgba(232,221,194,.15)">
          <circle cx="66" cy="82" r="8" />
          <circle cx="94" cy="82" r="8" />
          <path d="M74 82h12M58 80l-10-4M102 80l10-4" fill="none" />
        </g>
      )}
      {accessory === "eyepatch" && (
        <g className="fp-eyepatch">
          <path d="M46 70l66 16" stroke="#090807" strokeWidth="2.5" />
          <ellipse cx="66" cy="82" rx="9" ry="8" fill="#090807" />
        </g>
      )}
      {accessory === "spyglass" && (
        <g className="fp-spyglass">
          <path d="M104 150l40-46" stroke="#8e7138" strokeWidth="9" strokeLinecap="round" />
          <path d="M110 143l10-12" stroke="#c39a43" strokeWidth="11" />
          <circle cx="144" cy="104" r="5" fill="#163e49" stroke="#c39a43" strokeWidth="2" />
        </g>
      )}
      {spec.earring && <circle cx="45" cy="98" r="4" fill="none" stroke="#c39a43" strokeWidth="2" />}

      {/* hats */}
      {hat !== "none" && (
        <g className="fp-hat">
          {hat === "tricorn" && (
            <>
              <path d="M30 56c18-26 82-26 100 0-12-6-22-4-28 2-14-10-30-10-44 0-6-6-16-8-28-2z" fill={hatColor} stroke="#c39a43" strokeWidth="1.8" />
              <path d="M48 44c8-22 56-22 64 0z" fill={hatColor} />
            </>
          )}
          {hat === "captain" && (
            <>
              <path d="M44 48c0-14 16-22 36-22s36 8 36 22z" fill={hatColor} stroke="#1a0f08" strokeWidth="1.5" />
              <path d="M40 48h80c0 6-4 8-8 8H48c-4 0-8-2-8-8z" fill="#1a1a1a" />
              <path d="M44 46h72" stroke="#c39a43" strokeWidth="3" />
              <circle cx="80" cy="36" r="5" fill="#c39a43" />
            </>
          )}
          {hat === "bandana" && (
            <>
              <path d="M46 66c0-18 14-30 34-30s34 12 34 30c-20-8-48-8-68 0z" fill={hatColor} stroke="#3a0a0e" strokeWidth="1.5" />
              <path d="M112 62c8 2 14 8 16 14-6-2-12-2-16 0z" fill={hatColor} />
              <circle cx="66" cy="50" r="2" fill="#e8ddc2" />
              <circle cx="88" cy="46" r="2" fill="#e8ddc2" />
            </>
          )}
          {hat === "mortarboard" && (
            <>
              <path d="M54 52h52l-2 10H56z" fill={hatColor} />
              <path d="M28 46l52-16 52 14-52 16z" fill={hatColor} stroke="#c39a43" strokeWidth="1.5" />
              <path d="M80 44h36v20" stroke="#c39a43" strokeWidth="2" fill="none" />
              <circle cx="116" cy="66" r="3" fill="#c39a43" />
            </>
          )}
        </g>
      )}

      {accessory === "parrot" && (
        <g className="fp-parrot">
          <path d="M120 140c-4-16 2-30 14-32 10-2 18 8 16 20-2 10-10 16-20 16z" fill="#2f9a4a" stroke="#0f3a1a" strokeWidth="1.5" />
          <path d="M122 128c-2 8 0 14 6 18 2-6 2-12-2-18z" fill="#c8302a" />
          <circle cx="140" cy="116" r="3" fill="#f4ecd8" />
          <circle cx="141" cy="116" r="1.4" fill="#090807" />
          <path d="M146 120c6 0 8 6 6 10-2-2-5-3-8-2z" fill="#e8a33c" />
        </g>
      )}
    </svg>
  );
}
