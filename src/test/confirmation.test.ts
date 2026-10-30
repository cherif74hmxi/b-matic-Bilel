// @vitest-environment node
// Module du serveur du VPS : testé dans Node, pas dans le faux navigateur (jsdom).
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import {
  buildConfirmationEmail, confirmationHandler, createLimiter, parseConfirmation,
} from "../../server/confirmation";

const valide = {
  email: "sarah@example.be",
  prenom: "Sarah",
  telephone: "0470 12 34 56",
  rappel: "date",
  rappelDate: "2026-10-31",
  rappelPeriode: "matin",
  vitrages: ["vitre-laterale", "pare-brise", "inconnu-du-site"],
  couverture: "oui",
  website: "",
};

describe("email de confirmation — validation", () => {
  it("accepte une demande complète et ne garde que les choix connus", () => {
    const c = parseConfirmation(valide);
    expect(c?.email).toBe("sarah@example.be");
    expect(c?.form.vitrages).toEqual(["pare-brise", "vitre-laterale"]);
    expect(c?.form.rappelPeriode).toBe("matin");
  });

  it("refuse le pot de miel, un email invalide ou un rappel incohérent", () => {
    expect(parseConfirmation({ ...valide, website: "x" })).toBeNull();
    expect(parseConfirmation({ ...valide, email: "sarah@" })).toBeNull();
    expect(parseConfirmation({ ...valide, rappel: "plus-tard" })).toBeNull();
    expect(parseConfirmation({ ...valide, rappelDate: "2026-02-30" })).toBeNull();
    expect(parseConfirmation({ ...valide, rappelPeriode: "nuit" })).toBeNull();
    expect(parseConfirmation("texte")).toBeNull();
    expect(parseConfirmation({ ...valide, rappel: "asap", rappelDate: "", rappelPeriode: "" })).not.toBeNull();
  });

  it("anti-abus : un prénom ou un numéro douteux est retiré, jamais recopié", () => {
    const c = parseConfirmation({ ...valide, prenom: "Gagnez 1000€ sur spam.example", telephone: "<b>appelez</b>" });
    expect(c?.prenom).toBe("");
    expect(c?.telephone).toBe("");
    expect(parseConfirmation({ ...valide, prenom: "Marie-Anne d'Ans" })?.prenom).toBe("Marie-Anne d'Ans");
  });
});

describe("email de confirmation — contenu", () => {
  it("reprend le moment du rappel, le vitrage et la couverture", () => {
    const mail = buildConfirmationEmail(parseConfirmation(valide)!);
    expect(mail.subject).toMatch(/demande de rappel/i);
    expect(mail.text).toContain("Bonjour Sarah,");
    expect(mail.text).toContain("Nous vous appelons au 0470 12 34 56 le samedi 31 octobre 2026, le matin (10h–12h)");
    expect(mail.text).toContain("- Vitrage : Pare-brise, Vitre latérale");
    expect(mail.text).toContain("- Bris de glace : Oui");
    expect(mail.html).toContain("samedi 31 octobre 2026, matin (10h–12h)");
  });

  it("sans prénom ni numéro valides : formule neutre", () => {
    const mail = buildConfirmationEmail(parseConfirmation({ ...valide, prenom: "", telephone: "", rappel: "asap" })!);
    expect(mail.text).toContain("Bonjour,");
    expect(mail.text).toMatch(/Nous vous appelons dès que possible \(/);
  });
});

describe("email de confirmation — limites", () => {
  it("bloque au-delà du maximum puis libère après la fenêtre", () => {
    const limite = createLimiter(2, 1000);
    expect(limite("a", 0)).toBe(true);
    expect(limite("a", 10)).toBe(true);
    expect(limite("a", 20)).toBe(false);
    expect(limite("b", 20)).toBe(true);
    expect(limite("a", 1001)).toBe(true);
  });
});

describe("email de confirmation — route", () => {
  afterEach(() => vi.unstubAllGlobals());

  const appel = async (env: NodeJS.ProcessEnv, headers: Record<string, string>, body: unknown = valide) => {
    const req = { body, ip: "203.0.113.7", get: (h: string) => headers[h.toLowerCase()] } as unknown as ExpressRequest;
    const res = { statusCode: 0, status(c: number) { this.statusCode = c; return this; }, json() { return this; } };
    await confirmationHandler(env)(req, res as unknown as ExpressResponse);
    return res.statusCode;
  };
  const site = { origin: "https://bmatic-pare-brise.com", host: "bmatic-pare-brise.com" };

  it("refuse les autres sites et répond 503 sans clé Brevo", async () => {
    expect(await appel({ BREVO_API_KEY: "k" }, { origin: "https://pirate.example", host: site.host })).toBe(403);
    expect(await appel({ BREVO_API_KEY: "k" }, { host: site.host })).toBe(403);
    expect(await appel({}, site)).toBe(503);
  });

  it("envoie via Brevo, réponse vers la boîte du garage", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await appel({ BREVO_API_KEY: "k", MAIL_FROM: "contact@bmatic-pare-brise.com" }, site)).toBe(202);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    const body = JSON.parse(init.body);
    expect(body.to).toEqual([{ email: "sarah@example.be" }]);
    expect(body.sender.email).toBe("contact@bmatic-pare-brise.com");
    expect(body.replyTo.email).toBe("bmatic63s@gmail.com");
    expect(init.headers["api-key"]).toBe("k");
  });
});
