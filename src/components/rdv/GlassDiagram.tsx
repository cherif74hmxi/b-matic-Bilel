import type { ZoneVitrage } from "@/data/rendezvous";

// ============================================================================
//  GlassDiagram — voiture vue de dessus, vitre(s) concernée(s) surlignée(s)
// ----------------------------------------------------------------------------
//  SVG maison, léger (aucune image). L'avant est en haut ; « gauche » = côté
//  conducteur. Couleurs = tokens du thème (vitres : muted, sélection : primary).
// ============================================================================

const vitres: Record<ZoneVitrage, string> = {
  "pare-brise": "M15 31 Q32 24 49 31 L45.5 40.5 Q32 36.5 18.5 40.5 Z",
  toit: "M21 45 h22 a3 3 0 0 1 3 3 v24 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3 v-24 a3 3 0 0 1 3 -3 Z",
  lunette: "M18.5 80 Q32 83.5 45.5 80 L48.5 88 Q32 92.5 15.5 88 Z",
  "avant-gauche": "M11.5 41 L16 43 L16 59 L11.5 59 Z",
  "arriere-gauche": "M11.5 61.5 L16 61.5 L16 76.5 L11.5 78 Z",
  "avant-droite": "M52.5 41 L48 43 L48 59 L52.5 59 Z",
  "arriere-droite": "M52.5 61.5 L48 61.5 L48 76.5 L52.5 78 Z",
};

const GlassDiagram = ({ zones, className = "" }: { zones: ZoneVitrage[]; className?: string }) => (
  <svg viewBox="0 0 64 112" className={className} aria-hidden="true" focusable="false">
    {/* Rétroviseurs */}
    <rect x="4.5" y="34" width="6" height="4.5" rx="2" className="fill-muted stroke-foreground/50" strokeWidth="1" />
    <rect x="53.5" y="34" width="6" height="4.5" rx="2" className="fill-muted stroke-foreground/50" strokeWidth="1" />
    {/* Carrosserie */}
    <rect x="10" y="6" width="44" height="100" rx="16" className="fill-card stroke-foreground/60" strokeWidth="1.4" />
    {/* Capot et coffre : simples lignes de repère */}
    <path d="M20 12 Q32 9 44 12" className="stroke-foreground/25" strokeWidth="1" fill="none" />
    <path d="M20 100 Q32 103 44 100" className="stroke-foreground/25" strokeWidth="1" fill="none" />
    {(Object.keys(vitres) as ZoneVitrage[]).map((z) => (
      <path
        key={z}
        d={vitres[z]}
        strokeWidth="1"
        className={zones.includes(z) ? "fill-primary stroke-primary" : "fill-muted stroke-foreground/30"}
      />
    ))}
  </svg>
);

export default GlassDiagram;
