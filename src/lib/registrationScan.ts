// ============================================================================
//  Scan de carte grise (Gemini, via l'Edge Function « generate-copy »)
// ----------------------------------------------------------------------------
//  Utilisé par le formulaire de reprise (public) ET l'admin (ajout véhicule).
//  · La photo est réduite et réencodée en JPEG dans le navigateur, envoyée à la
//    fonction, lue par Gemini puis oubliée : elle n'est stockée nulle part.
//  · Seules les caractéristiques TECHNIQUES reviennent (jamais le titulaire).
//  · Activé avec VITE_AI_ENABLED=true (même fonction que l'assistant IA) ;
//    sinon les formulaires restent en saisie manuelle.
// ============================================================================
import { AI_ENABLED, invokeAiFunction } from "@/lib/aiCopy";
import { toJpeg, UnsupportedImageError } from "@/lib/imageOptimize";
import { normalizeVin, VIN_PATTERN } from "@/lib/vin";
import { vehiculesData } from "@/data/vehicules";
import type { Fuel } from "@/lib/vehicles";

export const SCAN_ENABLED = AI_ENABLED;

/** Grand côté de la photo envoyée (lisible par Gemini, léger sur mobile). */
const SCAN_MAX_EDGE = 2000;

/** Champs lus sur la carte grise, déjà mis au format des formulaires. */
export interface RegistrationScan {
  make?: string;
  model?: string;
  version?: string;
  /** Date de première immatriculation (AAAA-MM-JJ). */
  firstRegistration?: string;
  year?: number;
  fuel?: Fuel;
  powerKw?: number;
  /** Puissance en chevaux (convertie depuis les kW de la case P.2). */
  powerHp?: number;
  displacementCc?: number;
  vin?: string;
}

interface RawScan {
  readable: boolean;
  fields: {
    make?: string;
    model?: string;
    version?: string;
    first_registration?: string;
    fuel?: Fuel;
    power_kw?: number;
    displacement_cc?: number;
    vin?: string;
  };
}

export class ScanError extends Error {}

/** « VOLKSWAGEN » → « Volkswagen », « MERCEDES-BENZ » → « Mercedes-Benz ». */
const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split(/([\s-])/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Reprend l'écriture de la liste du site quand elle existe (« BMW », « Citroën »…). */
const matchIn = (list: string[], value: string) => list.find((x) => fold(x) === fold(value)) ?? titleCase(value);

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function toScan({ fields: f }: RawScan): RegistrationScan {
  const make = f.make ? matchIn(Object.keys(vehiculesData), f.make) : undefined;
  const year = f.first_registration ? Number(f.first_registration.slice(0, 4)) : undefined;
  const vin = f.vin ? normalizeVin(f.vin) : "";
  return {
    make,
    model: f.model ? matchIn(make ? vehiculesData[make] ?? [] : [], f.model) : undefined,
    version: f.version,
    firstRegistration: f.first_registration,
    year: year && year >= 1950 && year <= new Date().getFullYear() + 1 ? year : undefined,
    fuel: f.fuel,
    powerKw: f.power_kw,
    powerHp: f.power_kw && f.power_kw * 1.35962 <= 2000 ? Math.round(f.power_kw * 1.35962) : undefined,
    displacementCc: f.displacement_cc,
    vin: VIN_PATTERN.test(vin) ? vin : undefined,
  };
}

/** Nombre de champs reconnus (pour le message affiché après le scan). */
export const scanFieldCount = (scan: RegistrationScan) =>
  [scan.make, scan.model, scan.version, scan.year, scan.fuel, scan.powerHp, scan.displacementCc, scan.vin].filter((v) => v !== undefined).length;

/**
 * Lit la carte grise photographiée. Lève une ScanError (message en français,
 * prêt à afficher) si la photo est illisible ou si le service ne répond pas :
 * le formulaire bascule alors en saisie manuelle.
 */
export async function scanRegistration(file: File): Promise<RegistrationScan> {
  let jpeg: Blob;
  try {
    jpeg = await toJpeg(file, SCAN_MAX_EDGE, 0.85);
  } catch (error) {
    throw new ScanError(
      error instanceof UnsupportedImageError
        ? "Cette photo ne peut pas être lue par votre navigateur (format HEIC ?). Essayez une autre photo ou remplissez à la main."
        : "Impossible de préparer la photo. Essayez une autre photo ou remplissez à la main.",
    );
  }
  let raw: RawScan | null;
  try {
    raw = await invokeAiFunction<RawScan>(
      { kind: "registration", data: { image: await blobToBase64(jpeg), mime_type: "image/jpeg" } },
      "Lecture de la carte grise impossible pour le moment. Remplissez à la main.",
    );
  } catch (error) {
    throw new ScanError(error instanceof Error ? error.message : "Lecture de la carte grise impossible.");
  }
  if (!raw?.readable) throw new ScanError("La carte grise n'a pas pu être lue. Reprenez la photo bien à plat, en entier et nette, ou remplissez à la main.");
  const scan = toScan(raw);
  if (scanFieldCount(scan) === 0) throw new ScanError("Aucune information lisible sur cette photo. Reprenez-la ou remplissez à la main.");
  return scan;
}
