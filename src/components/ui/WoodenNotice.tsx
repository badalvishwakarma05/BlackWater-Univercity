import type { ReactNode } from "react";

interface Props {
  title: ReactNode;
  children?: ReactNode;
  tilt?: number;
  className?: string;
  as?: "div" | "section" | "aside";
  headingLevel?: 2 | 3;
}

/** A painted wooden sign nailed to the bulkhead. */
export function WoodenNotice({ title, children, tilt = -0.8, className = "", as: Tag = "div", headingLevel = 2 }: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Tag className={`wooden-notice tx-plank storm-wobble ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <span className="nail tl" aria-hidden="true" />
      <span className="nail tr" aria-hidden="true" />
      <span className="nail bl" aria-hidden="true" />
      <span className="nail br" aria-hidden="true" />
      <Heading className="wooden-notice-title">{title}</Heading>
      {children && <div className="wooden-notice-body">{children}</div>}
    </Tag>
  );
}
