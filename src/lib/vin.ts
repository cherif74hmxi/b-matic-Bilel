// ============================================================================
//  Décodage VIN — API gratuite NHTSA vPIC (sans clé)
//  https://vpic.nhtsa.dot.gov/api/
// ----------------------------------------------------------------------------
//  ⚠️  Couverture « best-effort » pour les véhicules européens : la marque est
//  souvent reconnue, le modèle / la finition / la puissance beaucoup moins.
//  L'année (10e caractère) n'est PAS normalisée en Europe : on ne la reprend
//  que pour un véhicule non européen dont la clé de contrôle (9e caractère,
//  norme nord-américaine) est valide.
//  La marque peut aussi être déduite du préfixe constructeur (WMI), même hors
//  ligne. Rien n'est inventé : le propriétaire complète et corrige.
// ============================================================================
import { vehiculesData } from "@/data/vehicules";
import { WMI_MAKES } from "@/data/vinWmi";
import type { Fuel, Gearbox } from "@/lib/vehicles";

/** VIN valide : 17 caractères, sans I, O ni Q. */
export const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

/** Majuscules, sans espaces ni tirets ; O/Q → 0 et I → 1 (lettres interdites, confusions fréquentes). */
export const normalizeVin = (vin: string) =>
  vin
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/[OQ]/g, "0")
    .replace(/I/g, "1");

const TRANSLIT: Record<string, number> = Object.fromEntries(
  [..."ABCDEFGHJKLMNPRSTUVWXYZ"].map((c, i) => [c, [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9][i]]),
);
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/** Clé de contrôle (9e caractère) valide ? Obligatoire en Amérique du Nord, rare en Europe. */
export function vinCheckDigitValid(vin: string): boolean {
  if (!VIN_PATTERN.test(vin)) return false;
  const sum = [...vin].reduce((acc, c, i) => acc + (/\d/.test(c) ? Number(c) : TRANSLIT[c]) * WEIGHTS[i], 0);
  const rest = sum % 11;
  return vin[8] === (rest === 10 ? "X" : String(rest));
}

/** Marque déduite des 3 premiers caractères, ou undefined. */
export const makeFromWmi = (vin: string): string | undefined => {
  const make = WMI_MAKES[vin.slice(0, 3)];
  return make && normalizeMake(make);
};

export interface VinSuggestion {
  make?: string;
  model?: string;
  year?: number;
  version?: string;
  fuel?: Fuel;
  gearbox?: Gearbox;
  power_hp?: number;
}

/** Sous-ensemble des champs renvoyés par DecodeVinValuesExtended. */
export type VpicResult = Partial<
  Record<
    | "Make"
    | "Model"
    | "ModelYear"
    | "Trim"
    | "Series"
    | "DisplacementL"
    | "FuelTypePrimary"
    | "FuelTypeSecondary"
    | "ElectrificationLevel"
    | "EngineHP"
    | "TransmissionStyle",
    string
  >
>;

const knownMakes = Object.keys(vehiculesData);

/** « VOLKSWAGEN » → « Volkswagen » (ou l'orthographe de notre liste de marques). */
function normalizeMake(raw: string): string {
  const upper = raw.trim().toUpperCase();
  const aliases: Record<string, string> = { "MERCEDES-BENZ": "Mercedes-Benz", MERCEDES: "Mercedes-Benz", CITROEN: "Citroën" };
  if (aliases[upper]) return aliases[upper];
  const known = knownMakes.find((m) => m.toUpperCase() === upper);
  if (known) return known;
  return upper.length <= 3 ? upper : upper.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());
}

function mapFuel(r: VpicResult): Fuel | undefined {
  const level = (r.ElectrificationLevel ?? "").toUpperCase();
  if (level.includes("PHEV")) return "hybride_rechargeable";
  if (level.includes("BEV")) return "electrique";
  if (level.includes("HEV")) return "hybride";
  const primary = (r.FuelTypePrimary ?? "").toLowerCase();
  const secondary = (r.FuelTypeSecondary ?? "").toLowerCase();
  if (primary.includes("electric") && !secondary) return "electrique";
  if (secondary.includes("electric")) return "hybride";
  if (primary.includes("diesel")) return "diesel";
  if (primary.includes("gasoline") || primary.includes("petrol")) return "essence";
  if (primary.includes("lpg") || primary.includes("liquefied petroleum")) return "gpl";
  return primary ? "autre" : undefined;
}

