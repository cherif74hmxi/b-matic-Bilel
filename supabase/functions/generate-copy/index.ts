// ============================================================================
//  Edge Function « generate-copy » — assistant IA (Gemini)
// ----------------------------------------------------------------------------
//  Rédaction (admin uniquement) :
//    POST { kind: "vehicle", data: { make, model, … } }  ou  { kind: "post", data: { topic, draft } }
//    → 200 { title, description, slug? }  (slug = simple suggestion d'adresse)
//  Scan de carte grise (formulaire de rendez-vous PUBLIC + admin) :
//    POST { kind: "registration", data: { image: <base64>, mime_type } }
//    → 200 { readable, fields: { make, model, version, first_registration, fuel,
//            power_kw, displacement_cc, vin } }   (champs techniques uniquement)
//
//  Sécurité :
//   · la clé GEMINI_API_KEY est un SECRET Supabase (jamais envoyée au navigateur) ;
//   · rédaction : l'appelant doit être connecté (JWT) ET admin (is_admin)
//     AVANT tout appel à Gemini, sinon 401 / 403 ;
//   · scan : ouvert aux visiteurs, mais chaque lecture consomme un quota en base
//     (plafond global sur 24 h + plafond par appareil sur 1 h, IP hachée avec un
//     sel qui change chaque jour — voir migration scan_quota) ; l'admin n'est pas
//     soumis au quota. L'image n'est JAMAIS stockée : elle est transmise à Gemini
//     puis oubliée ; la consigne et le schéma de réponse ne demandent que les
//     caractéristiques techniques (jamais le titulaire).
//   · entrée validée et bornée.
//
//  ⚠️ Déploiement : `supabase functions deploy generate-copy --no-verify-jwt`
//     (les visiteurs n'ont pas de session ; la fonction vérifie elle-même l'admin).
//
//  Secrets / variables (supabase secrets set …) :
//   GEMINI_API_KEY      (obligatoire)
//   GEMINI_MODEL        (facultatif, défaut ci-dessous)
//   ALLOWED_ORIGINS     (facultatif : « https://bmatic.be,http://localhost:8080 » ; défaut *)
//   SCAN_MAX_PER_HOUR   (facultatif, scans par appareil et par heure, défaut 5)
//   SCAN_MAX_PER_DAY    (facultatif, scans publics sur 24 h, défaut 150)
//   SCAN_IP_SALT        (facultatif, sel du hachage d'IP ; défaut : dérivé de la clé de service)
//  SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY sont fournis par Supabase.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const DEFAULT_MODEL = "gemini-3.6-flash";
// Modifiable pour passer par un proxy (ou un faux serveur pendant les tests).
const GEMINI_API_BASE = Deno.env.get("GEMINI_API_BASE") || "https://generativelanguage.googleapis.com";
const GEMINI_TIMEOUT_MS = 25_000;

// Limite d'appels par admin (garde-fou contre une boucle ou un compte compromis).
// En mémoire de l'instance : approximative, à compléter par un plafond de
// dépense côté Google Cloud. Ajustable via AI_MAX_CALLS_PER_10MIN.
const MAX_CALLS = Number(Deno.env.get("AI_MAX_CALLS_PER_10MIN") ?? 20);
const WINDOW_MS = 10 * 60_000;
const callsByUser = new Map<string, number[]>();

function overLimit(userId: string): boolean {
  const now = Date.now();
  const recent = (callsByUser.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_CALLS) {
    callsByUser.set(userId, recent);
    return true;
  }
  recent.push(now);
  callsByUser.set(userId, recent);
  return false;
}

// Scan public : quotas en base (voir supabase/migrations/20261024000001_scan_quota.sql).
const SCAN_MAX_PER_HOUR = Number(Deno.env.get("SCAN_MAX_PER_HOUR") ?? 5);
const SCAN_MAX_PER_DAY = Number(Deno.env.get("SCAN_MAX_PER_DAY") ?? 150);

