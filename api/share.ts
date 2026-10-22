// ============================================================================
//  Aperçu de partage des fiches véhicules et actualités (fonction Vercel)
// ----------------------------------------------------------------------------
//  vercel.json réécrit /vehicules/:slug et /actualites/:slug vers cette
//  fonction. Elle renvoie la page habituelle (dist/index.html) avec un <head>
//  déjà rempli : titre, description, photo et JSON-LD de la fiche. C'est ce
//  qu'affichent WhatsApp, Facebook ou LinkedIn quand on partage le lien.
//  React démarre ensuite normalement.
//
//  En cas de problème (fiche absente, Supabase injoignable…), la page est
//  renvoyée sans changement : le site reste toujours accessible.
//  Les formats (prix, km) reprennent ceux de src/lib/contentModel.ts.
// ============================================================================
import fs from "node:fs/promises";
import path from "node:path";
import { clipDescription, injectHead, type HeadMeta } from "./_lib/head.js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const FUEL: Record<string, string> = {
  essence: "Essence", diesel: "Diesel", hybride: "Hybride",
  hybride_rechargeable: "Hybride rechargeable", electrique: "Électrique", gpl: "GPL",
};

const price = (n: number | null) =>
  n === null ? null : new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const km = (n: number | null) => (n === null ? null : `${new Intl.NumberFormat("fr-BE").format(n)} km`);

export const siteBase = (requestUrl: string) => {
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return (process.env.VITE_SITE_URL || (prod ? `https://${prod}` : new URL(requestUrl).origin)).replace(/\/+$/, "");
};

const publicFile = (bucket: string, p: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${p.split("/").map(encodeURIComponent).join("/")}`;

async function rest<T>(query: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return (await res.json()) as T;
}

interface VehicleRow {
  slug: string; status: string; title: string; make: string | null; model: string | null;
  year: number | null; mileage_km: number | null; fuel: string | null; price_eur: number | null;
  description: string | null; vehicle_photos: { storage_path: string }[];
}

interface PostRow {
  slug: string; title: string; excerpt: string | null; content: string; cover_path: string | null;
  published_at: string | null; created_at: string; updated_at: string;
}

export async function vehicleMeta(slug: string, base: string): Promise<HeadMeta | null> {
  const rows = await rest<VehicleRow[]>(
    `vehicles?select=slug,status,title,make,model,year,mileage_km,fuel,price_eur,description,vehicle_photos(storage_path)` +
      `&status=in.(published,sold)&slug=eq.${slug}&vehicle_photos.order=is_cover.desc,position.asc&vehicle_photos.limit=1&limit=1`,
  );
  const v = rows[0];
  if (!v) return null;
  const sold = v.status === "sold";
  const specs = [v.year, km(v.mileage_km), v.fuel && FUEL[v.fuel]].filter(Boolean).join(" · ");
  const url = `${base}/vehicules/${v.slug}`;
  const image = v.vehicle_photos[0] ? publicFile("vehicle-photos", v.vehicle_photos[0].storage_path) : `${base}/og-image.jpg`;
  return {
    title: `${v.title}${sold ? " (vendu)" : price(v.price_eur) ? ` — ${price(v.price_eur)}` : ""} | B MATIC`,
    description: clipDescription(`${v.title}${specs ? ` : ${specs}` : ""}. Véhicule d'occasion chez B MATIC à Ans (Liège).`),
    url,
    image,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Car",
      name: v.title,
      url,
      image,
      ...(v.make ? { brand: { "@type": "Brand", name: v.make } } : {}),
      ...(v.model ? { model: v.model } : {}),
      ...(v.year ? { vehicleModelDate: String(v.year) } : {}),
      ...(v.mileage_km !== null ? { mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage_km, unitCode: "KMT" } } : {}),
      ...(v.price_eur !== null
        ? {
            offers: {
              "@type": "Offer",
              price: v.price_eur,
              priceCurrency: "EUR",
              availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
              seller: { "@id": `${base}/#garage` },
            },
          }
        : {}),
    },
  };
}

export async function postMeta(slug: string, base: string): Promise<HeadMeta | null> {
  const rows = await rest<PostRow[]>(
    `posts?select=slug,title,excerpt,content,cover_path,published_at,created_at,updated_at&status=eq.published&slug=eq.${slug}&limit=1`,
  );
  const p = rows[0];
  if (!p) return null;
  const url = `${base}/actualites/${p.slug}`;
  const description = clipDescription(p.excerpt || p.content);
  const image = p.cover_path ? publicFile("post-images", p.cover_path) : `${base}/og-image.jpg`;
  return {
    title: `${p.title} — Actualités B MATIC`,
    description,
    url,
    image,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.title,
      description,
      image,
      url,
      mainEntityOfPage: url,
      inLanguage: "fr-BE",
      datePublished: p.published_at ?? p.created_at,
      dateModified: p.updated_at,
      author: { "@id": `${base}/#garage` },
      publisher: {
        "@type": "Organization",
        "@id": `${base}/#garage`,
        name: "B MATIC",
        logo: { "@type": "ImageObject", url: `${base}/logo.png` },
      },
    },
  };
}

/** Gabarit HTML : copié avec la fonction (vercel.json → includeFiles), sinon relu sur le site. */
async function template(requestUrl: string): Promise<string> {
  try {
    return await fs.readFile(path.join(process.cwd(), "dist", "index.html"), "utf8");
  } catch {
    const res = await fetch(new URL("/", requestUrl), { signal: AbortSignal.timeout(4000) });
    return res.text();
  }
}

export async function GET(request: Request): Promise<Response> {
  const html = await template(request.url);
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  };
  try {
    const params = new URL(request.url).searchParams;
    const kind = params.get("kind");
    const slug = params.get("slug") ?? "";
    if (!SUPABASE_URL || !SUPABASE_KEY || !SLUG.test(slug)) return new Response(html, { headers });
    const base = siteBase(request.url);
    const meta = kind === "vehicle" ? await vehicleMeta(slug, base) : kind === "post" ? await postMeta(slug, base) : null;
    return new Response(meta ? injectHead(html, meta) : html, { headers });
  } catch {
    return new Response(html, { headers });
  }
}
