import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CircleHelp, Hash, Info, Keyboard, PhoneCall, ShieldCheck } from "lucide-react";
import {
  rdvAssurance, rdvCoordonnees, rdvEnvoi, rdvRappel, rdvVehicule, rdvVitrage, rdvVitrages,
} from "@/data/rendezvous";
import {
  formatPlate, isEmailValid, isPhoneValid, isPlateValid, isYearValid, recapRows, toggleVitrage,
  type RdvForm, type VehiculeMode,
} from "@/lib/rendezvous";
import ChoiceButton, { ChoiceGroup } from "@/components/rdv/ChoiceButton";
import GlassDiagram from "@/components/rdv/GlassDiagram";
import RappelPicker from "@/components/rdv/RappelPicker";

// ============================================================================
//  Étapes du formulaire de demande de rappel (page /rendez-vous)
// ----------------------------------------------------------------------------
//  Chaque étape reçoit l'état complet + `update` ; la page gère la navigation,
//  la validation (lib/rendezvous → isStepValid) et l'envoi.
//  Textes : src/data/rendezvous.ts.
// ============================================================================

export interface StepProps {
  form: RdvForm;
  update: (patch: Partial<RdvForm>) => void;
}


export const inputClass =
  "w-full h-12 rounded-xl border-2 border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors";

export const StepTitle = ({ titre, texte }: { titre: string; texte?: string }) => (
  <div className="mb-5">
    <h2 className="font-heading text-xl md:text-2xl font-bold leading-tight">{titre}</h2>
    {texte && <p className="text-muted-foreground text-sm mt-1.5">{texte}</p>}
  </div>
);

const Field = ({ label, error, children, htmlFor }: { label: ReactNode; error?: string | false; children: ReactNode; htmlFor: string }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-semibold mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-destructive text-sm mt-1.5">{error}</p>}
  </div>
);

const Notice = ({ children, icon: Icon = Info }: { children: ReactNode; icon?: typeof Info }) => (
  <p className="flex gap-2.5 items-start text-sm rounded-xl bg-primary/10 border border-primary/20 p-3.5 leading-relaxed">
    <Icon className="w-5 h-5 shrink-0 text-primary" aria-hidden="true" />
    <span>{children}</span>
  </p>
);

