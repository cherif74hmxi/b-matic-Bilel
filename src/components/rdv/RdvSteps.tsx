import { lazy, Suspense, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Building2, Camera, CircleHelp, Hash, Home, Info, Keyboard, MapPin, ShieldCheck, Loader2,
} from "lucide-react";
import { assureurs } from "@/data/assurances";
import {
  rdvAssurance, rdvBesoins, rdvCoordonnees, rdvCreneau, rdvLieu, rdvVehicule,
} from "@/data/rendezvous";
import {
  formatPlate, isEmailValid, isInZone, isPhoneValid, isPlateValid, isPostalCodeValid, isYearValid,
  recapRows, SCAN_ENABLED, type RdvForm, type VehiculeMode,
} from "@/lib/rendezvous";
import type { RegistrationScan } from "@/lib/registrationScan";
import ChoiceButton, { ChoiceGroup } from "@/components/rdv/ChoiceButton";
import GlassDiagram from "@/components/rdv/GlassDiagram";
import SlotPicker from "@/components/rdv/SlotPicker";

// ============================================================================
//  Étapes du formulaire de devis / rendez-vous (page /rendez-vous)
// ----------------------------------------------------------------------------
//  Chaque étape reçoit l'état complet + `update` ; la page gère la navigation,
//  la validation (lib/rendezvous → isStepValid) et l'envoi.
//  Textes : src/data/rendezvous.ts.
// ============================================================================

// Scanner chargé à la demande (il embarque le client Supabase).
const RegistrationScanner = lazy(() => import("@/components/RegistrationScanner"));

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

