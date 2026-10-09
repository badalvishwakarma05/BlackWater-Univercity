interface Props {
  size?: number;
  className?: string;
  spinning?: boolean;
}

export function ShipWheel({ size = 90, className = "", spinning = false }: Props) {
  const spokes = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <g className={spinning ? "anim-spin-slow" : undefined}>
        {spokes.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 50 50)`}>
            <path d="M49 50V8" stroke="#523826" strokeWidth="4.5" strokeLinecap="round" />
            <ellipse cx="50" cy="5.5" rx="4" ry="5.5" fill="#77583a" stroke="#2a1a10" strokeWidth="1" />
          </g>
        ))}
        <circle cx="50" cy="50" r="31" fill="none" stroke="#382419" strokeWidth="9" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="#77583a" strokeWidth="5" strokeDasharray="12 3" />
        <circle cx="50" cy="50" r="10" fill="#523826" stroke="#2a1a10" strokeWidth="2" />
        <circle cx="50" cy="50" r="4" fill="#c39a43" />
        <path d="M72 30l6-4" stroke="#1a0f08" strokeWidth="2" />
      </g>
    </svg>
  );
}