// ------------------------------------------------------------------ 1. Coordonnées
export const CoordonneesStep = ({ form, update }: StepProps) => {
  // Erreurs affichées une fois le champ quitté, pas pendant la saisie.
  const [quitte, setQuitte] = useState({ telephone: false, email: false });
  const telErreur = quitte.telephone && form.telephone.trim() !== "" && !isPhoneValid(form.telephone);
  const emailErreur = quitte.email && form.email.trim() !== "" && !isEmailValid(form.email);

  return (
    <>
      <StepTitle titre={rdvCoordonnees.titre} />
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label={rdvCoordonnees.prenom} htmlFor="rdv-prenom">
            <input id="rdv-prenom" value={form.prenom} onChange={(e) => update({ prenom: e.target.value.slice(0, 60) })} autoComplete="given-name" className={inputClass} />
          </Field>
          <Field label={rdvCoordonnees.nom} htmlFor="rdv-nom">
            <input id="rdv-nom" value={form.nom} onChange={(e) => update({ nom: e.target.value.slice(0, 60) })} autoComplete="family-name" className={inputClass} />
          </Field>
        </div>
        <Field label={rdvCoordonnees.telephone} htmlFor="rdv-tel" error={telErreur && rdvCoordonnees.telephoneInvalide}>
          <input
            id="rdv-tel"
            type="tel"
            inputMode="tel"
            value={form.telephone}
            onChange={(e) => update({ telephone: e.target.value.slice(0, 30) })}
            onBlur={() => setQuitte((q) => ({ ...q, telephone: true }))}
            autoComplete="tel"
            placeholder={rdvCoordonnees.telephonePlaceholder}
            aria-invalid={telErreur || undefined}
            className={inputClass}
          />
        </Field>
        <Field
          label={
            <>
              {rdvCoordonnees.email} <span className="font-normal text-muted-foreground">{rdvCoordonnees.emailAide}</span>
            </>
          }
          htmlFor="rdv-email"
          error={emailErreur && rdvCoordonnees.emailInvalide}
        >
          <input
            id="rdv-email"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value.slice(0, 254) })}
            onBlur={() => setQuitte((q) => ({ ...q, email: true }))}
            autoComplete="email"
            aria-invalid={emailErreur || undefined}
            className={inputClass}
          />
        </Field>
      </div>

      <p className="font-semibold mt-7 mb-3">{rdvRappel.question}</p>
      <ChoiceGroup label={rdvRappel.question}>
        <ChoiceButton
          selected={form.rappel === "asap"}
          onClick={() => update({ rappel: "asap" })}
          label={rdvRappel.asap.label}
          texte={rdvRappel.asap.texte}
          icon={PhoneCall}
        />
        <ChoiceButton
          selected={form.rappel === "date"}
          onClick={() => update({ rappel: "date" })}
          label={rdvRappel.date.label}
          texte={rdvRappel.date.texte}
          icon={CalendarDays}
        />
      </ChoiceGroup>
      {form.rappel === "date" && (
        <div className="mt-5 animate-fade-in">
          <RappelPicker
            date={form.rappelDate}
            periode={form.rappelPeriode}
            onChange={(rappelDate, rappelPeriode) => update({ rappelDate, rappelPeriode })}
          />
        </div>
      )}
    </>
  );
};

// ------------------------------------------------------------------ 2. Vitrage
export const VitrageStep = ({ form, update }: StepProps) => {
  const notes = rdvVitrages.filter((v) => v.note && form.vitrages.includes(v.id));
  return (
    <>
      <StepTitle titre={rdvVitrage.titre} texte={rdvVitrage.texte} />
      <ChoiceGroup label={rdvVitrage.titre} multiple>
        {rdvVitrages.map((v) => (
          <ChoiceButton
            key={v.id}
            multiple
            selected={form.vitrages.includes(v.id)}
            onClick={() => update({ vitrages: toggleVitrage(form.vitrages, v.id) })}
            label={v.label}
            texte={v.texte}
            visual={v.zones ? <GlassDiagram zones={v.zones} className="w-full h-full" /> : undefined}
            icon={v.zones ? undefined : CircleHelp}
          />
        ))}
      </ChoiceGroup>
      {notes.map((v) => (
        <div key={v.id} className="mt-4">
          <Notice>{v.note}</Notice>
        </div>
      ))}
    </>
  );
};

// ------------------------------------------------------------------ 3. Assurance
export const AssuranceStep = ({ form, update }: StepProps) => (
  <>
    <StepTitle titre={rdvAssurance.titre} />
    <p className="font-semibold mb-3">{rdvAssurance.question}</p>
    <ChoiceGroup label={rdvAssurance.question} className="grid-cols-3">
      {rdvAssurance.couvertures.map((c) => (
        <ChoiceButton key={c.id} compact selected={form.couverture === c.id} onClick={() => update({ couverture: c.id })} label={c.label} />
      ))}
    </ChoiceGroup>
    {form.couverture && (
      <div className="mt-5">
        <Notice icon={ShieldCheck}>{form.couverture === "non" ? rdvAssurance.sansCouverture : rdvAssurance.rassurance}</Notice>
      </div>
    )}
  </>
);

