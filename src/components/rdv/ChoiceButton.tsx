import type { ComponentType, ReactNode } from "react";
import { Check } from "lucide-react";

// ============================================================================
//  ChoiceButton — gros bouton de choix (formulaire de rendez-vous)
// ----------------------------------------------------------------------------
//  Cible tactile ≥ 56 px, rôle « radio » : à placer dans un conteneur
//  role="radiogroup" (voir ChoiceGroup).
//  · `icon`   : petite icône lucide dans un carré ;
//  · `visual` : vignette libre (ex. schéma de voiture), plus grande ;
//  · `compact`: libellé centré, sans pastille (Oui / Non, sous-choix…) ;
//    avec `visual`, la vignette passe au-dessus du libellé.
// ============================================================================

export const ChoiceGroup = ({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) => (
  <div role="radiogroup" aria-label={label} className={`grid gap-3 ${className || "grid-cols-1"}`}>
    {children}
  </div>
);

const ChoiceButton = ({
  selected,
  onClick,
  label,
  texte,
  icon: Icon,
  visual,
  compact = false,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  texte?: string;
  icon?: ComponentType<{ className?: string }>;
  visual?: ReactNode;
  compact?: boolean;
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={`relative w-full min-h-14 flex rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      compact && visual ? "flex-col items-center gap-2 text-center" : "items-center gap-3.5"
    } ${compact && !visual ? "justify-center text-center" : ""} ${
      selected ? "border-primary bg-primary-soft ring-1 ring-primary" : "border-border bg-card hover:border-primary/50"
    }`}
  >
    {visual && <span className={`shrink-0 ${compact ? "w-12 h-[84px]" : "w-10 h-[70px]"}`}>{visual}</span>}
    {Icon && !visual && (
      <span className="shrink-0 w-10 h-10 rounded-lg grid place-items-center bg-primary-soft text-primary">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block font-semibold text-[15px] leading-snug">{label}</span>
      {texte && <span className="block text-sm text-muted-foreground leading-snug mt-0.5">{texte}</span>}
    </span>
    {!compact && (
      <span
        className={`shrink-0 w-5 h-5 rounded-full border grid place-items-center transition-colors ${
          selected ? "bg-primary border-primary text-primary-foreground" : "border-foreground/30"
        }`}
        aria-hidden="true"
      >
        {selected && <Check className="w-3 h-3" strokeWidth={3} />}
      </span>
    )}
  </button>
);

export default ChoiceButton;
