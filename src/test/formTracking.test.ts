import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// insertPublicRow est simulé : on vérifie les lignes envoyées à form_events.
const insertPublicRow = vi.fn<(table: string, row: Record<string, unknown>) => Promise<boolean>>();
vi.mock("@/lib/publicInsert", () => ({ insertPublicRow: (t: string, r: Record<string, unknown>) => insertPublicRow(t, r) }));
const { getSessionId } = await import("@/lib/attribution");
const { trackFormStart, trackFormStep, trackFormSubmit } = await import("@/lib/formTracking");

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const events = () => insertPublicRow.mock.calls.map(([, r]) => `${r.form}:${r.event}:${r.step}:${r.step_label}`);

beforeEach(() => {
  vi.stubEnv("DEV", false);
  insertPublicRow.mockResolvedValue(true);
});

afterEach(() => {
  vi.unstubAllEnvs();
  insertPublicRow.mockReset();
  sessionStorage.clear();
});

describe("numéro de visite (session_id)", () => {
  it("UUID tiré une fois, gardé dans sessionStorage, sans cookie", () => {
    const id = getSessionId();
    expect(id).toMatch(UUID);
    expect(getSessionId()).toBe(id);
    expect(sessionStorage.getItem("bmatic-session")).toBe(id);
    expect(document.cookie).toBe("");
  });
});

describe("progression dans les formulaires (form_events)", () => {
  it("start une seule fois, chaque nouvelle étape une fois, puis submit", () => {
    trackFormStart("rdv", "Coordonnées");
    trackFormStart("rdv", "Coordonnées");
    trackFormStep("rdv", 2, "Vitrage");
    trackFormStep("rdv", 1, "Coordonnées"); // retour en arrière : rien
    trackFormStep("rdv", 2, "Vitrage"); // déjà atteinte : rien
    trackFormStep("rdv", 3, "Assurance");
    trackFormSubmit("rdv", 4, "Véhicule");
    expect(events()).toEqual(["rdv:start:1:Coordonnées", "rdv:step:2:Vitrage", "rdv:step:3:Assurance", "rdv:submit:4:Véhicule"]);
  });

  it("chaque formulaire a sa propre progression", () => {
    trackFormStart("rdv", "Coordonnées");
    trackFormStart("contact", "Message");
    expect(events()).toEqual(["rdv:start:1:Coordonnées", "contact:start:1:Message"]);
  });

  it("joint le numéro de visite et l'origine, jamais de saisie", () => {
    sessionStorage.setItem("bmatic-attribution", JSON.stringify({ utm_source: "google", gclid: "abc", landing_path: "/pare-brise" }));
    trackFormStart("contact", "Message");
    const [table, row] = insertPublicRow.mock.calls[0];
    expect(table).toBe("form_events");
    expect(row).toEqual({
      session_id: getSessionId(),
      form: "contact",
      event: "start",
      step: 1,
      step_label: "Message",
      utm_source: "google",
      gclid: "abc",
      landing_path: "/pare-brise",
    });
  });

  it("rien n'est envoyé en développement", () => {
    vi.stubEnv("DEV", true);
    trackFormStart("rdv", "Coordonnées");
    trackFormSubmit("rdv", 4, "Véhicule");
    expect(insertPublicRow).not.toHaveBeenCalled();
  });
});