/** Hachage SHA-256 de l'IP avec un sel secret + la date du jour (jamais d'IP en clair). */
async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get("SCAN_IP_SALT") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const day = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}|${day}|${ip}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * IP du visiteur, en ne se fiant qu'aux en-têtes posés par l'infrastructure :
 * cf-connecting-ip (réécrit par Cloudflare, devant Supabase), sinon la DERNIÈRE
 * entrée de x-forwarded-for (ajoutée par le proxy ; les premières viennent du client).
 */
function clientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const chain = (req.headers.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return chain.at(-1) || req.headers.get("x-real-ip")?.trim() || "inconnue";
}

/** 'ok' si un scan public est autorisé, sinon la limite atteinte ('ip' | 'global' | 'error'). */
async function consumeScanQuota(req: Request): Promise<"ok" | "ip" | "global" | "error"> {
  const ip = clientIp(req);
  const service = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await service.rpc("consume_scan_quota", {
    p_ip_hash: await hashIp(ip),
    p_per_hour: SCAN_MAX_PER_HOUR,
    p_per_day: SCAN_MAX_PER_DAY,
  });
  if (error) {
    console.error("scan quota:", error.message);
    return "error";
  }
  return data === "ok" || data === "ip" || data === "global" ? data : "error";
}

// ---------------------------------------------------------------------------
//  CORS
// ---------------------------------------------------------------------------
const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin = allowed.includes("*") ? "*" : origin && allowed.includes(origin) ? origin : allowed[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

// ---------------------------------------------------------------------------
//  Validation de l'entrée
// ---------------------------------------------------------------------------
type VehicleData = {
  make: string;
  model: string;
  version?: string;
  year?: number;
  mileage_km?: number;
  fuel?: string;
  gearbox?: string;
  power_hp?: number;
  price_eur?: number;
  notes?: string;
};
type PostData = { topic: string; draft?: string };
type CopyInput = { kind: "vehicle"; data: VehicleData } | { kind: "post"; data: PostData };
type RegistrationInput = { kind: "registration"; data: { image: string; mimeType: string } };
type Input = CopyInput | RegistrationInput;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
/** Taille maximale du corps de requête (image de 5 Mo en base64 + marge). */
const MAX_BODY_BYTES = 7 * 1024 * 1024;

class TooLarge extends Error {}

/** Lit le corps JSON en s'arrêtant dès que MAX_BODY_BYTES est dépassé (appels anonymes possibles). */
async function readJson(req: Request): Promise<unknown> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) throw new TooLarge();
  if (!req.body) throw new BadRequest("Requête vide.");
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new TooLarge();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new BadRequest("Requête invalide.");
  }
}

class BadRequest extends Error {}

const str = (v: unknown, max: number, required = false): string | undefined => {
  if (v === undefined || v === null || v === "") {
    if (required) throw new BadRequest("Champ obligatoire manquant.");
    return undefined;
  }
  if (typeof v !== "string") throw new BadRequest("Texte attendu.");
  const t = v.trim();
  if (required && !t) throw new BadRequest("Champ obligatoire manquant.");
  if (t.length > max) throw new BadRequest(`Texte trop long (${max} caractères maximum).`);
  return t || undefined;
};

const int = (v: unknown, min: number, max: number): number | undefined => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw new BadRequest("Nombre invalide.");
  return n;
};

