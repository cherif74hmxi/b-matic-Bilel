import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// ============================================================================
//  HeroRoad — route néon de nuit (fond du hero de l'accueil)
// ----------------------------------------------------------------------------
//  · Route : un vrai plan 3D en CSS (perspective + rotateX 90°) → perspective
//    exacte calculée par le navigateur. Asphalte sombre, bandes de rive néon
//    fines, marquage central. Seul le marquage bouge (transform animé en CSS,
//    géré par le GPU) : sensation d'avancer.
//  · Ambiance : halo « soleil » à l'horizon, brume au loin, reflets sur route
//    mouillée. Le néon reste un accent.
//  · Voiture (SVG) : s'éloigne vers l'horizon quand on fait défiler la page,
//    selon la perspective (taille = 1 / distance), puis disparaît.
//    Scroll : écouteur passif + requestAnimationFrame, actif seulement quand
//    le hero est visible ; un seul transform modifié par image.
//  · prefers-reduced-motion : scène figée (voiture à l'arrêt, marquage fixe).
//
//  Réglages : SCENE ci-dessous (horizon, point de fuite, taille de la voiture).
//  Les mêmes valeurs par défaut sont dans index.css (.road-scene).
// ============================================================================

// lane : décalage vers la voie de droite, en largeurs de voiture (voiture centrée dans sa voie).
const SCENE = {
  mobile: { vpX: 0.5, horizon: 0.74, carWidth: 0.3, carBase: 0.95, lane: 0.47 },
  desktop: { vpX: 0.68, horizon: 0.58, carWidth: 0.16, carBase: 0.95, lane: 0.95 },
};
/** Distance maximale (1 = position de départ) atteinte en fin de section. */
const MAX_DEPTH = 14;

const HeroRoad = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const car = carRef.current;
    if (!scene || !car) return;

    const still = prefersReducedMotion();
    let W = 0, H = 0, cfg = SCENE.desktop;
    let raf = 0;
    let active = true;

    const place = () => {
      raf = 0;
      // Progression 0 → 1 pendant que le hero quitte l'écran.
      const p = still ? 0 : Math.min(Math.max(window.scrollY / (H * 0.85), 0), 1);
      const d = 1 + (MAX_DEPTH - 1) * Math.pow(p, 1.6);
      const horizonY = H * cfg.horizon;
      const baseY = H * cfg.carBase;
      const w = W * cfg.carWidth;
      const x = W * cfg.vpX + (w * cfg.lane) / d;
      const y = horizonY + (baseY - horizonY) / d;
      const fade = p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) / 0.25);
      car.style.width = `${w}px`;
      car.style.transform = `translate3d(${x - w / 2}px, ${y - w * 0.5}px, 0) scale(${1 / d})`;
      car.style.opacity = String(fade);
    };
    const schedule = () => {
      if (active && !raf) raf = requestAnimationFrame(place);
    };

    const resize = () => {
      const r = scene.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cfg = W < 768 ? SCENE.mobile : SCENE.desktop;
      scene.style.setProperty("--vp-x", `${cfg.vpX * 100}%`);
      scene.style.setProperty("--horizon", `${cfg.horizon * 100}%`);
      place();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(scene);
    if (still) return () => ro.disconnect();

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) schedule();
    });
    io.observe(scene);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={sceneRef} className="road-scene" aria-hidden="true">
      <div className="road-sky" />
      <div className="road-3d">
        <div className="road-plane">
          <div className="road-asphalt" />
          <div className="road-sheen" />
          <div className="road-edge road-edge--left" />
          <div className="road-edge road-edge--right" />
          <div className="road-dashes" />
        </div>
      </div>
      <div className="road-fog" />
      <div className="road-sun" />
      <div ref={carRef} className="road-car">
        <CarRear />
      </div>
    </div>
  );
};

