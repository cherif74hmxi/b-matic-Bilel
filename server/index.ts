// ============================================================================
//  Serveur B MATIC — héberge le site sur un VPS (remplace Vercel).
// ----------------------------------------------------------------------------
//  Reproduit le comportement de vercel.json :
//   • redirections 301 (anciennes URLs du garage) ;
//   • URLs propres : /contact est servi depuis dist/contact.html ;
//   • fonctions dynamiques : aperçu de partage des actualités (api/share.ts)
//     et sitemap des actualités (api/sitemap-annonces.ts) ;
//   • email de confirmation des demandes de rappel (server/confirmation.ts) ;
//   • cache long sur /assets (fichiers au nom versionné) ;
//   • repli SPA : tout le reste renvoie dist/index.html, React prend la main.
//
//  Lancé par pm2 (deploy/ecosystem.config.cjs), derrière nginx qui gère le HTTPS.
//  Écoute uniquement sur 127.0.0.1 : il n'est joignable qu'à travers nginx.
// ============================================================================
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GET as shareGET } from "../api/share.ts";
import { GET as sitemapGET } from "../api/sitemap-annonces.ts";
import { confirmationHandler } from "./confirmation.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PORT) || 3000;
const SITE_URL = (process.env.VITE_SITE_URL || `http://127.0.0.1:${PORT}`).replace(/\/+$/, "");

// Redirections 301, reprises telles quelles de vercel.json.
const REDIRECTS: Record<string, string> = {
  "/pare-brise-assurances": "/pare-brise",
  "/faq": "/conseils",
  "/mecanique": "/rendez-vous",
  "/reprise": "/",
  "/depannage": "/",
  "/vehicules": "/",
  "/conseils/entretien-regulier-voiture": "/conseils",
  "/conseils/plaquettes-frein-usure": "/conseils",
  "/conseils/voyants-tableau-de-bord": "/conseils",
  "/conseils/preparer-voiture-hiver": "/conseils",
  "/conseils/pneus-usure-pression-saison": "/conseils",
  "/conseils/vendre-ou-faire-reprendre-vehicule": "/conseils",
  "/conseils/que-faire-en-cas-de-panne": "/conseils",
};

const app = express();
app.disable("x-powered-by");
// Derrière nginx (même machine) : req.ip = IP réelle du visiteur (X-Forwarded-For).
app.set("trust proxy", "loopback");

// Exécute une fonction Web (Request -> Response) et renvoie le résultat via Express.
async function runFetch(
  handler: (request: Request) => Promise<Response>,
  target: string,
  res: express.Response,
): Promise<void> {
  const response = await handler(new Request(target));
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

// 1) Redirections 301.
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const p = req.path.replace(/\/+$/, "") || "/";
  if (REDIRECTS[p]) return res.redirect(301, REDIRECTS[p]);
  if (p === "/vehicules" || p.startsWith("/vehicules/")) return res.redirect(301, "/");
  next();
});

// 2) Fonctions dynamiques (actualités).
app.get("/sitemap-annonces.xml", async (_req, res, next) => {
  try {
    await runFetch(sitemapGET, `${SITE_URL}/api/sitemap-annonces`, res);
  } catch (err) {
    next(err);
  }
});
app.get("/actualites/:slug", async (req, res, next) => {
  try {
    const url = `${SITE_URL}/api/share?kind=post&slug=${encodeURIComponent(req.params.slug)}`;
    await runFetch(shareGET, url, res);
  } catch (err) {
    next(err);
  }
});

// 2 bis) Email de confirmation de la demande de rappel (/rendez-vous).
app.post("/api/confirmation-rdv", express.json({ limit: "4kb" }), confirmationHandler());

// 3) Fichiers réels (assets, images, robots.txt, sitemaps…), cache long sur /assets.
app.use(
  express.static(DIST, {
    index: false,
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

// 4) URLs propres : /contact -> dist/contact.html (si la page pré-rendue existe).
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const clean = req.path.replace(/\/+$/, "");
  if (clean && !path.extname(clean)) {
    const file = path.normalize(path.join(DIST, `${clean}.html`));
    if (file.startsWith(DIST + path.sep) && fs.existsSync(file)) {
      return res.sendFile(file);
    }
  }
  next();
});

// 5) Repli SPA : tout le reste renvoie l'application.
app.use((_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

app.listen(PORT, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`B MATIC — serveur en ligne sur http://127.0.0.1:${PORT}`);
});
