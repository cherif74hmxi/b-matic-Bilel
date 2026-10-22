import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Camera, PenLine, ArrowLeft, ArrowRight, Check, CheckCircle2, Gauge, AlertTriangle, Plus, X, Loader2, Sparkles, Phone } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import RegistrationScanner from "@/components/RegistrationScanner";
import SlotIllustration from "@/components/admin/SlotIllustration";
import useSeo from "@/hooks/useSeo";
import { sendLead } from "@/lib/leads";
import { SCAN_ENABLED, scanFieldCount, type RegistrationScan } from "@/lib/registrationScan";
import { canDecodeImage, toJpeg } from "@/lib/imageOptimize";
import { normalizeVin, VIN_PATTERN } from "@/lib/vin";
import { FUEL_LABELS, GEARBOX_LABELS } from "@/lib/vehicles";
import { vehiculesData, marques } from "@/data/vehicules";
import { legalInfo } from "@/data/legal";
import {
  repriseSeo,
  repriseIntro,
  repriseChoix,
  repriseScan,
  repriseEtats,
  reprisePhotos,
  repriseEtapes,
  repriseConsentement,
  repriseMessages,
  type ReprisePhotoSlot,
} from "@/data/reprise";

// ============================================================================
//  Reprise de véhicule — formulaire court, mobile-first
//  Départ au choix : scan de la carte grise (Gemini) ou saisie à la main.
//  Envoi : e-mail Formspree (avec photos) + demande « reprise » dans l'admin.
// ============================================================================

const FORMSPREE_URL = "https://formspree.io/f/mlgokojb";
/** Photos jointes : réduites avant l'envoi (e-mail léger, envoi rapide en 4G). */
const PHOTO_MAX_EDGE = 1600;
/** Photo non convertible : jointe telle quelle seulement si elle reste légère. */
const RAW_PHOTO_MAX_BYTES = 4 * 1024 * 1024;

type Screen = "choix" | "scan" | "vehicule" | "photos" | "contact" | "envoye";

interface Vehicule {
  marque: string;
  modele: string;
  version: string;
  annee: string;
  carburant: string;
  boite: string;
  puissance: string;
  cylindree: string;
  vin: string;
  km: string;
  etat: string;
}
type VehiculeField = keyof Vehicule;

interface Contact {
  nom: string;
  telephone: string;
  email: string;
}

const EMPTY: Vehicule = { marque: "", modele: "", version: "", annee: "", carburant: "", boite: "", puissance: "", cylindree: "", vin: "", km: "", etat: "" };
const CURRENT_YEAR = new Date().getFullYear();
const digits = (s: string) => s.replace(/\D/g, "");

/** Erreurs bloquantes de l'étape véhicule (le VIN n'est jamais bloquant). */
function vehiculeErrors(v: Vehicule): Partial<Record<VehiculeField, string>> {
  const e: Partial<Record<VehiculeField, string>> = {};
  if (!v.marque.trim()) e.marque = "Indiquez la marque.";
  if (!v.modele.trim()) e.modele = "Indiquez le modèle.";
  const annee = Number(v.annee);
  if (!v.annee) e.annee = "Indiquez l'année.";
  else if (!Number.isInteger(annee) || annee < 1950 || annee > CURRENT_YEAR + 1) e.annee = `Année entre 1950 et ${CURRENT_YEAR + 1}.`;
  if (!v.carburant) e.carburant = "Choisissez le carburant.";
  const km = Number(digits(v.km));
  if (!digits(v.km)) e.km = "Indiquez le kilométrage.";
  else if (km > 2_000_000) e.km = "Kilométrage trop élevé.";
  if (!v.etat) e.etat = "Choisissez l'état général.";
  if (v.puissance && (Number(v.puissance) < 1 || Number(v.puissance) > 2000)) e.puissance = "Puissance entre 1 et 2000 ch.";
  if (v.cylindree && (Number(v.cylindree) < 1 || Number(v.cylindree) > 10_000)) e.cylindree = "Cylindrée entre 1 et 10 000 cm³.";
  return e;
}

