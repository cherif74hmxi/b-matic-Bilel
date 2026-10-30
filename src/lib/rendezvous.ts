// ============================================================================
//  Formulaire de demande de rappel pare-brise — état, validation, envoi
// ----------------------------------------------------------------------------
//  Fonctions pures, testées dans src/test/rendezvous.test.ts. Aucun document
//  n'est collecté : le véhicule se renseigne à la main (plaque, ou marque +
//  modèle). Le téléphone est la seule donnée de contact obligatoire.
// ============================================================================
import {
  rdvAssurance, rdvRappel, rdvVitrages, type CouvertureId, type PeriodeId, type RappelId, type VitrageId,
} from "@/data/rendezvous";
import { addDays, brusselsNow } from "@/lib/rdv";

export type VehiculeMode = "plaque" | "manuel";

export interface RdvForm {
  prenom: string;
  nom: string;
  telephone: string;
  /** Facultatif : vide, ou une adresse valide. */
  email: string;
  rappel: RappelId | "";
  /** Jour choisi (« AAAA-MM-JJ »), seulement si rappel = « date ». */
  rappelDate: string;
  rappelPeriode: PeriodeId | "";
  vitrages: VitrageId[];
  couverture: CouvertureId | "";
  vehiculeMode: VehiculeMode;
  plaque: string;
  marque: string;
  modele: string;
  /** Facultative. */
  annee: string;
  consent: boolean;
  /** Pot de miel : invisible pour un humain, rempli par les robots. */
  website: string;
}

export const emptyRdvForm: RdvForm = {
  prenom: "",
  nom: "",
  telephone: "",
  email: "",
  rappel: "",
  rappelDate: "",
  rappelPeriode: "",
  vitrages: [],
  couverture: "",
  vehiculeMode: "plaque",
  plaque: "",
  marque: "",
  modele: "",
  annee: "",
  consent: false,
  website: "",
};

// ---------------------------------------------------------------- Rappel

const periode = (id: PeriodeId | "") => rdvRappel.periodes.find((p) => p.id === id);

/** « 10h–12h ». */
export const plageLabel = (p: { debut: number; fin: number }) => `${p.debut}h–${p.fin}h`;

/**
 * La plage est-elle encore proposée ce jour-là ? Jours passés et au-delà de
 * l'horizon : non. Le jour même : tant qu'il reste `delaiMinutes` avant sa fin.
 */
