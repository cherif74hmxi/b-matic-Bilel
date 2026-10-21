import type { ReactNode } from "react";
import type { PhotoSlot } from "@/lib/vehiclePhotos";

// ============================================================================
//  Illustrations des emplacements photo (dessins maison)
//  Voiture vue de dessus, avant en haut : la zone à photographier est
//  surlignée et l'appareil photo montre d'où prendre la photo.
// ============================================================================

type Point = { x: number; y: number };

interface Shot {
  camera: Point;
  /** Point visé (centre de la zone). */
  target: Point;
  /** Zone surlignée. */
  zone: ReactNode;
  /** Demi-largeur du cône de visée au niveau de la cible. */
  spread?: number;
}

const zoneProps = { className: "fill-neon-cyan/35 stroke-neon-cyan", strokeWidth: 1.2 };
/** Contour seul (la classe fill-* l'emporterait sur un attribut fill="none"). */
const outlineProps = { className: "fill-none stroke-neon-cyan", strokeWidth: 3, strokeLinecap: "round" as const };

// Voiture : carrosserie x 34→62, y 8→64 ; avant en haut ; gauche du véhicule à gauche.
const SHOTS: Record<Exclude<PhotoSlot, "autre">, Shot> = {
  // Vue principale : toute la voiture, prise de loin (plan large), marquée d'une étoile.
  couverture: {
    camera: { x: 4, y: 2 },
    target: { x: 48, y: 36 },
    spread: 24,
    zone: (
      <>
        <rect x="34" y="8" width="28" height="56" rx="9" {...zoneProps} />
        <path d="M78 6l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" className="fill-neon-cyan" />
      </>
    ),
  },
  avant_gauche_3_4: { camera: { x: 16, y: 10 }, target: { x: 46, y: 24 }, spread: 12, zone: <path d="M34 36V17a9 9 0 0 1 9-9h10a9 9 0 0 1 9 9" {...outlineProps} /> },
  arriere_droit_3_4: { camera: { x: 80, y: 62 }, target: { x: 50, y: 48 }, spread: 12, zone: <path d="M62 36v19a9 9 0 0 1-9 9H43a9 9 0 0 1-9-9" {...outlineProps} /> },
  profil_gauche: { camera: { x: 8, y: 36 }, target: { x: 34, y: 36 }, spread: 24, zone: <line x1="34" y1="14" x2="34" y2="58" {...outlineProps} /> },
  interieur_conducteur: { camera: { x: 12, y: 33 }, target: { x: 42, y: 32 }, spread: 7, zone: <rect x="37" y="28" width="9" height="9" rx="2" {...zoneProps} /> },
  interieur_passager: { camera: { x: 84, y: 33 }, target: { x: 54, y: 32 }, spread: 7, zone: <rect x="50" y="28" width="9" height="9" rx="2" {...zoneProps} /> },
  detail_exterieur: { camera: { x: 14, y: 4 }, target: { x: 38, y: 11 }, spread: 5, zone: <circle cx="38" cy="11" r="4" {...zoneProps} /> },
  equipement_1: { camera: { x: 48, y: 44 }, target: { x: 48, y: 26 }, spread: 6, zone: <rect x="43" y="23" width="10" height="4" rx="1.5" {...zoneProps} /> },
  equipement_2: { camera: { x: 48, y: 50 }, target: { x: 48, y: 34 }, spread: 4, zone: <rect x="46" y="29" width="4" height="9" rx="1.5" {...zoneProps} /> },
  roue: { camera: { x: 8, y: 6 }, target: { x: 33, y: 18 }, spread: 6, zone: <rect x="30" y="13" width="6" height="11" rx="2" {...zoneProps} /> },
  coffre: { camera: { x: 48, y: 72 }, target: { x: 48, y: 58 }, spread: 12, zone: <rect x="37" y="53" width="22" height="9" rx="3" {...zoneProps} /> },
};

/** Voiture vue de dessus (traits seulement). */
const CarTopView = () => (
  <g className="stroke-current" fill="none" strokeWidth={1.2} strokeLinejoin="round">
    {/* roues */}
    <rect x="31" y="14" width="4" height="9" rx="1.5" className="fill-current" />
    <rect x="61" y="14" width="4" height="9" rx="1.5" className="fill-current" />
    <rect x="31" y="49" width="4" height="9" rx="1.5" className="fill-current" />
    <rect x="61" y="49" width="4" height="9" rx="1.5" className="fill-current" />
    {/* carrosserie, rétroviseurs */}
    <rect x="34" y="8" width="28" height="56" rx="9" className="fill-background" />
    <path d="M34 25h-3.5v3H34M62 25h3.5v3H62" />
    {/* pare-brise, toit, lunette arrière */}
    <path d="M37.5 21.5h21l-2.5 5.5h-16z" />
    <path d="M40 27v20.5M56 27v20.5" opacity={0.5} />
    <path d="M40 47.5h16l2 4.5H38z" />
    {/* sièges */}
    <rect x="38" y="29" width="7" height="7" rx="2" opacity={0.6} />
    <rect x="51" y="29" width="7" height="7" rx="2" opacity={0.6} />
    <rect x="38.5" y="39" width="19" height="6" rx="2" opacity={0.6} />
    {/* phares */}
    <path d="M37 11.5l4-2M59 11.5l-4-2" />
  </g>
);

/** Petit appareil photo orienté vers la cible, avec son cône de visée. */
const Camera = ({ camera, target, spread = 8 }: Pick<Shot, "camera" | "target" | "spread">) => {
  const dx = target.x - camera.x;
  const dy = target.y - camera.y;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendiculaire unitaire, pour ouvrir le cône de part et d'autre de la cible.
  const px = -dy / len;
  const py = dx / len;
  const cone = `${camera.x},${camera.y} ${target.x + px * spread},${target.y + py * spread} ${target.x - px * spread},${target.y - py * spread}`;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g>
      <polygon points={cone} className="fill-neon-purple/20" />
      <g transform={`translate(${camera.x} ${camera.y}) rotate(${angle})`}>
        <rect x="-5" y="-4" width="9" height="8" rx="1.8" className="fill-neon-purple stroke-background" strokeWidth={1} />
        <rect x="3.5" y="-2.5" width="3" height="5" rx="1" className="fill-neon-purple" />
        <circle cx="-0.5" cy="0" r="2" className="fill-background" />
      </g>
    </g>
  );
};

/** Illustration de l'angle à photographier pour un emplacement guidé. */
const SlotIllustration = ({ slot, className }: { slot: Exclude<PhotoSlot, "autre">; className?: string }) => {
  const shot = SHOTS[slot];
  return (
    // Marge de 6 autour du dessin : les appareils photo près des bords ne sont pas coupés.
    <svg viewBox="-6 -6 108 86" className={className} aria-hidden="true" focusable="false">
      <CarTopView />
      <Camera {...shot} />
      {shot.zone}
    </svg>
  );
};

export default SlotIllustration;
