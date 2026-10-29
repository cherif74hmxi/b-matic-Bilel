import { describe, expect, it } from "vitest";
import {
  buildDetails, documentPath, emptyRdvForm, formatPlate, isInZone, isPlateValid, isPostalCodeValid,
  isStepValid, longDate, newReference, type RdvForm,
} from "@/lib/rendezvous";

const complet: RdvForm = {
  ...emptyRdvForm,
  besoin: "pare-brise",
  sousChoix: "remplacement",
  plaque: "1abc123",
  couverture: "oui",
  assureur: "AXA",
  lieu: "domicile",
  codePostal: "4000",
  date: "2026-10-30",
  hour: 10,
  prenom: "Sarah",
  nom: "Lambert",
  telephone: "0470 12 34 56",
  email: "sarah@example.be",
  consent: true,
};

describe("formulaire de rendez-vous — validation", () => {
  it("plaque : lettres et chiffres, format belge mis en forme", () => {
    expect(isPlateValid("1-ABC-123")).toBe(true);
    expect(isPlateValid("abc")).toBe(false);
    expect(isPlateValid("123456")).toBe(false);
    expect(formatPlate("1abc123")).toBe("1-ABC-123");
    expect(formatPlate("AB-123-CD")).toBe("AB123CD");
  });

  it("code postal belge et zone d'intervention", () => {
    expect(isPostalCodeValid("4432")).toBe(true);
    expect(isPostalCodeValid("0432")).toBe(false);
    expect(isInZone("4432")).toBe(true);
    expect(isInZone("1000")).toBe(false);
  });

  it("chaque étape exige ses champs", () => {
    for (let step = 1; step <= 6; step++) expect(isStepValid(complet, step)).toBe(true);
    expect(isStepValid({ ...complet, sousChoix: "" }, 1)).toBe(false);
    expect(isStepValid({ ...complet, besoin: "toit", sousChoix: "" }, 1)).toBe(true);
    expect(isStepValid({ ...complet, vehiculeMode: "manuel" }, 2)).toBe(false);
    expect(isStepValid({ ...complet, vehiculeMode: "manuel", marque: "Peugeot", modele: "208" }, 2)).toBe(true);
    expect(isStepValid({ ...complet, assureur: "" }, 3)).toBe(false);
    expect(isStepValid({ ...complet, couverture: "inconnu", assureur: "" }, 3)).toBe(true);
    expect(isStepValid({ ...complet, codePostal: "40" }, 4)).toBe(false);
    expect(isStepValid({ ...complet, lieu: "centre", codePostal: "" }, 4)).toBe(true);
    expect(isStepValid({ ...complet, hour: null }, 5)).toBe(false);
    expect(isStepValid({ ...complet, consent: false }, 6)).toBe(false);
  });
});

describe("formulaire de rendez-vous — envoi", () => {
  it("détails de la demande : jamais de champ vide, référence incluse", () => {
    const d = buildDetails(complet, "ref");
    expect(d).toMatchObject({
      Service: "Pare-brise — Remplacer",
      Plaque: "1-ABC-123",
      "Couverture bris de glace": "Oui",
      Assureur: "AXA",
      "Code postal": "4000",
      Heure: "10:00",
      "Référence dossier": "ref",
    });
    expect(Object.values(d).every(Boolean)).toBe(true);
    expect(buildDetails({ ...complet, couverture: "non" }, "ref").Assureur).toBeUndefined();
  });

  it("date en toutes lettres", () => {
    expect(longDate("2026-10-30")).toBe("vendredi 30 octobre 2026");
  });

  it("chemin des documents accepté par la règle du bucket", () => {
    const ref = newReference();
    // Même expression que public.client_document_upload_allowed (migration 20261029000001).
    const regle = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/(carte-grise|assurance)-[0-9]{10,16}\.(jpg|png|webp|pdf)$/;
    expect(documentPath(ref, "carte-grise", "jpg")).toMatch(regle);
    expect(documentPath(ref, "assurance", "pdf")).toMatch(regle);
  });
});
