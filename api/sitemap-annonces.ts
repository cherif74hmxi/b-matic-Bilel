// ============================================================================
//  Sitemap des actualités en ligne (fonction Vercel)
// ----------------------------------------------------------------------------
//  Servi à /sitemap-annonces.xml (vercel.json). Toujours à jour : lu dans
//  Supabase à chaque demande (mis en cache 1 h). Les pages fixes sont dans
//  sitemap-pages.xml, généré au build (vite-plugin-seo.ts).
// ============================================================================
import { siteBase } from "./share.js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";

interface Row {
  slug: string;
  updated_at: string;
}

async function rows(query: string): Promise<Row[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return (await res.json()) as Row[];
}

export async function GET(request: Request): Promise<Response> {
  const base = siteBase(request.url);
  let entries: string[] = [];
  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      const posts = await rows("posts?select=slug,updated_at&status=eq.published&order=updated_at.desc&limit=5000");
      entries = posts.map((r) => `  <url><loc>${base}/actualites/${r.slug}</loc><lastmod>${r.updated_at.slice(0, 10)}</lastmod></url>`);
    }
  } catch {
    entries = []; // Sitemap vide plutôt qu'une erreur : Google réessaiera.
  }
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
