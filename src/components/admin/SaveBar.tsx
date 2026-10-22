import { Eye, Loader2 } from "lucide-react";

/**
 * Barre d'enregistrement des formulaires admin (fixe au-dessus des onglets sur mobile).
 * · fiche non publiée : « Enregistrer en brouillon » + « Publier » (enregistre ET met en ligne) ;
 * · fiche en ligne : « Enregistrer ».
 */
const SaveBar = ({
  status,
  pending,
  canPublish,
  saveDisabled,
  onPublish,
}: {
  /** Texte d'état affiché à gauche (à partir de sm). */
  status: string;
  /** « draft » = bouton d'enregistrement en cours, « publish » = publication en cours. */
  pending: "draft" | "publish" | null;
  canPublish: boolean;
  saveDisabled: boolean;
  onPublish: () => void;
}) => (
  <div className="fixed md:sticky inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] md:bottom-4 z-30 mt-6 border-t md:border border-border bg-background/95 backdrop-blur-xl px-4 py-3 md:rounded-xl md:px-4">
    <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
      <span className="text-xs text-muted-foreground hidden sm:block">{status}</span>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          type="submit"
          disabled={pending !== null || saveDisabled}
          className={`${canPublish ? "btn-ghost" : "btn-main"} flex-1 sm:flex-none min-h-[48px] px-4`}
        >
          {pending === "draft" && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {canPublish ? (
            <>
              <span className="sm:hidden">Brouillon</span>
              <span className="hidden sm:inline">Enregistrer en brouillon</span>
            </>
          ) : (
            "Enregistrer"
          )}
        </button>
        {canPublish && (
          <button type="button" onClick={onPublish} disabled={pending !== null} className="btn-main flex-1 sm:flex-none min-h-[48px] px-5">
            {pending === "publish" ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
            Publier
          </button>
        )}
      </div>
    </div>
  </div>
);

export default SaveBar;
