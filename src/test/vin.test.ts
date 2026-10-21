import { describe, expect, it } from "vitest";
import { mapVpicResult, normalizeVin, VIN_PATTERN, vinCheckDigitValid } from "@/lib/vin";
import { slugify } from "@/lib/vehicles";
import { insertionIndex } from "@/lib/vehiclePhotos";
import { fitWithin } from "@/lib/imageOptimize";

// VIN dont la clé de contrôle (9e caractère) est valide / européen sans clé.
const NA_VIN = "1M8GDM9AXKP042788";
const EU_VIN = "WAUZZZ8V5KA000000";

describe("mapVpicResult", () => {
  it("VIN européen : marque seule, l'année vPIC n'est pas reprise (clé de contrôle invalide)", () => {
    expect(mapVpicResult({ Make: "AUDI", ModelYear: "1989" }, EU_VIN)).toEqual({ make: "Audi" });
  });

  it("marque déduite du préfixe constructeur si vPIC ne la donne pas", () => {
    expect(mapVpicResult({ ModelYear: "2006", Model: "Not Applicable" }, "VF1RFB00X61234567")).toEqual({ make: "Renault" });
    expect(mapVpicResult({}, "ZZZ00000000000000")).toEqual({});
    expect(mapVpicResult({}, "WMW00000000000000")).toEqual({ make: "MINI" });
    expect(mapVpicResult({ Make: "ROLLS-ROYCE" }, "ZZZ00000000000000").make).toBe("Rolls-Royce");
  });

  it("VIN complet avec clé valide : modèle, année, version, carburant, puissance en ch", () => {
    const s = mapVpicResult(
      {
        Make: "BMW",
        Model: "328i",
        ModelYear: "2012",
        Series: "3-Series",
        DisplacementL: "2.00",
        FuelTypePrimary: "Gasoline",
        EngineHP: "241",
        TransmissionStyle: "Automatic",
      },
      NA_VIN,
    );
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
    expect(
      mapVpicResult({ Make: "MERCEDES-BENZ", ElectrificationLevel: "PHEV (Plug-in Hybrid Electric Vehicle)" }, EU_VIN),
    ).toEqual({ make: "Mercedes-Benz", fuel: "hybride_rechargeable" });
    expect(mapVpicResult({ FuelTypePrimary: "Electric" }, "ZZZ00000000000000").fuel).toBe("electrique");
    expect(mapVpicResult({ FuelTypePrimary: "Diesel", TransmissionStyle: "Manual/Standard" }, "ZZZ00000000000000")).toEqual({
      fuel: "diesel",
      gearbox: "manuelle",
    });
  });

  it("ignore les valeurs vides, « Not Applicable » ou aberrantes", () => {
    expect(
      mapVpicResult({ Make: " ", ModelYear: "0", EngineHP: "", DisplacementL: "0", Trim: "Not Applicable" }, "ZZZ00000000000000"),
    ).toEqual({});
  });
});

describe("VIN", () => {
  it("normalise (O/Q → 0, I → 1) et valide", () => {
    expect(normalizeVin(" wvw zzz-1kz 6w000001 ")).toBe("WVWZZZ1KZ6W000001");
    expect(normalizeVin("WVWZZZ1KZ6W00000O")).toBe("WVWZZZ1KZ6W000000");
    expect(normalizeVin("WVWZZZIKZ6W00000Q")).toBe("WVWZZZ1KZ6W000000");
    expect(VIN_PATTERN.test("WVWZZZ1KZ6W000001")).toBe(true);
    expect(VIN_PATTERN.test("WVWZZZ1KZ6W00001")).toBe(false); // 16 caractères
  });

  it("clé de contrôle", () => {
    expect(vinCheckDigitValid(NA_VIN)).toBe(true);
    expect(vinCheckDigitValid("1M8GDM9A1KP042788")).toBe(false);
    expect(vinCheckDigitValid(EU_VIN)).toBe(false);
  });
});

describe("slugify", () => {
  it("accents, espaces et ponctuation", () => {
    expect(slugify("Citroën C3 1.2 PureTech — Feel")).toBe("citroen-c3-1-2-puretech-feel");
    expect(slugify("  --Golf  7!!  ")).toBe("golf-7");
    expect(slugify("x".repeat(100)).length).toBe(80);
  });
});


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