const Field = ({ label, error, children, htmlFor }: { label: string; error?: string | false; children: ReactNode; htmlFor: string }) => (
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

// ------------------------------------------------------------------ 1. Besoin
export const BesoinStep = ({ form, update }: StepProps) => {
  const besoin = rdvBesoins.find((b) => b.id === form.besoin);
  return (
    <>
      <StepTitle titre="De quoi avez-vous besoin ?" />
      <ChoiceGroup label="Votre besoin">
        {rdvBesoins.map((b) => (
          <ChoiceButton
            key={b.id}
            selected={form.besoin === b.id}
            onClick={() => update({ besoin: b.id, sousChoix: form.besoin === b.id ? form.sousChoix : "" })}
            label={b.label}
            texte={b.texte}
            visual={b.zones ? <GlassDiagram zones={b.zones} className="w-full h-full" /> : undefined}
            icon={b.zones ? undefined : CircleHelp}
          />
        ))}
      </ChoiceGroup>
      {besoin?.sousChoix && (
        <div className="mt-6 animate-fade-in">
          <p className="font-semibold mb-3">{besoin.sousQuestion}</p>
          <ChoiceGroup label={besoin.sousQuestion ?? besoin.label} className="grid-cols-2">
            {besoin.sousChoix.map((s) => (
              <ChoiceButton
                key={s.id}
                compact
                selected={form.sousChoix === s.id}
                onClick={() => update({ sousChoix: s.id })}
                label={s.label}
                texte={s.texte}
                visual={s.zones ? <GlassDiagram zones={s.zones} className="w-full h-full" /> : undefined}
              />
            ))}
          </ChoiceGroup>
        </div>
      )}
      {besoin?.note && (
        <div className="mt-4">
          <Notice>{besoin.note}</Notice>
        </div>
      )}
    </>
  );
};

// ------------------------------------------------------------------ 2. Véhicule
export const VehiculeStep = ({ form, update }: StepProps) => {
  const modes: { id: VehiculeMode; label: string; icon: typeof Hash }[] = [
    { id: "plaque", label: rdvVehicule.modes.plaque, icon: Hash },
    ...(SCAN_ENABLED ? [{ id: "scan" as const, label: rdvVehicule.modes.scan, icon: Camera }] : []),
    { id: "manuel", label: rdvVehicule.modes.manuel, icon: Keyboard },
  ];
  const onScan = (scan: RegistrationScan) =>
    update({
      vehiculeMode: "manuel",
      marque: scan.make ?? form.marque,
      modele: scan.model ?? form.modele,
      annee: scan.year ? String(scan.year) : form.annee,
      vin: scan.vin ?? "",
    });

  return (
    <>
      <StepTitle titre={rdvVehicule.titre} texte={rdvVehicule.texte} />
      <div role="tablist" aria-label="Comment indiquer votre véhicule" className={`grid gap-2 mb-6 ${modes.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
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

      {form.vehiculeMode === "scan" && (
        <Suspense
          fallback={
            <div className="grid place-items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="Chargement" />
            </div>
          }
        >
          <RegistrationScanner onResult={onScan} onError={() => update({ vehiculeMode: "manuel" })} />
          <p className="text-xs text-muted-foreground text-center mt-3">{rdvVehicule.scanFacultatif}</p>
        </Suspense>
      )}

      {form.vehiculeMode === "manuel" && (
        <div className="grid gap-4">
          {form.vin && <Notice icon={ShieldCheck}>Carte grise lue : vérifiez les champs ci-dessous.</Notice>}
          <div className="grid grid-cols-2 gap-3">
            <Field label={rdvVehicule.marque} htmlFor="rdv-marque">
              <input id="rdv-marque" value={form.marque} onChange={(e) => update({ marque: e.target.value.slice(0, 40) })} placeholder="Ex. Peugeot" className={inputClass} />
            </Field>
            <Field label={rdvVehicule.modele} htmlFor="rdv-modele">
              <input id="rdv-modele" value={form.modele} onChange={(e) => update({ modele: e.target.value.slice(0, 60) })} placeholder="Ex. 208" className={inputClass} />
            </Field>
          </div>
          <Field label={`${rdvVehicule.annee} (facultatif)`} htmlFor="rdv-annee" error={!isYearValid(form.annee) && form.annee.length === 4 && "Année invalide."}>
            <input
              id="rdv-annee"
              value={form.annee}
              onChange={(e) => update({ annee: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              inputMode="numeric"
              placeholder="Ex. 2019"
              className={`${inputClass} max-w-[10rem]`}
            />
          </Field>
          <p className="text-sm text-muted-foreground">{rdvVehicule.manuelAide}</p>
        </div>
      )}
    </>
  );
};

// ------------------------------------------------------------------ 3. Assurance
export const AssuranceStep = ({ form, update }: StepProps) => {
  const noms = [...assureurs.map((a) => a.nom), rdvAssurance.assureurAutre];
  return (
    <>
      <StepTitle titre={rdvAssurance.titre} />
      <p className="font-semibold mb-3">{rdvAssurance.question}</p>
      <ChoiceGroup label={rdvAssurance.question} className="grid-cols-3">
        {rdvAssurance.couvertures.map((c) => (
          <ChoiceButton key={c.id} compact selected={form.couverture === c.id} onClick={() => update({ couverture: c.id })} label={c.label} />
        ))}
      </ChoiceGroup>

      {form.couverture && form.couverture !== "non" && (
        <div className="mt-6 animate-fade-in">
          <p className="font-semibold mb-1">
            {rdvAssurance.assureurQuestion}
            {form.couverture === "inconnu" && <span className="font-normal text-muted-foreground"> (facultatif)</span>}
          </p>
          <p className="text-sm text-muted-foreground mb-3">{rdvAssurance.aide}</p>
          <div role="radiogroup" aria-label={rdvAssurance.assureurQuestion} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {noms.map((nom) => (
              <button
                key={nom}
                type="button"
                role="radio"
                aria-checked={form.assureur === nom}
                onClick={() => update({ assureur: form.assureur === nom && form.couverture === "inconnu" ? "" : nom })}
                className={`min-h-12 rounded-xl border-2 px-3 text-sm font-semibold transition-all ${
                  form.assureur === nom ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {nom}
              </button>
            ))}
          </div>
          {form.assureur === rdvAssurance.assureurAutre && (
            <input
              aria-label={rdvAssurance.assureurAutrePlaceholder}
              value={form.assureurAutre}
              onChange={(e) => update({ assureurAutre: e.target.value.slice(0, 60) })}
              placeholder={rdvAssurance.assureurAutrePlaceholder}
              className={`${inputClass} mt-3`}
            />
          )}
        </div>
      )}

      {form.couverture && (
        <div className="mt-5">
          <Notice icon={ShieldCheck}>{form.couverture === "non" ? rdvAssurance.sansCouverture : rdvAssurance.rassurance}</Notice>
        </div>
      )}
    </>
  );
};

