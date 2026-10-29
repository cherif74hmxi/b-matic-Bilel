import type { ComponentType, ReactNode } from "react";
import { Check } from "lucide-react";

// ============================================================================
//  ChoiceButton — gros bouton de choix (formulaire de rendez-vous)
// ----------------------------------------------------------------------------
//  Cible tactile ≥ 56 px, rôle « radio » : à placer dans un conteneur
//  role="radiogroup" (voir ChoiceGroup).
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
  compact = false,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  texte?: string;
  icon?: ComponentType<{ className?: string }>;
  /** Bouton centré sans description (Oui / Non, Avant / Arrière…). */
  compact?: boolean;
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={`relative w-full min-h-14 flex items-center gap-3.5 rounded-xl border-2 px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      compact ? "justify-center text-center" : ""
    } ${
      selected
        ? "border-primary bg-primary/10 shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
        : "border-border bg-card hover:border-primary/50"
    }`}
  >
    {Icon && (
      <span
        className={`shrink-0 w-11 h-11 rounded-lg grid place-items-center transition-colors ${
          selected ? "bg-gradient-neon text-primary-foreground" : "bg-muted text-primary"
        }`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block font-semibold text-[15px] leading-snug">{label}</span>
      {texte && <span className="block text-sm text-muted-foreground leading-snug mt-0.5">{texte}</span>}
    </span>
    {!compact && (
      <span
        className={`shrink-0 w-6 h-6 rounded-full border-2 grid place-items-center transition-all ${
          selected ? "bg-primary border-primary text-primary-foreground" : "border-border"
        }`}
        aria-hidden="true"
      >
        {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </span>
    )}
  </button>
);

export default ChoiceButton;
