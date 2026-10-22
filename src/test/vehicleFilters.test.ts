import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, activeFilterCount, applyFilters, filtersFromParams, filtersToParams, type VehicleFilters } from "@/lib/vehicleFilters";
import type { Vehicle } from "@/lib/contentModel";

const base: Vehicle = {
  id: "",
  slug: "",
  status: "published",
  title: "",
  vin: null,
  make: "",
  model: "",
  version: null,
  year: null,
  mileage_km: null,
  fuel: null,
  gearbox: null,
  power_hp: null,
  price_eur: null,
  description: null,
  published_at: null,
  created_at: "",
  updated_at: "",
};
const v = (id: string, patch: Partial<Vehicle>): Vehicle => ({ ...base, id, title: `${patch.make ?? ""} ${patch.model ?? ""}`, ...patch });

const stock = [
  v("golf", { make: "Volkswagen", model: "Golf", version: "1.6 TDI Highline", year: 2017, mileage_km: 98_000, fuel: "diesel", gearbox: "manuelle", price_eur: 11_900, published_at: "2026-10-01" }),
  v("clio", { make: "Renault", model: "Clio", year: 2020, mileage_km: 40_000, fuel: "essence", gearbox: "manuelle", price_eur: 13_500, published_at: "2026-10-05" }),
  v("zoe", { make: "Renault", model: "Zoé", year: 2021, mileage_km: 30_000, fuel: "electrique", gearbox: "automatique", price_eur: 15_000, status: "sold", published_at: "2026-10-10" }),
  v("c3", { make: "Citroën", model: "C3", year: null, mileage_km: null, fuel: "essence", gearbox: null, price_eur: null, published_at: "2026-10-03" }),
];
const ids = (f: Partial<VehicleFilters>) => applyFilters(stock, { ...DEFAULT_FILTERS, ...f }).map((x) => x.id);

describe("applyFilters", () => {
  it("par défaut : plus récents d'abord, vendus toujours à la fin", () => {
    expect(ids({})).toEqual(["clio", "c3", "golf", "zoe"]);
  });

  it("peut masquer les vendus", () => {
    expect(ids({ vendus: false })).not.toContain("zoe");
  });

  it("recherche sans accents ni casse, tous les mots requis", () => {
    expect(ids({ q: "renault zoe" })).toEqual(["zoe"]);
    expect(ids({ q: "citroen" })).toEqual(["c3"]);
    expect(ids({ q: "tdi golf" })).toEqual(["golf"]);
  });

  it("les plafonds écartent les valeurs inconnues", () => {
    expect(ids({ prixMax: 14_000 })).toEqual(["clio", "golf"]);
    expect(ids({ kmMax: 50_000 })).toEqual(["clio", "zoe"]);
    expect(ids({ anneeMin: 2020 })).toEqual(["clio", "zoe"]);
  });

  it("marque, carburants (ou) et boîte", () => {
    expect(ids({ marque: "Renault" })).toEqual(["clio", "zoe"]);
    expect(ids({ carburants: ["diesel", "electrique"] })).toEqual(["golf", "zoe"]);
    expect(ids({ boite: "manuelle" })).toEqual(["clio", "golf"]);
  });

  it("tris numériques : valeurs inconnues en fin de liste", () => {
    expect(ids({ tri: "prix-asc" })).toEqual(["golf", "clio", "c3", "zoe"]);
    expect(ids({ tri: "prix-desc" })).toEqual(["clio", "golf", "c3", "zoe"]);
    expect(ids({ tri: "km-asc" })).toEqual(["clio", "golf", "c3", "zoe"]);
  });
});

describe("paramètres d'adresse", () => {
  it("aller-retour sans perte, valeurs par défaut omises", () => {
    const f: VehicleFilters = { ...DEFAULT_FILTERS, q: "golf", marque: "Volkswagen", prixMax: 15_000, carburants: ["diesel", "essence"], boite: "manuelle", vendus: false, tri: "prix-asc" };
    expect(filtersFromParams(filtersToParams(f))).toEqual(f);
    expect(filtersToParams(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("ignore les valeurs invalides (y compris les noms hérités d'Object)", () => {
    const f = filtersFromParams(new URLSearchParams("prixMax=-5&kmMax=abc&carburant=diesel,constructor,toString&boite=__proto__&tri=hasOwnProperty"));
    expect(f).toEqual({ ...DEFAULT_FILTERS, carburants: ["diesel"] });
  });

  it("garde les espaces pendant la saisie de la recherche", () => {
    expect(filtersFromParams(filtersToParams({ ...DEFAULT_FILTERS, q: "bmw " })).q).toBe("bmw ");
    expect(filtersToParams({ ...DEFAULT_FILTERS, q: "   " }).toString()).toBe("");
  });

  it("dédoublonne les carburants", () => {
    expect(filtersFromParams(new URLSearchParams("carburant=diesel,diesel")).carburants).toEqual(["diesel"]);
  });

  it("compte les filtres actifs, sans le tri", () => {
    expect(activeFilterCount({ ...DEFAULT_FILTERS, tri: "prix-asc" })).toBe(0);
    expect(activeFilterCount({ ...DEFAULT_FILTERS, marque: "Renault", carburants: ["diesel"], vendus: false })).toBe(3);
  });
});
