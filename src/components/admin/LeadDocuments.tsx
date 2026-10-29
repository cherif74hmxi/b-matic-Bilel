import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileText, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase, STORAGE_BUCKETS } from "@/lib/supabase";
import { legalInfo } from "@/data/legal";

// ============================================================================
//  LeadDocuments — documents déposés par le client après sa réservation
//  (carte grise, attestation d'assurance), bucket PRIVÉ « client-documents ».
// ----------------------------------------------------------------------------
//  Dossier = « Référence dossier » de la demande. Ouverture par lien signé
//  valable 5 minutes ; suppression possible (sinon purge auto à 90 jours).
// ============================================================================

const bucket = () => supabase.storage.from(STORAGE_BUCKETS.clientDocuments);

const pieceLabel = (name: string) =>
  name.startsWith("carte-grise") ? "Carte grise" : name.startsWith("assurance") ? "Attestation d'assurance" : name;

const LeadDocuments = ({ reference }: { reference: string }) => {
  const queryClient = useQueryClient();
  const key = ["lead-documents", reference];
  const { data, isLoading, isError } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await bucket().list(reference, { sortBy: { column: "created_at", order: "asc" } });
      if (error) throw error;
      return data.filter((f) => f.id !== null);
    },
  });

  const remove = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await bucket().remove([`${reference}/${name}`]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document supprimé.");
      void queryClient.invalidateQueries({ queryKey: key });
    },
    onError: () => toast.error("Suppression impossible."),
  });

  const open = async (name: string) => {
    // Onglet ouvert tout de suite (sinon bloqué par Safari après l'await).
    // (« noopener » ferait renvoyer null : opener coupé à la main.)
    const tab = window.open("", "_blank");
    if (tab) tab.opener = null;
    const { data, error } = await bucket().createSignedUrl(`${reference}/${name}`, 300);
    if (error || !data) {
      tab?.close();
      toast.error("Ouverture impossible.");
      return;
    }
    if (tab) tab.location.href = data.signedUrl;
    else window.location.assign(data.signedUrl);
  };

  if (isLoading)
    return (
      <p className="mt-3 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Documents…
      </p>
    );
  if (isError) return <p className="mt-3 text-muted-foreground">Documents indisponibles.</p>;
  if (!data?.length) return <p className="mt-3 text-muted-foreground">Aucun document déposé par le client.</p>;

  return (
    <div className="mt-3">
      <p className="text-muted-foreground mb-2">
        Documents du client (supprimés automatiquement après {legalInfo.documentsRetentionDays} jours)
      </p>
      <ul className="grid gap-2">
        {data.map((file) => (
          <li key={file.name} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <FileText className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1 min-w-0 truncate">{pieceLabel(file.name)}</span>
            <button type="button" onClick={() => void open(file.name)} className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg hover:bg-muted">
              <ExternalLink className="w-4 h-4" aria-hidden="true" /> Ouvrir
            </button>
            <button
              type="button"
              disabled={remove.isPending}
              onClick={() => window.confirm(`Supprimer « ${pieceLabel(file.name)} » ?`) && remove.mutate(file.name)}
              className="inline-flex items-center min-h-[40px] px-2.5 rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-50"
              aria-label={`Supprimer ${pieceLabel(file.name)}`}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeadDocuments;