function parseInput(body: unknown): Input {
  if (!body || typeof body !== "object") throw new BadRequest("Requête invalide.");
  const { kind, data } = body as { kind?: unknown; data?: Record<string, unknown> };
  if (!data || typeof data !== "object") throw new BadRequest("Données manquantes.");
  if (kind === "vehicle") {
    return {
      kind,
      data: {
        make: str(data.make, 60, true)!,
        model: str(data.model, 80, true)!,
        version: str(data.version, 120),
        year: int(data.year, 1950, 2100),
        mileage_km: int(data.mileage_km, 0, 2_000_000),
        fuel: str(data.fuel, 40),
        gearbox: str(data.gearbox, 40),
        power_hp: int(data.power_hp, 1, 2000),
        price_eur: int(data.price_eur, 0, 10_000_000),
        notes: str(data.notes, 10_000),
      },
    };
  }
  if (kind === "post") {
    return { kind, data: { topic: str(data.topic, 300, true)!, draft: str(data.draft, 20_000) } };
  }
  if (kind === "registration") {
    const { image, mime_type } = data as { image?: unknown; mime_type?: unknown };
    if (typeof mime_type !== "string" || !IMAGE_TYPES.includes(mime_type)) throw new BadRequest("Format d'image non pris en charge (JPEG, PNG ou WebP).");
    if (typeof image !== "string" || !image) throw new BadRequest("Image manquante.");
    if ((image.length * 3) / 4 > MAX_IMAGE_BYTES) throw new BadRequest("Image trop lourde (5 Mo maximum).");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(image)) throw new BadRequest("Image invalide.");
    return { kind, data: { image, mimeType: mime_type } };
  }
  throw new BadRequest("Type inconnu (vehicle, post ou registration).");
}

// ---------------------------------------------------------------------------
//  Consignes pour Gemini
// ---------------------------------------------------------------------------
const COMMON = `Tu rédiges pour B MATIC, un garage automobile en Belgique (mécanique, dépannage, reprise et vente de véhicules d'occasion).
Écris en français de Belgique, naturel et professionnel, sans emphase publicitaire ni superlatifs creux, sans emoji, sans markdown.
N'invente AUCUNE information : n'utilise que les éléments fournis. Si une information manque (entretien, options, garantie, état…), n'en parle pas.
Réponds uniquement avec l'objet JSON demandé.`;

function buildPrompt(input: CopyInput): string {
  if (input.kind === "vehicle") {
    const d = input.data;
    const facts = [
      ["Marque", d.make],
      ["Modèle", d.model],
      ["Version / finition", d.version],
      ["Année", d.year],
      ["Kilométrage", d.mileage_km !== undefined ? `${d.mileage_km} km` : undefined],
      ["Carburant", d.fuel],
      ["Boîte de vitesses", d.gearbox],
      ["Puissance", d.power_hp !== undefined ? `${d.power_hp} ch` : undefined],
      ["Prix", d.price_eur !== undefined ? `${d.price_eur} €` : undefined],
      ["Notes du garage", d.notes],
    ]
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `- ${k} : ${v}`)
      .join("\n");
    return `${COMMON}

Rédige l'annonce d'un véhicule d'occasion à vendre.
- "title" : titre court (60 caractères maximum), sous la forme « Marque Modèle Version », sans prix ni année.
- "slug" : adresse web courte pour l'annonce (minuscules sans accents, chiffres et tirets, 80 caractères maximum), ex. « volkswagen-golf-1-6-tdi-2017 ».
- "description" : 3 à 5 courts paragraphes séparés par une ligne vide (900 caractères maximum). Présente le véhicule, ses caractéristiques fournies, puis invite à contacter le garage pour un essai.

Caractéristiques fournies :
${facts}`;
  }
  const d = input.data;
  return `${COMMON}

Rédige une actualité (article court) pour le site du garage.
- "title" : titre clair (80 caractères maximum).
- "slug" : adresse web courte de l'article (minuscules sans accents, chiffres et tirets, 80 caractères maximum).
- "description" : le texte de l'article, 3 à 6 paragraphes séparés par une ligne vide (2500 caractères maximum).

Sujet : ${d.topic}
${d.draft ? `Notes / brouillon du garage (à reformuler, sans rien ajouter d'inventé) :\n${d.draft}` : ""}`;
}

// ---------------------------------------------------------------------------
//  Appel Gemini (sortie JSON structurée)
// ---------------------------------------------------------------------------
/** Suggestion d'adresse nettoyée (copie de slugify, src/lib/slug.ts — le front la renormalise), ou undefined. */
function cleanSlug(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const slug = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug || undefined;
}

