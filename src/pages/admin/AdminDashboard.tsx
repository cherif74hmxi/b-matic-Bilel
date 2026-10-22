import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertTriangle,
  Calendar,
  Car,
  Eye,
  Inbox,
  Mail,
  MessageCircle,
  MousePointerClick,
  Newspaper,
  Phone,
  RefreshCw,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TrafficChart, { type TrafficMetric } from "@/components/admin/TrafficChart";
import { supabase } from "@/lib/supabase";
import { CLICK_KINDS, CLICK_KIND_LABELS, type ClickKind } from "@/lib/clickTracking";
import {
  BUCKET_LABELS,
  PRESETS,
  allowedBuckets,
  defaultBucket,
  fetchPeriodStats,
  fetchTraffic,
  presetPeriod,
  variation,
  type Period,
  type PresetId,
} from "@/lib/kpi";
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
//  Tout est calculé côté base (fonctions SQL des migrations phase3 et kpi) :
//  chiffres exacts quel que soit le volume (l'API Supabase limite les
//  sélections à 1000 lignes).
//    · période choisie : visites, pages vues, clics de contact, demandes par
//      type et statut, pages / véhicules les plus vus, provenance ;
//    · en continu : contenu en ligne et dernières demandes.
// ============================================================================

const nf = new Intl.NumberFormat("fr-BE");
const KPIS_KEY = ["admin", "kpis"];
const RECENT_LEADS_KEY = ["admin", "recent-leads"];
const KPI_MIGRATION = "20261026000001_kpi.sql";

/** Erreur PostgREST « fonction introuvable » : migration SQL pas encore exécutée. */
const isMissingFunction = (error: unknown) => (error as { code?: string } | null)?.code === "PGRST202";

