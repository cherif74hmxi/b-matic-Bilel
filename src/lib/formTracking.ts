// ============================================================================
//  Progression dans les formulaires (/rendez-vous, Contact) — SANS cookie
// ----------------------------------------------------------------------------
//  Mesure d'audience interne et anonyme : qui commence un formulaire, à quelle
//  étape il s'arrête, qui va au bout. Une ligne par événement dans form_events,
//  avec le numéro de visite (session_id) et l'origine de la visite
//  (attribution.ts). JAMAIS ce que la personne saisit (ni nom, ni téléphone…).
//    · start  : première saisie dans le formulaire (1 fois par onglet), étape 1 ;
//    · step   : arrivée sur une étape jamais atteinte dans cet onglet
//               (un retour en arrière puis en avant ne compte pas deux fois) ;
//    · submit : demande bien envoyée (avec le n° de la dernière étape).
//  Silencieux : envoi keepalive sans attendre la réponse, aucune erreur ne
//  remonte. Désactivé en développement et pour les navigateurs automatisés,
//  comme PageViewTracker.
// ============================================================================
import { getAttribution, getSessionId } from "@/lib/attribution";
import { insertPublicRow } from "@/lib/publicInsert";

export type TrackedForm = "rdv" | "contact";

const STORAGE_KEY = "bmatic-form-progress";

/** Plus haute étape atteinte par formulaire dans cet onglet (absent = pas commencé). */
type Progress = Partial<Record<TrackedForm, number>>;

/** Repli si le stockage est indisponible. */
let memory: Progress = {};

const enabled = () => !import.meta.env.DEV && !navigator.webdriver;

function readProgress(): Progress {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return memory;
  }
}

function saveProgress(form: TrackedForm, step: number): void {
  memory = { ...readProgress(), [form]: step };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // Stockage indisponible : progression gardée en mémoire.
  }
}

function send(form: TrackedForm, event: "start" | "step" | "submit", step: number, label: string): void {
  void insertPublicRow("form_events", {
    session_id: getSessionId(),
    form,
    event,
    step,
    step_label: label.slice(0, 80),
    ...getAttribution(),
  });
}

/** Première saisie dans le formulaire. À appeler à chaque saisie : seule la première compte. */
export function trackFormStart(form: TrackedForm, label: string): void {
  if (!enabled() || readProgress()[form]) return;
  saveProgress(form, 1);
  send(form, "start", 1, label);
}

/** Arrivée sur l'étape n (2, 3…), comptée seulement si elle n'a jamais été atteinte. */
export function trackFormStep(form: TrackedForm, step: number, label: string): void {
  if (!enabled() || (readProgress()[form] ?? 0) >= step) return;
  saveProgress(form, step);
  send(form, "step", step, label);
}

/** Demande bien envoyée, depuis l'étape n (la dernière). */
export function trackFormSubmit(form: TrackedForm, step: number, label: string): void {
  if (!enabled()) return;
  send(form, "submit", step, label);
}
