// ============================================================================
//  Décodage VIN — API gratuite NHTSA vPIC (sans clé)
//  https://vpic.nhtsa.dot.gov/api/
// ----------------------------------------------------------------------------
//  ⚠️  Couverture « best-effort » pour les véhicules européens : la marque est
//  souvent reconnue, le modèle / la finition / la puissance beaucoup moins.
//  L'année est déduite du 10e caractère, qui n'est PAS obligatoire en Europe :
//  elle doit toujours être vérifiée. Le résultat ne fait que PROPOSER des
//  valeurs, le propriétaire complète et corrige.
// ============================================================================
import { vehiculesData } from "@/data/vehicules";
import type { Fuel, Gearbox } from "@/lib/vehicles";

/** VIN valide : 17 caractères, sans I, O ni Q. */
export const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export const normalizeVin = (vin: string) => vin.toUpperCase().replace(/[^A-Z0-9]/g, "");

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
  return upper.length <= 3 ? upper : upper.charAt(0) + upper.slice(1).toLowerCase();
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

/** Transforme une réponse vPIC en suggestions de champs (fonction pure, testée). */
export function mapVpicResult(r: VpicResult): VinSuggestion {
  const out: VinSuggestion = {};
  if (r.Make?.trim()) out.make = normalizeMake(r.Make);
  if (r.Model?.trim()) out.model = r.Model.trim();

  const year = Number(r.ModelYear);
  if (Number.isInteger(year) && year >= 1950 && year <= new Date().getFullYear() + 1) out.year = year;

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

/**
 * Interroge vPIC. Ne lève pas d'exception : renvoie null si le service est
 * injoignable ou trop lent (8 s), {} si le VIN n'est pas reconnu.
 */
export async function decodeVin(vin: string, signal?: AbortSignal): Promise<VinSuggestion | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  signal?.addEventListener("abort", () => controller.abort());
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`,
      { signal: controller.signal },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { Results?: VpicResult[] };
    return json.Results?.[0] ? mapVpicResult(json.Results[0]) : {};
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
