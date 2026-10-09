import { Lantern } from "./Lantern";
import { useSvgId } from "./useSvgId";

/** An original deep-sea skeletal captain, crusted in barnacles and coral, for The Abyss. */
export function SkeletonCaptain({ className = "" }: { className?: string }) {
  const coat = useSvgId("capcoat");
  const eye = useSvgId("capeye");
  return (
    <svg
      viewBox="0 0 400 560"
      className={className}
      role="img"
      aria-label="A towering skeletal pirate captain rising from the deep, in a rotting greatcoat and feathered tricorn, eyes glowing sea-green, barnacles and coral on his bones, a crab on his shoulder and a ghostly lantern in hand."
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={coat} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2a2e" />
          <stop offset="1" stopColor="#071214" />
        </linearGradient>
        <radialGradient id={eye}>
          <stop offset="0" stopColor="#bfffe6" />
          <stop offset=".4" stopColor="#3bd1a0" stopOpacity=".8" />
          <stop offset="1" stopColor="#3bd1a0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* greatcoat, tattered at the hem */}
      <path
        d="M70 560l10-150c4-60 30-110 80-130h80c50 20 76 70 80 130l10 150-20-14-14 18-18-16-16 16-20-18-16 18-22-18-20 16-18-16-16 18-18-16-16 14-16-14z"
        fill={`url(#${coat})`}
        stroke="#020607"
        strokeWidth="3"
      />
      {/* lapels with gold trim and buttons */}
      <path d="M160 280l40 130 40-130" fill="none" stroke="#8e7138" strokeWidth="5" />
      {[320, 350, 380, 410].map((y) => (
        <g key={y}>
          <circle cx="150" cy={y} r="5" fill="#8e7138" />
          <circle cx="250" cy={y} r="5" fill="#8e7138" opacity={y === 380 ? 0 : 1} />
        </g>
      ))}
      {/* ribcage visible through the coat */}
      <g stroke="#d8ceb4" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M200 300v120" />
        <path d="M188 318c-14 2-22 10-24 20M212 318c14 2 22 10 24 20" />
        <path d="M188 342c-14 2-22 10-24 20M212 342c14 2 22 10 24 20" />
        <path d="M188 366c-12 2-18 8-20 16M212 366c12 2 18 8 20 16" />
      </g>
      {/* coral growing on the coat */}
      <g fill="#b4574a" opacity=".85">
        <path d="M100 470c-6-20 4-34 2-46 8 8 6 20 12 26 2-10 10-16 14-18-4 12 0 24-6 38z" />
        <path d="M290 500c4-18-6-28-2-40 8 6 6 16 12 22 2-8 8-12 12-14-4 10 0 22-8 32z" />
      </g>
      {/* seaweed */}
      <path className="seaweed" d="M120 300c-10 30 8 50-4 80s4 50-6 80" stroke="#355b48" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path className="seaweed alt" d="M282 296c12 26-6 46 6 72" stroke="#608c76" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* neck */}
      <path d="M186 240h28v40h-28z" fill="#d8ceb4" stroke="#4a4436" strokeWidth="2" />
      <path d="M186 254h28M186 268h28" stroke="#4a4436" strokeWidth="2" />

      {/* skull */}
      <path
        d="M200 90c-50 0-76 34-72 76 2 26 14 42 28 50l2 26c0 8 6 14 14 14h56c8 0 14-6 14-14l2-26c14-8 26-24 28-50 4-42-22-76-72-76z"
        fill="#e2d8bd"
        stroke="#2a2622"
        strokeWidth="3"
      />
      <path d="M226 96l-8 18 12 10-8 16" stroke="#4a4436" strokeWidth="2" fill="none" />
      <ellipse cx="172" cy="170" rx="20" ry="22" fill="#060c0b" />
      <ellipse cx="228" cy="168" rx="18" ry="20" fill="#060c0b" />
      <circle cx="172" cy="172" r="22" fill={`url(#${eye})`} className="eye-glow" />
      <circle cx="228" cy="170" r="20" fill={`url(#${eye})`} className="eye-glow" />
      <path d="M200 192l-8 16h16z" fill="#060c0b" />
      <path d="M168 226h64v12h-64z" fill="#f2ead6" stroke="#2a2622" strokeWidth="2" />
      <path d="M178 226v12M188 226v12M198 226v12M208 226v12M218 226v12" stroke="#2a2622" strokeWidth="1.5" />
      {/* barnacles on skull */}
      <g>
        {[
          [150, 130, 7],
          [162, 116, 5],
          [244, 124, 6],
          [256, 140, 4],
          [146, 196, 5],
        ].map(([x, y, r]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={r} fill="#cfc6ae" stroke="#6f6a5c" strokeWidth="1.5" />
            <circle cx={x} cy={y} r={r * 0.4} fill="#4d4a40" />
          </g>
        ))}
      </g>

      {/* tricorn with ragged feather */}
      <path d="M110 104c40-50 140-50 180 0-26-10-44-6-56 4-24-16-48-16-72 0-12-10-30-14-52-4z" fill="#0e1414" stroke="#8e7138" strokeWidth="3" />
      <path d="M144 80c16-44 96-44 112 0z" fill="#0e1414" stroke="#020607" strokeWidth="2" />
      <path d="M250 64c30-40 70-44 90-30-30 0-50 12-64 32 20-12 44-12 58-4-26 0-48 12-62 28z" fill="#3a4a48" stroke="#1a2422" strokeWidth="2" />
      <path d="M150 70c-6 10-2 20-8 30" stroke="#355b48" strokeWidth="4" fill="none" className="seaweed" />

      {/* crab on the shoulder */}
      <g transform="translate(252 268)">
        <ellipse cx="20" cy="12" rx="18" ry="11" fill="#b4574a" stroke="#4a1a10" strokeWidth="2" />
        <path d="M8 4l-6-10M32 4l6-10" stroke="#4a1a10" strokeWidth="2" />
        <circle cx="2" cy="-10" r="3" fill="#e8ddc2" />
        <circle cx="38" cy="-10" r="3" fill="#e8ddc2" />
        <path d="M2 16l-12 6M38 16l12 6M6 20l-8 10M34 20l8 10" stroke="#4a1a10" strokeWidth="2" />
      </g>

      {/* arm holding the lantern */}
      <path d="M110 330c-30 20-40 50-36 80" stroke="#d8ceb4" strokeWidth="10" strokeLinecap="round" fill="none" />
      <g transform="translate(46 396)">
        <Lantern size={56} ghostly />
      </g>
    </svg>
  );
}
