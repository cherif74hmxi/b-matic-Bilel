import { useCallback, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Loader2, PhoneCall } from "lucide-react";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { legalInfo } from "@/data/legal";
import { RDV_PATH } from "@/data/rdv";
import { rdvConfirmation, rdvEnvoi, rdvEtapes, rdvIntro } from "@/data/rendezvous";
import { sendLead } from "@/lib/leads";
import { buildDetails, emptyRdvForm, isStepValid, rappelPhrase, type RdvForm } from "@/lib/rendezvous";
import StepProgress from "@/components/rdv/StepProgress";
import { AssuranceStep, CoordonneesStep, Recap, VehiculeStep, VitrageStep } from "@/components/rdv/RdvSteps";

// ============================================================================
//  /rendez-vous — demande de rappel pare-brise, un écran par étape
// ----------------------------------------------------------------------------
//  1 Coordonnées (+ quand rappeler) · 2 Vitrage · 3 Assurance · 4 Véhicule,
//  puis confirmation. Aucune heure n'est réservée en ligne : le garage
//  rappelle pour fixer le rendez-vous. Aucun document n'est demandé.
//  Envoi : double envoi classique (sendLead) → e-mail Formspree + demande
//  dans Supabase (leads, type « rdv »).
// ============================================================================

const FORMSPREE_URL = "https://formspree.io/f/xlgokywp";
const LAST_STEP = rdvEtapes.length;

const RendezVous = () => {
  useSeo({ ...pagesSeo[RDV_PATH] });
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RdvForm>(emptyRdvForm);
  const update = useCallback((patch: Partial<RdvForm>) => setForm((f) => ({ ...f, ...patch })), []);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const valid = isStepValid(form, step);

  const goto = (n: number) => {
    setStep(n);
    setMessage("");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const done = () => {
    setSent(true);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async () => {
    // Pot de miel rempli : un robot. Faux succès, rien n'est envoyé.
    if (form.website) return done();

    setSending(true);
    setMessage("");
    const details = buildDetails(form);
    const name = `${form.prenom.trim()} ${form.nom.trim()}`;
    const phone = form.telephone.trim();
    const email = form.email.trim();

    try {
      const ok = await sendLead(
        () =>
          fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
              _subject: `Rappel pare-brise — ${name} — ${details["Rappel"]}`,
              Nom: name,
              Téléphone: phone,
              // Facultatif : champ omis s'il est vide (Formspree s'en sert comme adresse de réponse).
              ...(email ? { email } : {}),
              ...details,
            }),
          }),
        { type: "rdv", name, email, phone, details },
      );
      if (!ok) {
        setMessage(rdvEnvoi.erreur);
        return;
      }
      done();
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    if (step < LAST_STEP) goto(step + 1);
    else void submit();
  };

  // ------------------------------------------------------------ Confirmation
  if (sent) {
    return (
      <div ref={top} className="pt-24 pb-16 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-success/10 text-success grid place-items-center mx-auto mb-5">
              <Check className="w-8 h-8" aria-hidden="true" />
            </div>
            <h1 className="font-heading text-xl md:text-3xl font-bold leading-snug mb-3" style={{ textWrap: "balance" }}>
              {rdvConfirmation.titre}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed" role="status">
              {rdvConfirmation.texte(form.telephone.trim(), rappelPhrase(form))}
            </p>
          </div>

          <Recap form={form} />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a href={legalInfo.phoneHref} className="btn-ghost min-h-12">
              <PhoneCall className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
            </a>
            <Link to="/" className="btn-main min-h-12">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ Formulaire
  return (
    <div ref={top} className="pt-24 pb-12 md:pb-20 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <header className="text-center mb-6">
          <h1 className="font-heading text-2xl md:text-4xl font-bold leading-tight" style={{ textWrap: "balance" }}>
            {rdvIntro.titre}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{rdvIntro.texte}</p>
        </header>

        <form onSubmit={onSubmit} noValidate className="relative rounded-2xl border border-border bg-card p-5 md:p-8">
          <StepProgress step={step} labels={rdvEtapes} />

          {message && (
            <p role="alert" className="mb-5 p-4 rounded-xl text-sm bg-destructive/10 text-destructive border border-destructive/30">
              {message}
            </p>
          )}

          <div key={step} className="animate-fade-in">
            {step === 1 && <CoordonneesStep form={form} update={update} />}
            {step === 2 && <VitrageStep form={form} update={update} />}
            {step === 3 && <AssuranceStep form={form} update={update} />}
            {step === 4 && <VehiculeStep form={form} update={update} />}
          </div>

          {/* Navigation : collée en bas de l'écran sur mobile, sous l'étape sur ordinateur. */}
          <div
            className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-border bg-background/95 backdrop-blur-xl px-4 pt-3 md:static md:z-auto md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {step > 1 && (
              <button type="button" onClick={() => goto(step - 1)} className="btn-ghost min-h-14 !px-5" aria-label="Étape précédente">
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                <span className="hidden sm:inline">Retour</span>
              </button>
            )}
            <button type="submit" disabled={!valid || sending} className="btn-main min-h-14 flex-1 !text-sm">
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> {rdvEnvoi.envoi}
                </>
              ) : step < LAST_STEP ? (
                <>
                  Continuer <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </>
              ) : (
                rdvEnvoi.envoyer
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RendezVous;
