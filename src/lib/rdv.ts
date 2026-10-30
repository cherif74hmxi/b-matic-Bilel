// ============================================================================
//  Créneaux de rendez-vous — dates et heures de Bruxelles
// ----------------------------------------------------------------------------
//  Utilisé par l'agenda admin et les jours de rappel du formulaire
//  /rendez-vous. Les heures sont TOUJOURS celles de Bruxelles, quel que soit
//  le fuseau du téléphone du visiteur.
// ============================================================================
import { rdvRegles } from "@/data/rdv";

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
