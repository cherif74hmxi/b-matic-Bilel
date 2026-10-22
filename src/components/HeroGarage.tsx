import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { legalInfo } from "@/data/legal";

/** Image de la voiture (dans public/). Remplacer le fichier suffit. */
const CAR_SRC = "/hero-car.png";
const carMask = { WebkitMaskImage: `url(${CAR_SRC})`, maskImage: `url(${CAR_SRC})` };

// ============================================================================
//  HeroGarage — la voiture rentre au garage (fond du hero de l'accueil)
// ----------------------------------------------------------------------------
//  · Décor (CSS pur, statique) : façade sombre, baie de garage au cadre néon
//    rose → violet → bleu, porte relevée, tube lumineux au plafond, sol
//    mouillé qui reflète la baie, lignes de guidage néon, grain + vignette
//    (le grain recouvre aussi la photo : décor et voiture « se fondent »).
//  · Voiture : VRAIE PHOTO, public/hero-car.png (PNG transparent, vue 3/4
//    arrière, recadrée au ras des pneus). Intégrée par : étalonnage de nuit,
//    liseré néon (rose à gauche, bleu à droite) limité à la carrosserie,
//    ombre de contact, reflet inversé sur le sol mouillé.
//  · Scroll : la voiture avance vers la baie selon la perspective
//    (taille = 1 / distance), passe le seuil, s'assombrit et disparaît à
//    l'intérieur. Remonter = elle ressort. Le mouvement suit le scroll avec un
//    léger amorti (effet « scrub ») : écouteur passif + requestAnimationFrame,
//    actif seulement quand le hero est visible, transform/opacity uniquement.
//  · prefers-reduced-motion : scène figée (voiture devant le garage).
//
//  Réglages : SCENE ci-dessous. Les valeurs par défaut équivalentes sont dans
//  index.css (.garage-scene), pour le tout premier affichage.
// ============================================================================

// Fractions de la largeur (x, largeurs) ou de la hauteur (bas) de la scène.
const SCENE = {
  mobile: { bayX: 0.5, bayBottom: 0.875, bayW: 0.27, carX: 0.5, carBase: 0.955, carW: 0.37 },
  desktop: { bayX: 0.7, bayBottom: 0.66, bayW: 0.17, carX: 0.74, carBase: 0.95, carW: 0.21 },
};
/** Hauteur / largeur de la baie. */
const BAY_RATIO = 0.62;
/** Largeur de la voiture au passage du seuil, en largeur de baie. */
const FIT = 0.56;
/** Profondeur atteinte à la fin, au-delà du seuil (1,6 = un peu plus loin dans le garage). */
const INSIDE_DEPTH = 1.6;
/** Part de la hauteur du hero à défiler pour faire rentrer la voiture. */
const SCROLL_RANGE = 0.7;
/** Amorti du suivi du scroll (secondes). */
const SMOOTH = 0.1;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

