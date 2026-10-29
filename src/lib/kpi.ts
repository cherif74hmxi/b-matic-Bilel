// ============================================================================
//  Tableau de bord KPI — périodes et requêtes (admin)
//  Fonctions SQL admin_traffic / admin_period_stats
//  (supabase/migrations/20261026000001_kpi.sql). Les dates sont des jours
//  locaux « yyyy-MM-dd » ; la base les interprète à l'heure de Bruxelles.
// ============================================================================
import { addDays, differenceInCalendarDays, format, parseISO, startOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import type { ClickKind } from "@/lib/clickTracking";
import type { LeadStatus, LeadType } from "@/lib/leads";

export type Bucket = "hour" | "day" | "month";
export type PresetId = "today" | "yesterday" | "7d" | "30d" | "12m" | "custom";

export interface Period {
  from: string;
  to: string;
  bucket: Bucket;
}

export const PRESETS: { id: PresetId; label: string }[] = [
  { id: "today", label: "Aujourd'hui" },
  { id: "yesterday", label: "Hier" },
  { id: "7d", label: "7 jours" },
  { id: "30d", label: "30 jours" },
  { id: "12m", label: "12 mois" },
  { id: "custom", label: "Dates…" },
];

export const BUCKET_LABELS: Record<Bucket, string> = { hour: "Par heure", day: "Par jour", month: "Par mois" };

/** Découpage par heure : 31 jours maximum (limite aussi appliquée en base). */
export const MAX_HOUR_DAYS = 31;

const day = (d: Date) => format(d, "yyyy-MM-dd");

/** Nombre de jours de la période, bornes incluses. */
export const periodDays = (from: string, to: string) => differenceInCalendarDays(parseISO(to), parseISO(from)) + 1;

export const allowedBuckets = (from: string, to: string): Bucket[] =>
  periodDays(from, to) <= MAX_HOUR_DAYS ? ["hour", "day", "month"] : ["day", "month"];

/** Découpage le plus lisible pour une durée donnée. */
export const defaultBucket = (from: string, to: string): Bucket => {
  const days = periodDays(from, to);
  return days <= 2 ? "hour" : days <= 92 ? "day" : "month";
};

export function presetPeriod(id: Exclude<PresetId, "custom">, now = new Date()): Period {
  const today = day(now);
  switch (id) {
    case "today":
      return { from: today, to: today, bucket: "hour" };
    case "yesterday": {
      const y = day(addDays(now, -1));
      return { from: y, to: y, bucket: "hour" };
    }
    case "7d":
      return { from: day(addDays(now, -6)), to: today, bucket: "day" };
    case "30d":
      return { from: day(addDays(now, -29)), to: today, bucket: "day" };
    case "12m":
      return { from: day(startOfMonth(subMonths(now, 11))), to: today, bucket: "month" };
  }
}

/** Libellé d'un point de la courbe (horodatage local renvoyé par la base). */
export function bucketLabel(bucket: string, unit: Bucket, long = false): string {
  const d = parseISO(bucket);
  if (unit === "hour") return long ? format(d, "EEE d MMM 'à' H'h'", { locale: fr }) : format(d, "H'h'");
  if (unit === "day") return format(d, long ? "EEEE d MMMM" : "d MMM", { locale: fr });
  return format(d, "MMMM yyyy", { locale: fr });
}

/** Variation en % par rapport à la période précédente (null si rien à comparer). */
export const variation = (current: number, previous: number) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;

// ---------------------------------------------------------------------------
//  Requêtes
// ---------------------------------------------------------------------------

export interface TrafficPoint {
  bucket: string;
  views: number;
  visits: number;
}

export async function fetchTraffic(p: Period): Promise<TrafficPoint[]> {
  const { data, error } = await supabase.rpc("admin_traffic", { p_from: p.from, p_to: p.to, p_bucket: p.bucket });
  if (error) throw error;
  return ((data ?? []) as TrafficPoint[]).map((r) => ({ bucket: r.bucket, views: Number(r.views), visits: Number(r.visits) }));
}

export interface PeriodStats {
  views: number;
  visits: number;
  prev_views: number;
  prev_visits: number;
  clicks: Partial<Record<ClickKind, number>>;
  leads: Partial<Record<LeadType, Partial<Record<LeadStatus, number>>>>;
  top_pages: { path: string; views: number }[];
  sources: { host: string; visits: number }[];
}

export async function fetchPeriodStats(from: string, to: string): Promise<PeriodStats> {
  const { data, error } = await supabase.rpc("admin_period_stats", { p_from: from, p_to: to });
  if (error) throw error;
  return data as PeriodStats;
}
