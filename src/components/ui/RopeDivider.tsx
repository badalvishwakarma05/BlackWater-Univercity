interface Props {
  className?: string;
  knots?: number;
  /** Slight droop in the middle, like a rope that has given up */
  sag?: number;
}

/** A frayed rope strung across the page. Purely decorative. */
export function RopeDivider({ className = "", knots = 2, sag = 10 }: Props) {
  const knotXs = Array.from({ length: knots }, (_, i) => ((i + 1) * 1000) / (knots + 1));
  const y = (x: number) => 12 + sag * Math.sin((Math.PI * x) / 1000);
  return (
    <div className={`rope-divider anim-rope ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1000 34" preserveAspectRatio="none" width="100%" height="34">
        <path d={`M0 12 Q 500 ${12 + sag * 2} 1000 12`} stroke="#5a3f22" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={`M0 12 Q 500 ${12 + sag * 2} 1000 12`} stroke="#b18a52" strokeWidth="8" fill="none" strokeDasharray="7 6" strokeLinecap="round" />
        {knotXs.map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={y(x)} rx="10" ry="8" fill="#8f6b3d" stroke="#3a2a14" strokeWidth="2" />
            <path d={`M${x - 3} ${y(x) + 6}l-4 12M${x + 3} ${y(x) + 6}l5 10`} stroke="#8f6b3d" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </div>
  );
}
