// ============================================================================
//  Filtres et tri de la liste publique des véhicules (/vehicules)
// ----------------------------------------------------------------------------
//  L'état des filtres vit dans l'adresse (?marque=…&prixMax=…) : une recherche
//  se partage et survit au bouton retour. Filtrage côté navigateur : le stock
//  d'un garage tient en une seule requête.
// ============================================================================
import { FUEL_LABELS, GEARBOX_LABELS, type Fuel, type Gearbox, type Vehicle } from "@/lib/contentModel";

export type SortKey = "recent" | "prix-asc" | "prix-desc" | "km-asc" | "annee-desc";

export const SORT_LABELS: Record<SortKey, string> = {
  recent: "Plus récents",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  "km-asc": "Kilométrage croissant",
  "annee-desc": "Année la plus récente",
};

export interface VehicleFilters {
  q: string;
  marque: string;
  prixMax: number | null;
  anneeMin: number | null;
  kmMax: number | null;
  carburants: Fuel[];
  boite: Gearbox | "";
  /** Afficher les véhicules vendus (après les disponibles). */
  vendus: boolean;
  tri: SortKey;
}

export const DEFAULT_FILTERS: VehicleFilters = {
  q: "",
  marque: "",
  prixMax: null,
  anneeMin: null,
  kmMax: null,
  carburants: [],
  boite: "",
  vendus: true,
  tri: "recent",
};

type Filterable = Pick<Vehicle, "status" | "title" | "make" | "model" | "version" | "year" | "mileage_km" | "fuel" | "gearbox" | "price_eur" | "published_at">;

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const num = (v: string | null) => {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Clé propre de l'objet (pas « constructor », « toString »… hérités). */
const own = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

export function filtersFromParams(p: URLSearchParams): VehicleFilters {
  const tri = p.get("tri") as SortKey | null;
  const boite = p.get("boite") as Gearbox | null;
  return {
    q: p.get("q") ?? "",
    marque: p.get("marque") ?? "",
    prixMax: num(p.get("prixMax")),
    anneeMin: num(p.get("anneeMin")),
    kmMax: num(p.get("kmMax")),
    carburants: [...new Set((p.get("carburant") ?? "").split(","))].filter((f): f is Fuel => own(FUEL_LABELS, f)),
    boite: boite && own(GEARBOX_LABELS, boite) ? boite : "",
    vendus: p.get("vendus") !== "0",
    tri: tri && own(SORT_LABELS, tri) ? tri : "recent",
  };
}

/** Paramètres d'adresse (les valeurs par défaut sont omises : adresse courte). */
export function filtersToParams(f: VehicleFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q); // not trimmed: the field must accept spaces while typing
  if (f.marque) p.set("marque", f.marque);
  if (f.prixMax) p.set("prixMax", String(f.prixMax));
  if (f.anneeMin) p.set("anneeMin", String(f.anneeMin));
  if (f.kmMax) p.set("kmMax", String(f.kmMax));
  if (f.carburants.length) p.set("carburant", f.carburants.join(","));
  if (f.boite) p.set("boite", f.boite);
  if (!f.vendus) p.set("vendus", "0");
  if (f.tri !== "recent") p.set("tri", f.tri);
  return p;
}

/** Nombre de filtres actifs (le tri n'en est pas un). */
export function activeFilterCount(f: VehicleFilters): number {
  return [f.q.trim(), f.marque, f.prixMax, f.anneeMin, f.kmMax, f.carburants.length, f.boite, !f.vendus].filter(Boolean).length;
}

const byNumber = (a: number | null, b: number | null, dir: 1 | -1) => {
  if (a === null && b === null) return 0;
  if (a === null) return 1; // valeurs inconnues toujours en fin de liste
  if (b === null) return -1;
  return (a - b) * dir;
};

export function applyFilters<T extends Filterable>(list: T[], f: VehicleFilters): T[] {
  const words = fold(f.q).split(/\s+/).filter(Boolean);
  const kept = list.filter((v) => {
    if (!f.vendus && v.status === "sold") return false;
    if (f.marque && v.make !== f.marque) return false;
    if (f.prixMax && (v.price_eur === null || v.price_eur > f.prixMax)) return false;
    if (f.anneeMin && (v.year === null || v.year < f.anneeMin)) return false;
    if (f.kmMax && (v.mileage_km === null || v.mileage_km > f.kmMax)) return false;
    if (f.carburants.length && (!v.fuel || !f.carburants.includes(v.fuel))) return false;
    if (f.boite && v.gearbox !== f.boite) return false;
    if (words.length) {
      const haystack = fold([v.make, v.model, v.version, v.title].filter(Boolean).join(" "));
      if (!words.every((w) => haystack.includes(w))) return false;
    }
    return true;
  });
  const sorters: Record<SortKey, (a: T, b: T) => number> = {
    recent: (a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""),
    "prix-asc": (a, b) => byNumber(a.price_eur, b.price_eur, 1),
    "prix-desc": (a, b) => byNumber(a.price_eur, b.price_eur, -1),
    "km-asc": (a, b) => byNumber(a.mileage_km, b.mileage_km, 1),
    "annee-desc": (a, b) => byNumber(a.year, b.year, -1),
  };
  // Les véhicules vendus restent visibles, mais toujours après les disponibles.
  return kept.sort((a, b) => Number(a.status === "sold") - Number(b.status === "sold") || sorters[f.tri](a, b));
}
