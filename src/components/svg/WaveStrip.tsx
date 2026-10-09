import type { CSSProperties } from "react";

interface Props {
  color?: string;
  foam?: string;
  height?: number | string;
  speed?: number;
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 0–1, how choppy the sea is */
  chop?: number;
}

/**
 * An endlessly scrolling strip of sea. The path repeats every 300 units and the
 * SVG is twice the container width, so translating by -50% loops seamlessly.
 */
export function WaveStrip({
  color = "#102f35",
  foam = "#608c76",
  height = 60,
  speed = 12,
  reverse = false,
  className = "",
  style,
  chop = 0.6,
}: Props) {
  const a = 6 + chop * 18;
  const crest = Array.from({ length: 8 }, (_, i) => i * 300)
    .map((x) => `Q ${x + 75} ${30 - a} ${x + 150} 30 Q ${x + 225} ${30 + a * 0.6} ${x + 300} 30`)
    .join(" ");
  const svgStyle = { width: "200%", maxWidth: "none", height: "100%", display: "block", "--wave-speed": `${speed}s` } as CSSProperties;
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} style={{ height, ...style }} aria-hidden="true">
      <svg viewBox="0 0 2400 60" preserveAspectRatio="none" className={reverse ? "anim-wave-rev" : "anim-wave"} style={svgStyle}>
        <path d={`M0 30 ${crest} V60 H0 Z`} fill={color} />
        <path d={`M0 30 ${crest}`} fill="none" stroke={foam} strokeWidth="2.5" strokeDasharray="14 9 4 9" opacity=".7" />
      </svg>
    </div>
  );
}