// ------------------------------------------------------------------ 4. Lieu
export const LieuStep = ({ form, update }: StepProps) => {
  const cp = form.codePostal.trim();
  return (
    <>
      <StepTitle titre={rdvLieu.titre} />
      <ChoiceGroup label={rdvLieu.titre}>
        <ChoiceButton selected={form.lieu === "centre"} onClick={() => update({ lieu: "centre" })} label={rdvLieu.centre.label} texte={rdvLieu.centre.texte} icon={Building2} />
        <ChoiceButton selected={form.lieu === "domicile"} onClick={() => update({ lieu: "domicile" })} label={rdvLieu.domicile.label} texte={rdvLieu.domicile.texte} icon={Home} />
      </ChoiceGroup>
      {form.lieu === "domicile" && (
        <div className="mt-6 animate-fade-in">
          <Field label={rdvLieu.codePostal} htmlFor="rdv-cp" error={cp.length === 4 && !isPostalCodeValid(cp) && rdvLieu.codePostalInvalide}>
            <div className="relative max-w-[12rem]">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                id="rdv-cp"
                value={form.codePostal}
                onChange={(e) => update({ codePostal: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="4000"
                className={`${inputClass} pl-11 tracking-widest`}
              />
            </div>
          </Field>
          {isPostalCodeValid(cp) && !isInZone(cp) && (
            <div className="mt-3">
              <Notice>{rdvLieu.horsZone}</Notice>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// ------------------------------------------------------------------ 5. Créneau
export const CreneauStep = ({ form, update, refreshKey }: StepProps & { refreshKey: number }) => (
  <>
    <StepTitle titre={rdvCreneau.titre} texte={rdvCreneau.texte} />
    {form.lieu === "domicile" && (
      <div className="mb-5">
        <Notice icon={Home}>{rdvCreneau.domicileNote}</Notice>
      </div>
    )}
    <SlotPicker
      date={form.date}
      hour={form.hour}
      onChange={(date, hour) => update({ date, hour })}
      refreshKey={refreshKey}
    />
  </>
);

// ------------------------------------------------------------------ 6. Coordonnées
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

export const CoordonneesStep = ({ form, update }: StepProps) => (
  <>
    <StepTitle titre={rdvCoordonnees.titre} texte={rdvCoordonnees.texte} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Prénom" htmlFor="rdv-prenom">
        <input id="rdv-prenom" value={form.prenom} onChange={(e) => update({ prenom: e.target.value.slice(0, 60) })} autoComplete="given-name" className={inputClass} />
      </Field>
      <Field label="Nom" htmlFor="rdv-nom">
        <input id="rdv-nom" value={form.nom} onChange={(e) => update({ nom: e.target.value.slice(0, 60) })} autoComplete="family-name" className={inputClass} />
      </Field>
      <Field label="Téléphone" htmlFor="rdv-tel" error={form.telephone.length > 5 && !isPhoneValid(form.telephone) && "Numéro incomplet."}>
        <input id="rdv-tel" type="tel" value={form.telephone} onChange={(e) => update({ telephone: e.target.value.slice(0, 30) })} autoComplete="tel" placeholder="04xx xx xx xx" className={inputClass} />
      </Field>
      <Field label="E-mail" htmlFor="rdv-email" error={form.email.includes("@") && form.email.length > 5 && !isEmailValid(form.email) && "Adresse e-mail invalide."}>
        <input id="rdv-email" type="email" value={form.email} onChange={(e) => update({ email: e.target.value.slice(0, 254) })} autoComplete="email" className={inputClass} />
      </Field>
    </div>

    {/* Pot de miel : masqué aux humains et aux lecteurs d'écran. */}
    <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
      <label htmlFor="rdv-website">Site web</label>
      <input id="rdv-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update({ website: e.target.value })} />
    </div>

    <h3 className="font-semibold mt-7 mb-3">{rdvCoordonnees.recapTitre}</h3>
    <Recap form={form} />

    <label className="flex gap-3 items-start text-sm mt-6 cursor-pointer">
      <input
        type="checkbox"
        checked={form.consent}
        onChange={(e) => update({ consent: e.target.checked })}
        className="w-5 h-5 mt-0.5 accent-[hsl(var(--primary))] shrink-0"
      />
      <span>
        {rdvCoordonnees.consentement}{" "}
        <Link to="/politique-de-confidentialite" target="_blank" className="text-primary underline underline-offset-2">
          {rdvCoordonnees.consentementLien}
        </Link>
        .
      </span>
    </label>
  </>
);
