// ============================================================================
//  Email de confirmation de la demande de rappel (/rendez-vous) — via Brevo
// ----------------------------------------------------------------------------
//  POST /api/confirmation-rdv, appelé par le formulaire APRÈS l'envoi réussi
//  de la demande, seulement si le client a donné son email
//  (src/lib/confirmationRdv.ts). Textes : src/data/rendezvous.ts → rdvEmail.
//
//  Clé Brevo dans le .env du VPS (BREVO_API_KEY, sans préfixe VITE_) : elle
//  n'est jamais dans le site. Sans clé : réponse 503, le formulaire n'affiche
//  simplement pas « e-mail envoyé ».
//
//  Anti-abus (l'adresse de destination vient du visiteur) : même origine
//  seulement, pot de miel, contenu fixe (aucun texte libre ni lien, prénom
//  filtré), limites par IP, par destinataire et par jour.
// ============================================================================
import type { Request, Response } from "express";
import { legalInfo } from "@/data/legal";
import { rdvAssurance, rdvEmail, rdvRappel, rdvVitrages, type CouvertureId, type PeriodeId, type VitrageId } from "@/data/rendezvous";
import {
  couvertureLabel, emptyRdvForm, isEmailValid, rappelLabel, rappelPhrase, vitragesLabel, type RdvForm,
} from "@/lib/rendezvous";

/** Limites d'envoi (mémoire du serveur, remises à zéro à chaque redémarrage). */
export const LIMITES = {
  parIp: { max: 5, fenetreMs: 60 * 60 * 1000 },
  parDestinataire: { max: 3, fenetreMs: 24 * 60 * 60 * 1000 },
  // Sous les 300 emails/jour de l'offre gratuite Brevo.
  total: { max: 200, fenetreMs: 24 * 60 * 60 * 1000 },
};

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export interface Confirmation {
  email: string;
  /** Vide si le prénom reçu n'est pas un prénom plausible. */
  prenom: string;
  /** Vide si le numéro reçu n'est pas un numéro plausible. */
  telephone: string;
  form: RdvForm;
}

const isIsoDate = (d: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(`${d}T00:00:00Z`)) &&
  new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) === d;

/** Valide et nettoie la demande reçue ; null = refusée. */
export function parseConfirmation(body: unknown): Confirmation | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");

  if (str("website")) return null; // pot de miel rempli : un robot
  const email = str("email");
  if (email.length > 254 || !isEmailValid(email)) return null;

  // Prénom : lettres, espaces, apostrophes et tirets seulement, sinon omis.
  const p = str("prenom").slice(0, 40);
  const prenom = /^\p{L}[\p{L}' -]*$/u.test(p) ? p : "";
  const t = str("telephone");
  const telephone = /^[0-9+ ./()-]{8,25}$/.test(t) && t.replace(/\D/g, "").length >= 8 ? t : "";

  const form: RdvForm = { ...emptyRdvForm, email };
  const rappel = str("rappel");
  const periode = str("rappelPeriode");
  if (rappel === "asap") form.rappel = "asap";
  else if (rappel === "date" && isIsoDate(str("rappelDate")) && rdvRappel.periodes.some((x) => x.id === periode)) {
    form.rappel = "date";
    form.rappelDate = str("rappelDate");
    form.rappelPeriode = periode as PeriodeId;
  } else return null;

  const vitrages = Array.isArray(b.vitrages) ? b.vitrages : [];
  form.vitrages = rdvVitrages.filter((v) => vitrages.includes(v.id)).map((v) => v.id as VitrageId);
  const couverture = str("couverture");
  if (rdvAssurance.couvertures.some((c) => c.id === couverture)) form.couverture = couverture as CouvertureId;

  return { email, prenom, telephone, form };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Sujet, version texte et version HTML de l'email. */
export function buildConfirmationEmail(c: Confirmation): { subject: string; text: string; html: string } {
  const bonjour = c.prenom ? `Bonjour ${c.prenom},` : "Bonjour,";
  const appel = rdvEmail.appel(c.telephone, rappelPhrase(c.form));
  const rows = ([
    ["Rappel", rappelLabel(c.form)],
    ["Vitrage", vitragesLabel(c.form)],
    ["Bris de glace", couvertureLabel(c.form)],
  ] as [string, string][]).filter(([, v]) => v);
  const adresse = legalInfo.address;

  const text = [
    bonjour,
    "",
    appel,
    "",
    `${rdvEmail.recapTitre} :`,
    ...rows.map(([k, v]) => `- ${k} : ${v}`),
    "",
    rdvEmail.question,
    "",
    rdvEmail.signature,
    adresse,
    "",
    rdvEmail.mention,
  ].join("\n");

  // Email : styles en ligne et couleurs fixes (violet du logo), les jetons
  // CSS du site n'existent pas dans une messagerie.
  const e = escapeHtml;
  const recap = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 0;border-top:1px solid #ece9f3;color:#6b6880;font-size:14px;vertical-align:top;width:110px">${e(k)}</td>` +
        `<td style="padding:10px 0;border-top:1px solid #ece9f3;font-size:14px;font-weight:bold">${e(v)}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(rdvEmail.sujet)}</title></head>
<body style="margin:0;padding:0;background:#f5f4f8;font-family:Arial,Helvetica,sans-serif;color:#1c1a2b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f8"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;border-top:4px solid #7b39eb">
<tr><td style="padding:28px 24px">
<p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#7b39eb">B MATIC</p>
<h1 style="margin:0 0 18px;font-size:22px;line-height:1.3">${e(rdvEmail.titre)}</h1>
<p style="margin:0 0 12px;font-size:15px;line-height:1.6">${e(bonjour)}</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6">${e(appel)}</p>
<p style="margin:0 0 4px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#7b39eb">${e(rdvEmail.recapTitre)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">${recap}</table>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6">${e(rdvEmail.question)}</p>
<p style="margin:0;font-size:15px;line-height:1.6">${e(rdvEmail.signature)}<br><span style="color:#6b6880;font-size:13px">${e(adresse)}</span></p>
</td></tr></table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#6b6880">${e(rdvEmail.mention)}</p>
</td></tr></table>
</body></html>`;

  return { subject: rdvEmail.sujet, text, html };
}

/** Limiteur à fenêtre glissante : renvoie false quand `max` est atteint. */
export function createLimiter(max: number, fenetreMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < fenetreMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    // Ménage de temps en temps pour ne pas grossir indéfiniment.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.every((t) => now - t >= fenetreMs)) hits.delete(k);
    }
    return true;
  };
}

