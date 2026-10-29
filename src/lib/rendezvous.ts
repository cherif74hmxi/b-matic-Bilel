// ============================================================================
//  Formulaire de devis / rendez-vous pare-brise — état, validation, envoi
// ----------------------------------------------------------------------------
//  Fonctions pures (testées dans src/test/rendezvous.test.ts) + dépôt des
//  documents facultatifs APRÈS la réservation (bucket privé client-documents,
//  voir supabase/migrations/20261029000001_client_documents.sql).
// ============================================================================
import { STORAGE_BUCKETS } from "@/lib/contentModel";
import { rdvAssurance, rdvBesoins, rdvLieu, type BesoinId, type CouvertureId, type LieuId } from "@/data/rendezvous";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type VehiculeMode = "plaque" | "scan" | "manuel";

export interface RdvForm {
  besoin: BesoinId | "";
  sousChoix: string;
  vehiculeMode: VehiculeMode;
  plaque: string;
  marque: string;
  modele: string;
  annee: string;
  /** Rempli uniquement par le scan de la carte grise. */
  vin: string;
  couverture: CouvertureId | "";
  /** Nom d'un assureur de la liste, ou « Autre ». */
  assureur: string;
  assureurAutre: string;
  lieu: LieuId | "";
  codePostal: string;
  date: string;
  hour: number | null;
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  consent: boolean;
  /** Pot de miel : invisible pour un humain, rempli par les robots. */
  website: string;
}

export const emptyRdvForm: RdvForm = {
  besoin: "",
  sousChoix: "",
  vehiculeMode: "plaque",
  plaque: "",
  marque: "",
  modele: "",
  annee: "",
  vin: "",
  couverture: "",
  assureur: "",
  assureurAutre: "",
  lieu: "",
  codePostal: "",
  date: "",
  hour: null,
  prenom: "",
  nom: "",
  telephone: "",
  email: "",
  consent: false,
  website: "",
};

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
  if (!year) return true; // facultative
  const y = Number(year);
  return /^\d{4}$/.test(year) && y >= 1970 && y <= new Date().getFullYear() + 1;
}

// ---------------------------------------------------------------- Lieu

export const isPostalCodeValid = (cp: string) => /^[1-9]\d{3}$/.test(cp.trim());

/** Code postal dans la zone sûre (sinon : accepté, « on vous confirme »). */
export function isInZone(cp: string): boolean {
  const n = Number(cp.trim());
  return rdvLieu.zoneSure.some(([min, max]) => n >= min && n <= max);
}

// ---------------------------------------------------------------- Validation

export const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const isPhoneValid = (phone: string) => phone.replace(/\D/g, "").length >= 8;

/** L'étape (1 à 6) est-elle complète ? */
export function isStepValid(f: RdvForm, step: number): boolean {
  switch (step) {
    case 1: {
      const besoin = rdvBesoins.find((b) => b.id === f.besoin);
      if (!besoin) return false;
      return !besoin.sousChoix || besoin.sousChoix.some((s) => s.id === f.sousChoix);
    }
    case 2:
      if (f.vehiculeMode === "plaque") return isPlateValid(f.plaque);
      return f.marque.trim().length >= 2 && f.modele.trim().length >= 1 && isYearValid(f.annee);
    case 3:
      if (!f.couverture) return false;
      return f.couverture !== "oui" || Boolean(f.assureur);
    case 4:
      return f.lieu === "centre" || (f.lieu === "domicile" && isPostalCodeValid(f.codePostal));
    case 5:
      return Boolean(f.date) && f.hour !== null;
    case 6:
      return (
        f.prenom.trim().length >= 2 &&
        f.nom.trim().length >= 2 &&
        isEmailValid(f.email) &&
        isPhoneValid(f.telephone) &&
        f.consent
      );
    default:
      return false;
  }
}

