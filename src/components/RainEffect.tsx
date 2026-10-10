import { useEffect, useRef } from "react";

interface RainEffectProps {
  speed?: number;
  rainAmount?: number;
  turbulence?: number;
  background?: string;
  color?: string;
}

interface Drop {
  x: number;
  y: number;
  len: number;
  v: number;
  a: number;
  dash: number[];
  ph: number;
}

interface Splash {
  x: number;
  y: number;
  r: number;
  maxR: number;
  a: number;
  v: number;
}

// Slanted (60°) hyper-realistic rain animation with wind gusts & impact water splashes.
export default function RainEffect({
  speed = 0.88,        // 0..2   fall speed (boosted for realistic downpour)
  rainAmount = 1.25,   // 0..2   streak density
  turbulence = 1.85,   // 0..2.5 wind sway turbulence
  background = "transparent",
  color = "rgba(220, 235, 255, 0.85)",
}: RainEffectProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const props = useRef<RainEffectProps>({});
  props.current = { speed, rainAmount, turbulence, background, color };

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const CAP = 2400;
    const drops: Drop[] = [];
    const splashes: Splash[] = [];
    let W = 0, H = 0, S = 1, N = 0, t = 0, last = 0, raf = 0;

    const spawn = (d: Partial<Drop>, fill: boolean) => {
      d.len = S * (0.045 + Math.random() ** 1.35 * 0.18);
      d.v = S * (0.65 + Math.random() ** 1.1 * 0.75);
      d.a = 0.25 + Math.random() ** 1.2 * 0.75;
      d.dash = Math.random() < 0.7 ? [] : Math.random() < 0.5 ? [4, 4] : [2, 6];
      d.ph = Math.random() * 6.28;
      const angle = Math.PI / 3;
      const dx = Math.cos(angle), dy = Math.sin(angle);
      const skew = ((H + d.len) * dx) / dy;
      d.x = fill ? Math.random() * W : -skew + Math.random() * (W + skew * 1.5);
      d.y = fill ? Math.random() * H : -d.len * dy - Math.random() * S * 0.3;
    };

    const spawnSplash = (x: number, y: number) => {
      if (splashes.length > 150) splashes.shift();
      splashes.push({
        x,
        y,
        r: 1 + Math.random() * 3,
        maxR: 8 + Math.random() * 14,
        a: 0.65 + Math.random() * 0.35,
        v: 0.65 + Math.random() * 0.85,
      });
    };

    const resize = () => {
      const r = Math.min(2, devicePixelRatio || 1);
      W = cv.width = Math.round(cv.clientWidth * r);
      H = cv.height = Math.round(cv.clientHeight * r);
      S = Math.min(W, H) || 1;
      const k = Math.min(2.1, Math.max(0.65, (S / 900) ** 0.55));
      N = Math.round(520 * k * Math.min(3, Math.max(0.6, (W * H) / (S * S))));
      for (let i = 0; i < CAP; i++) {
        if (!drops[i]) drops[i] = {} as Drop;
        spawn(drops[i], true);
      }
    };

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const p = props.current;
      const d_t = Math.min(0.08, (ts - (last || ts)) / 1000) * (p.speed ?? 1);
      last = ts;
      t += d_t;

      // Dynamic wind gusting angle offset
      const windGust = Math.sin(t * 0.4) * 0.08;
      const baseAngle = Math.PI / 3 + windGust;
      const dx = Math.cos(baseAngle);
      const dy = Math.sin(baseAngle);

      if (p.background === "transparent") {
        ctx.clearRect(0, 0, W, H);
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = p.background || "transparent";
        ctx.fillRect(0, 0, W, H);
      }

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = Math.max(0.95, (S / 1200) * 1.15);
      const n = Math.min(CAP, Math.round(N * (p.rainAmount ?? 1)));

      // Render rain streaks
      for (let i = 0; i < n; i++) {
        const d = drops[i];
        d.x += dx * d.v * d_t;
        d.y += dy * d.v * d_t;

        // Check if drop hit ocean / ground
        if (d.y >= H - 120 && Math.random() < 0.12) {
          spawnSplash(d.x, d.y);
        }

        if (d.y - d.len * dy > H || d.x - d.len * dx > W) {
          spawn(d, false);
        }

        const tx = d.x - dx * d.len;
        const ty = d.y - dy * d.len;
        const sway = Math.sin(t * 1.2 + d.ph) * (p.turbulence ?? 1) * d.len * 0.14;

        const g = ctx.createLinearGradient(d.x, d.y, tx, ty);
        g.addColorStop(0, p.color || "white");
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.strokeStyle = g;
        ctx.globalAlpha = d.a;
        ctx.setLineDash(d.dash.map((v) => v * ctx.lineWidth));
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.quadraticCurveTo(
          (d.x + tx) / 2 - dy * sway,
          (d.y + ty) / 2 + dx * sway,
          tx,
          ty
        );
        ctx.stroke();
      }

      // Render water splash ripples at impact zone
      for (let i = splashes.length - 1; i >= 0; i--) {
        const sp = splashes[i];
        sp.r += sp.v;
        sp.a -= 0.04;

        if (sp.a <= 0 || sp.r >= sp.maxR) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(sp.x, sp.y, sp.r, sp.r * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 230, 255, ${sp.a * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} />;
}
