// ============================================================================
//  Edge Function « generate-copy » — rédaction assistée (Gemini) pour l'admin
// ----------------------------------------------------------------------------
//  POST { kind: "vehicle", data: { make, model, … } }  ou  { kind: "post", data: { topic, draft } }
//  → 200 { title, description }
//
//  Sécurité :
//   · la clé GEMINI_API_KEY est un SECRET Supabase (jamais envoyée au navigateur) ;
//   · l'appelant doit être connecté (JWT) ET admin (fonction SQL is_admin)
//     AVANT tout appel à Gemini, sinon 401 / 403 ;
//   · entrée validée et bornée ; seules les caractéristiques du véhicule ou le
//     sujet de l'actu sont envoyés à Gemini (aucune donnée de client).
//
//  Secrets / variables (supabase secrets set …) :
//   GEMINI_API_KEY   (obligatoire)
//   GEMINI_MODEL     (facultatif, défaut ci-dessous)
//   ALLOWED_ORIGINS  (facultatif : « https://bmatic.be,http://localhost:8080 » ; défaut *)
//  SUPABASE_URL et SUPABASE_ANON_KEY sont fournis automatiquement par Supabase.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const DEFAULT_MODEL = "gemini-2.5-flash";
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
type Input = { kind: "vehicle"; data: VehicleData } | { kind: "post"; data: PostData };

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
  throw new BadRequest("Type inconnu (vehicle ou post).");
}

// ---------------------------------------------------------------------------
//  Consignes pour Gemini
// ---------------------------------------------------------------------------
const COMMON = `Tu rédiges pour B MATIC, un garage automobile en Belgique (mécanique, dépannage, reprise et vente de véhicules d'occasion).
Écris en français de Belgique, naturel et professionnel, sans emphase publicitaire ni superlatifs creux, sans emoji, sans markdown.
N'invente AUCUNE information : n'utilise que les éléments fournis. Si une information manque (entretien, options, garantie, état…), n'en parle pas.
Réponds uniquement avec l'objet JSON demandé.`;

function buildPrompt(input: Input): string {
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
- "description" : 3 à 5 courts paragraphes séparés par une ligne vide (900 caractères maximum). Présente le véhicule, ses caractéristiques fournies, puis invite à contacter le garage pour un essai.

Caractéristiques fournies :
${facts}`;
  }
  const d = input.data;
  return `${COMMON}

Rédige une actualité (article court) pour le site du garage.
- "title" : titre clair (80 caractères maximum).
- "description" : le texte de l'article, 3 à 6 paragraphes séparés par une ligne vide (2500 caractères maximum).

Sujet : ${d.topic}
${d.draft ? `Notes / brouillon du garage (à reformuler, sans rien ajouter d'inventé) :\n${d.draft}` : ""}`;
}

// ---------------------------------------------------------------------------
//  Appel Gemini (sortie JSON structurée)
// ---------------------------------------------------------------------------
async function callGemini(prompt: string): Promise<{ title: string; description: string }> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY manquante");
  const model = Deno.env.get("GEMINI_MODEL") || DEFAULT_MODEL;

  const res = await fetch(`${GEMINI_API_BASE}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        // Large : les modèles « à réflexion » (2.5) décomptent aussi leurs jetons de réflexion.
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: { title: { type: "STRING" }, description: { type: "STRING" } },
          required: ["title", "description"],
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const candidate = json?.candidates?.[0];
  const text: string | undefined = candidate?.content?.parts?.find((p: { text?: string; thought?: boolean }) => p.text && !p.thought)?.text;
  if (!text) throw new Error(`Réponse Gemini vide (${candidate?.finishReason ?? json?.promptFeedback?.blockReason ?? "?"})`);
  const out = JSON.parse(text) as { title?: unknown; description?: unknown };
  if (typeof out.title !== "string" || typeof out.description !== "string") throw new Error("Réponse Gemini mal formée");
  return { title: out.title.trim().slice(0, 200), description: out.description.trim().slice(0, 10_000) };
}

// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  const cors = corsHeaders(req.headers.get("origin"));
  const reply = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return reply(405, { error: "Méthode non autorisée." });

  // 1) Appelant authentifié…
  const authorization = req.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return reply(401, { error: "Connexion requise." });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(authorization.slice(7));
  if (userError || !userData.user) return reply(401, { error: "Session invalide ou expirée." });

  // 2) … ET admin (même règle que la RLS), avant tout appel payant à Gemini.
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) return reply(500, { error: "Vérification des droits impossible." });
  if (isAdmin !== true) return reply(403, { error: "Accès réservé à l'administrateur." });

  // 3) Entrée validée.
  let input: Input;
  try {
    input = parseInput(await req.json());
  } catch (error) {
    return reply(400, { error: error instanceof BadRequest ? error.message : "Requête invalide." });
  }

  // 4) Garde-fou de fréquence, puis génération.
  if (overLimit(userData.user.id)) return reply(429, { error: "Trop de demandes. Réessayez dans quelques minutes." });
  try {
    return reply(200, await callGemini(buildPrompt(input)));
  } catch (error) {
    console.error("generate-copy:", error instanceof Error ? error.message : error);
    return reply(502, { error: "Le service de rédaction est indisponible. Réessayez dans un instant." });
  }
});