function contactErrors(c: Contact, consent: boolean): Partial<Record<keyof Contact | "consent", string>> {
  const e: Partial<Record<keyof Contact | "consent", string>> = {};
  if (c.nom.trim().length < 2) e.nom = "Indiquez votre nom.";
  if (!/^(\+|0)[\d\s./-]+$/.test(c.telephone.trim()) || digits(c.telephone).length < 9) e.telephone = "Numéro invalide (ex. 0470 12 34 56 ou +32 470 12 34 56).";
  if (c.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) e.email = "Adresse e-mail invalide.";
  if (!consent) e.consent = "Votre accord est nécessaire pour envoyer la demande.";
  return e;
}

const inputClass =
  "w-full min-h-[48px] bg-input border border-border rounded-lg px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors aria-[invalid=true]:border-destructive";

/** Libellé + aide / erreur d'un champ. */
const Field = ({ id, label, required, error, hint, scanned, children }: { id: string; label: string; required?: boolean; error?: string; hint?: ReactNode; scanned?: boolean; children: ReactNode }) => (
  <div>
    <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium mb-1.5">
      {label}
      {required && <span className="text-neon-pink" aria-hidden="true">*</span>}
      {scanned && (
        <span className="text-neon-cyan" title="Lu sur la carte grise">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="sr-only">(lu sur la carte grise)</span>
        </span>
      )}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="text-destructive text-xs mt-1">{error}</p>
    ) : hint ? (
      <p id={`${id}-hint`} className="text-muted-foreground text-xs mt-1">{hint}</p>
    ) : null}
  </div>
);

interface Photo {
  slot: string;
  file: File;
  url: string;
}

const SlotVisual = ({ slot }: { slot: ReprisePhotoSlot }) =>
  slot.illustration ? (
    <SlotIllustration slot={slot.illustration} className="w-full h-14" />
  ) : slot.icone === "compteur" ? (
    <Gauge className="w-9 h-9 text-neon-cyan" aria-hidden="true" />
  ) : (
    <AlertTriangle className="w-9 h-9 text-neon-cyan" aria-hidden="true" />
  );

