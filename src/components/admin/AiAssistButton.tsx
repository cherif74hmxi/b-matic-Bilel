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

export default AiAssistButton;
