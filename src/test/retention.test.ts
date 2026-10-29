import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { legalInfo } from "@/data/legal";

// La durée de conservation promise dans la politique de confidentialité
// (legal.ts) doit être celle appliquée par la tâche de purge SQL.
describe("durée de conservation des demandes", () => {
  it("legal.ts et la tâche de purge SQL concordent", () => {
    const sql = readFileSync(resolve(__dirname, "../../supabase/migrations/20261021000002_purge_leads.sql"), "utf8");
    const match = sql.match(/interval '(\d+) years'/);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBe(legalInfo.leadsRetentionYears);
  });
});

describe("durée de conservation des documents clients", () => {
  it("legal.ts et l'Edge Function de purge concordent", () => {
    const ts = readFileSync(resolve(__dirname, "../../supabase/functions/purge-documents/index.ts"), "utf8");
    const match = ts.match(/const RETENTION_DAYS = (\d+);/);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBe(legalInfo.documentsRetentionDays);
  });
});