const HeroGarage = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  // Hauteur / largeur de l'image, lue au chargement (s'adapte à n'importe quel PNG).
  const ratioRef = useRef(0.49);
  const redrawRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const car = carRef.current;
    const shade = shadeRef.current;
    const lines = linesRef.current;
    if (!scene || !car || !shade || !lines) return;

    const still = prefersReducedMotion();
    let W = 0, H = 0, cfg = SCENE.desktop;
    let raf = 0, last = 0, active = true;
    let target = 0, cur = 0;

    const progress = () => (still || !H ? 0 : clamp01(window.scrollY / (H * SCROLL_RANGE)));

    const place = (p: number) => {
      const w = W * cfg.carW;
      const h = w * ratioRef.current;
      const x0 = W * cfg.carX, base = H * cfg.carBase;
      const vx = W * cfg.bayX, bayBottom = H * cfg.bayBottom;
      // Point de fuite choisi pour que la voiture touche le seuil à la bonne taille.
      const sT = Math.min((W * cfg.bayW * FIT) / w, 0.95);
      const vy = (bayBottom - base * sT) / (1 - sT);
      const dT = 1 / sT, dMax = dT * INSIDE_DEPTH;
      const d = 1 + (dMax - 1) * p;
      const s = 1 / d;
      const x = vx + (x0 - vx) * s;
      const y = vy + (base - vy) * s;
      // Après le seuil : s'efface dans la pénombre du garage.
      const inside = clamp01((d - dT) / (dMax - dT));
      car.style.width = `${w}px`;
      car.style.transform = `translate3d(${x - w / 2}px, ${y - h}px, 0) scale(${s})`;
      car.style.opacity = String(1 - inside);
      shade.style.opacity = String(0.08 + 0.42 * clamp01((d - 1) / (dT - 1)) + 0.5 * inside);
    };

    const tick = (t: number) => {
      raf = 0;
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 1 / 60;
      last = t;
      cur += (target - cur) * (1 - Math.exp(-dt / SMOOTH));
      if (Math.abs(target - cur) < 0.0005) cur = target;
      place(cur);
      if (cur !== target && active) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const onScroll = () => {
      target = progress();
      if (active && !raf) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const r = scene.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cfg = W < 768 ? SCENE.mobile : SCENE.desktop;
      const bx = W * cfg.bayX, bb = H * cfg.bayBottom, bw = W * cfg.bayW;
      scene.style.setProperty("--bay-x", `${bx}px`);
      scene.style.setProperty("--bay-bottom", `${bb}px`);
      scene.style.setProperty("--bay-w", `${bw}px`);
      scene.style.setProperty("--bay-h", `${bw * BAY_RATIO}px`);
      // Lignes de guidage néon : des coins de la baie vers le bas de l'écran.
      lines.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const spread = bw * (W < 768 ? 1.6 : 2.4);
      lines.querySelectorAll("line").forEach((l, i) => {
        const side = i < 2 ? -1 : 1; // 2 premières : gauche (halo + trait), 2 suivantes : droite
        const x1 = bx + (side * bw) / 2;
        l.setAttribute("x1", `${x1}`);
        l.setAttribute("x2", `${x1 + side * spread}`);
        l.setAttribute("y1", `${bb}`);
        l.setAttribute("y2", `${H}`);
      });
      target = cur = progress();
      place(cur);
    };

    redrawRef.current = () => place(cur);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(scene);
    if (still) return () => ro.disconnect();

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) onScroll();
    });
    io.observe(scene);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={sceneRef} className="garage-scene" aria-hidden="true">
      <div className="garage-sky" />
      <div className="garage-facade" />
      <div className="garage-sign hidden md:block">{legalInfo.siteName}</div>
      <div className="garage-bay">
        <div className="garage-door" />
        <div className="garage-tube" />
      </div>
      <div className="garage-floor" />
      <div className="garage-spill" />
      <div className="garage-reflect" />
      <svg ref={linesRef} className="garage-lines" preserveAspectRatio="none">
        <line className="garage-line garage-line--glow garage-line--left" />
        <line className="garage-line garage-line--left" />
        <line className="garage-line garage-line--glow garage-line--right" />
        <line className="garage-line garage-line--right" />
      </svg>
      <div ref={carRef} className="garage-car">
        <img src={CAR_SRC} alt="" decoding="async" draggable={false} className="garage-car-reflect" />
        <img
          src={CAR_SRC}
          alt=""
          decoding="async"
          fetchPriority="low"
          draggable={false}
          className="garage-car-img"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth) ratioRef.current = img.naturalHeight / img.naturalWidth;
            redrawRef.current();
          }}
          onError={() => carRef.current?.style.setProperty("display", "none")}
        />
        <div className="garage-car-light" style={carMask} />
        <div ref={shadeRef} className="garage-car-shade" style={carMask} />
      </div>
      <div className="garage-grain" />
    </div>
  );
};

export default HeroGarage;
