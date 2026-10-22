// ============================================================================
//  Créneaux de rendez-vous — appels publics à Supabase (sans supabase-js)
// ----------------------------------------------------------------------------
//  Même principe que publicInsert.ts : un simple fetch vers l'API REST.
//  Les heures sont TOUJOURS celles de Bruxelles, quel que soit le fuseau du
//  téléphone du visiteur.
// ============================================================================
import { rdvRegles } from "@/data/rdv";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Clé d'un créneau : « 2026-10-22@10 ». */
export const slotKey = (date: string, hour: number) => `${date}@${hour}`;

/** Ajoute n jours à une date « AAAA-MM-JJ ». */
export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Date (« AAAA-MM-JJ ») et minutes écoulées depuis minuit, à Bruxelles. */
export function brusselsNow(now = new Date()): { date: string; minutes: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Brussels",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** Le créneau respecte-t-il le délai minimum et l'horizon de réservation ? */
export function isSlotInWindow(date: string, hour: number, now = new Date()): boolean {
  const { date: today, minutes } = brusselsNow(now);
  if (date < today || date > addDays(today, rdvRegles.horizonJours)) return false;
  if (date > today) return true;
  return hour * 60 >= minutes + rdvRegles.delaiMinimumHeures * 60;
}

async function rpc(fn: string, body: Record<string, unknown>): Promise<unknown> {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("supabase-non-configure");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`rpc-${res.status}`);
  return res.json();
}

/**
 * Créneaux occupés entre deux dates (incluses), sous forme de clés slotKey.
 * Renvoie null si l'agenda est injoignable (Supabase absent ou migration non
 * exécutée) : la page passe alors en mode « créneau à confirmer ».
 */
export async function fetchTakenSlots(from: string, to: string): Promise<Set<string> | null> {
  try {
    const rows = (await rpc("rdv_taken_slots", { p_from: from, p_to: to })) as {
      slot_date: string;
      slot_hour: number;
    }[];
    return new Set(rows.map((r) => slotKey(r.slot_date, r.slot_hour)));
  } catch {
    return null;
  }
}

export type BookingResult = "ok" | "taken" | "limit" | "invalid" | "unavailable";

export interface BookingRequest {
  date: string;
  hour: number;
  name: string;
  email: string;
  phone: string;
  /** Champs affichés dans l'espace admin (service, prix, VIN…). */
  details: Record<string, string>;
}

/**
 * Réserve le créneau ET enregistre la demande (une seule transaction côté
 * base). « unavailable » = agenda injoignable, rien n'a été enregistré.
 */
export async function bookRdv(r: BookingRequest): Promise<BookingResult> {
  const details = Object.fromEntries(
    Object.entries(r.details)
      .filter(([, v]) => v)
      .map(([k, v]) => [k, v.slice(0, 2000)]),
  );
  try {
    const result = await rpc("book_rdv", {
      p_date: r.date,
      p_hour: r.hour,
      p_name: r.name.trim().slice(0, 120),
      p_email: r.email.trim().slice(0, 254),
      p_phone: r.phone.trim().slice(0, 40),
      p_details: details,
      p_consent: true,
    });
    return result === "ok" || result === "taken" || result === "limit" || result === "invalid"
      ? result
      : "unavailable";
  } catch {
    return "unavailable";
  }
}
