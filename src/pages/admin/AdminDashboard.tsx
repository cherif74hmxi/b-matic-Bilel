import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, Car, Eye, Inbox, Mail, Newspaper, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { supabase } from "@/lib/supabase";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_TYPES,
  LEAD_TYPE_LABELS,
  type LeadStatus,
  type LeadType,
} from "@/lib/leads";

// ============================================================================
//  Tableau de bord admin — KPI
//  Compteurs et top des pages calculés côté base (fonctions SQL de
//  supabase/migrations/20261021_phase3.sql) : exacts quel que soit le volume
//  (l'API Supabase limite les sélections à 1000 lignes).
// ============================================================================

const nf = new Intl.NumberFormat("fr-BE");
const KPIS_KEY = ["admin", "kpis"];
const RECENT_LEADS_KEY = ["admin", "recent-leads"];

/** Erreur PostgREST « fonction introuvable » : migration SQL pas encore exécutée. */
const isMissingFunction = (error: unknown) => (error as { code?: string } | null)?.code === "PGRST202";

interface DashboardCounts {
  visits_total: number;
  visits_30d: number;
  vehicles: { published: number; draft: number; sold: number };
  posts: { published: number; draft: number };
  leads: Partial<Record<LeadType, { total: number; new: number }>>;
}

async function fetchKpis() {
  const { data, error } = await supabase.rpc("admin_dashboard_counts");
  if (error) throw error;
  const c = data as DashboardCounts;
  const leadsByType = LEAD_TYPES.map((type) => ({ type, total: c.leads[type]?.total ?? 0, fresh: c.leads[type]?.new ?? 0 }));
  return {
    visitsTotal: c.visits_total,
    visits30: c.visits_30d,
    vehicles: c.vehicles,
    posts: c.posts,
    leadsByType,
    leadsTotal: leadsByType.reduce((sum, l) => sum + l.total, 0),
    leadsNew: leadsByType.reduce((sum, l) => sum + l.fresh, 0),
  };
}

interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

async function fetchRecentLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("id,type,status,name,email,phone,message,details,created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return data as Lead[];
}

type TopPage = { path: string; views: number };

async function fetchTopPages(): Promise<TopPage[]> {
  const { data, error } = await supabase.rpc("admin_top_pages", { days: 30, max_rows: 8 });
  if (error) throw error;
  return (data as TopPage[]).map((r) => ({ path: r.path, views: Number(r.views) }));
}

// ---------------------------------------------------------------------------
//  Petits composants d'affichage
// ---------------------------------------------------------------------------

