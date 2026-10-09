import type { CSSProperties, ElementType, ReactNode } from "react";

export type PanelMaterial =
  | "parchment"
  | "parchment-dark"
  | "lined"
  | "damp"
  | "chart"
  | "wood"
  | "plank"
  | "canvas"
  | "rust"
  | "deep"
  | "wanted";

const MATERIAL: Record<PanelMaterial, { bg: string; tone: "on-paper" | "on-dark" }> = {
  parchment: { bg: "tx-parchment", tone: "on-paper" },
  "parchment-dark": { bg: "tx-parchment-dark", tone: "on-paper" },
  lined: { bg: "tx-paper-lined", tone: "on-paper" },
  damp: { bg: "tx-damp", tone: "on-paper" },
  chart: { bg: "tx-chart", tone: "on-paper" },
  wood: { bg: "tx-wood", tone: "on-dark" },
  plank: { bg: "tx-plank", tone: "on-dark" },
  canvas: { bg: "tx-canvas", tone: "on-paper" },
  rust: { bg: "tx-rust", tone: "on-dark" },
  deep: { bg: "tx-deep", tone: "on-dark" },
  wanted: { bg: "wanted-poster", tone: "on-paper" },
};

type Corner = "tl" | "tr" | "bl" | "br";

interface Props {
  as?: ElementType;
  material?: PanelMaterial;
  tilt?: number;
  torn?: "top" | "bottom" | "both" | "corner";
  nails?: Corner[];
  pin?: boolean;
  tape?: ("left" | "right")[];
  stain?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}

/**
 * The basic building block of every page: a scrap of some material, nailed,
 * pinned or taped to the ship at a slightly wrong angle. The material is a
 * separate background layer so torn edges can clip it without clipping the
 * content, nails, pins or tape.
 */
export function ParchmentPanel({
  as: Tag = "div",
  material = "parchment",
  tilt = 0,
  torn,
  nails = [],
  pin = false,
  tape = [],
  stain = false,
  className = "",
  style,
  children,
  ...aria
}: Props) {
  const look = MATERIAL[material];
  return (
    <Tag
      className={`panel ${look.tone} ${torn ? "panel-torn" : ""} ${className}`}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
      {...aria}
    >
      <div className={`panel-bg ${look.bg} ${torn ? `torn-${torn}` : ""}`} aria-hidden="true" />
      <div className="panel-content">{children}</div>
      {nails.map((corner) => (
        <span key={corner} className={`nail ${corner}`} aria-hidden="true" />
      ))}
      {pin && <span className="pin" aria-hidden="true" />}
      {tape.includes("left") && <span className="tape" style={{ top: -10, left: -18, transform: "rotate(-24deg)" }} aria-hidden="true" />}
      {tape.includes("right") && <span className="tape" style={{ top: -8, right: -20, transform: "rotate(28deg)" }} aria-hidden="true" />}
      {stain && <span className="rum-stain" style={{ right: 10, bottom: 10 }} aria-hidden="true" />}
    </Tag>
  );
}
