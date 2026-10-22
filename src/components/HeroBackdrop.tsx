import { useEffect, useRef } from "react";
import { isLowEndDevice, prefersReducedMotion } from "@/lib/motion";

// ============================================================================
//  HeroBackdrop — fond animé du hero de l'accueil (Canvas 2D, sans librairie)
// ----------------------------------------------------------------------------
//  Une ligne d'horizon néon, des rails en perspective à peine visibles et
//  quelques traînées de lumière qui glissent lentement dessus (des phares sur
//  une route de nuit), aux couleurs B MATIC (violet / rose / bleu).
//
//  Performance :
//   • décor fixe (horizon, rails, halo) dessiné UNE fois par taille d'écran
//     dans un canvas caché, puis recopié à chaque image ;
//   • 30 images/s maximum, résolution plafonnée (1,5× sur mobile) ;
//   • en pause hors de l'écran (IntersectionObserver) et onglet caché (rAF) ;
//   • image FIGÉE si prefers-reduced-motion ; moins de traînées sur les
//     appareils modestes.
//  Lisibilité : intensité faible, et les traînées s'éteignent sous le texte
//  (masque CSS « hero-backdrop » dans index.css).
// ============================================================================

const COLORS = ["270 80% 62%", "320 80% 58%", "200 100% 58%"]; // --neon-purple / pink / blue
const FPS = 30;

interface Trail {
  rail: number;
  p: number; // progression 0 → 1 le long du rail
  speed: number; // progression par seconde
  color: string;
  width: number;
}

interface Scene {
  w: number;
  h: number;
  vx: number; // point de fuite
  vy: number;
  rails: { dx: number; dy: number; len: number }[];
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function buildScene(w: number, h: number): Scene {
  const mobile = w < 768;
  const vx = mobile ? w * 0.5 : w * 0.7;
  const vy = h * (mobile ? 0.72 : 0.64);
  // Rails en éventail sous l'horizon, du bord gauche au bord droit.
  const n = mobile ? 11 : 15;
  const rails = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const angle = (8 + t * 164) * (Math.PI / 180); // 8° → 172° sous l'horizontale
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    // Longueur jusqu'au bord du canvas (+10 % pour sortir proprement).
    const toX = dx > 0 ? (w - vx) / dx : dx < 0 ? -vx / dx : Infinity;
    const toY = (h - vy) / dy;
    return { dx, dy, len: Math.min(toX, toY) * 1.1 };
  });
  return { w, h, vx, vy, rails };
}

/** Décor fixe : halo, horizon, rails. Dessiné une fois par taille d'écran. */
function drawStatic(ctx: CanvasRenderingContext2D, s: Scene) {
  const { w, h, vx, vy } = s;
  ctx.clearRect(0, 0, w, h);

  // Halo très doux autour du point de fuite.
  const halo = ctx.createRadialGradient(vx, vy, 0, vx, vy, Math.max(w, h) * 0.55);
  halo.addColorStop(0, "hsl(270 80% 60% / 0.3)");
  halo.addColorStop(0.4, "hsl(320 80% 55% / 0.1)");
  halo.addColorStop(1, "hsl(270 80% 60% / 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  // Rails : traits fins qui s'effacent vers l'horizon.
  ctx.lineWidth = 1;
  for (const r of s.rails) {
    const g = ctx.createLinearGradient(vx, vy, vx + r.dx * r.len, vy + r.dy * r.len);
    g.addColorStop(0, "hsl(270 80% 70% / 0)");
    g.addColorStop(1, "hsl(270 80% 70% / 0.14)");
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + r.dx * r.len, vy + r.dy * r.len);
    ctx.stroke();
  }

  // Horizon : fine ligne néon, plus intense près du point de fuite.
  const line = ctx.createLinearGradient(0, 0, w, 0);
  const at = vx / w;
  line.addColorStop(0, "hsl(270 80% 60% / 0)");
  line.addColorStop(Math.max(0, at - 0.3), "hsl(270 80% 62% / 0.5)");
  line.addColorStop(at, "hsl(320 80% 65% / 0.9)");
  line.addColorStop(Math.min(1, at + 0.25), "hsl(200 100% 60% / 0.5)");
  line.addColorStop(1, "hsl(200 100% 60% / 0)");
  ctx.fillStyle = line;
  ctx.fillRect(0, vy - 0.5, w, 1);
  // Lueur de l'horizon (bande floue simulée par un dégradé vertical).
  const glow = ctx.createLinearGradient(0, vy - 18, 0, vy + 18);
  glow.addColorStop(0, "hsl(320 80% 60% / 0)");
  glow.addColorStop(0.5, "hsl(320 80% 60% / 0.14)");
  glow.addColorStop(1, "hsl(320 80% 60% / 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, vy - 18, w, 36);
}

function newTrail(s: Scene, p = 0): Trail {
  return {
    rail: Math.floor(Math.random() * s.rails.length),
    p,
    speed: rand(0.07, 0.14), // 7 à 14 s pour parcourir un rail
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: rand(1.2, 2.2),
  };
}

/** Une traînée : tête lumineuse, queue qui s'efface ; accélère en approchant (perspective). */
function drawTrail(ctx: CanvasRenderingContext2D, s: Scene, t: Trail) {
  const r = s.rails[t.rail];
  const ease = (x: number) => x * x * x; // perspective : lent au loin, rapide devant
  const head = ease(t.p) * r.len;
  const tail = ease(Math.max(0, t.p - 0.18)) * r.len;
  if (head - tail < 1) return;
  const x1 = s.vx + r.dx * tail, y1 = s.vy + r.dy * tail;
  const x2 = s.vx + r.dx * head, y2 = s.vy + r.dy * head;
  const alpha = Math.sin(Math.PI * t.p) * 0.9; // apparition / disparition douces
  const width = t.width * (0.4 + t.p * 1.6);

  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, `hsl(${t.color} / 0)`);
  g.addColorStop(1, `hsl(${t.color} / ${alpha})`);
  ctx.strokeStyle = g;
  // Deux passes (large et pâle, puis fine) : effet de lueur sans shadowBlur.
  ctx.lineWidth = width * 4;
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.lineWidth = width;
  ctx.globalAlpha = 1;
  ctx.stroke();
}

const HeroBackdrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = prefersReducedMotion();
    const count = isLowEndDevice() ? 5 : 9;
    const layer = document.createElement("canvas");
    const layerCtx = layer.getContext("2d")!;
    let scene: Scene;
    let trails: Trail[] = [];
    let raf = 0;
    let visible = true;
    let last = 0;

    const frame = () => {
      ctx.clearRect(0, 0, scene.w, scene.h);
      ctx.drawImage(layer, 0, 0, scene.w, scene.h);
      ctx.lineCap = "round";
      for (const t of trails) drawTrail(ctx, scene, t);
    };

    const resize = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);
      for (const c of [canvas, layer]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene = buildScene(w, h);
      drawStatic(layerCtx, scene);
      // Traînées réparties le long de leur course (pas de départ groupé).
      trails = Array.from({ length: count }, (_, i) => newTrail(scene, still ? 0.35 + (i / count) * 0.5 : Math.random()));
      frame();
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 1000 / FPS) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      for (let i = 0; i < trails.length; i++) {
        trails[i].p += trails[i].speed * dt;
        if (trails[i].p >= 1) trails[i] = newTrail(scene);
      }
      frame();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (still) return () => ro.disconnect();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-backdrop absolute inset-0 w-full h-full" aria-hidden="true" />;
};

export default HeroBackdrop;
