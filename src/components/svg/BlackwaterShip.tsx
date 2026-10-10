import { FlagArt } from "./PirateFlag";
import { useSvgId } from "./useSvgId";

interface ShipArtProps {
  variant?: "blackwater" | "pearl";
  rocking?: boolean;
}

/**
 * The ship, as an embeddable <g> in a 420×340 box.
 * "blackwater": the university's own leaky flagship.
 * "pearl": the jet-black storm ship that appears when the Konami code is entered.
 */
export function ShipArt({ variant = "blackwater", rocking = true }: ShipArtProps) {
  const hull = useSvgId("hull");
  const sailGrad = useSvgId("sail");
  const pearl = variant === "pearl";
  const sailFill = pearl ? "#0a0b0c" : "#151a1a";
  const sailEdge = pearl ? "#3a3f44" : "#2c3433";
  const trim = pearl ? "#c9c3b0" : "#c39a43";
  return (
    <g className={rocking ? "anim-ship-rock" : undefined}>
      <defs>
        <linearGradient id={hull} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pearl ? "#1c1a18" : "#523826"} />
          <stop offset=".6" stopColor={pearl ? "#0d0c0b" : "#382419"} />
          <stop offset="1" stopColor={pearl ? "#050505" : "#1c120c"} />
        </linearGradient>
        <linearGradient id={sailGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={sailFill} />
          <stop offset=".6" stopColor={pearl ? "#1d2024" : "#222a29"} />
          <stop offset="1" stopColor={sailFill} />
        </linearGradient>
      </defs>

      {/* rigging lines */}
      <g stroke={pearl ? "#6f6a5e" : "#8e7138"} strokeWidth="1" opacity=".55" fill="none">
        <path d="M215 18L40 210M215 18L398 208M130 62L52 214M130 62L250 230M305 70L392 212M305 70L220 228" />
        <path d="M215 18L130 62L305 70z" />
        <path d="M60 205l6 -8M72 196l6-8M84 186l6-8M96 177l6-8" />
      </g>

      {/* masts */}
      <g stroke="#2a1a10" strokeWidth="1.5">
        <rect x="127" y="56" width="6" height="190" fill="#523826" />
        <rect x="212" y="12" width="7" height="236" fill="#523826" />
        <rect x="302" y="64" width="6" height="180" fill="#523826" transform="rotate(3 305 150)" />
      </g>

      {/* yards */}
      <g stroke="#2a1a10" strokeWidth="1" fill="#6b4a2e">
        <rect x="88" y="78" width="86" height="4" rx="2" />
        <rect x="94" y="150" width="76" height="4" rx="2" />
        <rect x="160" y="40" width="112" height="5" rx="2" />
        <rect x="150" y="122" width="128" height="5" rx="2" />
        <rect x="268" y="86" width="76" height="4" rx="2" transform="rotate(4 305 88)" />
        <rect x="264" y="156" width="84" height="4" rx="2" transform="rotate(3 305 158)" />
      </g>

      {/* tattered sails */}
      <g stroke={sailEdge} strokeWidth="1.5">
        <path className="sail" d="M92 82h78c4 22 4 44-2 66l-8-6-6 7-10-5-9 6-8-7-10 5-7-6c-6-20-6-40-18-60z" fill={`url(#${sailGrad})`} />
        <path className="sail" d="M164 45h104c6 26 6 52-2 76l-9-7-8 8-11-6-10 8-12-7-10 6-11-8-10 7-11-6c-6-24-6-48-10-71z" fill={`url(#${sailGrad})`} />
        <path className="sail" d="M156 127h116c4 30 2 60-6 86l-12-8-10 9-14-7-12 9-14-8-12 8-12-9-10 6c-8-26-10-54-14-86z" fill={`url(#${sailGrad})`} />
        <path className="sail" d="M272 92l70 4c4 20 2 40-4 58l-9-5-8 6-10-6-9 5-10-6-8 4c-4-18-6-38-12-60z" fill={`url(#${sailGrad})`} />
        <path className="sail" d="M98 155h68c2 20 0 38-6 54l-8-5-8 6-9-6-8 5-9-5-6 3c-4-16-8-34-14-52z" fill={`url(#${sailGrad})`} />
      </g>
      {/* holes in the sails */}
      <g fill={pearl ? "#02080a" : "#061316"}>
        <ellipse cx="226" cy="80" rx="7" ry="5" />
        <ellipse cx="190" cy="168" rx="5" ry="8" />
        <path d="M118 108l8 3-3 8-7-4z" />
        <ellipse cx="312" cy="120" rx="4" ry="6" />
      </g>
      {/* a crude skull painted on the main sail */}
      <g opacity=".75" transform="translate(196 140) scale(.42)">
        <path d="M40 0C18 0 4 14 5 32c1 10 6 16 11 19v12h48V51c5-3 10-9 11-19C76 14 62 0 40 0z" fill={pearl ? "#c9c3b0" : "#c8b995"} />
        <ellipse cx="26" cy="32" rx="8" ry="9" fill={sailFill} />
        <ellipse cx="53" cy="32" rx="8" ry="7" fill={sailFill} />
        <path d="M40 40l-5 9h10z" fill={sailFill} />
      </g>

      {/* crow's nest */}
      <path d="M204 64h23l-3 12h-17z" fill="#382419" stroke="#1a0f08" />
      <path d="M206 64v-6M225 64v-6M204 58h23" stroke="#382419" strokeWidth="2" />

      {/* flag on the mainmast - waving gently in the wind with skull mark */}
      <g transform="translate(217 -6) scale(.40)">
        <FlagArt fast={false} withPole={false} />
      </g>
      <path d="M332 74l18 4-18 6z" fill="#8d1d28" className="anim-flag" />

      {/* bowsprit + jib */}
      <path d="M368 222l50-30" stroke="#523826" strokeWidth="5" strokeLinecap="round" />
      <path className="sail" d="M366 210l44-24-8 30-10-2-8 6z" fill={`url(#${sailGrad})`} stroke={sailEdge} />

      {/* hull */}
      <path
        d="M28 196l82 6 4 30h246c14 0 28-8 42-22l-4 34c-10 42-56 62-104 64H128c-50 0-84-24-94-70z"
        fill={`url(#${hull})`}
        stroke="#0e0905"
        strokeWidth="2.5"
      />
      {/* stern castle windows */}
      <g fill="#ffcf6b" opacity=".85">
        <rect x="44" y="210" width="9" height="11" rx="2" />
        <rect x="60" y="211" width="9" height="11" rx="2" />
        <rect x="76" y="212" width="9" height="11" rx="2" opacity=".4" />
      </g>
      {/* planks */}
      <g stroke="#0e0905" strokeWidth="1.2" opacity=".75" fill="none">
        <path d="M40 246c90 6 240 6 360-6" />
        <path d="M48 266c100 6 220 6 340-8" />
        <path d="M70 288c90 6 180 6 280-6" />
        <path d="M140 232v10M220 233v12M300 232v8M180 262l2 8M260 263l-2 8" />
      </g>
      {/* gold trim + name */}
      <path d="M114 232h246" stroke={trim} strokeWidth="2.5" opacity=".85" />
      <text
        x="236"
        y="257"
        textAnchor="middle"
        fontFamily="Pirata One, Georgia, serif"
        fontSize="17"
        fontWeight="bold"
        fill={trim}
        letterSpacing="3.5"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.95)) drop-shadow(0 0 6px rgba(195,154,67,0.5))"
      >
        {pearl ? "THE BLACKER PEARL" : "BLACKWATER"}
      </text>
      {/* gun ports */}
      <g fill="#050302">
        {[150, 190, 270, 310, 350].map((x) => (
          <rect key={x} x={x} y="270" width="12" height="9" rx="1.5" />
        ))}
      </g>
      {/* a patch, a barnacle cluster, and a leak */}
      <rect x="226" y="276" width="20" height="14" fill="#77583a" stroke="#1a0f08" transform="rotate(-8 236 283)" />
      <path d="M228 278l16 10M244 278l-16 10" stroke="#1a0f08" strokeWidth="1" />
      <g fill="#b9b09a">
        <circle cx="120" cy="290" r="3" />
        <circle cx="127" cy="294" r="2.2" />
        <circle cx="114" cy="296" r="2" />
      </g>
      {/* stern lanterns */}
      <circle cx="30" cy="190" r="5" fill="#ffcf6b" className="anim-flicker" />
      <circle cx="30" cy="190" r="12" fill="#ffcf6b" opacity=".2" className="anim-glow" />
    </g>
  );
}

interface Props {
  width?: number;
  className?: string;
  variant?: "blackwater" | "pearl";
  title?: string;
  rocking?: boolean;
}

export function BlackwaterShip({ width = 420, className = "", variant = "blackwater", title, rocking = true }: Props) {
  return (
    <svg
      viewBox="0 -10 420 350"
      width={width}
      height={(width * 350) / 420}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible" }}
    >
      <ShipArt variant={variant} rocking={rocking} />
    </svg>
  );
}
