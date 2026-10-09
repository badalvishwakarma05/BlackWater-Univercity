interface Props {
  size?: number;
  className?: string;
}

export function CannonBlast({ size = 260, className = "" }: Props) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="90" fill="#c39a43" opacity=".18" />
      <path
        d="M100 8l14 52 44-36-18 52 52-4-44 30 44 30-54-6 20 52-46-34-12 52-14-52-44 34 18-52-54 6 46-30-46-30 54 6-20-52 46 34z"
        fill="#e8a33c"
        stroke="#8d1d28"
        strokeWidth="3"
      />
      <path
        d="M100 38l9 34 30-22-12 34 34-2-30 20 30 20-36-4 14 34-30-22-9 34-9-34-30 22 12-34-36 4 30-20-30-20 36 2-14-34 30 22z"
        fill="#ffe9a8"
      />
      <circle cx="100" cy="100" r="18" fill="#fff8e0" />
      <g fill="#3a3a38" opacity=".75">
        <circle cx="30" cy="40" r="16" />
        <circle cx="168" cy="160" r="20" />
        <circle cx="160" cy="34" r="12" />
        <circle cx="38" cy="168" r="14" />
      </g>
    </svg>
  );
}
