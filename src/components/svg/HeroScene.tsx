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

/** The homepage hero: a rich visible ocean, a crooked moon, a wrecked fortress, and our floating ship with water reflections and cinematic fog & lightning. */
export function HeroScene({ className = "" }: { className?: string }) {
  const sky = useSvgId("sky");
  const moonGlow = useSvgId("moonglow");
  const sea = useSvgId("sea");
  const seaDeep = useSvgId("seadeep");
  const shipReflect = useSvgId("shipreflect");
  const moonMask = useSvgId("moonmask");
  const fogGrad1 = useSvgId("foggrad1");
  const fogGrad2 = useSvgId("foggrad2");
  const lightningGrad = useSvgId("lightninggrad");

  return (
    <svg
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="An illustrated pirate ship with tattered black sails floating gracefully on sea waves under a crooked moon with atmospheric mist and lightning."
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020809" />
          <stop offset=".45" stopColor="#091f24" />
          <stop offset="1" stopColor="#123b45" />
        </linearGradient>

        <radialGradient id={moonGlow}>
          <stop offset="0" stopColor="#e8ddc2" stopOpacity=".55" />
          <stop offset="50%" stopColor="#e8ddc2" stopOpacity=".15" />
          <stop offset="1" stopColor="#e8ddc2" stopOpacity="0" />
        </radialGradient>

        {/* Enhanced Darker Teal Ocean Gradients */}
        <linearGradient id={sea} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b3842" />
          <stop offset="35%" stopColor="#06252d" />
          <stop offset="70%" stopColor="#03161b" />
          <stop offset="100%" stopColor="#010608" />
        </linearGradient>

        <linearGradient id={seaDeep} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#114855" />
          <stop offset="50%" stopColor="#092d37" />
          <stop offset="100%" stopColor="#021217" />
        </linearGradient>

        {/* Golden/Wood Ship Reflection Gradient */}
        <radialGradient id={shipReflect} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a34b" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#523826" stopOpacity="0.35" />
          <stop offset="85%" stopColor="#09282f" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#061316" stopOpacity="0" />
        </radialGradient>

        {/* Low-lying Atmospheric Fog Gradients */}
        <linearGradient id={fogGrad1} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#69969f" stopOpacity="0" />
          <stop offset="40%" stopColor="#43727d" stopOpacity="0.32" />
          <stop offset="80%" stopColor="#1c4b54" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0c2e35" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={fogGrad2} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d6c77" stopOpacity="0" />
          <stop offset="25%" stopColor="#588b96" stopOpacity="0.28" />
          <stop offset="65%" stopColor="#43747f" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#25515b" stopOpacity="0" />
        </linearGradient>

        {/* Distant Lightning Glow Gradient Focused on Right-Side Sky */}
        <linearGradient id={lightningGrad} x1="0.3" y1="0" x2="0.95" y2="0.7">
          <stop offset="0%" stopColor="#c5e8f7" stopOpacity="0.08" />
          <stop offset="45%" stopColor="#7ecae6" stopOpacity="0.38" />
          <stop offset="85%" stopColor="#dff5ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#195565" stopOpacity="0.15" />
        </linearGradient>

        <mask id={moonMask}>
          <rect width="1200" height="640" fill="#fff" />
          <circle cx="960" cy="104" r="44" fill="#000" />
        </mask>
      </defs>

      {/* Sky Background */}
      <rect width="1200" height="640" fill={`url(#${sky})`} />

      {/* ⚡ Sheet Lightning Overlay on Sky & Clouds */}
      <rect width="1200" height="420" fill={`url(#${lightningGrad})`} className="anim-sheet-lightning" />

      {/* Stars */}
      <g fill="#e8ddc2">
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="anim-twinkle" />
        ))}
      </g>

      {/* Crooked Moon (Drifting subtly) */}
      <g className="anim-moon-gentle">
        <circle cx="930" cy="120" r="110" fill={`url(#${moonGlow})`} />
        <g className="anim-moon">
          <circle cx="930" cy="120" r="52" fill="#e8ddc2" mask={`url(#${moonMask})`} />
          <path d="M884 104l12 8-4 12 10 8" stroke="#9f9274" strokeWidth="2" fill="none" />
          <rect x="886" y="140" width="22" height="8" rx="2" fill="#c8b995" stroke="#77583a" transform="rotate(-30 897 144)" />
          <circle cx="900" cy="96" r="4" fill="#c8b995" />
        </g>
      </g>

      {/* Storm Clouds (Layer 1 & Layer 2 Drifting) */}
      <g fill="#061316" opacity=".85">
        <g className="anim-cloud-drift-1">
          <path d="M640 150c20-30 60-30 76-10 18-18 56-14 64 12 26-4 40 14 30 30H630c-14-8-10-24 10-32z" />
          <path d="M800 130c25-25 70-20 85 8 20-10 45-2 50 18 20 4 30 20 20 34H780c-10-10-8-22 20-30z" opacity="0.6" />
        </g>
        <g className="anim-cloud-drift-2">
          <path d="M60 110c14-22 44-22 56-6 14-12 40-10 46 8 18-2 28 10 20 22H52c-10-6-8-18 8-24z" />
          <path d="M220 90c18-18 50-16 62 4 16-8 36-2 40 14 16 3 24 16 16 28H210c-8-8-6-18 10-26z" opacity="0.5" />
        </g>
      </g>

      {/* Atmospheric Mid-Sky Haze / Mist Layer */}
      <g className="anim-fog-slow" opacity="0.65">
        <ellipse cx="600" cy="280" rx="550" ry="60" fill={`url(#${fogGrad1})`} />
        <ellipse cx="900" cy="310" rx="350" ry="45" fill={`url(#${fogGrad2})`} />
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
        
        {/* Flag on castle with gentle waving animation and pirate skull cap crest */}
        <g className="anim-flag-gentle">
          <path d="M1074 100h34l-7 10 7 10h-34z" fill="#090807" stroke="#33241b" strokeWidth="1" />
          <circle cx="1086" cy="110" r="3" fill="#e8ddc2" />
          {/* mini graduation cap */}
          <polygon points="1086,105 1092,108 1086,110 1080,108" fill="#c39a43" />
        </g>

        {/* Castle Windows Flickering Warm Light */}
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

      {/* 🌫️ Midground Swirling Fog Behind Ship and Fortress */}
      <g className="anim-fog-fast" opacity="0.5">
        <path d="M200 360 Q 450 330 700 365 T 1200 350 V 390 H 200 Z" fill={`url(#${fogGrad1})`} />
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

      {/* ⚓ WATER REFLECTION & FOAM RIPPLE BENEATH PROMINENT SHIP */}
      <g transform="translate(670 145) scale(0.96)">
        {/* Soft Golden Ship Reflection with gentle pulsing ripple */}
        <ellipse cx="200" cy="275" rx="180" ry="26" fill={`url(#${shipReflect})`} className="anim-ship-reflect" />

        {/* Animated Water Ripples & Foam Lines around Hull */}
        <g opacity="0.95">
          <ellipse cx="200" cy="268" rx="200" ry="14" fill="none" stroke="#7bbda3" strokeWidth="2.8" strokeDasharray="35 15 45 20" className="anim-wave" style={{ ["--wave-speed" as string]: "4.2s" }} />
          <ellipse cx="210" cy="274" rx="160" ry="9" fill="none" stroke="#e8ddc2" strokeWidth="2" opacity="0.85" strokeDasharray="20 25 40 15" className="anim-wave-rev" style={{ ["--wave-speed" as string]: "5.2s" }} />
          <ellipse cx="190" cy="282" rx="120" ry="7" fill="none" stroke="#5da08d" strokeWidth="1.8" opacity="0.7" />
        </g>
      </g>

      {/* 🚢 THE PROMINENT BLACKWATER SHIP (Mid-Right, Sailing Ocean Waves) */}
      <g transform="translate(670 145) scale(0.96)">
        <g className="anim-ship-sailing">
          <ShipArt variant="blackwater" rocking={true} />
        </g>
      </g>


      {/* 🌫️ Low-Lying Atmospheric Sea Fog (Swirling around ship hull & ocean front) */}
      <g className="anim-fog-slow" opacity="0.45">
        <path d="M0 430 Q 300 400 600 425 T 1200 415 V 470 H 0 Z" fill={`url(#${fogGrad2})`} />
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

      {/* 🌫️ Foreground Low Creeping Sea Mist */}
      <g className="anim-fog-fast" opacity="0.35">
        <path d="M0 560 Q 400 535 800 555 T 1200 545 V 640 H 0 Z" fill={`url(#${fogGrad1})`} />
      </g>
    </svg>
  );
}
