import { useRef, useState } from "react";
import { Check, FileUp, Loader2, Lock, AlertTriangle } from "lucide-react";
import { legalInfo } from "@/data/legal";
import { rdvDocuments } from "@/data/rendezvous";
import { DocumentError, uploadDocument, type PieceId } from "@/lib/rendezvous";

// ============================================================================
//  DocumentsUpload — carte grise et attestation d'assurance, FACULTATIVES,
//  proposées sur l'écran de confirmation (jamais dans le formulaire initial).
// ----------------------------------------------------------------------------
//  · Consentement spécifique obligatoire avant tout envoi.
//  · Bucket privé, dossier = « Référence dossier » de la demande, purge
//    automatique après legalInfo.documentsRetentionDays jours.
//  · Un échec n'est jamais bloquant : « apportez-le le jour du rendez-vous ».
// ============================================================================

type PieceState = { status: "idle" | "envoi" | "ok" | "erreur"; message?: string; nom?: string };

const errorMessage = (e: unknown) => {
  const reason = e instanceof DocumentError ? e.reason : "envoi";
  return reason === "format" ? rdvDocuments.formatRefuse : reason === "taille" ? rdvDocuments.tropLourd : rdvDocuments.echec;
};

const DocumentsUpload = ({ reference }: { reference: string }) => {
  const jours = legalInfo.documentsRetentionDays;
  const [consent, setConsent] = useState(false);
  const [pieces, setPieces] = useState<Record<PieceId, PieceState>>({
    "carte-grise": { status: "idle" },
    assurance: { status: "idle" },
  });
  const inputs = useRef<Partial<Record<PieceId, HTMLInputElement | null>>>({});

  const set = (id: PieceId, state: PieceState) => setPieces((p) => ({ ...p, [id]: state }));

  const handle = async (id: PieceId, input: HTMLInputElement) => {
    const file = input.files?.[0];
    input.value = "";
    if (!file || !consent) return;
    set(id, { status: "envoi", nom: file.name });
    try {
      await uploadDocument(reference, id, file);
      set(id, { status: "ok", nom: file.name });
    } catch (e) {
      set(id, { status: "erreur", message: errorMessage(e) });
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6 text-left" aria-labelledby="rdv-docs-titre">
      <h2 id="rdv-docs-titre" className="font-heading text-lg font-bold mb-1.5">
        {rdvDocuments.titre}
      </h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{rdvDocuments.texte}</p>

      <label className="flex gap-3 items-start text-sm mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="w-5 h-5 mt-0.5 accent-[hsl(var(--primary))] shrink-0"
        />
        <span>{rdvDocuments.consentement(jours)}</span>
      </label>

      <ul className="grid grid-cols-1 gap-3">
        {rdvDocuments.pieces.map((piece) => {
          const state = pieces[piece.id];
          const busy = state.status === "envoi";
          return (
            <li key={piece.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`shrink-0 w-10 h-10 rounded-lg grid place-items-center ${
                    state.status === "ok" ? "bg-success/15 text-success" : "bg-muted text-primary"
                  }`}
                >
                  {state.status === "ok" ? <Check className="w-5 h-5" aria-hidden="true" /> : <FileUp className="w-5 h-5" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm">{piece.label}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {state.status === "ok" ? `${rdvDocuments.ok} · ${state.nom}` : piece.aide}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!consent || busy}
                  onClick={() => inputs.current[piece.id]?.click()}
                  className="btn-ghost !px-4 !py-2.5 min-h-11 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label={`${state.status === "ok" ? rdvDocuments.remplacer : rdvDocuments.bouton} : ${piece.label}`}
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> {rdvDocuments.envoi}
                    </>
                  ) : state.status === "ok" ? (
                    rdvDocuments.remplacer
                  ) : (
                    rdvDocuments.bouton
                  )}
                </button>
                <input
                  ref={(el) => (inputs.current[piece.id] = el)}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => void handle(piece.id, e.currentTarget)}
                />
              </div>
              {state.status === "erreur" && (
                <p role="alert" className="flex gap-2 items-start text-sm text-warning mt-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" /> {state.message}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-muted-foreground mt-3">{rdvDocuments.formats}</p>
      <p className="flex gap-2 items-start text-sm text-muted-foreground mt-4 leading-relaxed">
        <Lock className="w-4 h-4 shrink-0 mt-0.5 text-primary" aria-hidden="true" /> {rdvDocuments.rassurance(jours)}
      </p>
    </section>
  );
};

export default DocumentsUpload;
