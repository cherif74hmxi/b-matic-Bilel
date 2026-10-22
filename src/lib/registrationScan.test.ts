import { describe, expect, it, vi } from "vitest";

// Le module appelle l'Edge Function : on n'en teste ici que la mise en forme.
vi.mock("@/lib/aiCopy", () => ({ AI_ENABLED: false, invokeAiFunction: vi.fn() }));
const { toScan, scanFieldCount } = await import("@/lib/registrationScan");

describe("toScan (carte grise → champs du formulaire)", () => {
  it("reprend l'écriture du site, convertit les kW et déduit l'année", () => {
    const scan = toScan({
      readable: true,
      fields: { make: "CITROEN", model: "C3", first_registration: "2019-06-01", fuel: "diesel", power_kw: 73, vin: "vf7sxhmz6kt000001" },
    });
    expect(scan).toMatchObject({ make: "Citroën", model: "C3", year: 2019, fuel: "diesel", powerHp: 99, vin: "VF7SXHMZ6KT000001" });
  });

  it("met en forme une marque inconnue et écarte un VIN invalide", () => {
    const scan = toScan({ readable: true, fields: { make: "ALFA ROMEO", model: "GIULIETTA", vin: "ABC123" } });
    expect(scan.make).toBe("Alfa Romeo");
    expect(scan.model).toBe("Giulietta");
    expect(scan.vin).toBeUndefined();
    expect(scanFieldCount(scan)).toBe(2);
  });
});
