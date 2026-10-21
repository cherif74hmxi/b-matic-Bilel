import { useEffect, useRef, useState, ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// ============================================================================
//  AnimatedSection — révélation au scroll (fondu + léger glissé vers le haut)
// ----------------------------------------------------------------------------
//  Déclenchée par IntersectionObserver (aucun écouteur de scroll). N'anime que
//  `opacity` et `transform` (GPU), jamais de propriété qui recalcule la mise en
//  page → pas de layout shift. L'animation ne joue qu'une fois (unobserve).
//
//  prefers-reduced-motion : on rend le contenu VISIBLE d'emblée (pas d'état
//  masqué, pas d'observer) → rendu statique propre, sans risque de contenu
//  invisible. `rootMargin` déclenche un peu avant l'entrée pour un ressenti
//  fluide même en scroll rapide sur mobile.
// ============================================================================

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Décalage de démarrage en millisecondes (effet d'escalier). */
  delay?: number;
}

const AnimatedSection = ({ children, className = "", delay = 0 }: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // Si l'utilisateur réduit les animations → visible immédiatement.
  const [isVisible, setIsVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (isVisible) return; // déjà visible (reduced-motion) : rien à observer.
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setIsVisible(true), delay);
          obs.unobserve(entry.target);
          el.dataset.revealTimer = String(t);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, isVisible]);

  return (
    <div
      ref={ref}
      className={`motion-safe:transition-all motion-safe:duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 will-change-[opacity,transform]"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