/** Appel Gemini avec sortie JSON structurée ; renvoie l'objet JSON produit. */
async function geminiJson(
  parts: Record<string, unknown>[],
  schema: Record<string, unknown>,
  options: { temperature: number; fast?: boolean },
): Promise<Record<string, unknown>> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY manquante");
  const model = Deno.env.get("GEMINI_MODEL") || DEFAULT_MODEL;

  const res = await fetch(`${GEMINI_API_BASE}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: options.temperature,
        // Large : les modèles « à réflexion » (2.5) décomptent aussi leurs jetons de réflexion.
        maxOutputTokens: 8192,
        // Lecture simple : pas de réflexion (réponse plus rapide), si le modèle le permet.
        ...(options.fast && model.includes("flash") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const candidate = json?.candidates?.[0];
  const text: string | undefined = candidate?.content?.parts?.find((p: { text?: string; thought?: boolean }) => p.text && !p.thought)?.text;
  if (!text) throw new Error(`Réponse Gemini vide (${candidate?.finishReason ?? json?.promptFeedback?.blockReason ?? "?"})`);
  const out = JSON.parse(text);
  if (!out || typeof out !== "object") throw new Error("Réponse Gemini mal formée");
  return out as Record<string, unknown>;
}

async function callGemini(prompt: string): Promise<{ title: string; description: string; slug?: string }> {
  const out = await geminiJson(
    [{ text: prompt }],
    {
      type: "OBJECT",
      properties: { title: { type: "STRING" }, description: { type: "STRING" }, slug: { type: "STRING" } },
      required: ["title", "description"],
    },
    { temperature: 0.6 },
  );
  if (typeof out.title !== "string" || typeof out.description !== "string") throw new Error("Réponse Gemini mal formée");
  return { title: out.title.trim().slice(0, 200), description: out.description.trim().slice(0, 10_000), slug: cleanSlug(out.slug) };
}

// ---------------------------------------------------------------------------
//  Scan de carte grise : champs TECHNIQUES uniquement
// ---------------------------------------------------------------------------
const FUELS = ["essence", "diesel", "hybride", "hybride_rechargeable", "electrique", "gpl", "autre"];

const REGISTRATION_PROMPT = `Tu lis la photo d'un certificat d'immatriculation (carte grise) belge ou européen, pour pré-remplir un formulaire de reprise de véhicule.
Extrais UNIQUEMENT ces caractéristiques techniques du véhicule :
- "make" : marque (case D.1)
- "model" : désignation commerciale (case D.3)
- "version" : type, variante ou version (case D.2), tel qu'écrit
- "first_registration" : date de première immatriculation (case B), au format AAAA-MM-JJ
- "fuel" : carburant ou source d'énergie (case P.3)
- "power_kw" : puissance nette maximale en kW (case P.2), nombre entier
- "displacement_cc" : cylindrée en cm³ (case P.1), nombre entier
- "vin" : numéro d'identification du véhicule (case E), 17 caractères
- "is_registration" : true si l'image est bien une carte grise lisible, sinon false.
Ne lis et ne recopie JAMAIS de donnée sur une personne : ni nom, ni prénom, ni adresse du titulaire (cases C.*), ni numéro de plaque, ni aucun autre identifiant personnel.
Si une case est absente, illisible ou incertaine, laisse le champ vide : n'invente rien.
Réponds uniquement avec l'objet JSON demandé.`;

const REGISTRATION_SCHEMA = {
  type: "OBJECT",
  properties: {
    is_registration: { type: "BOOLEAN" },
    make: { type: "STRING" },
    model: { type: "STRING" },
    version: { type: "STRING" },
    first_registration: { type: "STRING" },
    fuel: { type: "STRING", enum: FUELS },
    power_kw: { type: "INTEGER" },
    displacement_cc: { type: "INTEGER" },
    vin: { type: "STRING" },
  },
  required: ["is_registration"],
};

/** Ne renvoie que des valeurs bornées et bien formées (le reste est écarté). */
function cleanRegistration(out: Record<string, unknown>) {
  const text = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);
  const num = (v: unknown, min: number, max: number) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) && n >= min && n <= max ? Math.round(n) : undefined;
  };
  const date = text(out.first_registration, 10);
  const vin = typeof out.vin === "string" ? out.vin.toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
  return {
    readable: out.is_registration === true,
    fields: {
      make: text(out.make, 60),
      model: text(out.model, 80),
      version: text(out.version, 120),
      first_registration: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
      fuel: typeof out.fuel === "string" && FUELS.includes(out.fuel) ? out.fuel : undefined,
      power_kw: num(out.power_kw, 1, 1470), // ≤ 2000 ch une fois converti (limite des formulaires)
      displacement_cc: num(out.displacement_cc, 1, 10_000),
      vin: vin.length === 17 ? vin : undefined,
    },
  };
}

