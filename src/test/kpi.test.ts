import { describe, expect, it } from "vitest";
import { allowedBuckets, bucketLabel, defaultBucket, presetPeriod, variation } from "@/lib/kpi";

const now = new Date(2026, 9, 22, 15, 30); // 22 octobre 2026

describe("périodes du tableau de bord", () => {
  it("préréglages", () => {
    expect(presetPeriod("today", now)).toEqual({ from: "2026-10-22", to: "2026-10-22", bucket: "hour" });
    expect(presetPeriod("yesterday", now)).toEqual({ from: "2026-10-21", to: "2026-10-21", bucket: "hour" });
    expect(presetPeriod("7d", now)).toEqual({ from: "2026-10-16", to: "2026-10-22", bucket: "day" });
    expect(presetPeriod("30d", now).from).toBe("2026-09-23");
    expect(presetPeriod("12m", now)).toEqual({ from: "2025-11-01", to: "2026-10-22", bucket: "month" });
  });

  it("découpage par heure limité à 31 jours", () => {
    expect(allowedBuckets("2026-10-01", "2026-10-31")).toContain("hour");
    expect(allowedBuckets("2026-10-01", "2026-11-01")).not.toContain("hour");
    expect(defaultBucket("2026-10-21", "2026-10-22")).toBe("hour");
    expect(defaultBucket("2026-08-01", "2026-10-22")).toBe("day");
    expect(defaultBucket("2026-01-01", "2026-10-22")).toBe("month");
  });

  it("libellés et variation", () => {
    expect(bucketLabel("2026-10-22T14:00:00", "hour")).toBe("14h");
    expect(bucketLabel("2026-10-01T00:00:00", "month")).toBe("octobre 2026");
    expect(variation(15, 10)).toBe(50);
    expect(variation(3, 0)).toBeNull();
  });
});
