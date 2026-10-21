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

import { insertionIndex } from "@/lib/vehiclePhotos";
import { fitWithin } from "@/lib/imageOptimize";

describe("insertionIndex (ordre logique des photos)", () => {
  const photos = (...slots: string[]) => slots.map((slot) => ({ slot }));
  it("insère selon l'ordre des emplacements guidés", () => {
    expect(insertionIndex(photos("couverture", "coffre"), "roue")).toBe(1);
    expect(insertionIndex(photos("couverture", "roue"), "avant_gauche_3_4")).toBe(1);
    expect(insertionIndex(photos(), "coffre")).toBe(0);
  });
  it("« autre » va toujours à la fin", () => {
    expect(insertionIndex(photos("couverture", "autre", "coffre"), "autre")).toBe(3);
  });
  it("après un réordonnancement manuel, s'insère avant la première photo plus « loin »", () => {
    expect(insertionIndex(photos("coffre", "couverture"), "roue")).toBe(0);
  });
});

describe("fitWithin", () => {
  it("réduit le grand côté, sans jamais agrandir", () => {
    expect(fitWithin(4032, 3024, 1920)).toEqual({ width: 1920, height: 1440 });
    expect(fitWithin(3024, 4032, 1920)).toEqual({ width: 1440, height: 1920 });
    expect(fitWithin(800, 600, 1920)).toEqual({ width: 800, height: 600 });
  });
});
