import { Loader2, Sparkles } from "lucide-react";
import { AI_ENABLED } from "@/lib/aiCopy";

/** Bouton « Générer avec l'IA » (désactivé tant que VITE_AI_ENABLED n'est pas à true). */
const AiAssistButton = ({ onClick, pending, hint }: { onClick: () => void; pending: boolean; hint: string }) => (
  <div className="grid gap-1.5">
    <button
      type="button"
      onClick={onClick}
      disabled={!AI_ENABLED || pending}
      className="btn-ghost min-h-[44px] w-full sm:w-auto border-neon-purple/50 disabled:opacity-50"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Sparkles className="w-4 h-4 text-neon-purple" aria-hidden="true" />}
      {pending ? "Rédaction en cours…" : "Générer avec l'IA"}
    </button>
    <p className="text-xs text-muted-foreground">
      {AI_ENABLED
        ? `${hint} Le texte est envoyé à Google Gemini : n'y mettez aucune donnée personnelle (nom, téléphone d'un client…).`
        : "Assistant IA pas encore activé sur ce site."}
    </p>
  </div>
);

/** Adresse proposée par l'IA : simple suggestion, appliquée seulement sur demande. */
export const SlugSuggestion = ({ prefix, slug, onUse }: { prefix: string; slug: string; onUse: () => void }) => (
  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground -mt-1">
    <Sparkles className="w-3.5 h-3.5 text-neon-purple shrink-0" aria-hidden="true" />
    <span className="min-w-0 break-all">
      Adresse proposée par l'IA : <span className="font-mono text-foreground">{prefix}{slug}</span>
    </span>
    <button type="button" onClick={onUse} className="underline min-h-[44px] px-1 text-neon-cyan">
      Utiliser
    </button>
  </p>
);

export default AiAssistButton;