function mapGearbox(style: string | undefined): Gearbox | undefined {
  const s = (style ?? "").toLowerCase();
  if (!s) return undefined;
  if (s.includes("manual")) return "manuelle";
  if (s.includes("automatic") || s.includes("cvt") || s.includes("dual-clutch") || s.includes("dct")) return "automatique";
  return undefined;
}

const VPIC_FIELDS = [
  "Make", "Model", "ModelYear", "Trim", "Series", "DisplacementL", "FuelTypePrimary",
  "FuelTypeSecondary", "ElectrificationLevel", "EngineHP", "TransmissionStyle",
] as const satisfies readonly (keyof VpicResult)[];

/** Valeur exploitable (vPIC renvoie parfois « Not Applicable »). */
const clean = (v: string | undefined) => {
  const t = v?.trim() ?? "";
  return /^(not applicable|n\/a|null|0)$/i.test(t) ? "" : t;
};

/**
 * Transforme une réponse vPIC en suggestions de champs (fonction pure, testée).
 * `vin` sert à décider si l'année est fiable et à déduire la marque si vPIC l'ignore.
 */
export function mapVpicResult(raw: VpicResult, vin: string): VinSuggestion {
  const r = Object.fromEntries(VPIC_FIELDS.map((k) => [k, clean(raw[k])])) as VpicResult;
  const out: VinSuggestion = {};
  const make = r.Make ? normalizeMake(r.Make) : makeFromWmi(vin);
  if (make) out.make = make;
  if (r.Model) out.model = r.Model;

  const year = Number(r.ModelYear);
  // Année fiable seulement hors Europe (1er caractère S à Z = Europe) et avec une clé valide.
  const yearReliable = vinCheckDigitValid(vin) && !/^[S-Z]/.test(vin);
  if (yearReliable && Number.isInteger(year) && year >= 1950 && year <= new Date().getFullYear() + 1) out.year = year;

  const displacement = Number(r.DisplacementL);
  const version = [r.Series, r.Trim, displacement > 0 ? `${displacement.toFixed(1)} L` : ""]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(" ");
  if (version) out.version = version.slice(0, 120);

  const fuel = mapFuel(r);
  if (fuel) out.fuel = fuel;
  const gearbox = mapGearbox(r.TransmissionStyle);
  if (gearbox) out.gearbox = gearbox;

  // vPIC donne des « hp » (SAE) ; 1 hp ≈ 1,014 ch : arrondi suffisant pour une suggestion.
  const hp = Number(r.EngineHP);
  if (hp > 0) out.power_hp = Math.round(hp * 1.014);
  return out;
}

export interface VinDecodeResult {
  suggestion: VinSuggestion;
  /** vPIC injoignable ou trop lent : seule la marque (WMI) a pu être déduite. */
  serviceDown: boolean;
  /** vPIC proposait une année, écartée car peu fiable pour ce VIN. */
  yearSkipped: boolean;
}

/** Interroge vPIC (8 s max). Ne lève pas d'exception. */
export async function decodeVin(vin: string, signal?: AbortSignal): Promise<VinDecodeResult> {
  const offline = (): VinDecodeResult => {
    const make = makeFromWmi(vin);
    return { suggestion: make ? { make } : {}, serviceDown: true, yearSkipped: false };
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  signal?.addEventListener("abort", () => controller.abort());
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`,
      { signal: controller.signal },
    );
    if (res.status >= 500) return offline();
    // 4xx : VIN refusé par vPIC, le service fonctionne → résultat « rien trouvé » (+ marque WMI).
    const result = res.ok ? ((await res.json()) as { Results?: VpicResult[] }).Results?.[0] ?? {} : {};
    const suggestion = mapVpicResult(result, vin);
    return { suggestion, serviceDown: false, yearSkipped: Boolean(clean(result.ModelYear)) && suggestion.year === undefined };
  } catch {
    return offline();
  } finally {
    clearTimeout(timeout);
  }
}
