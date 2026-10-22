import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, ChevronLeft, ChevronRight, Lock, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { supabase } from "@/lib/supabase";
import { rdvHeures } from "@/data/rdv";
import { addDays, brusselsNow, slotKey } from "@/lib/rdv";

// ============================================================================
//  Agenda des rendez-vous (admin) — 7 jours par page
//  · créneau libre   → toucher pour le BLOQUER (congé, atelier plein…)
//  · créneau bloqué  → toucher pour le débloquer
//  · rendez-vous     → nom, téléphone, prestation. Pour l'annuler : archiver
//                      la demande dans le tableau de bord (le créneau se libère).
// ============================================================================

const JOURS = 7;

interface SlotRow {
  slot_date: string;
  slot_hour: number;
  lead_id: string | null;
  note: string | null;
  leads: { name: string; phone: string | null; details: Record<string, string> } | null;
}

async function listSlots(from: string, to: string): Promise<Map<string, SlotRow>> {
  const { data, error } = await supabase
    .from("rdv_slots")
    .select("slot_date, slot_hour, lead_id, note, leads(name, phone, details)")
    .gte("slot_date", from)
    .lte("slot_date", to);
  if (error) throw error;
  return new Map((data as unknown as SlotRow[]).map((r) => [slotKey(r.slot_date, r.slot_hour), r]));
}

const jourLabel = (iso: string) => format(new Date(`${iso}T12:00:00`), "EEEE d MMMM", { locale: fr });

const AdminAgenda = () => {
  useSeo({ title: "Agenda — Admin B MATIC" });
  const today = brusselsNow().date;
  const [debut, setDebut] = useState(today);
  const fin = addDays(debut, JOURS - 1);
  const queryClient = useQueryClient();
  const queryKey = ["admin", "rdv_slots", debut];

  const { data: slots, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () => listSlots(debut, fin),
  });

  const toggle = useMutation({
    mutationFn: async ({ date, hour, bloque }: { date: string; hour: number; bloque: boolean }) => {
      const { error } = bloque
        ? await supabase.from("rdv_slots").delete().eq("slot_date", date).eq("slot_hour", hour).is("lead_id", null)
        : await supabase.from("rdv_slots").insert({ slot_date: date, slot_hour: hour, note: "Bloqué" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "rdv_slots"] }),
    onError: () => {
      toast.error("Modification impossible : le créneau vient peut-être d'être réservé. Actualisez.");
      queryClient.invalidateQueries({ queryKey: ["admin", "rdv_slots"] });
    },
  });

  const jours = Array.from({ length: JOURS }, (_, i) => addDays(debut, i));

  return (
    <div>
      <AdminPageHeader
        title="Agenda"
        subtitle="Créneaux d'1 h, 10h–19h. Touchez un créneau libre pour le bloquer."
        actions={
          <button type="button" onClick={() => refetch()} className="btn-ghost min-h-[44px]" disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" /> Actualiser
          </button>
        }
      />

      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          type="button"
          onClick={() => setDebut(addDays(debut, -JOURS))}
          disabled={debut <= today}
          className="w-11 h-11 rounded-lg border border-border grid place-items-center disabled:opacity-30"
          aria-label="Semaine précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="text-sm font-medium text-center">
          Du {jourLabel(debut)} au {jourLabel(fin)}
        </p>
        <button
          type="button"
          onClick={() => setDebut(addDays(debut, JOURS))}
          className="w-11 h-11 rounded-lg border border-border grid place-items-center"
          aria-label="Semaine suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {isError && (
        <div className="flex gap-3 items-start bg-destructive/10 border border-destructive/30 text-sm rounded-xl p-4 mb-5">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0" aria-hidden="true" />
          <p>
            Agenda inaccessible. Si c'est la première utilisation, exécutez la migration
            <code className="mx-1">20261027000001_rdv_slots.sql</code>dans Supabase → SQL Editor.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {jours.map((jour) => (
          <section key={jour} className="bg-gradient-card border border-border rounded-xl p-4">
            <h2 className="font-heading text-sm font-bold capitalize mb-3">{jourLabel(jour)}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {rdvHeures.map((h) => {
                const row = slots?.get(slotKey(jour, h));
                const label = `${String(h).padStart(2, "0")}:00`;
                if (row?.lead_id && row.leads) {
                  return (
                    <li key={h} className="rounded-lg border border-neon-pink/50 bg-neon-pink/10 p-2.5 text-sm">
                      <p className="font-semibold">{label} · {row.leads.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{row.leads.details?.["Service"] ?? "Rendez-vous"}</p>
                      {row.leads.phone && (
                        <a href={`tel:${row.leads.phone}`} className="inline-flex items-center gap-1 text-xs text-neon-cyan mt-1 min-h-[32px]">
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" /> {row.leads.phone}
                        </a>
                      )}
                    </li>
                  );
                }
                const bloque = Boolean(row);
                return (
                  <li key={h}>
                    <button
                      type="button"
                      disabled={isLoading || isError || toggle.isPending}
                      onClick={() => toggle.mutate({ date: jour, hour: h, bloque })}
                      className={`w-full min-h-[44px] rounded-lg border px-3 text-sm flex items-center justify-between gap-2 transition-colors disabled:opacity-50 ${
                        bloque
                          ? "border-border bg-muted text-muted-foreground"
                          : "border-border hover:border-primary"
                      }`}
                      aria-label={bloque ? `${label} bloqué, toucher pour débloquer` : `${label} libre, toucher pour bloquer`}
                    >
                      <span>{label}</span>
                      <span className="inline-flex items-center gap-1 text-xs">
                        {bloque ? <><Lock className="w-3.5 h-3.5" aria-hidden="true" /> Bloqué</> : "Libre"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AdminAgenda;
