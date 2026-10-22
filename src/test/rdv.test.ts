import { describe, it, expect } from "vitest";
import { addDays, brusselsNow, isSlotInWindow, slotKey } from "@/lib/rdv";
import { rdvHeures } from "@/data/rdv";

// 22 octobre 2026, 09:30 à Bruxelles (heure d'été, UTC+2)
const now = new Date("2026-10-22T07:30:00Z");

describe("lib/rdv", () => {
  it("9 créneaux d'1 h, de 10:00 à 18:00", () => {
    expect(rdvHeures).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18]);
  });

  it("addDays traverse les mois et les années", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("brusselsNow donne l'heure de Bruxelles, pas celle du navigateur", () => {
    expect(brusselsNow(now)).toEqual({ date: "2026-10-22", minutes: 9 * 60 + 30 });
    // 23:30 UTC = déjà le lendemain à Bruxelles
    expect(brusselsNow(new Date("2026-10-22T23:30:00Z")).date).toBe("2026-10-23");
  });

  it("respecte le délai minimum d'1 h le jour même", () => {
    expect(isSlotInWindow("2026-10-22", 10, now)).toBe(false); // dans 30 min
    expect(isSlotInWindow("2026-10-22", 11, now)).toBe(true);
  });

  it("refuse le passé et au-delà de 90 jours", () => {
    expect(isSlotInWindow("2026-10-21", 15, now)).toBe(false);
    expect(isSlotInWindow(addDays("2026-10-22", 90), 10, now)).toBe(true);
    expect(isSlotInWindow(addDays("2026-10-22", 91), 10, now)).toBe(false);
  });

  it("slotKey est stable", () => {
    expect(slotKey("2026-10-22", 10)).toBe("2026-10-22@10");
  });
});