const Reprise = () => {
  useSeo(repriseSeo);

  const [screen, setScreen] = useState<Screen>(SCAN_ENABLED ? "choix" : "vehicule");
  const [method, setMethod] = useState<"scan" | "manuel">("manuel");
  const [vehicule, setVehicule] = useState<Vehicule>(EMPTY);
  const [scanned, setScanned] = useState<Set<VehiculeField>>(new Set());
  const [scanNotice, setScanNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [firstRegistration, setFirstRegistration] = useState("");
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [contact, setContact] = useState<Contact>({ nom: "", telephone: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState<"" | "photos" | "envoi">("");
  const [sendError, setSendError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const pendingSlot = useRef<string>("autre");
  const topRef = useRef<HTMLDivElement>(null);

  // Aperçus locaux des photos : libérés à la sortie de la page.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const go = (next: Screen) => {
    setScreen(next);
    setShowAll(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ----- Véhicule
  const vErrors = vehiculeErrors(vehicule);
  const shown = (name: string) => showAll || touched.has(name);
  const touch = (name: string) => setTouched((t) => (t.has(name) ? t : new Set(t).add(name)));
  const setField = (name: VehiculeField, value: string) => {
    setVehicule((v) => ({ ...v, [name]: value, ...(name === "marque" && value !== v.marque ? { modele: "" } : {}) }));
    // Corrigé par le visiteur : ce n'est plus la valeur lue sur la carte grise.
    setScanned((s) => {
      if (!s.has(name) && !(name === "marque" && s.has("modele"))) return s;
      const next = new Set(s);
      next.delete(name);
      if (name === "marque") next.delete("modele");
      return next;
    });
  };
  const fieldProps = (name: VehiculeField) => {
    const error = shown(name) ? vErrors[name] : undefined;
    return {
      id: `r-${name}`,
      value: vehicule[name],
      onChange: (e: { target: { value: string } }) => setField(name, e.target.value),
      onBlur: () => touch(name),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `r-${name}-error` : undefined,
      className: `${inputClass}${scanned.has(name) ? " ring-1 ring-neon-cyan/60" : ""}`,
    };
  };

  const applyScan = (scan: RegistrationScan) => {
    const filled: Partial<Vehicule> = {
      marque: scan.make,
      modele: scan.model,
      version: scan.version,
      annee: scan.year?.toString(),
      carburant: scan.fuel,
      puissance: scan.powerHp?.toString(),
      cylindree: scan.displacementCc?.toString(),
      vin: scan.vin,
    };
    const keys = (Object.keys(filled) as VehiculeField[]).filter((k) => filled[k]);
    // Nouveau scan : on repart de la carte grise (rien ne reste d'un scan précédent) ;
    // seuls le kilométrage, l'état et la boîte, absents de la carte, sont gardés.
    setVehicule((v) => ({ ...EMPTY, km: v.km, etat: v.etat, boite: v.boite, ...Object.fromEntries(keys.map((k) => [k, filled[k]!])) }));
    setScanned(new Set(keys));
    setFirstRegistration(scan.firstRegistration ?? "");
    setScanNotice({ ok: true, text: repriseScan.succes(scanFieldCount(scan)) });
    go("vehicule");
  };

  const nextFromVehicule = () => {
    if (Object.keys(vErrors).length > 0) {
      setShowAll(true);
      document.getElementById(`r-${Object.keys(vErrors)[0]}`)?.focus();
      return;
    }
    go("photos");
  };

  // ----- Photos
  const pickPhoto = (slot: string) => {
    pendingSlot.current = slot;
    fileInput.current?.click();
  };
  const [photoNotice, setPhotoNotice] = useState("");
  const onPhotos = async (files: FileList | null) => {
    const picked = Array.from(files ?? []).filter((f) => f.type.startsWith("image/") || f.type === "");
    if (fileInput.current) fileInput.current.value = "";
    // Uniquement les photos que le navigateur sait lire (aperçu + réduction avant envoi).
    const readable = await Promise.all(picked.map((f) => canDecodeImage(f)));
    const list = picked.filter((_, i) => readable[i]);
    setPhotoNotice(list.length < picked.length ? reprisePhotos.formatRefuse : "");
    if (list.length === 0) return;
    const slot = pendingSlot.current;
    // Emplacement guidé : une seule photo (la nouvelle remplace l'ancienne).
    const replaced = slot === "autre" ? [] : photos.filter((p) => p.slot === slot);
    replaced.forEach((p) => URL.revokeObjectURL(p.url));
    const kept = photos.filter((p) => !replaced.includes(p));
    const room = reprisePhotos.max - kept.length;
    const added = list.slice(0, slot === "autre" ? room : Math.min(1, room)).map((file) => ({ slot, file, url: URL.createObjectURL(file) }));
    setPhotos([...kept, ...added]);
  };
  const removePhoto = (photo: Photo) => {
    URL.revokeObjectURL(photo.url);
    setPhotos((list) => list.filter((p) => p !== photo));
  };
  const photoFor = (slot: string) => photos.find((p) => p.slot === slot);
  const extraPhotos = photos.filter((p) => p.slot === "autre");
  const full = photos.length >= reprisePhotos.max;

  // ----- Coordonnées + envoi
  const cErrors = contactErrors(contact, consent);
  const contactProps = (name: keyof Contact) => {
    const error = shown(name) ? cErrors[name] : undefined;
    return {
      id: `r-${name}`,
      value: contact[name],
      onChange: (e: { target: { value: string } }) => setContact((c) => ({ ...c, [name]: e.target.value })),
      onBlur: () => touch(name),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `r-${name}-error` : undefined,
      className: inputClass,
    };
  };

  const submit = async () => {
    if (Object.keys(cErrors).length > 0) {
      setShowAll(true);
      document.getElementById(`r-${Object.keys(cErrors)[0]}`)?.focus();
      return;
    }
    setSendError(false);
    const v = vehicule;
    const vin = normalizeVin(v.vin);
    // Date lue sur la carte grise : envoyée seulement si l'année n'a pas été changée depuis.
    const premiereImmat = firstRegistration.startsWith(v.annee) && v.annee ? firstRegistration : "";
    const fields: Record<string, string> = {
      methode: scanned.size > 0 ? "Scan de la carte grise" : "Saisie manuelle",
      marque: v.marque.trim(),
      modele: v.modele.trim(),
      version: v.version.trim(),
      annee: v.annee,
      premiere_immatriculation: premiereImmat,
      carburant: FUEL_LABELS[v.carburant as keyof typeof FUEL_LABELS] ?? v.carburant,
      boite: GEARBOX_LABELS[v.boite as keyof typeof GEARBOX_LABELS] ?? "",
      puissance_ch: v.puissance,
      cylindree_cm3: v.cylindree,
      vin: vin ? `${vin}${VIN_PATTERN.test(vin) ? "" : " (incomplet)"}` : "",
      kilometrage: digits(v.km),
      etat: v.etat,
      nom: contact.nom.trim(),
      telephone: contact.telephone.trim(),
      email: contact.email.trim(),
    };

    // Photos réduites en JPEG (repli : fichier d'origine si le navigateur ne sait pas le lire).
    setSending(photos.length > 0 ? "photos" : "envoi");
    const attachments: { name: string; blob: Blob }[] = [];
    for (const [i, p] of photos.entries()) {
      const label = reprisePhotos.slots.find((s) => s.id === p.slot)?.label ?? reprisePhotos.autre;
      const name = `${String(i + 1).padStart(2, "0")}-${label.replace(/[^\p{L}\d]+/gu, "-").toLowerCase()}.jpg`;
      try {
        attachments.push({ name, blob: await toJpeg(p.file, PHOTO_MAX_EDGE, 0.8) });
      } catch {
        if (p.file.size <= RAW_PHOTO_MAX_BYTES) attachments.push({ name: p.file.name, blob: p.file });
      }
    }
    setSending("envoi");

    const formData = new FormData();
    Object.entries(fields).forEach(([k, val]) => val && formData.append(k, val));
    attachments.forEach((a) => formData.append("photos", a.blob, a.name));

    const ok = await sendLead(
      () => fetch(FORMSPREE_URL, { method: "POST", headers: { Accept: "application/json" }, body: formData }),
      {
        type: "reprise",
        name: fields.nom,
        email: fields.email,
        phone: fields.telephone,
        details: {
          "Méthode": fields.methode,
          "Véhicule": [fields.marque, fields.modele, fields.version].filter(Boolean).join(" "),
          "Année": fields.annee,
          "1re immatriculation": fields.premiere_immatriculation,
          "Kilométrage": fields.kilometrage ? `${fields.kilometrage} km` : undefined,
          "État": fields.etat,
          "Carburant": fields.carburant,
          "Boîte": fields.boite,
          "Puissance": fields.puissance_ch ? `${fields.puissance_ch} ch` : undefined,
          "Cylindrée": fields.cylindree_cm3 ? `${fields.cylindree_cm3} cm³` : undefined,
          "VIN": fields.vin,
          "Photos (par e-mail)": attachments.length || undefined,
        },
      },
      { hasAttachments: attachments.length > 0 },
    );
    setSending("");
    if (ok) go("envoye");
    else setSendError(true);
  };

  const stepIndex = screen === "vehicule" ? 0 : screen === "photos" ? 1 : screen === "contact" ? 2 : -1;

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <AnimatedSection>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-center mb-3">
            <span className="text-gradient-neon">{repriseIntro.titre}</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-8">{repriseIntro.texte}</p>
        </AnimatedSection>

        <div ref={topRef} className="scroll-mt-24" />
        <GlowCard className="p-5 sm:p-8">
          {/* ---------- Progression ---------- */}
          {stepIndex >= 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>
                  Étape {stepIndex + 1}/{repriseEtapes.length} · <span className="text-foreground font-semibold">{repriseEtapes[stepIndex]}</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                <div className="h-full bg-gradient-neon transition-all duration-300" style={{ width: `${((stepIndex + 1) / repriseEtapes.length) * 100}%` }} />
              </div>
            </div>
          )}

          {/* ---------- Choix de la méthode ---------- */}
          {screen === "choix" && (
            <div>
              <h2 className="font-heading text-lg md:text-xl font-semibold text-center mb-5">{repriseChoix.titre}</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setMethod("scan");
                    go("scan");
                  }}
                  className="w-full text-left rounded-xl border-2 border-neon-purple/60 bg-primary/10 p-4 flex gap-4 items-center hover:bg-primary/20 transition-colors min-h-[88px]"
                >
                  <span className="shrink-0 w-12 h-12 rounded-xl bg-gradient-neon grid place-items-center">
                    <Camera className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 font-semibold">
                      {repriseChoix.scan.label}
                      <span className="rounded-full bg-neon-cyan/15 text-neon-cyan px-2 py-0.5 text-[11px] font-semibold">{repriseChoix.scan.badge}</span>
                    </span>
                    <span className="block text-sm text-neon-cyan">{repriseChoix.scan.duree}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{repriseChoix.scan.texte}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod("manuel");
                    go("vehicule");
                  }}
                  className="w-full text-left rounded-xl border border-border p-4 flex gap-4 items-center hover:bg-muted transition-colors min-h-[88px]"
                >
                  <span className="shrink-0 w-12 h-12 rounded-xl bg-muted grid place-items-center">
                    <PenLine className="w-6 h-6 text-foreground" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{repriseChoix.manuel.label}</span>
                    <span className="block text-sm text-muted-foreground">{repriseChoix.manuel.duree}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{repriseChoix.manuel.texte}</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ---------- Scan de la carte grise ---------- */}
          {screen === "scan" && (
            <div>
              <h2 className="font-heading text-lg md:text-xl font-semibold text-center mb-4">{repriseScan.titre}</h2>
              <RegistrationScanner onResult={applyScan} />
              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                <button type="button" onClick={() => go("choix")} className="btn-ghost min-h-[48px] sm:flex-1">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Retour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod("manuel");
                    go("vehicule");
                  }}
                  className="btn-ghost min-h-[48px] sm:flex-1"
                >
                  <PenLine className="w-4 h-4" aria-hidden="true" /> {repriseChoix.manuel.label}
                </button>
              </div>
            </div>
          )}

          {/* ---------- Véhicule ---------- */}
          {screen === "vehicule" && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                nextFromVehicule();
              }}
              className="space-y-4"
            >
              {scanNotice && (
                <p role="status" className="flex gap-2 items-start text-sm rounded-lg p-3 bg-neon-cyan/10 border border-neon-cyan/30">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-neon-cyan" aria-hidden="true" />
                  <span>
                    {scanNotice.text}
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      <Sparkles className="inline w-3.5 h-3.5 text-neon-cyan align-[-2px]" aria-hidden="true" /> = lu sur la carte grise
                    </span>
                  </span>
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="r-marque" label="Marque" required error={shown("marque") ? vErrors.marque : undefined} scanned={scanned.has("marque")}>
                  <input {...fieldProps("marque")} list="r-marques" autoComplete="off" placeholder="ex. Volkswagen" />
                </Field>
                <Field id="r-modele" label="Modèle" required error={shown("modele") ? vErrors.modele : undefined} scanned={scanned.has("modele")}>
                  <input {...fieldProps("modele")} list="r-modeles" autoComplete="off" placeholder="ex. Golf" />
                </Field>
              </div>
              <datalist id="r-marques">
                {marques.filter((m) => m !== "Autre").map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <datalist id="r-modeles">
                {(vehiculesData[marques.find((m) => m.toLowerCase() === vehicule.marque.trim().toLowerCase()) ?? ""] ?? []).map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <Field id="r-version" label="Version / finition" scanned={scanned.has("version")}>
                <input {...fieldProps("version")} placeholder="ex. 1.6 TDI Highline" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field id="r-annee" label="Année" required error={shown("annee") ? vErrors.annee : undefined} scanned={scanned.has("annee")}>
                  <input {...fieldProps("annee")} inputMode="numeric" maxLength={4} placeholder="ex. 2017" />
                </Field>
                <Field id="r-km" label="Kilométrage" required error={shown("km") ? vErrors.km : undefined}>
                  <input {...fieldProps("km")} inputMode="numeric" placeholder="ex. 98 000" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field id="r-carburant" label="Carburant" required error={shown("carburant") ? vErrors.carburant : undefined} scanned={scanned.has("carburant")}>
                  <select {...fieldProps("carburant")} className={`${fieldProps("carburant").className} appearance-none`}>
                    <option value="">Choisir…</option>
                    {Object.entries(FUEL_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field id="r-boite" label="Boîte">
                  <select {...fieldProps("boite")} className={`${inputClass} appearance-none`}>
                    <option value="">Choisir…</option>
                    {Object.entries(GEARBOX_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field id="r-puissance" label="Puissance (ch)" error={shown("puissance") ? vErrors.puissance : undefined} scanned={scanned.has("puissance")}>
                  <input {...fieldProps("puissance")} inputMode="numeric" placeholder="ex. 110" />
                </Field>
                <Field id="r-cylindree" label="Cylindrée (cm³)" error={shown("cylindree") ? vErrors.cylindree : undefined} scanned={scanned.has("cylindree")}>
                  <input {...fieldProps("cylindree")} inputMode="numeric" placeholder="ex. 1598" />
                </Field>
              </div>
              <Field
                id="r-vin"
                label="N° de châssis (VIN)"
                scanned={scanned.has("vin")}
                hint={
                  vehicule.vin && !VIN_PATTERN.test(normalizeVin(vehicule.vin))
                    ? `${normalizeVin(vehicule.vin).length}/17 — facultatif, vous pouvez le laisser incomplet ou vide.`
                    : "Facultatif — carte grise, case E (17 caractères)."
                }
              >
                <input {...fieldProps("vin")} aria-describedby="r-vin-hint" autoCapitalize="characters" autoComplete="off" spellCheck={false} maxLength={20} />
              </Field>

              <fieldset>
                <legend className="text-sm font-medium mb-2">
                  État général <span className="text-neon-pink" aria-hidden="true">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {repriseEtats.map((etat) => (
                    <label
                      key={etat}
                      className={`flex items-center justify-center text-center min-h-[48px] rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/60 ${vehicule.etat === etat ? "border-neon-purple bg-primary/15 font-semibold" : "border-border hover:bg-muted"}`}
                    >
                      <input type="radio" name="etat" value={etat} checked={vehicule.etat === etat} onChange={() => setField("etat", etat)} className="sr-only" />
                      {etat}
                    </label>
                  ))}
                </div>
                {shown("etat") && vErrors.etat && <p id="r-etat-error" className="text-destructive text-xs mt-1">{vErrors.etat}</p>}
              </fieldset>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                {SCAN_ENABLED && (
                  <button type="button" onClick={() => go(method === "scan" ? "scan" : "choix")} className="btn-ghost min-h-[48px] sm:flex-1">
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Retour
                  </button>
                )}
                <button type="submit" className="btn-main min-h-[48px] sm:flex-1">
                  Continuer <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}

          {/* ---------- Photos ---------- */}
          {screen === "photos" && (
            <div>
              <h2 className="font-heading text-lg md:text-xl font-semibold mb-1">{reprisePhotos.titre}</h2>
              <p className="text-sm text-muted-foreground mb-4">{reprisePhotos.texte}</p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {reprisePhotos.slots.map((slot) => {
                  const photo = photoFor(slot.id);
                  return (
                    <li key={slot.id} className="relative">
                      {photo ? (
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neon-purple/50">
                          <img src={photo.url} alt={slot.label} className="w-full h-full object-cover" />
                          <span className="absolute left-1.5 bottom-1.5 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium">{slot.label}</span>
                          <button type="button" onClick={() => removePhoto(photo)} className="absolute top-0 right-0 w-11 h-11 grid place-items-center" aria-label={`Retirer la photo ${slot.label}`}>
                            <span className="w-7 h-7 rounded-full bg-background/85 grid place-items-center">
                              <X className="w-4 h-4" aria-hidden="true" />
                            </span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => pickPhoto(slot.id)}
                          disabled={full}
                          className="w-full aspect-[4/3] rounded-xl border border-dashed border-border bg-background/40 hover:bg-muted flex flex-col items-center justify-center gap-1.5 p-2 text-center disabled:opacity-45 transition-colors"
                        >
                          <SlotVisual slot={slot} />
                          <span className="text-xs font-medium leading-tight">{slot.label}</span>
                        </button>
                      )}
                    </li>
                  );
                })}
                {extraPhotos.map((photo, i) => (
                  <li key={photo.url} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
                    <img src={photo.url} alt={`${reprisePhotos.autre} ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(photo)} className="absolute top-0 right-0 w-11 h-11 grid place-items-center" aria-label={`Retirer ${reprisePhotos.autre.toLowerCase()} ${i + 1}`}>
                      <span className="w-7 h-7 rounded-full bg-background/85 grid place-items-center">
                        <X className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </button>
                  </li>
                ))}
                {!full && (
                  <li>
                    <button
                      type="button"
                      onClick={() => pickPhoto("autre")}
                      className="w-full aspect-[4/3] rounded-xl border border-dashed border-border hover:bg-muted flex flex-col items-center justify-center gap-1.5 text-center transition-colors"
                    >
                      <Plus className="w-7 h-7 text-neon-cyan" aria-hidden="true" />
                      <span className="text-xs font-medium">{reprisePhotos.autre}</span>
                    </button>
                  </li>
                )}
              </ul>
              <p className="text-xs text-muted-foreground mt-3" aria-live="polite">
                {photos.length}/{reprisePhotos.max} photo{photos.length > 1 ? "s" : ""}
              </p>
              <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void onPhotos(e.target.files)} />
              {photoNotice && (
                <p role="alert" className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-3">{photoNotice}</p>
              )}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5">
                <button type="button" onClick={() => go("vehicule")} className="btn-ghost min-h-[48px] sm:flex-1">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Retour
                </button>
                <button type="button" onClick={() => go("contact")} className="btn-main min-h-[48px] sm:flex-1">
                  {photos.length > 0 ? "Continuer" : "Continuer sans photo"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* ---------- Coordonnées ---------- */}
          {screen === "contact" && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              className="space-y-4"
            >
              <Field id="r-nom" label="Nom et prénom" required error={shown("nom") ? cErrors.nom : undefined}>
                <input {...contactProps("nom")} autoComplete="name" />
              </Field>
              <Field id="r-telephone" label="Téléphone" required error={shown("telephone") ? cErrors.telephone : undefined}>
                <input {...contactProps("telephone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0470 12 34 56" />
              </Field>
              <Field id="r-email" label="E-mail" error={shown("email") ? cErrors.email : undefined} hint="Facultatif — pour recevoir l'offre par écrit.">
                <input {...contactProps("email")} type="email" inputMode="email" autoComplete="email" aria-describedby={shown("email") && cErrors.email ? "r-email-error" : "r-email-hint"} />
              </Field>
              <div>
                <label className="flex items-start gap-3 cursor-pointer py-2 min-h-[44px]">
                  <input
                    id="r-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-invalid={shown("consent") && cErrors.consent ? true : undefined}
                    aria-describedby={shown("consent") && cErrors.consent ? "r-consent-error" : undefined}
                    className="w-5 h-5 accent-neon-purple mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {repriseConsentement}{" "}
                    <Link to="/politique-de-confidentialite" className="text-neon-cyan underline underline-offset-2">
                      politique de confidentialité
                    </Link>
                    . <span className="text-neon-pink" aria-hidden="true">*</span>
                  </span>
                </label>
                {shown("consent") && cErrors.consent && <p id="r-consent-error" className="text-destructive text-xs">{cErrors.consent}</p>}
              </div>

              {sendError && (
                <p role="alert" className="text-sm rounded-lg p-3 bg-destructive/15 text-destructive border border-destructive/30">
                  {repriseMessages.erreur}{" "}
                  <a href={legalInfo.phoneHref} className="underline font-semibold whitespace-nowrap">{legalInfo.phone}</a>
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => go("photos")} disabled={sending !== ""} className="btn-ghost min-h-[48px] sm:flex-1">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Retour
                </button>
                <button type="submit" disabled={sending !== ""} className="btn-main min-h-[48px] sm:flex-1">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Check className="w-4 h-4" aria-hidden="true" />}
                  {sending === "photos" ? "Préparation des photos…" : sending === "envoi" ? "Envoi…" : "Envoyer ma demande"}
                </button>
              </div>
            </form>
          )}

          {/* ---------- Confirmation ---------- */}
          {screen === "envoye" && (
            <div className="text-center py-6" role="status">
              <CheckCircle2 className="w-14 h-14 text-neon-cyan mx-auto mb-4" aria-hidden="true" />
              <p className="text-lg font-semibold mb-6">{repriseMessages.succes}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/" className="btn-main min-h-[48px]">Retour à l'accueil</Link>
                <a href={legalInfo.phoneHref} className="btn-ghost min-h-[48px]">
                  <Phone className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
                </a>
              </div>
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
};

export default Reprise;
