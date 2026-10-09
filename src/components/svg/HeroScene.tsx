import { ShipArt } from "./BlackwaterShip";
import { useSvgId } from "./useSvgId";

const STARS: [number, number, number][] = [
  [60, 40, 1.4], [140, 90, 1], [220, 30, 1.6], [300, 70, 1.1], [380, 20, 1.3], [460, 110, 1], [520, 50, 1.5],
  [600, 26, 1.1], [660, 96, 1.2], [740, 40, 1.4], [800, 120, 1], [1010, 60, 1.6], [1080, 30, 1.2], [1150, 100, 1.4],
  [100, 160, 1], [430, 170, 1.2], [700, 180, 1], [1120, 190, 1.3], [260, 140, 1.4], [560, 150, 1],
];

function wavePath(y: number, amp: number, period: number): string {
  let d = `M0 ${y}`;
  for (let x = 0; x < 2400; x += period) {
    d += ` Q ${x + period / 4} ${y - amp} ${x + period / 2} ${y} T ${x + period} ${y}`;
  }
  return `${d} V 700 H 0 Z`;
}

/** The homepage hero: a rich visible ocean, a crooked moon, a wrecked fortress, and our floating ship with water reflections. */
export function HeroScene({ className = "" }: { className?: string }) {
  const sky = useSvgId("sky");
  const moonGlow = useSvgId("moonglow");
  const sea = useSvgId("sea");
  const seaDeep = useSvgId("seadeep");
  const shipReflect = useSvgId("shipreflect");
  const moonMask = useSvgId("moonmask");

  return (
    <svg
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="An illustrated pirate ship with tattered black sails floating gracefully on sea waves under a crooked moon."
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020809" />
          <stop offset=".5" stopColor="#0a2328" />
          <stop offset="1" stopColor="#123b45" />
        </linearGradient>

        <radialGradient id={moonGlow}>
          <stop offset="0" stopColor="#e8ddc2" stopOpacity=".45" />
          <stop offset="1" stopColor="#e8ddc2" stopOpacity="0" />
        </radialGradient>

        {/* Vibrant Ocean Gradient */}
        <linearGradient id={sea} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#124854" />
          <stop offset="35%" stopColor="#0a323c" />
          <stop offset="70%" stopColor="#061f25" />
          <stop offset="100%" stopColor="#02090b" />
        </linearGradient>

        <linearGradient id={seaDeep} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b5c6b" />
          <stop offset="50%" stopColor="#0e3f4a" />
          <stop offset="100%" stopColor="#04161a" />
        </linearGradient>

        {/* Golden/Wood Ship Reflection Gradient */}
        <radialGradient id={shipReflect} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c39a43" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#523826" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#061316" stopOpacity="0" />
        </radialGradient>

        <mask id={moonMask}>
          <rect width="1200" height="640" fill="#fff" />
          <circle cx="960" cy="104" r="44" fill="#000" />
        </mask>
      </defs>

      {/* Sky Background */}
      <rect width="1200" height="640" fill={`url(#${sky})`} />

      {/* Stars */}
      <g fill="#e8ddc2">
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="anim-twinkle" />
        ))}
      </g>

      {/* Crooked Moon */}
      <circle cx="930" cy="120" r="110" fill={`url(#${moonGlow})`} />
      <g className="anim-moon">
        <circle cx="930" cy="120" r="52" fill="#e8ddc2" mask={`url(#${moonMask})`} />
        <path d="M884 104l12 8-4 12 10 8" stroke="#9f9274" strokeWidth="2" fill="none" />
        <rect x="886" y="140" width="22" height="8" rx="2" fill="#c8b995" stroke="#77583a" transform="rotate(-30 897 144)" />
        <circle cx="900" cy="96" r="4" fill="#c8b995" />
      </g>

      {/* Storm Clouds */}
      <g fill="#061316" opacity=".85">
        <path d="M640 150c20-30 60-30 76-10 18-18 56-14 64 12 26-4 40 14 30 30H630c-14-8-10-24 10-32z" />
        <path d="M60 110c14-22 44-22 56-6 14-12 40-10 46 8 18-2 28 10 20 22H52c-10-6-8-18 8-24z" />
      </g>

      {/* Seagulls */}
      <g stroke="#9f9274" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M300 200q8-8 14 0q6-8 14 0" />
        <path d="M340 180q6-6 11 0q5-6 11 0" />
      </g>

      {/* Distant Cliff & Fortress */}
      <path d="M760 400c30-60 70-120 140-150 50-20 120-10 170 20 40 24 80 70 130 110v40H760z" fill="#071a1d" />
      <g>
        <rect x="900" y="250" width="150" height="80" fill="#2a1c13" stroke="#0e0905" strokeWidth="2" />
        <path d="M890 254c20-40 150-40 170 0z" fill="#382419" stroke="#0e0905" strokeWidth="2" />
        <path d="M900 254c30-6 120-6 150 0" stroke="#523826" strokeWidth="2" fill="none" />
        <g stroke="#0e0905" strokeWidth="1" opacity=".8">
          <path d="M900 270h150M900 290h150M900 310h150M930 250v80M972 250v80M1012 250v80" />
        </g>
        <path d="M860 330l6-120h40l4 120z" fill="#24170f" stroke="#0e0905" strokeWidth="2" transform="rotate(-3 880 270)" />
        <path d="M852 214l34-40 34 40z" fill="#382419" stroke="#0e0905" strokeWidth="2" transform="rotate(-6 886 200)" />
        <path d="M1050 330l2-150h36l4 150z" fill="#24170f" stroke="#0e0905" strokeWidth="2" transform="rotate(4 1070 255)" />
        <path d="M1044 186l26-46 30 46z" fill="#382419" stroke="#0e0905" strokeWidth="2" transform="rotate(8 1072 170)" />
        <path d="M1072 140v-40" stroke="#523826" strokeWidth="3" />
        <path d="M1074 100h30l-6 8 6 8h-30z" fill="#090807" className="anim-flag anim-flag-fast" />
        <g fill="#ffcf6b">
          <rect x="878" y="236" width="8" height="12" className="anim-flicker" />
          <rect x="884" y="276" width="8" height="12" opacity=".6" />
          <rect x="940" y="296" width="10" height="14" />
          <rect x="1000" y="296" width="10" height="14" opacity=".5" />
          <rect x="1066" y="206" width="8" height="12" className="anim-flicker" />
          <rect x="1066" y="250" width="8" height="12" opacity=".7" />
        </g>
        <path d="M1110 330l10-120 40 30" stroke="#523826" strokeWidth="4" fill="none" />
        <path d="M1160 240v30" stroke="#8e7138" strokeWidth="1.5" />
        <rect x="1154" y="270" width="12" height="10" fill="#382419" />
      </g>

      {/* Kraken in Distance */}
      <g transform="translate(110 330) scale(.55)" opacity=".75">
        <path className="anim-tentacle" d="M40 160c-6-30 0-60 16-80 12-16 22-34 18-52-2-10-12-16-20-12-6 3-6 10 0 12" stroke="#2a2a3a" strokeWidth="14" fill="none" strokeLinecap="round" />
      </g>

      {/* 🌊 VISIBLE OCEAN WATER LAYERS */}
      <rect x="0" y="370" width="1200" height="270" fill={`url(#${sea})`} />

      {/* Deep Ocean Waves (Back Layer) */}
      <g className="anim-wave" style={{ ["--wave-speed" as string]: "6.5s" }}>
        <path d={wavePath(375, 12, 150)} fill={`url(#${seaDeep})`} opacity="0.9" />
      </g>
      <g className="anim-wave-rev" style={{ ["--wave-speed" as string]: "8.5s" }}>
        <path d={wavePath(410, 15, 190)} fill="#0c3742" opacity="0.85" />
      </g>

      {/* Moon Reflection on Sea Surface */}
      <g fill="#e8ddc2" opacity=".5">
        <rect x="880" y="420" width="90" height="4" rx="2" className="anim-pulse" />
        <rect x="895" y="438" width="60" height="3" rx="1.5" />
        <rect x="910" y="454" width="40" height="3" rx="1.5" />
        <rect x="920" y="470" width="24" height="2" rx="1" />
      </g>

      {/* ⚓ WATER REFLECTION & FOAM RIPPLE BENEATH SHIP */}
      <g transform="translate(400 215)">
        {/* Soft Golden Ship Reflection */}
        <ellipse cx="200" cy="275" rx="160" ry="22" fill={`url(#${shipReflect})`} />

        {/* Animated Water Ripples & Foam Lines around Hull */}
        <g opacity="0.9">
          <ellipse cx="200" cy="268" rx="180" ry="10" fill="none" stroke="#608c76" strokeWidth="2.5" strokeDasharray="30 15 40 20" className="anim-wave" style={{ ["--wave-speed" as string]: "4.5s" }} />
          <ellipse cx="210" cy="274" rx="140" ry="7" fill="none" stroke="#e8ddc2" strokeWidth="1.8" opacity="0.75" strokeDasharray="15 25 35 15" className="anim-wave-rev" style={{ ["--wave-speed" as string]: "5.5s" }} />
          <ellipse cx="190" cy="282" rx="100" ry="5" fill="none" stroke="#487868" strokeWidth="1.5" opacity="0.6" />
        </g>
      </g>

      {/* 🚢 THE SHIP CONTAINER (Floating on Ocean) */}
      <g transform="translate(400 215) scale(1)">
        <g className="anim-float-sea">
          <ShipArt />
        </g>
      </g>

      {/* Floating Debris on Water */}
      <g>
        <g className="anim-drift" transform="translate(150 490)">
          <rect x="0" y="0" width="34" height="26" rx="8" fill="#523826" stroke="#1a0f08" strokeWidth="2" />
          <path d="M8 0v26M26 0v26" stroke="#1a0f08" strokeWidth="2" />
        </g>
        <g className="anim-drift slow" transform="translate(820 520) rotate(-8)">
          <rect x="0" y="0" width="80" height="12" fill="#77583a" stroke="#1a0f08" strokeWidth="1.5" />
          <circle cx="70" cy="6" r="2" fill="#bfb8a8" />
        </g>
        <g className="anim-drift" transform="translate(1040 485) rotate(12)">
          <rect x="0" y="0" width="30" height="22" fill="#8d1d28" stroke="#2a0a0e" strokeWidth="1.5" />
          <path d="M3 3h24" stroke="#c39a43" strokeWidth="1.2" />
        </g>
        <g className="anim-drift slow" transform="translate(620 540) rotate(-20)">
          <rect x="0" y="0" width="34" height="12" rx="5" fill="#608c76" opacity=".85" stroke="#1d3a36" />
          <rect x="34" y="3" width="8" height="6" fill="#523826" />
          <rect x="8" y="3" width="16" height="6" fill="#e8ddc2" opacity=".9" />
        </g>
      </g>

      {/* 🌊 FRONT OCEAN WAVE SURFACES */}
      <g className="anim-wave" style={{ ["--wave-speed" as string]: "5.2s" }}>
        <path d={wavePath(520, 18, 170)} fill="#0d404c" opacity="0.92" />
      </g>
      <g className="anim-wave-rev" style={{ ["--wave-speed" as string]: "7s" }}>
        <path d={wavePath(560, 15, 230)} fill="#07272f" opacity="0.95" />
      </g>
      <g className="anim-wave" style={{ ["--wave-speed" as string]: "9s" }}>
        <path d={wavePath(595, 12, 280)} fill="#02080a" />
      </g>
    </svg>
  );
}
