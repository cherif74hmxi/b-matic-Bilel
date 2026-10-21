import { describe, expect, it } from "vitest";
import { mapVpicResult, normalizeVin, VIN_PATTERN } from "@/lib/vin";
import { slugify } from "@/lib/vehicles";

describe("mapVpicResult", () => {
  it("VIN européen partiel : marque normalisée + année seulement", () => {
    expect(mapVpicResult({ Make: "VOLKSWAGEN", ModelYear: "2015" })).toEqual({ make: "Volkswagen", year: 2015 });
  });

  it("VIN complet : modèle, version, carburant, puissance en ch", () => {
    const s = mapVpicResult({
      Make: "BMW",
      Model: "328i",
      ModelYear: "2012",
      Series: "3-Series",
      DisplacementL: "2.00",
      FuelTypePrimary: "Gasoline",
      EngineHP: "241",
      TransmissionStyle: "Automatic",
    });
    expect(s).toEqual({
      make: "BMW",
      model: "328i",
      year: 2012,
      version: "3-Series 2.0 L",
      fuel: "essence",
      gearbox: "automatique",
      power_hp: 244,
    });
  });

  it("électrification et alias de marque", () => {
    expect(mapVpicResult({ Make: "MERCEDES-BENZ", ElectrificationLevel: "PHEV (Plug-in Hybrid Electric Vehicle)" })).toEqual({
      make: "Mercedes-Benz",
      fuel: "hybride_rechargeable",
    });
    expect(mapVpicResult({ FuelTypePrimary: "Electric" }).fuel).toBe("electrique");
    expect(mapVpicResult({ FuelTypePrimary: "Diesel", TransmissionStyle: "Manual/Standard" })).toEqual({ fuel: "diesel", gearbox: "manuelle" });
  });

  it("ignore les valeurs vides ou aberrantes", () => {
    expect(mapVpicResult({ Make: " ", ModelYear: "0", EngineHP: "", DisplacementL: "0" })).toEqual({});
  });
});

describe("VIN", () => {
  it("normalise et valide", () => {
    expect(normalizeVin(" wvw zzz-1kz 6w000001 ")).toBe("WVWZZZ1KZ6W000001");
    expect(VIN_PATTERN.test("WVWZZZ1KZ6W000001")).toBe(true);
    expect(VIN_PATTERN.test("WVWZZZ1KZ6W00000O")).toBe(false); // lettre O interdite
    expect(VIN_PATTERN.test("WVWZZZ1KZ6W00001")).toBe(false); // 16 caractères
  });
});

describe("slugify", () => {
  it("accents, espaces et ponctuation", () => {
    expect(slugify("Citroën C3 1.2 PureTech — Feel")).toBe("citroen-c3-1-2-puretech-feel");
    expect(slugify("  --Golf  7!!  ")).toBe("golf-7");
    expect(slugify("x".repeat(100)).length).toBe(80);
  });
});
