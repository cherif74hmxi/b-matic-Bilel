import { afterEach, describe, expect, it, vi } from "vitest";

// insertPublicRow est simulé : on teste la règle de réussite du double envoi.
const insertPublicRow = vi.fn<(table: string, row: Record<string, unknown>) => Promise<boolean>>();
vi.mock("@/lib/publicInsert", () => ({ insertPublicRow: (t: string, r: Record<string, unknown>) => insertPublicRow(t, r) }));
const { sendLead, submitLead } = await import("@/lib/leads");

const lead = { type: "contact" as const, name: "Jean", email: "j@x.be" };
const mailOk = () => Promise.resolve(new Response(null, { status: 200 }));
const mailKo = () => Promise.resolve(new Response(null, { status: 500 }));
const mailThrows = () => Promise.reject(new Error("offline"));

afterEach(() => insertPublicRow.mockReset());

describe("sendLead", () => {
  it("sans fichier : réussi si au moins un canal fonctionne", async () => {
    insertPublicRow.mockResolvedValue(true);
    expect(await sendLead(mailKo, lead)).toBe(true);
    expect(await sendLead(mailThrows, lead)).toBe(true);
    insertPublicRow.mockResolvedValue(false);
    expect(await sendLead(mailOk, lead)).toBe(true);
    expect(await sendLead(mailKo, lead)).toBe(false);
  });

  it("avec fichiers : l'e-mail est obligatoire et la demande n'est enregistrée qu'après", async () => {
    insertPublicRow.mockResolvedValue(true);
    expect(await sendLead(mailKo, lead, { hasAttachments: true })).toBe(false);
    expect(insertPublicRow).not.toHaveBeenCalled();
    expect(await sendLead(mailOk, lead, { hasAttachments: true })).toBe(true);
    expect(insertPublicRow).toHaveBeenCalledTimes(1);
  });
});

describe("submitLead", () => {
  it("retire les champs vides, tronque et force le consentement", async () => {
    insertPublicRow.mockResolvedValue(true);
    await submitLead({ ...lead, name: "  " + "x".repeat(200), phone: "", details: { A: "", B: null, C: "ok", D: 0 } });
    const [table, row] = insertPublicRow.mock.calls[0];
    expect(table).toBe("leads");
    expect((row.name as string).length).toBe(120);
    expect(row.phone).toBeNull();
    expect(row.details).toEqual({ C: "ok", D: 0 });
    expect(row.consent).toBe(true);
  });
});
