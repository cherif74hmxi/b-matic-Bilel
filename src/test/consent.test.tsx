import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CookieConsent from "@/components/CookieConsent";
import { CONSENT_STORAGE_KEY, CONVERSIONS, pushConversion } from "@/lib/consent";

// La mesure interne n'est pas testée ici : on neutralise l'envoi à Supabase.
vi.mock("@/lib/publicInsert", () => ({ insertPublicRow: () => Promise.resolve(true) }));
const { default: ContactClickTracker } = await import("@/components/ContactClickTracker");

const HTML = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
// Script Consent Mode + GTM de la tête de index.html, exécuté tel quel.
const HEAD_SCRIPT = [...HTML.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((s) => s.includes('"consent", "default"'))!;

type W = Window & { bmaticGtmLoaded?: boolean };
const w = window as W;

const gtmScripts = () => [...document.querySelectorAll<HTMLScriptElement>('script[src*="googletagmanager.com"]')];
/** Commandes gtag poussées dans le dataLayer (objets `arguments`), en tableaux lisibles. */
const commands = () => (w.dataLayer ?? []).filter((e) => !Array.isArray(e) && typeof e === "object" && e !== null && "0" in e).map((e) => Array.from(e as ArrayLike<unknown>));
const lastUpdate = () => commands().filter((c) => c[0] === "consent" && c[1] === "update").at(-1)?.[2];

const store = (value: unknown) => localStorage.setItem(CONSENT_STORAGE_KEY, typeof value === "string" ? value : JSON.stringify(value));

/** Simule le chargement d'une page : script de tête, puis bandeau. */
const loadPage = (path = "/") => {
  window.history.replaceState(null, "", path);
  (0, eval)(HEAD_SCRIPT);
};

const renderBandeau = () =>
  render(
    <MemoryRouter>
      <CookieConsent />
    </MemoryRouter>,
  );

beforeEach(() => {
  // Le chargeur GTM s'insère avant le premier <script> de la page.
  document.head.appendChild(document.createElement("script"));
});

afterEach(() => {
  gtmScripts().forEach((s) => s.remove());
  document.head.innerHTML = "";
  delete w.dataLayer;
  delete w.bmaticGtmLoaded;
  delete w.bmaticLoadGtm;
  localStorage.clear();
  document.cookie.split(";").forEach((c) => (document.cookie = `${c.split("=")[0].trim()}=; Max-Age=0; path=/`));
  window.history.replaceState(null, "", "/");
});

describe("index.html — Consent Mode v2 et GTM", () => {
  it("GTM officiel (head + noscript), même clé que src/lib/consent.ts, pas de GA4 en direct", () => {
    expect(HTML).toContain("'GTM-W2CZ7DTJ'");
    expect(HTML).toMatch(/<body>\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-W2CZ7DTJ"/);
    expect(HEAD_SCRIPT).toContain(`localStorage.getItem("${CONSENT_STORAGE_KEY}")`);
    expect(HTML).not.toContain("gtag/js");
    expect(HTML).not.toContain("G-BG2WRCLCKP");
  });

  it("sans choix : tout est refusé par défaut et GTM n'est pas chargé", () => {
    loadPage();
    expect(commands()[0]).toEqual(["consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }]);
    expect(gtmScripts()).toHaveLength(0);
  });

  it("ancien choix (bandeau d'information) : ignoré, la question est reposée", () => {
    store("accepted");
    loadPage();
    expect(lastUpdate()).toBeUndefined();
    expect(gtmScripts()).toHaveLength(0);
  });

  it("refus mémorisé : consentement « denied », GTM jamais chargé", () => {
    store({ v: 2, analytics: false, marketing: false });
    loadPage();
    expect(lastUpdate()).toEqual({ analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    expect(gtmScripts()).toHaveLength(0);
  });

  it("accord mémorisé : mise à jour AVANT GTM, GTM chargé une seule fois", () => {
    store({ v: 2, analytics: true, marketing: false });
    loadPage();
    expect(lastUpdate()).toEqual({ analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    const ordre = (w.dataLayer ?? []).map((e) => ((e as { event?: string }).event === "gtm.js" ? "gtm" : Array.from(e as ArrayLike<unknown>).slice(0, 2).join(" ")));
    expect(ordre).toEqual(["consent default", "consent update", "gtm"]);
    w.bmaticLoadGtm?.();
    w.bmaticLoadGtm?.();
    expect(gtmScripts()).toHaveLength(1);
    expect(gtmScripts()[0].src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-W2CZ7DTJ");
  });

  it("espace admin : GTM jamais chargé", () => {
    store({ v: 2, analytics: true, marketing: true });
    loadPage("/admin/agenda");
    expect(gtmScripts()).toHaveLength(0);
  });
});

describe("bandeau cookies", () => {
  it("refus : mémorisé, consentement « denied », GTM non chargé", () => {
    loadPage();
    renderBandeau();
    fireEvent.click(screen.getByRole("button", { name: "Refuser" }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject({ v: 2, analytics: false, marketing: false });
    expect(lastUpdate()).toMatchObject({ analytics_storage: "denied", ad_storage: "denied" });
    expect(gtmScripts()).toHaveLength(0);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("acceptation après le chargement de la page : GTM chargé tout de suite, une seule fois", () => {
    loadPage();
    renderBandeau();
    expect(gtmScripts()).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Accepter" }));
    expect(lastUpdate()).toEqual({ analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    expect(gtmScripts()).toHaveLength(1);
  });

  it("choix existant : jamais redemandé ; « Gérer mes cookies » rouvre le détail pour le modifier", () => {
    store({ v: 2, analytics: true, marketing: true });
    loadPage();
    document.cookie = "_ga=GA1.1.123; path=/";
    document.cookie = "_gcl_au=1.1.456; path=/";
    renderBandeau();
    expect(screen.queryByRole("dialog")).toBeNull();

    act(() => {
      window.dispatchEvent(new Event("open-cookie-consent"));
    });
    const marketing = screen.getByRole("checkbox", { name: /Marketing/ });
    expect(screen.getByRole("checkbox", { name: /Statistiques/ })).toBeChecked();
    expect(marketing).toBeChecked();
    fireEvent.click(marketing);
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer mes choix" }));

    expect(lastUpdate()).toEqual({ analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    expect(document.cookie).toContain("_ga=");
    expect(document.cookie).not.toContain("_gcl_au");
    expect(gtmScripts()).toHaveLength(1);
  });

  it("« Personnaliser » : rien de coché par défaut, choix enregistré tel quel", () => {
    loadPage();
    renderBandeau();
    fireEvent.click(screen.getByRole("button", { name: "Personnaliser" }));
    expect(screen.getByRole("checkbox", { name: /Statistiques/ })).not.toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: /Marketing/ }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer mes choix" }));
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject({ analytics: false, marketing: true });
    expect(lastUpdate()).toMatchObject({ analytics_storage: "denied", ad_storage: "granted" });
  });
});

describe("conversions (dataLayer)", () => {
  const events = () => (w.dataLayer ?? []).filter((e) => typeof (e as { event?: unknown }).event === "string" && (e as { event: string }).event !== "gtm.js");

  it("rien sans accord, puis événement sans donnée personnelle", () => {
    loadPage("/rendez-vous");
    pushConversion("rdv");
    expect(events()).toHaveLength(0);

    store({ v: 2, analytics: false, marketing: true });
    pushConversion("rdv");
    expect(events()).toEqual([{ event: CONVERSIONS.rdv, page_path: "/rendez-vous" }]);
  });

  it("clics téléphone et WhatsApp, pas e-mail", () => {
    store({ v: 2, analytics: true, marketing: true });
    loadPage("/contact");
    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <ContactClickTracker />
        <a href="tel:+32470853551">appeler</a>
        <a href="https://wa.me/32470853551">whatsapp</a>
        <a href="mailto:x@y.be">e-mail</a>
      </MemoryRouter>,
    );
    for (const t of ["appeler", "whatsapp", "e-mail"]) {
      const a = screen.getByText(t);
      a.addEventListener("click", (e) => e.preventDefault());
      fireEvent.click(a);
    }
    expect(events()).toEqual([
      { event: CONVERSIONS.phone, page_path: "/contact" },
      { event: CONVERSIONS.whatsapp, page_path: "/contact" },
    ]);
  });
});