/** Même origine : la requête doit venir d'une page du site lui-même. */
function isSameOrigin(req: Request): boolean {
  const origin = req.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.get("host");
  } catch {
    return false;
  }
}

/** Route Express POST /api/confirmation-rdv (à monter derrière express.json()). */
export function confirmationHandler(env: NodeJS.ProcessEnv = process.env) {
  const apiKey = env.BREVO_API_KEY;
  const from = env.MAIL_FROM || "contact@bmatic-pare-brise.com";
  const replyTo = env.MAIL_REPLY_TO || legalInfo.email;
  const parIp = createLimiter(LIMITES.parIp.max, LIMITES.parIp.fenetreMs);
  const parDestinataire = createLimiter(LIMITES.parDestinataire.max, LIMITES.parDestinataire.fenetreMs);
  const total = createLimiter(LIMITES.total.max, LIMITES.total.fenetreMs);

  return async (req: Request, res: Response) => {
    if (!isSameOrigin(req)) return res.status(403).json({ ok: false });
    if (!apiKey) return res.status(503).json({ ok: false });
    const c = parseConfirmation(req.body);
    if (!c) return res.status(400).json({ ok: false });
    if (!parIp(req.ip ?? "?") || !parDestinataire(c.email.toLowerCase()) || !total("*")) {
      return res.status(429).json({ ok: false });
    }

    const mail = buildConfirmationEmail(c);
    try {
      const r = await fetch(BREVO_URL, {
        method: "POST",
        headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          sender: { name: rdvEmail.expediteur, email: from },
          to: [{ email: c.email }],
          replyTo: { name: rdvEmail.expediteur, email: replyTo },
          subject: mail.subject,
          textContent: mail.text,
          htmlContent: mail.html,
          tags: ["confirmation-rdv"],
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) {
        // Pas de donnée personnelle dans les logs : seulement l'erreur Brevo.
        console.error(`Brevo : envoi refusé (${r.status})`, (await r.text()).slice(0, 300));
      }
      return res.status(r.ok ? 202 : 502).json({ ok: r.ok });
    } catch (err) {
      console.error("Brevo : injoignable", err instanceof Error ? err.message : err);
      return res.status(502).json({ ok: false });
    }
  };
}