// ---------------------------------------------------------------- Récapitulatif

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** « 2026-10-29 » → « jeudi 29 octobre 2026 ». */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DAYS[dt.getUTCDay()]} ${d} ${MONTHS[m - 1]} ${y}`;
}

export const heureLabel = (h: number) => `${h < 10 ? "0" : ""}${h}:00`;

export function serviceLabel(f: RdvForm): string {
  const besoin = rdvBesoins.find((b) => b.id === f.besoin);
  if (!besoin) return "";
  const sous = besoin.sousChoix?.find((s) => s.id === f.sousChoix);
  return sous ? `${besoin.label} — ${sous.label}` : besoin.label;
}

export function vehiculeLabel(f: RdvForm): string {
  if (f.vehiculeMode === "plaque") return `Plaque ${formatPlate(f.plaque)}`;
  return [f.marque.trim(), f.modele.trim(), f.annee].filter(Boolean).join(" ");
}

export function assureurLabel(f: RdvForm): string {
  if (f.assureur === rdvAssurance.assureurAutre) return f.assureurAutre.trim() || "Autre";
  return f.assureur;
}

export function couvertureLabel(f: RdvForm): string {
  return rdvAssurance.couvertures.find((c) => c.id === f.couverture)?.label ?? "";
}

export function lieuLabel(f: RdvForm): string {
  if (f.lieu === "centre") return `Au centre (${rdvLieu.centre.texte})`;
  if (f.lieu === "domicile") return `À domicile / au travail — ${f.codePostal.trim()}${isInZone(f.codePostal) ? "" : " (zone à confirmer)"}`;
  return "";
}

/** Lignes du récapitulatif (écran 6 et confirmation). */
export function recapRows(f: RdvForm): [string, string][] {
  const rows: [string, string][] = [
    ["Besoin", serviceLabel(f)],
    ["Véhicule", vehiculeLabel(f)],
    ["Bris de glace", couvertureLabel(f)],
  ];
  if (f.couverture !== "non" && assureurLabel(f)) rows.push(["Assureur", assureurLabel(f)]);
  rows.push(["Lieu", lieuLabel(f)]);
  if (f.date && f.hour !== null) rows.push(["Créneau", `${longDate(f.date)} à ${heureLabel(f.hour)}`]);
  return rows;
}

/**
 * Champs enregistrés avec la demande (leads.details), lus dans l'espace admin.
 * « Service » est affiché tel quel dans l'agenda admin.
 */
export function buildDetails(f: RdvForm, reference: string): Record<string, string> {
  const details: Record<string, string> = {
    "Service": serviceLabel(f),
    "Véhicule": f.vehiculeMode === "plaque" ? "" : vehiculeLabel(f),
    "Plaque": f.vehiculeMode === "plaque" ? formatPlate(f.plaque) : "",
    "VIN (scan)": f.vin,
    "Couverture bris de glace": couvertureLabel(f),
    "Assureur": f.couverture === "non" ? "" : assureurLabel(f),
    "Lieu": f.lieu === "centre" ? "Au centre" : f.lieu === "domicile" ? "À domicile / au travail" : "",
    "Code postal": f.lieu === "domicile" ? f.codePostal.trim() + (isInZone(f.codePostal) ? "" : " (zone à confirmer)") : "",
    "Date": f.date ? longDate(f.date) : "",
    "Heure": f.hour !== null ? heureLabel(f.hour) : "",
    "Référence dossier": reference,
  };
  return Object.fromEntries(Object.entries(details).filter(([, v]) => v));
}

// ---------------------------------------------------------------- Référence dossier

/** UUID v4 aléatoire : nom du dossier des documents (impossible à deviner). */
export function newReference(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// ---------------------------------------------------------------- Documents (après réservation)

export type PieceId = "carte-grise" | "assurance";
export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
/** Grand côté des photos de documents : lisible, léger sur mobile. */
const DOCUMENT_MAX_EDGE = 2400;

export class DocumentError extends Error {
  constructor(public reason: "format" | "taille" | "envoi") {
    super(reason);
  }
}

/** Chemin accepté par la règle d'accès du bucket : « <ref>/<pièce>-<horodatage>.<ext> ». */
export const documentPath = (reference: string, piece: PieceId, ext: "jpg" | "pdf", now = Date.now()) =>
  `${reference}/${piece}-${now}.${ext}`;

/**
 * Prépare puis dépose un document dans le dossier de la demande. Les photos
 * sont réencodées en JPEG (métadonnées EXIF, dont le GPS, retirées).
 */
export async function uploadDocument(reference: string, piece: PieceId, file: File): Promise<void> {
  let body: Blob;
  let ext: "jpg" | "pdf";
  if (file.type === "application/pdf") {
    body = file;
    ext = "pdf";
  } else if (file.type.startsWith("image/") || !file.type) {
    const { toJpeg } = await import("@/lib/imageOptimize");
    try {
      body = await toJpeg(file, DOCUMENT_MAX_EDGE, 0.85);
    } catch {
      throw new DocumentError("format");
    }
    ext = "jpg";
  } else {
    throw new DocumentError("format");
  }
  if (body.size > DOCUMENT_MAX_BYTES) throw new DocumentError("taille");
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new DocumentError("envoi");

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKETS.clientDocuments}/${documentPath(reference, piece, ext)}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": ext === "pdf" ? "application/pdf" : "image/jpeg",
      "x-upsert": "false",
    },
    body,
  }).catch(() => null);
  if (!res?.ok) throw new DocumentError("envoi");
}

/**
 * Scan de carte grise disponible ? Même interrupteur que lib/aiCopy
 * (AI_ENABLED), lu ici pour ne pas charger supabase-js avec la page.
 */
export const SCAN_ENABLED = import.meta.env.VITE_AI_ENABLED === "true";