/** Voiture moderne vue de l'arrière (coupé / SUV bas), feux LED en bandeau. */
const CarRear = () => (
  <svg viewBox="0 0 240 120" className="w-full h-auto block overflow-visible">
    <defs>
      <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a3646" />
        <stop offset="0.45" stopColor="#1d1a26" />
        <stop offset="1" stopColor="#0d0c12" />
      </linearGradient>
      <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1b1a26" />
        <stop offset="0.55" stopColor="#0b0a10" />
        <stop offset="1" stopColor="#14121c" />
      </linearGradient>
      <linearGradient id="car-rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="hsl(270 80% 70%)" stopOpacity="0" />
        <stop offset="0.3" stopColor="hsl(270 80% 72%)" stopOpacity="0.7" />
        <stop offset="0.7" stopColor="hsl(200 100% 70%)" stopOpacity="0.7" />
        <stop offset="1" stopColor="hsl(200 100% 70%)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="car-light" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ff2e63" />
        <stop offset="0.5" stopColor="#ff5c8a" />
        <stop offset="1" stopColor="#ff2e63" />
      </linearGradient>
      <radialGradient id="car-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ff3d74" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ff3d74" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="car-reflect" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ff3d74" stopOpacity="0.22" />
        <stop offset="1" stopColor="#ff3d74" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="car-shadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000" stopOpacity="0.8" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ombre et reflets des feux sur la route mouillée */}
    <ellipse cx="120" cy="111" rx="122" ry="10" fill="url(#car-shadow)" />
    <ellipse cx="44" cy="124" rx="9" ry="14" fill="url(#car-reflect)" />
    <ellipse cx="196" cy="124" rx="9" ry="14" fill="url(#car-reflect)" />

    {/* Pneus */}
    <rect x="20" y="86" width="32" height="26" rx="5" fill="#07070a" />
    <rect x="188" y="86" width="32" height="26" rx="5" fill="#07070a" />

    {/* Caisse : épaules larges, hayon galbé */}
    <path
      d="M12 96 C10 84 12 72 18 64 C24 56 34 52 50 50 L190 50 C206 52 216 56 222 64 C228 72 230 84 228 96 C228 101 224 104 218 104 L22 104 C16 104 12 101 12 96 Z"
      fill="url(#car-body)"
    />
    {/* Pavillon et lunette arrière */}
    <path d="M56 51 C64 36 72 26 86 22 C100 19 140 19 154 22 C168 26 176 36 184 51 Z" fill="url(#car-body)" />
    <path d="M66 49 C72 38 79 30 90 27 C102 24.5 138 24.5 150 27 C161 30 168 38 174 49 Z" fill="url(#car-glass)" />
    <path d="M92 28 L118 26 L104 48 L80 48 Z" fill="#fff" opacity="0.05" />

    {/* Liseré de lumière néon sur les épaules (reflet de la route) */}
    <path d="M18 64 C24 56 34 52 50 50 L190 50 C206 52 216 56 222 64" fill="none" stroke="url(#car-rim)" strokeWidth="1.2" />
    <path d="M86 22 C100 19 140 19 154 22" fill="none" stroke="url(#car-rim)" strokeWidth="0.8" opacity="0.7" />

    {/* Reflets latéraux de la carrosserie */}
    <path d="M16 78 C18 70 22 65 28 61" fill="none" stroke="#6b6680" strokeWidth="1" opacity="0.45" />
    <path d="M224 78 C222 70 218 65 212 61" fill="none" stroke="#6b6680" strokeWidth="1" opacity="0.45" />
    <rect x="104" y="20.4" width="32" height="1.4" rx="0.7" fill="#ff4d7e" opacity="0.85" />

    {/* Feux : bandeau LED sur toute la largeur + halo */}
    <ellipse cx="120" cy="60" rx="118" ry="14" fill="url(#car-glow)" />
    <path d="M24 62 L34 57 L206 57 L216 62 L206 61 L34 61 Z" fill="url(#car-light)" />
    <rect x="34" y="58.4" width="172" height="1.2" fill="#ffd0dc" opacity="0.8" />

    {/* Plaque, bouclier, diffuseur */}
    <rect x="102" y="70" width="36" height="10" rx="1.5" fill="#0a0910" stroke="#2a2735" strokeWidth="0.6" />
    <path d="M40 92 L200 92 L194 102 L46 102 Z" fill="#0a0910" />
    <path d="M90 94 V101 M105 94 V101 M120 94 V101 M135 94 V101 M150 94 V101" stroke="#1f1c29" strokeWidth="1" />
  </svg>
);

export default HeroRoad;
