import { describe, expect, it } from "vitest";
import {
  buildDetails, emptyRdvForm, formatPlate, isPeriodeOpen, isPlateValid, isStepValid, jourCourt,
  joursRappel, longDate, rappelLabel, rappelPhrase, recapRows, toggleVitrage, type RdvForm,
} from "@/lib/rendezvous";

// 30 octobre 2026, 09:30 à Bruxelles (heure d'hiver depuis le 25, UTC+1)
const now = new Date("2026-10-30T08:30:00Z");

const complet: RdvForm = {
  ...emptyRdvForm,
  prenom: "Sarah",
  nom: "Lambert",
  telephone: "0470 12 34 56",
  rappel: "date",
  rappelDate: "2026-10-31",
  rappelPeriode: "matin",
  vitrages: ["pare-brise", "vitre-laterale"],
  couverture: "oui",
  plaque: "1abc123",
  consent: true,
};

describe("formulaire de rappel — coordonnées", () => {
  it("téléphone obligatoire, e-mail facultatif mais valide s'il est rempli", () => {
    expect(isStepValid(complet, 1, now)).toBe(true);
    expect(isStepValid({ ...complet, email: "" }, 1, now)).toBe(true);
    expect(isStepValid({ ...complet, email: "sarah@example.be" }, 1, now)).toBe(true);
    expect(isStepValid({ ...complet, email: "sarah@" }, 1, now)).toBe(false);
    expect(isStepValid({ ...complet, telephone: "" }, 1, now)).toBe(false);
    expect(isStepValid({ ...complet, telephone: "0470" }, 1, now)).toBe(false);
    expect(isStepValid({ ...complet, prenom: "" }, 1, now)).toBe(false);
  });

  it("rappel : dès que possible, ou un jour ET une plage", () => {
    expect(isStepValid({ ...complet, rappel: "" }, 1, now)).toBe(false);
    expect(isStepValid({ ...complet, rappel: "asap", rappelDate: "", rappelPeriode: "" }, 1, now)).toBe(true);
    expect(isStepValid({ ...complet, rappelPeriode: "" }, 1, now)).toBe(false);
    expect(isStepValid({ ...complet, rappelDate: "" }, 1, now)).toBe(false);
  });
});

describe("formulaire de rappel — plages et jours", () => {
  it("le jour même, une plage se ferme 1 h avant sa fin", () => {
    expect(isPeriodeOpen("2026-10-30", "matin", now)).toBe(true); // 9:30, fin 12h
    expect(isPeriodeOpen("2026-10-30", "matin", new Date("2026-10-30T10:01:00Z"))).toBe(false); // 11:01
    expect(isPeriodeOpen("2026-10-30", "apres-midi", new Date("2026-10-30T16:59:00Z"))).toBe(true); // 17:59
    expect(isPeriodeOpen("2026-10-30", "apres-midi", new Date("2026-10-30T17:01:00Z"))).toBe(false); // 18:01
  });

  it("refuse le passé, l'au-delà de l'horizon et une plage vide", () => {
    expect(isPeriodeOpen("2026-10-29", "apres-midi", now)).toBe(false);
    expect(isPeriodeOpen("2026-11-30", "matin", now)).toBe(false);
    expect(isPeriodeOpen("2026-10-31", "", now)).toBe(false);
  });

  it("14 jours proposés ; aujourd'hui retiré quand plus aucune plage n'est possible", () => {
    const jours = joursRappel(now);
    expect(jours).toHaveLength(14);
    expect(jours[0]).toBe("2026-10-30");
    expect(joursRappel(new Date("2026-10-30T19:00:00Z"))[0]).toBe("2026-10-31"); // 20:00
  });

  it("pastilles de jour", () => {
    expect(jourCourt("2026-10-30", "2026-10-30")).toEqual({ haut: "Auj.", jour: 30, mois: "oct." });
    expect(jourCourt("2026-10-31", "2026-10-30").haut).toBe("Demain");
    expect(jourCourt("2026-11-02", "2026-10-30")).toEqual({ haut: "lun.", jour: 2, mois: "nov." });
  });
});

describe("formulaire de rappel — vitrage, assurance, véhicule", () => {
  it("vitrages multiples, « Je ne sais pas » exclusif", () => {
    expect(toggleVitrage(["pare-brise"], "lunette-arriere")).toEqual(["pare-brise", "lunette-arriere"]);
    expect(toggleVitrage(["pare-brise", "lunette-arriere"], "pare-brise")).toEqual(["lunette-arriere"]);
    expect(toggleVitrage(["pare-brise", "toit"], "inconnu")).toEqual(["inconnu"]);
    expect(toggleVitrage(["inconnu"], "toit")).toEqual(["toit"]);
    expect(isStepValid({ ...complet, vitrages: [] }, 2, now)).toBe(false);
    expect(isStepValid(complet, 2, now)).toBe(true);
  });

  it("assurance : un choix obligatoire", () => {
    expect(isStepValid(complet, 3, now)).toBe(true);
    expect(isStepValid({ ...complet, couverture: "" }, 3, now)).toBe(false);
  });

  it("véhicule : plaque, ou marque + modèle (année facultative) ; consentement obligatoire", () => {
    expect(isStepValid(complet, 4, now)).toBe(true);
    expect(isStepValid({ ...complet, consent: false }, 4, now)).toBe(false);
    const manuel: RdvForm = { ...complet, vehiculeMode: "manuel", marque: "Peugeot", modele: "208" };
    expect(isStepValid({ ...manuel, marque: "" }, 4, now)).toBe(false);
    expect(isStepValid(manuel, 4, now)).toBe(true);
    expect(isStepValid({ ...manuel, annee: "2019" }, 4, now)).toBe(true);
    expect(isStepValid({ ...manuel, annee: "1950" }, 4, now)).toBe(false);
  });

  it("plaque : lettres et chiffres, format belge mis en forme", () => {
    expect(isPlateValid("1-ABC-123")).toBe(true);
    expect(isPlateValid("abc")).toBe(false);
    expect(isPlateValid("123456")).toBe(false);
    expect(formatPlate("1abc123")).toBe("1-ABC-123");
    expect(formatPlate("AB-123-CD")).toBe("AB123CD");
  });
});

describe("formulaire de rappel — envoi", () => {
  it("détails de la demande : jamais de champ vide", () => {
    const d = buildDetails(complet);
    expect(d).toEqual({
      Rappel: "samedi 31 octobre 2026, matin (10h–12h)",
      Vitrage: "Pare-brise, Vitre latérale",
      "Couverture bris de glace": "Oui",
      Plaque: "1-ABC-123",
    });
    expect(buildDetails({ ...complet, rappel: "asap" }).Rappel).toBe("Dès que possible");
  });

  it("phrases de rappel et récapitulatif", () => {
    expect(rappelLabel({ ...complet, rappelPeriode: "apres-midi" })).toBe("samedi 31 octobre 2026, après-midi (12h–19h)");
    expect(rappelPhrase(complet)).toBe("le samedi 31 octobre 2026, le matin (10h–12h)");
    expect(rappelPhrase({ ...complet, rappel: "asap" })).toMatch(/^dès que possible \(/);
    expect(recapRows(complet).map(([k]) => k)).toEqual(["Rappel", "Vitrage", "Bris de glace", "Véhicule"]);
  });

  it("date en toutes lettres", () => {
    expect(longDate("2026-10-30")).toBe("vendredi 30 octobre 2026");
  });
});
