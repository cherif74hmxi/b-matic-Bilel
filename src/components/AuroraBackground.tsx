import { useEffect, useRef, useState, type CSSProperties } from "react";
import { canRunAmbientMotion } from "@/lib/motion";

// ============================================================================
//  AuroraBackground — fond d'ambiance néon (halos flous qui dérivent)
// ----------------------------------------------------------------------------
//  100 % CSS, GPU-friendly (transform/opacity uniquement), aucune image.
//  À poser dans un conteneur en `position: relative` ; se place derrière le
//  contenu (contenu en z-10).
//
//  Performance :
//   • MIS EN PAUSE dès qu'il sort de l'écran (IntersectionObserver) → 0 CPU.
//   • Rendu STATIQUE (halos figés, aucune animation) si prefers-reduced-motion
//     ou appareil bas de gamme. Le flou est aussi réduit sur mobile (index.css).
// ============================================================================

const blobs: CSSProperties[] = [
  {
    width: "40rem", height: "40rem", top: "-10rem", left: "-8rem",
    background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.55), transparent 70%)",
    animationDelay: "0s",
  },
  {
    width: "34rem", height: "34rem", top: "15%", right: "-10rem",
    background: "radial-gradient(circle, hsl(var(--neon-cyan) / 0.45), transparent 70%)",
    animationDelay: "-7s",
  },
  {
    width: "30rem", height: "30rem", bottom: "-12rem", left: "28%",
    background: "radial-gradient(circle, hsl(var(--neon-pink) / 0.4), transparent 70%)",
    animationDelay: "-14s",
  },
];

const AuroraBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Décidé une fois au montage : anime-t-on du tout sur cet appareil ?
  const [animated] = useState(() => canRunAmbientMotion());
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!animated) return; // rendu statique : inutile d'observer.
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {blobs.map((style, i) => (
        <div
          key={i}
          className="aurora-blob"
          style={{
            ...style,
            // Statique sur bas de gamme / reduced-motion ; sinon pause hors écran.
            animation: animated ? undefined : "none",
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      ))}
    </div>
  );
};

export default AuroraBackground;
