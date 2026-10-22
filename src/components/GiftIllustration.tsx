import { useId, type ReactNode } from "react";
import type { GiftIllustrationKey } from "@/data/parebrise";

// ============================================================================
//  GiftIllustration — pictos maison des cadeaux pare-brise
// ----------------------------------------------------------------------------
//  Dessins au trait, en dégradé néon (violet → rose → bleu), pensés pour une
//  tuile claire. Volontairement génériques : aucune photo produit, aucun logo
//  ni forme déposée de marque. Le nom du cadeau est affiché à côté, en texte.
//  Pour ajouter un cadeau : une entrée ici + la clé dans GiftIllustrationKey.
// ============================================================================

const shapes: Record<GiftIllustrationKey, ReactNode> = {
  // Liasse de billets + pièce
  argent: (
    <>
      <rect x="6" y="20" width="38" height="22" rx="3" />
      <rect x="10" y="14" width="38" height="22" rx="3" />
      <circle cx="29" cy="25" r="5" />
      <path d="M15 20h3M40 30h3" />
      <circle cx="47" cy="45" r="11" />
      <path d="M50.5 40.5a5 5 0 1 0 0 9M42 44h6M42 47h6" />
    </>
  ),
  // Deux boîtiers de jeu
  jeux: (
    <>
      <rect x="8" y="12" width="26" height="38" rx="3" />
      <path d="M8 19h26M14 30l6 6 8-10" />
      <rect x="30" y="16" width="26" height="38" rx="3" />
      <path d="M30 23h26M37 36h12M37 42h8" />
    </>
  ),
  // Console portable à manettes détachables
  console: (
    <>
      <rect x="15" y="16" width="34" height="30" rx="2" />
      <rect x="19" y="20" width="26" height="22" rx="1" />
      <path d="M15 16h-4a6 6 0 0 0-6 6v18a6 6 0 0 0 6 6h4M49 16h4a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6h-4" />
      <circle cx="10" cy="25" r="2" />
      <path d="M8 36h4M10 34v4" />
      <circle cx="54" cy="35" r="2" />
      <circle cx="54" cy="26" r="1" />
    </>
  ),
  // Tablette
  tablette: (
    <>
      <rect x="14" y="6" width="36" height="52" rx="5" />
      <rect x="18" y="12" width="28" height="40" rx="1.5" />
      <circle cx="32" cy="9" r="0.8" />
      <path d="M23 20h12M23 26h18M23 32h14" />
    </>
  ),
  // Trottinette électrique
  trottinette: (
    <>
      <circle cx="13" cy="48" r="6" />
      <circle cx="51" cy="48" r="6" />
      <path d="M13 48h4l4-4h22l8 4" />
      <path d="M51 48 44 12" />
      <path d="M38 12h12" />
      <rect x="22" y="38" width="10" height="5" rx="1" />
    </>
  ),
  // Pneus (un de face, un derrière)
  pneus: (
    <>
      <path d="M40 10a20 22 0 0 1 0 44" />
      <ellipse cx="28" cy="32" rx="18" ry="22" />
      <ellipse cx="28" cy="32" rx="8" ry="10" />
      <path d="M28 10v6M28 48v6M10 32h6M40 32h6M15 16l4 5M41 48l-4-5M15 48l4-5M41 16l-4 5" />
    </>
  ),
  // Friteuse à air
  airfryer: (
    <>
      <path d="M16 14a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v36H16z" />
      <path d="M12 50h40v4a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z" />
      <rect x="24" y="14" width="16" height="7" rx="2" />
      <path d="M16 30h32" />
      <path d="M26 38h12" />
      <circle cx="32" cy="17.5" r="0.8" />
    </>
  ),
  // Aspirateur balai
  aspirateur: (
    <>
      <path d="M38 6h8a2 2 0 0 1 2 2v4l-6 6" />
      <rect x="34" y="16" width="10" height="14" rx="3" />
      <path d="M39 30 24 52" />
      <path d="M14 52h18a2 2 0 0 1 2 2v2H12v-2a2 2 0 0 1 2-2z" />
      <path d="M36 21h6" />
    </>
  ),
};

const GiftIllustration = ({ name, className = "" }: { name: GiftIllustrationKey; className?: string }) => {
  // Identifiant unique du dégradé : plusieurs pictos sur la même page.
  const gid = `gift-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(var(--neon-purple))" />
          <stop offset="0.55" stopColor="hsl(var(--neon-pink))" />
          <stop offset="1" stopColor="hsl(var(--neon-blue))" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${gid})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {shapes[name]}
      </g>
    </svg>
  );
};

export default GiftIllustration;
