import { describe, it, expect, vi, afterEach } from "vitest";
import { clipDescription, injectHead } from "../../api/_lib/head";
import { prerenderPages } from "@/seo/pages";
import { pagesSeo } from "@/data/seo";

const TEMPLATE = `<html><head>\n<!--seo-->\n<title>Ancien</title>\n<!--/seo-->\n</head><body></body></html>`;

describe("SEO — titres et descriptions", () => {
  const pages = prerenderPages();

  it("chaque page pré-rendue a un titre et une description uniques", () => {
    const titres = pages.map((p) => p.meta.title);
    const descriptions = pages.map((p) => p.meta.description);
    expect(new Set(titres).size).toBe(titres.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("titres ≤ 75 caractères, descriptions entre 50 et 170", () => {
    for (const p of pages) {
      expect(p.meta.title.length, p.path).toBeLessThanOrEqual(75);
      expect(p.meta.description.length, p.path).toBeGreaterThanOrEqual(50);
      expect(p.meta.description.length, p.path).toBeLessThanOrEqual(170);
    }
  });

  it("toutes les routes fixes sont pré-rendues, avec un JSON-LD sur l'accueil", () => {
    const paths = pages.map((p) => p.path);
    for (const path of Object.keys(pagesSeo)) expect(paths).toContain(path);
    const accueil = JSON.stringify(pages.find((p) => p.path === "/")?.meta.jsonLd);
    expect(accueil).toContain('"AutoRepair"');
    expect(accueil).toContain('"opens":"10:00"');
  });
});

describe("api/_lib/head", () => {
  it("remplace le bloc <!--seo--> et échappe les attributs", () => {
    const html = injectHead(TEMPLATE, {
      title: 'Golf "GTI" & co',
      description: "Desc <b>",
      url: "https://x.be/vehicules/golf",
      image: "https://x.be/a.jpg",
      jsonLd: { name: "</script><script>alert(1)</script>" },
    });
    expect(html).not.toContain("Ancien");
    expect(html).toContain("<title>Golf &quot;GTI&quot; &amp; co</title>");
    expect(html).toContain('content="Desc &lt;b&gt;"');
    expect(html).toContain('<link rel="canonical" href="https://x.be/vehicules/golf" />');
    expect(html).not.toContain("</script><script>");
  });

  it("ajoute le bloc avant </head> si le gabarit n'a pas de marqueur", () => {
    expect(injectHead("<head></head>", { title: "T", description: "D" })).toMatch(/<!--seo-->[\s\S]*<title>T<\/title>[\s\S]*<\/head>/);
  });

  it("clipDescription coupe au mot", () => {
    const long = "mot ".repeat(80);
    const clipped = clipDescription(long);
    expect(clipped.length).toBeLessThanOrEqual(155);
    expect(clipped.endsWith("…")).toBe(true);
  });
});

describe("api/share — fiche véhicule", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("construit titre, photo et JSON-LD Car depuis Supabase", async () => {
    // jsdom n'a pas AbortSignal.timeout (présent sur Vercel / Node 18+).
    if (!("timeout" in AbortSignal)) vi.stubGlobal("AbortSignal", Object.assign(AbortSignal, { timeout: () => new AbortController().signal }));
    vi.stubEnv("VITE_SUPABASE_URL", "https://sb.test");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "cle");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            {
              slug: "vw-golf-2019", status: "published", title: "Volkswagen Golf 1.5 TSI", make: "Volkswagen",
              model: "Golf", year: 2019, mileage_km: 58000, fuel: "essence", price_eur: 16900, description: null,
              vehicle_photos: [{ storage_path: "v1/photo 1.webp" }],
            },
          ]),
        ),
      ),
    );
    const { vehicleMeta } = await import("../../api/share");
    const meta = await vehicleMeta("vw-golf-2019", "https://www.bmatic.be");
    expect(meta?.title).toMatch(/^Volkswagen Golf 1\.5 TSI — 16\s900\s€ \| B MATIC$/);
    expect(meta?.description).toContain("2019 · 58");
    expect(meta?.image).toBe("https://sb.test/storage/v1/object/public/vehicle-photos/v1/photo%201.webp");
    expect(JSON.stringify(meta?.jsonLd)).toContain('"@type":"Car"');
  });
});
