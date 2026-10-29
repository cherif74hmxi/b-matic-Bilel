import { useCallback, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, ChevronLeft, ChevronRight, Loader2, PhoneCall } from "lucide-react";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { legalInfo } from "@/data/legal";
import { RDV_PATH, rdvTextes } from "@/data/rdv";
import { rdvConfirmation, rdvCoordonnees, rdvEtapes, rdvIntro } from "@/data/rendezvous";
import { bookRdv } from "@/lib/rdv";
import { sendLead } from "@/lib/leads";
import {
  buildDetails, emptyRdvForm, heureLabel, isStepValid, longDate, newReference, type RdvForm,
} from "@/lib/rendezvous";
import StepProgress from "@/components/rdv/StepProgress";
import DocumentsUpload from "@/components/rdv/DocumentsUpload";
import {
  AssuranceStep, BesoinStep, CoordonneesStep, CreneauStep, LieuStep, Recap, VehiculeStep,
} from "@/components/rdv/RdvSteps";

// ============================================================================
//  /rendez-vous — devis et rendez-vous pare-brise, un écran par étape
// ----------------------------------------------------------------------------
//  1 Besoin · 2 Véhicule · 3 Assurance · 4 Lieu · 5 Créneau · 6 Coordonnées,
//  puis confirmation. Les documents (carte grise, attestation d'assurance) ne
//  sont proposés QU'APRÈS la réservation, et restent facultatifs.
//  Envoi : réservation + demande dans Supabase (book_rdv), puis e-mail
//  Formspree. Agenda injoignable → double envoi classique (sendLead),
//  « créneau à confirmer ».
// ============================================================================

const FORMSPREE_URL = "https://formspree.io/f/xlgokywp";
const LAST_STEP = rdvEtapes.length;

type Result = { booked: boolean };

const RendezVous = () => {
  useSeo({ ...pagesSeo[RDV_PATH] });
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RdvForm>(emptyRdvForm);
  const update = useCallback((patch: Partial<RdvForm>) => setForm((f) => ({ ...f, ...patch })), []);
  // Nom du dossier des documents : tiré une fois, enregistré avec la demande.
  const [reference] = useState(newReference);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const valid = isStepValid(form, step);

  const goto = (n: number) => {
    setStep(n);
    setMessage("");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const done = (r: Result) => {
    setResult(r);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async () => {
    // Pot de miel rempli : un robot. Faux succès, rien n'est envoyé.
    if (form.website) return done({ booked: true });

    setSending(true);
    setMessage("");
    const details = buildDetails(form, reference);
    const name = `${form.prenom.trim()} ${form.nom.trim()}`;
    const sendMail = (extra: Record<string, string> = {}) =>
      fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `RDV pare-brise — ${details["Date"]} ${details["Heure"]}`,
          Nom: name,
          Téléphone: form.telephone.trim(),
          email: form.email.trim(),
          ...details,
          ...extra,
        }),
      });

    try {
      const booking = await bookRdv({
        date: form.date,
        hour: form.hour ?? 0,
        name,
        email: form.email,
        phone: form.telephone,
        details,
      });

      if (booking === "taken" || booking === "invalid") {
        update({ hour: null });
        setRefreshKey((k) => k + 1);
        goto(5);
        setMessage(booking === "taken" ? rdvTextes.creneauPris : rdvTextes.creneauInvalide);
        return;
      }
      if (booking === "limit") {
        setMessage(rdvTextes.limite);
        return;
      }
      if (booking === "ok") {
        // Déjà dans l'agenda : l'e-mail n'est qu'une notification.
        await sendMail({ Créneau: "Réservé dans l'agenda" }).catch(() => undefined);
        return done({ booked: true });
      }
      // Agenda injoignable : la demande part quand même, créneau à confirmer.
      const creneau = "À CONFIRMER (agenda en ligne indisponible)";
      const ok = await sendLead(() => sendMail({ Créneau: creneau }), {
        type: "rdv",
        name,
        email: form.email,
        phone: form.telephone,
        details: { ...details, Créneau: creneau },
      });
      if (!ok) {
        setMessage(rdvCoordonnees.erreur);
        return;
      }
      done({ booked: false });
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
  if (result) {
    const quand = form.date && form.hour !== null ? `${longDate(form.date)} à ${heureLabel(form.hour)}` : "";
    return (
      <div ref={top} className="pt-24 pb-16 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-neon text-primary-foreground grid place-items-center mx-auto mb-5 shadow-lg">
              <CalendarCheck className="w-8 h-8" aria-hidden="true" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">
              {result.booked ? rdvConfirmation.titreReserve : rdvConfirmation.titreDemande}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed" role="status">
              {result.booked
                ? rdvConfirmation.texteReserve(form.prenom.trim(), quand)
                : rdvConfirmation.texteDemande(form.prenom.trim())}
            </p>
          </div>

          <div className="mb-8">
            <Recap form={form} />
          </div>

          {!form.website && <DocumentsUpload reference={reference} />}

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
            <span className="text-gradient-neon">{rdvIntro.titre}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{rdvIntro.texte}</p>
        </header>

        <form onSubmit={onSubmit} noValidate className="relative rounded-2xl border border-border bg-card/60 p-5 md:p-8 shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.25)]">
          <StepProgress step={step} labels={rdvEtapes} />

          {message && (
            <p role="alert" className="mb-5 p-4 rounded-xl text-sm bg-destructive/10 text-destructive border border-destructive/30">
              {message}
            </p>
          )}

          <div key={step} className="animate-fade-in">
            {step === 1 && <BesoinStep form={form} update={update} />}
            {step === 2 && <VehiculeStep form={form} update={update} />}
            {step === 3 && <AssuranceStep form={form} update={update} />}
            {step === 4 && <LieuStep form={form} update={update} />}
            {step === 5 && <CreneauStep form={form} update={update} refreshKey={refreshKey} />}
            {step === 6 && <CoordonneesStep form={form} update={update} />}
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
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> {rdvCoordonnees.envoi}
                </>
              ) : step < LAST_STEP ? (
                <>
                  Continuer <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </>
              ) : (
                rdvCoordonnees.envoyer
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RendezVous;