const StatTile = ({
  icon,
  label,
  value,
  sub,
  to,
}: {
  icon: ReactNode;
  label: string;
  value: number | undefined;
  sub?: ReactNode;
  to?: string;
}) => {
  const body = (
    <>
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider font-heading">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="font-heading text-3xl font-bold mt-2 tabular-nums">
        {value === undefined ? <span className="inline-block w-12 h-8 rounded bg-muted animate-pulse align-middle" /> : nf.format(value)}
      </p>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </>
  );
  const className = "block bg-gradient-card border-glow rounded-xl p-4 min-h-[112px]";
  return to ? (
    <Link to={to} className={`${className} hover:glow-card transition-shadow`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
};

const Section = ({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) => (
  <section className="mt-8">
    <div className="flex items-baseline justify-between gap-3 mb-3">
      <h2 className="font-heading text-sm uppercase tracking-wider">{title}</h2>
      {aside}
    </div>
    {children}
  </section>
);

const ErrorBox = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-neon-pink/40 bg-neon-pink/5 p-4 text-sm">
    <span className="flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 text-neon-pink shrink-0" aria-hidden="true" />
      {isMissingFunction(error)
        ? "Migration SQL manquante : exécuter supabase/migrations/20261021_phase3.sql dans Supabase."
        : "Chargement impossible."}
    </span>
    <button type="button" onClick={onRetry} className="btn-ghost min-h-[44px] px-4">
      <RefreshCw className="w-4 h-4" aria-hidden="true" />
      Réessayer
    </button>
  </div>
);

const contactChipClass =
  "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-border text-sm hover:border-muted-foreground hover:bg-muted transition-colors";

const formatDetailValue = (value: unknown) =>
  typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);

const LeadCard = ({ lead, onStatusChange }: { lead: Lead; onStatusChange: (status: LeadStatus) => void }) => {
  const details = Object.entries(lead.details ?? {}).filter(([, v]) => v !== null && v !== "");
  return (
    <li className="min-w-0 bg-gradient-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium truncate">{lead.name}</p>
          <p className="text-xs text-muted-foreground">
            {LEAD_TYPE_LABELS[lead.type]} · {format(new Date(lead.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
          </p>
        </div>
        <label className="sr-only" htmlFor={`lead-status-${lead.id}`}>
          Statut de la demande
        </label>
        <select
          id={`lead-status-${lead.id}`}
          value={lead.status}
          onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
          className={`shrink-0 min-h-[40px] rounded-lg border bg-input px-2 text-sm ${
            lead.status === "new" ? "border-neon-cyan text-neon-cyan" : "border-border text-foreground"
          }`}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {lead.phone && (
          <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className={contactChipClass}>
            <Phone className="w-4 h-4" aria-hidden="true" />
            {lead.phone}
          </a>
        )}
        {lead.email && (
          <a href={`mailto:${encodeURIComponent(lead.email)}`} className={`${contactChipClass} min-w-0 max-w-full`}>
            <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{lead.email}</span>
          </a>
        )}
      </div>

      {(lead.message || details.length > 0) && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-muted-foreground min-h-[32px] flex items-center">Voir le détail</summary>
          {lead.message && <p className="mt-2 whitespace-pre-line break-words">{lead.message}</p>}
          {details.length > 0 && (
            <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
              {details.map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="break-words">{formatDetailValue(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </details>
      )}
    </li>
  );
};

// ---------------------------------------------------------------------------

const AdminDashboard = () => {
  useSeo({ title: "Tableau de bord — Admin B MATIC" });
  const queryClient = useQueryClient();

  const kpis = useQuery({ queryKey: KPIS_KEY, queryFn: fetchKpis });
  const leads = useQuery({ queryKey: RECENT_LEADS_KEY, queryFn: fetchRecentLeads });
  const topPages = useQuery({ queryKey: ["admin", "top-pages"], queryFn: fetchTopPages });

  // Mise à jour optimiste : le menu affiche tout de suite le nouveau statut,
  // puis on revient en arrière si l'enregistrement échoue.
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: RECENT_LEADS_KEY });
      const previous = queryClient.getQueryData<Lead[]>(RECENT_LEADS_KEY);
      queryClient.setQueryData<Lead[]>(RECENT_LEADS_KEY, (old) => old?.map((l) => (l.id === id ? { ...l, status } : l)));
      return { previous };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(RECENT_LEADS_KEY, context?.previous);
      toast.error("Impossible de modifier le statut.");
    },
    onSuccess: () => toast.success("Statut mis à jour."),
    // Seuls les compteurs dépendent du statut (pas les vues de page).
    onSettled: () => void queryClient.invalidateQueries({ queryKey: KPIS_KEY }),
  });

  const k = kpis.data;
  const maxViews = topPages.data?.[0]?.views ?? 0;

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        subtitle="Statistiques sans cookie : aucune donnée personnelle des visiteurs."
        actions={
          <button
            type="button"
            onClick={() => void queryClient.invalidateQueries({ queryKey: ["admin"] })}
            className="btn-ghost min-h-[44px] px-4"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Actualiser
          </button>
        }
      />

      {kpis.isError ? (
        <ErrorBox error={kpis.error} onRetry={() => void kpis.refetch()} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile
            icon={<Eye className="w-4 h-4" aria-hidden="true" />}
            label="Visites 30 j"
            value={k?.visits30}
            sub={k && <>Total : {nf.format(k.visitsTotal)}</>}
          />
          <StatTile
            icon={<Inbox className="w-4 h-4" aria-hidden="true" />}
            label="Demandes"
            value={k?.leadsNew}
            sub={k && <>nouvelles · {nf.format(k.leadsTotal)} au total</>}
          />
          <StatTile
            icon={<Car className="w-4 h-4" aria-hidden="true" />}
            label="Véhicules"
            value={k?.vehicles.published}
            sub={k && <>en ligne · {nf.format(k.vehicles.draft)} brouillon(s) · {nf.format(k.vehicles.sold)} vendu(s)</>}
            to="/admin/vehicules"
          />
          <StatTile
            icon={<Newspaper className="w-4 h-4" aria-hidden="true" />}
            label="Actualités"
            value={k?.posts.published}
            sub={k && <>publiées · {nf.format(k.posts.draft)} brouillon(s)</>}
            to="/admin/actualites"
          />
        </div>
      )}

      {k && (
        <Section title="Demandes par type">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="text-left font-normal px-4 py-2">Type</th>
                  <th scope="col" className="text-right font-normal px-4 py-2">Nouvelles</th>
                  <th scope="col" className="text-right font-normal px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {k.leadsByType.map((row) => (
                  <tr key={row.type} className="border-t border-border">
                    <th scope="row" className="text-left font-normal px-4 py-2.5">{LEAD_TYPE_LABELS[row.type]}</th>
                    <td className={`text-right px-4 py-2.5 tabular-nums ${row.fresh > 0 ? "text-neon-cyan font-semibold" : ""}`}>
                      {nf.format(row.fresh)}
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{nf.format(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section title="Dernières demandes">
        {leads.isError ? (
          <ErrorBox error={leads.error} onRetry={() => void leads.refetch()} />
        ) : leads.isLoading ? (
          <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ) : leads.data && leads.data.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {leads.data.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onStatusChange={(status) => updateStatus.mutate({ id: lead.id, status })} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
        )}
      </Section>

      <Section title="Pages les plus vues (30 j)">
        {topPages.isError ? (
          <ErrorBox error={topPages.error} onRetry={() => void topPages.refetch()} />
        ) : topPages.isLoading ? (
          <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ) : topPages.data && topPages.data.length > 0 ? (
          <ol className="rounded-xl border border-border divide-y divide-border">
            {topPages.data.map((row) => (
              <li key={row.path} className="relative flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                {/* Barre de proportion (une seule série : la valeur est écrite à droite) */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-1 rounded bg-neon-purple/15"
                  style={{ width: `max(0px, calc(${maxViews ? (row.views / maxViews) * 100 : 0}% - 8px))` }}
                />
                <span className="relative truncate font-mono text-xs">{row.path}</span>
                <span className="relative tabular-nums">{nf.format(row.views)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">Pas encore de visites enregistrées.</p>
        )}
      </Section>
    </>
  );
};

export default AdminDashboard;