interface DashboardCounts {
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
    vehicles: c.vehicles,
    posts: c.posts,
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

const CLICK_ICONS: Record<ClickKind, ReactNode> = {
  whatsapp: <MessageCircle className="w-4 h-4" aria-hidden="true" />,
  phone: <Phone className="w-4 h-4" aria-hidden="true" />,
  rdv: <Calendar className="w-4 h-4" aria-hidden="true" />,
  email: <Mail className="w-4 h-4" aria-hidden="true" />,
};

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

/** Comparaison avec la période précédente de même durée. */
const Trend = ({ current, previous }: { current: number; previous: number }) => {
  const v = variation(current, previous);
  if (v === null) return <>période précédente : {nf.format(previous)}</>;
  return (
    <>
      <span className={v > 0 ? "text-neon-cyan" : v < 0 ? "text-neon-pink" : ""}>
        {v > 0 ? "▲ +" : v < 0 ? "▼ " : ""}
        {v} %
      </span>{" "}
      vs période précédente
    </>
  );
};

const Section = ({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) => (
  <section className="mt-8">
    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
      <h2 className="font-heading text-sm uppercase tracking-wider">{title}</h2>
      {aside}
    </div>
    {children}
  </section>
);

const ErrorBox = ({
  error,
  onRetry,
  migration = "20261021000001_phase3.sql",
}: {
  error: unknown;
  onRetry: () => void;
  migration?: string;
}) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-neon-pink/40 bg-neon-pink/5 p-4 text-sm">
    <span className="flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 text-neon-pink shrink-0" aria-hidden="true" />
      {isMissingFunction(error)
        ? `Migration SQL manquante : exécuter supabase/migrations/${migration} dans Supabase.`
        : "Chargement impossible."}
    </span>
    <button type="button" onClick={onRetry} className="btn-ghost min-h-[44px] px-4">
      <RefreshCw className="w-4 h-4" aria-hidden="true" />
      Réessayer
    </button>
  </div>
);

const chipClass = (active: boolean) =>
  `shrink-0 min-h-[40px] px-4 rounded-full border text-sm transition-colors ${
    active ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
  }`;

/** Liste classée avec barre de proportion (une seule série : la valeur est écrite à droite). */
const RankedList = ({ rows, empty }: { rows: { key: string; label: ReactNode; value: number }[]; empty: string }) => {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  const max = rows[0].value || 1;
  return (
    <ol className="rounded-xl border border-border divide-y divide-border">
      {rows.map((row) => (
        <li key={row.key} className="relative flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 rounded bg-neon-purple/15"
            style={{ width: `max(0px, calc(${(row.value / max) * 100}% - 8px))` }}
          />
          <span className="relative min-w-0 truncate">{row.label}</span>
          <span className="relative tabular-nums">{nf.format(row.value)}</span>
        </li>
      ))}
    </ol>
  );
};

const Skeleton = ({ className = "h-24" }: { className?: string }) => (
  <div className={`${className} rounded-xl bg-muted/40 animate-pulse`} />
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
//  Sélecteur de période
// ---------------------------------------------------------------------------

const dateInputClass = "min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm";

const PeriodPicker = ({
  preset,
  period,
  onPreset,
  onChange,
}: {
  preset: PresetId;
  period: Period;
  onPreset: (id: PresetId) => void;
  onChange: (p: Period) => void;
}) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const setDates = (from: string, to: string) => {
    if (!from || !to) return;
    const [a, b] = from <= to ? [from, to] : [to, from];
    const buckets = allowedBuckets(a, b);
    onChange({ from: a, to: b, bucket: buckets.includes(period.bucket) ? period.bucket : defaultBucket(a, b) });
  };

  return (
    <div className="space-y-3">
      {/* Défile horizontalement sur petit écran plutôt que de passer sur 3 lignes */}
      <div className="-mx-4 px-4 overflow-x-auto">
        <div role="group" aria-label="Période" className="flex gap-2 w-max">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" aria-pressed={preset === p.id} onClick={() => onPreset(p.id)} className={chipClass(preset === p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {preset === "custom" && (
          <>
            <label className="text-xs text-muted-foreground flex flex-col gap-1">
              Du
              <input type="date" value={period.from} max={today} onChange={(e) => setDates(e.target.value, period.to)} className={dateInputClass} />
            </label>
            <label className="text-xs text-muted-foreground flex flex-col gap-1">
              Au
              <input type="date" value={period.to} max={today} onChange={(e) => setDates(period.from, e.target.value)} className={dateInputClass} />
            </label>
          </>
        )}
        <label className="text-xs text-muted-foreground flex flex-col gap-1">
          Découpage
          <select
            value={period.bucket}
            onChange={(e) => onChange({ ...period, bucket: e.target.value as Period["bucket"] })}
            className={dateInputClass}
          >
            {allowedBuckets(period.from, period.to).map((b) => (
              <option key={b} value={b}>
                {BUCKET_LABELS[b]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const AdminDashboard = () => {
  useSeo({ title: "Tableau de bord — Admin B MATIC" });
  const queryClient = useQueryClient();

  const [preset, setPreset] = useState<PresetId>("30d");
  const [period, setPeriod] = useState<Period>(() => presetPeriod("30d"));
  const [metric, setMetric] = useState<TrafficMetric>("visits");

  const choosePreset = (id: PresetId) => {
    setPreset(id);
    if (id !== "custom") setPeriod(presetPeriod(id));
  };

  const kpis = useQuery({ queryKey: KPIS_KEY, queryFn: fetchKpis });
  const leads = useQuery({ queryKey: RECENT_LEADS_KEY, queryFn: fetchRecentLeads });
  // keepPreviousData : en changeant de période, l'ancien graphique reste affiché
  // jusqu'à l'arrivée des nouveaux chiffres (pas de saut de mise en page).
  const traffic = useQuery({
    queryKey: ["admin", "traffic", period],
    // Le découpage voyage avec les points : pendant le chargement d'une autre
    // période, les anciens points gardent leurs propres libellés.
    queryFn: async () => ({ bucket: period.bucket, points: await fetchTraffic(period) }),
    placeholderData: keepPreviousData,
  });
  const stats = useQuery({
    queryKey: ["admin", "period-stats", period.from, period.to],
    queryFn: () => fetchPeriodStats(period.from, period.to),
    placeholderData: keepPreviousData,
  });

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
    // Les compteurs de demandes dépendent du statut (pas les vues de page).
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: KPIS_KEY });
      void queryClient.invalidateQueries({ queryKey: ["admin", "period-stats"] });
    },
  });

  const k = kpis.data;
  const s = stats.data;
  const clicksTotal = s ? CLICK_KINDS.reduce((sum, kind) => sum + (s.clicks[kind] ?? 0), 0) : undefined;
  const leadCount = (type: LeadType, status?: LeadStatus) => {
    const byStatus = s?.leads[type] ?? {};
    return status ? byStatus[status] ?? 0 : LEAD_STATUSES.reduce((sum, st) => sum + (byStatus[st] ?? 0), 0);
  };
  const leadsInPeriod = s ? LEAD_TYPES.reduce((sum, t) => sum + leadCount(t), 0) : undefined;

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

      <PeriodPicker
        preset={preset}
        period={period}
        onPreset={choosePreset}
        onChange={(p) => {
          setPreset((cur) => (cur === "custom" || p.from !== period.from || p.to !== period.to ? "custom" : cur));
          setPeriod(p);
        }}
      />

      {/* --- Chiffres clés de la période --- */}
      <div className="mt-5">
        {stats.isError ? (
          <ErrorBox error={stats.error} onRetry={() => void stats.refetch()} migration={KPI_MIGRATION} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile
              icon={<Users className="w-4 h-4" aria-hidden="true" />}
              label="Visites"
              value={s?.visits}
              sub={s && <Trend current={s.visits} previous={s.prev_visits} />}
            />
            <StatTile
              icon={<Eye className="w-4 h-4" aria-hidden="true" />}
              label="Pages vues"
              value={s?.views}
              sub={s && <Trend current={s.views} previous={s.prev_views} />}
            />
            <StatTile
              icon={<Inbox className="w-4 h-4" aria-hidden="true" />}
              label="Demandes"
              value={leadsInPeriod}
              sub={k && <>{nf.format(k.leadsNew)} nouvelle(s) à traiter au total</>}
            />
            <StatTile
              icon={<MousePointerClick className="w-4 h-4" aria-hidden="true" />}
              label="Clics contact"
              value={clicksTotal}
              sub="WhatsApp, téléphone, RDV, e-mail"
            />
          </div>
        )}
      </div>

