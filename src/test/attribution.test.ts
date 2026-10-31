import { afterEach, describe, expect, it } from "vitest";
import { captureAttribution, getAttribution, readAttribution } from "@/lib/attribution";

const SITE = "https://bmatic-pare-brise.com";

const visite = (url: string, referrer = "") => {
  window.history.replaceState(null, "", url);
  Object.defineProperty(document, "referrer", { value: referrer, configurable: true });
};

afterEach(() => sessionStorage.clear());

describe("origine de la visite — lecture", () => {
  it("lit les UTM, le gclid, le site référent et la page d'arrivée", () => {
    const a = readAttribution(
      `${SITE}/pare-brise?utm_source=google&utm_medium=cpc&utm_campaign=liege&gclid=Cj0KCQ&autre=x`,
      "https://www.google.com/search?q=pare+brise+ans",
    );
    expect(a).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "liege",
      gclid: "Cj0KCQ",
      referrer: "https://www.google.com/search",
      landing_path: "/pare-brise",
    });
  });

  it("ignore le site lui-même comme référent et tronque les valeurs trop longues", () => {
    const a = readAttribution(`${SITE}/?utm_term=${"x".repeat(400)}`, `${SITE}/contact`);
    expect(a.referrer).toBeUndefined();
    expect(a.utm_term).toHaveLength(255);
    expect(a.landing_path).toBe("/");
  });
});

describe("origine de la visite — sessionStorage", () => {
  it("notée une seule fois : les navigations suivantes ne l'écrasent pas", () => {
    visite("/rendez-vous?utm_source=facebook&utm_campaign=promo", "https://l.facebook.com/l.php?u=x");
    captureAttribution();
    visite("/contact?utm_source=autre");
    captureAttribution();
    expect(getAttribution()).toEqual({
      utm_source: "facebook",
      utm_campaign: "promo",
      referrer: "https://l.facebook.com/l.php",
      landing_path: "/rendez-vous",
    });
  });

  it("rien de noté : objet vide, et aucun cookie déposé", () => {
    expect(getAttribution()).toEqual({});
    visite("/");
    captureAttribution();
    expect(document.cookie).toBe("");
  });
});
