import { useEffect, useRef } from "react";

/** Image de la voiture (dans public/). Remplacer le fichier suffit. */
const CAR_SRC = "/hero-car.png";
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
//  · Voiture : VRAIE IMAGE, public/hero-car.png (PNG transparent, vue 3/4
//    arrière, recadrée au ras des pneus, ~600–800 px de large, < 150 Ko).
//    Au défilement, elle s'éloigne vers l'horizon selon la perspective
//    (taille = 1 / distance), s'estompe puis disparaît. Ombre et reflet sur la
//    route mouillée sont ajoutés en CSS (.road-car). Image absente → masquée.
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
  // Hauteur / largeur de l'image, lue au chargement (s'adapte à n'importe quel PNG).
  const ratioRef = useRef(0.44);
  const placeRef = useRef<() => void>(() => {});

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
      // S'estompe progressivement en s'éloignant ; invisible avant la fin du hero.
      const fade = Math.min(1, Math.max(0, 1 - (p - 0.3) / 0.6));
      const h = w * ratioRef.current;
      car.style.width = `${w}px`;
      car.style.transform = `translate3d(${x - w / 2}px, ${y - h}px, 0) scale(${1 / d})`;
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

    placeRef.current = place;
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
        <img
          src={CAR_SRC}
          alt=""
          decoding="async"
          fetchPriority="low"
          draggable={false}
          className="block w-full h-auto"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth) ratioRef.current = img.naturalHeight / img.naturalWidth;
            placeRef.current();
          }}
          onError={() => carRef.current?.style.setProperty("display", "none")}
        />
      </div>
    </div>
  );
};

export default HeroRoad;