// ------------------------------------------------------------------ 4. Véhicule (+ consentement)
export const VehiculeStep = ({ form, update }: StepProps) => {
  const modes: { id: VehiculeMode; label: string; icon: typeof Hash }[] = [
    { id: "plaque", label: rdvVehicule.modes.plaque, icon: Hash },
    { id: "manuel", label: rdvVehicule.modes.manuel, icon: Keyboard },
  ];

  return (
    <>
      <StepTitle titre={rdvVehicule.titre} texte={rdvVehicule.texte} />
      <div role="tablist" aria-label="Comment indiquer votre véhicule" className="grid grid-cols-2 gap-2 mb-6">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={form.vehiculeMode === m.id}
            onClick={() => update({ vehiculeMode: m.id })}
            className={`min-h-14 rounded-xl border-2 px-2 py-2 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-semibold leading-tight text-center transition-all ${
              form.vehiculeMode === m.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
          >
            <m.icon className="w-5 h-5" aria-hidden="true" />
            {m.label}
          </button>
        ))}
      </div>

      {form.vehiculeMode === "plaque" && (
        <Field label={rdvVehicule.plaqueLabel} htmlFor="rdv-plaque" error={form.plaque.length >= 4 && !isPlateValid(form.plaque) && rdvVehicule.plaqueInvalide}>
          <input
            id="rdv-plaque"
            value={form.plaque}
            onChange={(e) => update({ plaque: e.target.value.toUpperCase().slice(0, 14) })}
            onBlur={() => isPlateValid(form.plaque) && update({ plaque: formatPlate(form.plaque) })}
            placeholder={rdvVehicule.plaquePlaceholder}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className={`${inputClass} font-heading tracking-[0.15em] uppercase !text-lg h-14`}
          />
          <p className="text-sm text-muted-foreground mt-2">{rdvVehicule.plaqueAide}</p>
        </Field>
      )}

      {form.vehiculeMode === "manuel" && (
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={rdvVehicule.marque} htmlFor="rdv-marque">
              <input id="rdv-marque" value={form.marque} onChange={(e) => update({ marque: e.target.value.slice(0, 40) })} placeholder="Ex. Peugeot" className={inputClass} />
            </Field>
            <Field label={rdvVehicule.modele} htmlFor="rdv-modele">
              <input id="rdv-modele" value={form.modele} onChange={(e) => update({ modele: e.target.value.slice(0, 60) })} placeholder="Ex. 208" className={inputClass} />
            </Field>
          </div>
          <Field label={rdvVehicule.annee} htmlFor="rdv-annee" error={!isYearValid(form.annee) && form.annee.length === 4 && rdvVehicule.anneeInvalide}>
            <input
              id="rdv-annee"
              value={form.annee}
              onChange={(e) => update({ annee: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              inputMode="numeric"
              placeholder="Ex. 2019"
              className={`${inputClass} max-w-[10rem]`}
            />
          </Field>
        </div>
      )}

      {/* Pot de miel : masqué aux humains et aux lecteurs d'écran. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="rdv-website">Site web</label>
        <input id="rdv-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update({ website: e.target.value })} />
      </div>

      <label className="flex gap-3 items-start text-sm mt-7 cursor-pointer">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update({ consent: e.target.checked })}
          className="w-5 h-5 mt-0.5 accent-[hsl(var(--primary))] shrink-0"
        />
        <span>
          {rdvEnvoi.consentement}{" "}
          <Link to="/politique-de-confidentialite" target="_blank" className="text-primary underline underline-offset-2">
            {rdvEnvoi.consentementLien}
          </Link>
          .
        </span>
      </label>
    </>
  );
};

// ------------------------------------------------------------------ Récapitulatif (confirmation)
export const Recap = ({ form }: { form: RdvForm }) => (
  <dl className="rounded-xl border border-border overflow-hidden text-sm">
    {recapRows(form).map(([k, v]) => (
      <div key={k} className="flex justify-between gap-4 px-4 py-3 border-b border-border last:border-b-0 bg-card">
        <dt className="text-muted-foreground shrink-0">{k}</dt>
        <dd className="font-semibold text-right break-words min-w-0">{v}</dd>
      </div>
    ))}
  </dl>
);
