// ============================================================================
//  Pré-rendu SEO au build (pages fixes) + sitemap + robots.txt
// ----------------------------------------------------------------------------
//  Après `vite build`, pour chaque page de src/seo/pages.ts, on écrit une copie
//  de dist/index.html dont le <head> contient déjà titre, description,
//  canonical, aperçu de partage et JSON-LD (dist/contact.html, …). Vercel
//  (cleanUrls) sert /contact depuis contact.html ; React prend ensuite le
//  relais comme avant. Seul le <head> est pré-rendu : c'est ce que lisent les
//  robots de partage (WhatsApp, Facebook…), qui n'exécutent pas JavaScript.
//
//  Les modules de src/ sont chargés par un serveur Vite interne (alias « @/ »
//  et imports d'images compris), sans dupliquer de texte.
//
//  Sans adresse de site (VITE_SITE_URL ou domaine de production Vercel), les
//  pages sont pré-rendues sans URL absolue et le sitemap n'est pas généré.
// ============================================================================
import fs from "node:fs/promises";
import path from "node:path";
import { createServer, type Plugin } from "vite";
import { injectHead } from "./api/_lib/head";

interface PrerenderPage {
  path: string;
  meta: Parameters<typeof injectHead>[1];
  lastmod?: string;
}

const xmlEscape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function seoPrerender({ siteUrl, alias }: { siteUrl: string; alias: Record<string, string> }): Plugin {
  let root = process.cwd();
  let outDir = "dist";

  return {
    name: "bmatic-seo-prerender",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const server = await createServer({
        configFile: false,
        root,
        logLevel: "error",
        appType: "custom",
        server: { middlewareMode: true, hmr: false, ws: false },
        resolve: { alias },
        define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl) },
        optimizeDeps: { noDiscovery: true, include: [] },
      });

      let pages: PrerenderPage[];
      try {
        const mod = await server.ssrLoadModule("/src/seo/pages.ts");
        pages = (mod.prerenderPages as () => PrerenderPage[])();
      } finally {
        await server.close();
      }

      const template = await fs.readFile(path.join(outDir, "index.html"), "utf8");
      for (const page of pages) {
        const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
        const target = path.join(outDir, file);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, injectHead(template, page.meta));
      }

      // robots.txt : tout est autorisé. L'admin n'est PAS bloqué ici : ses pages
      // portent « noindex », que Google ne verrait plus si elles étaient bloquées.
      const robots = ["User-agent: *", "Allow: /", ""];
      if (siteUrl) {
        robots.push(`Sitemap: ${siteUrl}/sitemap.xml`, "");

        const urls = pages
          .map(
            (p) =>
              `  <url><loc>${xmlEscape(siteUrl + (p.path === "/" ? "/" : p.path))}</loc>` +
              `${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}</url>`,
          )
          .join("\n");
        await fs.writeFile(
          path.join(outDir, "sitemap-pages.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        );
        // Index : pages fixes (ce build) + véhicules et actualités (api/sitemap-annonces.ts, toujours à jour).
        await fs.writeFile(
          path.join(outDir, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            `  <sitemap><loc>${xmlEscape(siteUrl)}/sitemap-pages.xml</loc></sitemap>\n` +
            `  <sitemap><loc>${xmlEscape(siteUrl)}/sitemap-annonces.xml</loc></sitemap>\n` +
            `</sitemapindex>\n`,
        );
      } else {
        this.warn("Adresse du site inconnue (VITE_SITE_URL) : sitemap non généré, URL relatives.");
      }
      await fs.writeFile(path.join(outDir, "robots.txt"), robots.join("\n"));
      console.log(`  SEO : ${pages.length} pages pré-rendues${siteUrl ? ` pour ${siteUrl}` : ""}.`);
    },
  };
}