async function readRegistration(image: string, mimeType: string) {
  const out = await geminiJson(
    [{ text: REGISTRATION_PROMPT }, { inlineData: { mimeType, data: image } }],
    REGISTRATION_SCHEMA,
    { temperature: 0, fast: true },
  );
  return cleanRegistration(out);
}

// ---------------------------------------------------------------------------

/** Appelant : admin connecté, utilisateur connecté non admin, ou visiteur anonyme. */
async function caller(authorization: string): Promise<{ userId?: string; admin: boolean } | "error"> {
  // Visiteur : seule la clé publique est envoyée (pas de session) → anonyme,
  // sans appel réseau inutile (une session est toujours un JWT en 3 parties).
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token || token === Deno.env.get("SUPABASE_ANON_KEY") || token.split(".").length !== 3) return { admin: false };
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return { admin: false };
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) return "error";
  return { userId: userData.user.id, admin: isAdmin === true };
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req.headers.get("origin"));
  const reply = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return reply(405, { error: "Méthode non autorisée." });

  // 1) Entrée validée (le type de demande décide des droits requis).
  let input: Input;
  try {
    input = parseInput(await readJson(req));
  } catch (error) {
    if (error instanceof TooLarge) return reply(413, { error: "Requête trop lourde (image de 5 Mo maximum)." });
    return reply(400, { error: error instanceof BadRequest ? error.message : "Requête invalide." });
  }

  // 2) Appelant identifié, avant tout appel payant à Gemini.
  const who = await caller(req.headers.get("authorization") ?? "");
  if (who === "error") return reply(500, { error: "Vérification des droits impossible." });

  // 3a) Scan de carte grise : public, sous quota (l'admin n'y est pas soumis).
  if (input.kind === "registration") {
    if (who.admin) {
      if (overLimit(who.userId!)) return reply(429, { error: "Trop de demandes. Réessayez dans quelques minutes." });
    } else {
      const quota = await consumeScanQuota(req);
      if (quota === "ip") return reply(429, { error: "Trop de scans depuis cet appareil. Réessayez plus tard ou remplissez à la main." });
      if (quota !== "ok") return reply(503, { error: "Le scan est momentanément indisponible. Remplissez le formulaire à la main." });
    }
    try {
      return reply(200, await readRegistration(input.data.image, input.data.mimeType));
    } catch (error) {
      console.error("generate-copy (scan):", error instanceof Error ? error.message : error);
      return reply(502, { error: "Lecture de la carte grise impossible pour le moment. Remplissez à la main." });
    }
  }

  // 3b) Rédaction : réservée à l'admin.
  if (!who.userId) return reply(401, { error: "Connexion requise." });
  if (!who.admin) return reply(403, { error: "Accès réservé à l'administrateur." });
  if (overLimit(who.userId)) return reply(429, { error: "Trop de demandes. Réessayez dans quelques minutes." });
  try {
    return reply(200, await callGemini(buildPrompt(input)));
  } catch (error) {
    console.error("generate-copy:", error instanceof Error ? error.message : error);
    return reply(502, { error: "Le service de rédaction est indisponible. Réessayez dans un instant." });
  }
});