      {/* --- Courbe de fréquentation --- */}
      <Section
        title="Fréquentation"
        aside={
          <div role="group" aria-label="Mesure affichée" className="flex gap-2">
            {(["visits", "views"] as const).map((m) => (
              <button key={m} type="button" aria-pressed={metric === m} onClick={() => setMetric(m)} className={chipClass(metric === m)}>
                {m === "visits" ? "Visites" : "Pages vues"}
              </button>
            ))}
          </div>
        }
      >
        <div className="bg-gradient-card border border-border rounded-xl p-4">
          {traffic.isError ? (
            <ErrorBox error={traffic.error} onRetry={() => void traffic.refetch()} migration={KPI_MIGRATION} />
          ) : traffic.data ? (
            <div className={traffic.isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <TrafficChart points={traffic.data.points} bucket={traffic.data.bucket} metric={metric} />
            </div>
          ) : (
            <Skeleton className="h-60" />
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Une visite = une arrivée sur le site (un rechargement de page compte comme une nouvelle visite, faute de cookie).
          </p>
        </div>
      </Section>

      {/* --- Clics de contact --- */}
      <Section title="Clics de contact">
        {s ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CLICK_KINDS.map((kind) => (
              <div key={kind} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {CLICK_ICONS[kind]}
                  {CLICK_KIND_LABELS[kind]}
                </div>
                <p className="font-heading text-2xl font-bold mt-1 tabular-nums">{nf.format(s.clicks[kind] ?? 0)}</p>
              </div>
            ))}
          </div>
        ) : (
          !stats.isError && <Skeleton />
        )}
      </Section>

      {/* --- Demandes par type et statut --- */}
      {s && (
        <Section title="Demandes reçues sur la période">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="text-left font-normal px-4 py-2">Type</th>
                  {LEAD_STATUSES.map((st) => (
                    <th key={st} scope="col" className="text-right font-normal px-3 py-2">{LEAD_STATUS_LABELS[st]}</th>
                  ))}
                  <th scope="col" className="text-right font-normal px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {LEAD_TYPES.map((type) => (
                  <tr key={type} className="border-t border-border">
                    <th scope="row" className="text-left font-normal px-4 py-2.5">{LEAD_TYPE_LABELS[type]}</th>
                    {LEAD_STATUSES.map((st) => {
                      const n = leadCount(type, st);
                      return (
                        <td key={st} className={`text-right px-3 py-2.5 tabular-nums ${st === "new" && n > 0 ? "text-neon-cyan font-semibold" : ""}`}>
                          {nf.format(n)}
                        </td>
                      );
                    })}
                    <td className="text-right px-4 py-2.5 tabular-nums font-semibold">{nf.format(leadCount(type))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* --- Classements de la période --- */}
      {s && (
        <div className="grid gap-x-6 lg:grid-cols-2">
          <Section title="Véhicules les plus vus">
            <RankedList
              empty="Aucune fiche véhicule consultée sur la période."
              rows={s.top_vehicles.map((v) => ({
                key: v.id,
                value: v.views,
                label: (
                  <Link to={`/admin/vehicules/${v.id}`} className="hover:text-neon-cyan">
                    {v.title}
                    {v.status === "sold" && <span className="text-muted-foreground"> · vendu</span>}
                  </Link>
                ),
              }))}
            />
          </Section>
          <Section title="Pages les plus vues">
            <RankedList
              empty="Pas encore de visites enregistrées."
              rows={s.top_pages.map((p) => ({ key: p.path, value: p.views, label: <span className="font-mono text-xs">{p.path}</span> }))}
            />
          </Section>
          <Section title="Provenance des visites">
            <RankedList
              empty="Pas encore de visites enregistrées."
              rows={s.sources.map((src) => ({
                key: src.host || "direct",
                value: src.visits,
                label: src.host || <span className="text-muted-foreground">Accès direct / application</span>,
              }))}
            />
          </Section>
        </div>
      )}

      {/* --- En continu --- */}
      <Section title="Contenu en ligne">
        {kpis.isError ? (
          <ErrorBox error={kpis.error} onRetry={() => void kpis.refetch()} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
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
      </Section>

      <Section title="Dernières demandes">
        {leads.isError ? (
          <ErrorBox error={leads.error} onRetry={() => void leads.refetch()} />
        ) : leads.isLoading ? (
          <Skeleton />
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
    </>
  );
};

export default AdminDashboard;