export function isPeriodeOpen(date: string, id: PeriodeId | "", now = new Date()): boolean {
  const p = periode(id);
  if (!p || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const { date: today, minutes } = brusselsNow(now);
  if (date < today || date > addDays(today, rdvRappel.jours)) return false;
  return date > today || minutes + rdvRappel.delaiMinutes <= p.fin * 60;
}

/** Jours proposés : les `rdvRappel.jours` prochains jours ayant au moins une plage ouverte. */
export function joursRappel(now = new Date()): string[] {
  const { date: today } = brusselsNow(now);
  const jours: string[] = [];
  for (let i = 0; jours.length < rdvRappel.jours; i++) {
    const d = addDays(today, i);
    if (rdvRappel.periodes.some((p) => isPeriodeOpen(d, p.id, now))) jours.push(d);
  }
  return jours;
}

// ---------------------------------------------------------------- Vitrage

/** Coche / décoche un vitrage ; un choix exclusif (« Je ne sais pas ») reste seul. */
export function toggleVitrage(list: VitrageId[], id: VitrageId): VitrageId[] {
  if (list.includes(id)) return list.filter((v) => v !== id);
  if (rdvVitrages.find((v) => v.id === id)?.exclusif) return [id];
  const exclusifs = rdvVitrages.filter((v) => v.exclusif).map((v) => v.id);
  return [...list.filter((v) => !exclusifs.includes(v)), id];
}

// ---------------------------------------------------------------- Véhicule

/** Plaque en majuscules, sans espaces, points ni tirets. */
export const normalizePlate = (plate: string) => plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Plaque plausible (belge ou étrangère) : 4 à 10 caractères, lettres ET chiffres. */
export function isPlateValid(plate: string): boolean {
  const p = normalizePlate(plate);
  return p.length >= 4 && p.length <= 10 && /[A-Z]/.test(p) && /\d/.test(p);
}

/** Affichage belge « 1-ABC-123 » quand le format s'y prête, sinon tel quel. */
export function formatPlate(plate: string): string {
  const p = normalizePlate(plate);
  const be = /^(\d)([A-Z]{3})(\d{3})$/.exec(p);
  return be ? `${be[1]}-${be[2]}-${be[3]}` : p;
}

export function isYearValid(year: string): boolean {
  const y = Number(year);
  return /^\d{4}$/.test(year) && y >= 1970 && y <= new Date().getFullYear() + 1;
}

// ---------------------------------------------------------------- Validation

export const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const isPhoneValid = (phone: string) => phone.replace(/\D/g, "").length >= 8;

/** L'étape (1 à 4) est-elle complète ? */
export function isStepValid(f: RdvForm, step: number, now = new Date()): boolean {
  switch (step) {
    case 1:
      return (
        f.prenom.trim().length >= 2 &&
        f.nom.trim().length >= 2 &&
        isPhoneValid(f.telephone) &&
        // E-mail facultatif, mais valide s'il est rempli.
        (!f.email.trim() || isEmailValid(f.email)) &&
        (f.rappel === "asap" || (f.rappel === "date" && isPeriodeOpen(f.rappelDate, f.rappelPeriode, now)))
      );
    case 2:
      return f.vitrages.length > 0;
    case 3:
      return Boolean(f.couverture);
    case 4: {
      const vehicule =
        f.vehiculeMode === "plaque"
          ? isPlateValid(f.plaque)
          : f.marque.trim().length >= 2 && f.modele.trim().length >= 1 && (!f.annee || isYearValid(f.annee));
      return vehicule && f.consent;
    }
    default:
      return false;
  }
}

// ---------------------------------------------------------------- Récapitulatif

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const DAYS_SHORT = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

const utc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

/** « 2026-10-29 » → « jeudi 29 octobre 2026 ». */
export function longDate(iso: string): string {
  const dt = utc(iso);
  return `${DAYS[dt.getUTCDay()]} ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

/** Pastille de jour : « Auj. » / « Demain » / « ven. », puis « 31 » et « oct. ». */
export function jourCourt(iso: string, today: string): { haut: string; jour: number; mois: string } {
  const dt = utc(iso);
  const haut = iso === today ? "Auj." : iso === addDays(today, 1) ? "Demain" : DAYS_SHORT[dt.getUTCDay()];
  return { haut, jour: dt.getUTCDate(), mois: MONTHS_SHORT[dt.getUTCMonth()] };
}

/** « Dès que possible » ou « vendredi 31 octobre 2026, matin (10h–12h) ». */
export function rappelLabel(f: RdvForm): string {
  if (f.rappel === "asap") return "Dès que possible";
  const p = periode(f.rappelPeriode);
  if (f.rappel !== "date" || !f.rappelDate || !p) return "";
  return `${longDate(f.rappelDate)}, ${p.label.toLowerCase()} (${plageLabel(p)})`;
}

/** Fin de la phrase de confirmation : « dès que possible (…) » ou « le vendredi…, le matin (10h–12h) ». */
export function rappelPhrase(f: RdvForm): string {
  if (f.rappel === "asap") return rdvRappel.asapPhrase;
  const p = periode(f.rappelPeriode);
  if (f.rappel !== "date" || !f.rappelDate || !p) return "";
  return `le ${longDate(f.rappelDate)}, ${p.moment} (${plageLabel(p)})`;
}

export function vitragesLabel(f: RdvForm): string {
  return rdvVitrages
    .filter((v) => f.vitrages.includes(v.id))
    .map((v) => v.label)
    .join(", ");
}

export function vehiculeLabel(f: RdvForm): string {
  if (f.vehiculeMode === "plaque") return `Plaque ${formatPlate(f.plaque)}`;
  return [f.marque.trim(), f.modele.trim(), f.annee].filter(Boolean).join(" ");
}

export function couvertureLabel(f: RdvForm): string {
  return rdvAssurance.couvertures.find((c) => c.id === f.couverture)?.label ?? "";
}

/** Lignes du récapitulatif (écran de confirmation). */
export function recapRows(f: RdvForm): [string, string][] {
  const rows: [string, string][] = [
    ["Rappel", rappelLabel(f)],
    ["Vitrage", vitragesLabel(f)],
    ["Bris de glace", couvertureLabel(f)],
    ["Véhicule", vehiculeLabel(f)],
  ];
  return rows.filter(([, v]) => v);
}

/** Champs enregistrés avec la demande (leads.details, e-mail Formspree), lus dans l'espace admin. */
export function buildDetails(f: RdvForm): Record<string, string> {
  const details: Record<string, string> = {
    "Rappel": rappelLabel(f),
    "Vitrage": vitragesLabel(f),
    "Couverture bris de glace": couvertureLabel(f),
    "Véhicule": f.vehiculeMode === "plaque" ? "" : vehiculeLabel(f),
    "Plaque": f.vehiculeMode === "plaque" ? formatPlate(f.plaque) : "",
  };
  return Object.fromEntries(Object.entries(details).filter(([, v]) => v));
}
