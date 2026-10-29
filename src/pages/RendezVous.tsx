import { useEffect, useMemo, useState, FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Clock, Check, ChevronRight, ChevronLeft, User, Mail, Phone,
  Car, FileText, Upload, Info, ShieldCheck, CalendarDays,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import { serviceCategories, findService, type Service } from "@/data/services";
import { sendLead } from "@/lib/leads";
import { RDV_PATH, rdvHeures, rdvRegles, rdvTextes } from "@/data/rdv";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { addDays, bookRdv, brusselsNow, fetchTakenSlots, isSlotInWindow, slotKey } from "@/lib/rdv";

/* ------------------------------------------------------------------ helpers */
const MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const DAYS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

const pad = (n: number) => (n < 10 ? "0" : "") + n;
const heureLabel = (h: number) => `${pad(h)}:00`;
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const money = (n: number) => "€" + n.toLocaleString("fr-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function durLabel(min: number) {
  if (!min) return "";
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h} h${m ? " " + pad(m) : ""}` : `${m} min`;
}
function longDate(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number);
  const dt = new Date(y, mo - 1, d);
  return `${DAYS[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]} ${y}`;
}
function priceNode(s: Service) {
  if (s.priceType === "devis") return <span className="text-neon-cyan font-semibold">Sur devis</span>;
  return (
    <span className="text-neon-cyan font-semibold">
      {s.priceType === "from" && <span className="text-muted-foreground font-normal text-[0.86em]">à partir de </span>}
      {money(s.price)}
    </span>
  );
}

const STEPS = ["Service", "Date & heure", "Vos informations", "Confirmation"];

const RendezVous = () => {
  useSeo({ ...pagesSeo[RDV_PATH] });
  const [step, setStep] = useState(1);

  // Présélection via ?service=<id> (ex. depuis une promo de l'accueil).
  const [searchParams] = useSearchParams();
  const presetId = searchParams.get("service") ?? "";
  const presetValid = Boolean(presetId && findService(presetId));
  const presetCatId = presetValid
    ? serviceCategories.find((c) => c.services.some((s) => s.id === presetId))!.id
    : serviceCategories[0].id;

  // step 1
  const [catId, setCatId] = useState(presetCatId);
  const [svcId, setSvcId] = useState(presetValid ? presetId : "");
  const svc = findService(svcId);

  // step 2
  const [month, setMonth] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  // Créneaux occupés du mois affiché (clés slotKey). null = agenda injoignable :
  // la demande part quand même, avec un créneau « à confirmer ».
  const [taken, setTaken] = useState<Set<string> | null>(new Set());
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsVersion, setSlotsVersion] = useState(0);
  const [booked, setBooked] = useState(true);
  const [mailWarning, setMailWarning] = useState(false);

  // step 3
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [vin, setVin] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // step 4
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState<{ status: string; message: string }>({ status: "idle", message: "" });
  const [sent, setSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = telephone.replace(/[^\d]/g, "").length >= 8;
  const vinValid = !vin || /^[A-HJ-NPR-Z0-9]{15,20}$/.test(vin.toUpperCase());
  const step3Valid = prenom.trim().length >= 2 && nom.trim().length >= 2 && emailValid && phoneValid && vinValid && (vin.trim() || file);

  const cat = serviceCategories.find((c) => c.id === catId)!;

  /* ---------------------------------------------------------------- calendar */
  const days = useMemo(() => {
    const y = month.getFullYear(), m = month.getMonth();
    const lead = (new Date(y, m, 1).getDay() + 6) % 7; // lundi = 0
    const total = new Date(y, m + 1, 0).getDate();
    const cells: { key: string; day: number; free: boolean; empty?: boolean }[] = [];
    for (let i = 0; i < lead; i++) cells.push({ key: `e${i}`, day: 0, free: false, empty: true });
    for (let i = 1; i <= total; i++) {
      const key = ymd(new Date(y, m, i));
      // Ouvert 7j/7 : un jour est libre s'il lui reste au moins un créneau réservable.
      const free = rdvHeures.some((h) => isSlotInWindow(key, h) && !taken?.has(slotKey(key, h)));
      cells.push({ key, day: i, free });
    }
    return cells;
  }, [month, taken]);

  const canNext = useMemo(() => {
    const last = addDays(brusselsNow().date, rdvRegles.horizonJours);
    return ymd(new Date(month.getFullYear(), month.getMonth() + 1, 1)) <= last;
  }, [month]);

  // Chargement des créneaux occupés du mois affiché (à l'étape 2).
  useEffect(() => {
    if (step !== 2) return;
    let cancelled = false;
    const from = ymd(new Date(month.getFullYear(), month.getMonth(), 1));
    const to = ymd(new Date(month.getFullYear(), month.getMonth() + 1, 0));
    setSlotsLoading(true);
    fetchTakenSlots(from, to).then((set) => {
      if (cancelled) return;
      setTaken(set);
      setSlotsLoading(false);
    });
    return () => { cancelled = true; };
  }, [step, month, slotsVersion]);

  const canPrev = useMemo(() => {
    const cur = new Date(); cur.setDate(1); cur.setHours(0, 0, 0, 0);
    return new Date(month.getFullYear(), month.getMonth(), 1) > cur;
  }, [month]);

  const goto = (n: number) => { setStep(n); setFormState({ status: "idle", message: "" }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const takeFile = (f: File) => {
    if (!/^(image\/jpeg|image\/png|application\/pdf)$/.test(f.type)) {
      setFormState({ status: "error", message: "Format non accepté. Utilisez un fichier JPG, PNG ou PDF." });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFormState({ status: "error", message: "Fichier trop volumineux. Maximum 5 Mo." });
      return;
    }
    setFormState({ status: "idle", message: "" });
    setFile(f);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent || !svc) return;
    setFormState({ status: "loading", message: "Envoi en cours..." });

    const prix = svc.priceType === "devis" ? "Sur devis" : (svc.priceType === "from" ? "à partir de " : "") + money(svc.price);
    const base: Record<string, string> = {
      service: svc.name,
      categorie: cat.name,
      prix,
      date: date ? longDate(date) : "",
      heure: time,
      duree: durLabel(svc.duration),
      prenom, nom, email, telephone,
      vin: vin ? vin.toUpperCase() : "",
      carteGrise: file ? file.name : "",
    };

    const sendByMail = () => {
      if (file) {
        const fd = new FormData();
        Object.entries(base).forEach(([k, v]) => fd.append(k, v));
        fd.append("carteGriseFichier", file, file.name);
        return fetch("https://formspree.io/f/xlgokywp", { method: "POST", headers: { Accept: "application/json" }, body: fd });
      }
      return fetch("https://formspree.io/f/xlgokywp", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(base),
      });
    };

    const details: Record<string, string> = {
      "Service": base.service,
      "Catégorie": base.categorie,
      "Prix": base.prix,
      "Date": base.date,
      "Heure": base.heure,
      "Durée": base.duree,
      "VIN": base.vin,
      "Carte grise (par e-mail)": base.carteGrise,
    };

    // 1. Réservation du créneau (et enregistrement de la demande) dans l'agenda.
    const result = await bookRdv({
      date, hour: parseInt(time, 10), name: `${prenom} ${nom}`, email, phone: telephone, details,
    });

    if (result === "taken" || result === "invalid") {
      setTime("");
      setSlotsVersion((v) => v + 1);
      goto(2);
      setFormState({ status: "error", message: result === "taken" ? rdvTextes.creneauPris : rdvTextes.creneauInvalide });
      return;
    }
    if (result === "limit") {
      setFormState({ status: "error", message: rdvTextes.limite });
      return;
    }

    try {
      if (result === "ok") {
        // 2. Créneau réservé : e-mail de notification (avec la carte grise).
        //    Un échec ici n'annule pas le rendez-vous, déjà dans l'espace admin.
        base.creneau = "Réservé dans l'agenda";
        const mailOk = await sendByMail().then((r) => r.ok, () => false);
        setMailWarning(!mailOk && Boolean(file));
        setBooked(true);
      } else {
        // Agenda injoignable : double envoi classique, créneau à confirmer.
        base.creneau = "À CONFIRMER (agenda en ligne indisponible)";
        const ok = await sendLead(
          sendByMail,
          { type: "rdv", name: `${prenom} ${nom}`, email, phone: telephone, details: { ...details, "Créneau": base.creneau } },
          { hasAttachments: Boolean(file) },
        );
        if (!ok) throw new Error("server");
        setBooked(false);
      }
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormState({ status: "error", message: "Une erreur est survenue. Réessayez ou contactez-nous directement." });
    }
  };

  const inputClass = "w-full bg-input border border-border rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm";
  const iconWrap = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none";

  /* --------------------------------------------------------------- recap rows */
  const recap = () => {
    if (!svc) return null;
    const rows: [string, string][] = [["Service", svc.name]];
    rows.push(["Date", date ? longDate(date) : "—"]);
    rows.push(["Heure", svc.duration ? `${time} — durée estimée ${durLabel(svc.duration)}` : time]);
    rows.push(["Nom", `${prenom} ${nom}`]);
    rows.push(["E-mail", email]);
    rows.push(["Téléphone", telephone]);
    if (vin) rows.push(["Numéro de châssis", vin.toUpperCase()]);
    if (file) rows.push(["Carte grise", file.name]);
    const totalLabel = svc.priceType === "devis" ? "Montant" : svc.priceType === "from" ? "Montant estimé, à régler sur place" : "Total à régler sur place";
    return (
      <div className="border border-border rounded-lg overflow-hidden mb-6">
        {rows.map(([k, v], i) => (
          <div key={i} className="flex justify-between gap-5 px-5 py-3.5 border-b border-border text-sm">
            <span className="text-muted-foreground shrink-0">{k}</span>
            <span className="font-semibold text-right break-words">{v}</span>
          </div>
        ))}
        <div className="flex justify-between gap-5 px-5 py-3.5 bg-primary/10 text-sm">
          <span className="text-muted-foreground shrink-0">{totalLabel}</span>
          <span className="font-semibold text-right text-neon-cyan text-base">
            {svc.priceType === "devis" ? "Sur devis" : (svc.priceType === "from" ? "à partir de " : "") + money(svc.price)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-gradient-neon">Demander un devis</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-6">
            Réparation d'impact ou remplacement de pare-brise : choisissez votre prestation et votre créneau, c'est réservé.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="flex items-center justify-center gap-3 mb-10 text-center">
            <Clock className="w-6 h-6 text-neon-cyan shrink-0" aria-hidden="true" />
            <p className="text-sm"><b>{rdvTextes.bandeauTitre}</b> · <span className="text-muted-foreground">{rdvTextes.bandeauTexte}</span></p>
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <AnimatedSection delay={200}>
            <GlowCard className="md:p-8">
              {/* ---------------------------------------------------- Stepper */}
              <div className="flex items-start mb-9">
                {STEPS.map((label, i) => {
                  const n = i + 1;
                  const active = n === step, done = n < step;
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center relative gap-2.5">
                      {i > 0 && <div className={`absolute top-[17px] right-1/2 left-0 h-px mr-6 ${n <= step ? "bg-gradient-neon" : "bg-border"}`} />}
                      {i < STEPS.length - 1 && <div className={`absolute top-[17px] left-1/2 right-0 h-px ml-6 ${n < step ? "bg-gradient-neon" : "bg-border"}`} />}
                      <div className={`w-9 h-9 rounded-full grid place-items-center font-heading text-sm font-bold relative z-10 transition-all ${
                        active ? "bg-gradient-neon text-primary-foreground shadow-[0_0_0_4px_hsl(270_80%_60%/0.18)]"
                        : done ? "bg-muted text-foreground" : "bg-muted text-muted-foreground"}`}>
                        {done ? <Check className="w-4 h-4" /> : n}
                      </div>
                      <div className={`text-[10px] md:text-[11px] uppercase tracking-wider font-semibold text-center transition-colors ${active ? "text-neon-purple" : "text-muted-foreground"} ${active ? "block" : "hidden md:block"}`}>
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {formState.message && (
                <div className={`mb-5 p-4 rounded-lg text-sm ${formState.status === "error" ? "bg-destructive/15 text-destructive border border-destructive/30" : "bg-muted text-muted-foreground"}`}>
                  {formState.message}
                </div>
              )}

              {/* =============================================== Étape 1 — Service */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="font-heading text-xl font-bold mb-1">Choisissez votre service</h2>
                  <p className="text-muted-foreground text-sm mb-6">Sélectionnez la prestation souhaitée pour votre véhicule.</p>

                  {/* category pills */}
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {serviceCategories.map((c) => (
                      <button key={c.id} type="button" onClick={() => setCatId(c.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          c.id === catId
                            ? c.promo ? "bg-neon-pink border-neon-pink text-white" : "bg-gradient-neon border-transparent text-primary-foreground"
                            : `border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground ${c.promo ? "border-neon-pink/60 text-neon-pink" : ""}`}`}>
                        {c.name}
                      </button>
                    ))}
                  </div>

                  {/* service cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.services.map((s) => {
                      const on = s.id === svcId;
                      return (
                        <button key={s.id} type="button" onClick={() => setSvcId(s.id)}
                          className={`text-left relative border rounded-lg p-4 pr-10 bg-input transition-all ${on ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground hover:bg-card"}`}>
                          <span className={`absolute top-4 right-4 w-5 h-5 rounded-full grid place-items-center border transition-all ${on ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                            {on && <Check className="w-3 h-3" />}
                          </span>
                          <div className="font-semibold text-sm pr-2">{s.name}</div>
                          {s.description && <div className="text-muted-foreground text-xs leading-relaxed mt-1.5">{s.description}</div>}
                          <div className="flex gap-4 text-sm mt-2.5 items-center">
                            {priceNode(s)}
                            {s.duration > 0 && <span className="text-muted-foreground text-xs">{durLabel(s.duration)}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {cat.services.some((s) => s.priceType === "from") && (
                    <p className="text-muted-foreground text-xs mt-4 pl-3 border-l-2 border-border">
                      Pour les tarifs « à partir de » : le prix peut varier selon le modèle de véhicule et les pièces nécessaires.
                    </p>
                  )}

                  <div className="flex justify-end mt-7">
                    <button type="button" disabled={!svcId} onClick={() => goto(2)} className="btn-main">
                      Continuer <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================== Étape 2 — Date & heure */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="font-heading text-xl font-bold mb-1">Date &amp; heure</h2>
                  <p className="text-muted-foreground text-sm mb-6">Choisissez le créneau qui vous convient le mieux.</p>

                  <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-7 items-start">
                    {/* calendar */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-semibold capitalize">{MONTHS[month.getMonth()]} {month.getFullYear()}</div>
                        <div className="flex gap-1.5">
                          <button type="button" disabled={!canPrev} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                            aria-label="Mois précédent"
                            className="w-11 h-11 md:w-8 md:h-8 rounded-lg border border-border grid place-items-center text-muted-foreground enabled:hover:border-primary enabled:hover:text-primary disabled:opacity-30 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button type="button" disabled={!canNext} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                            aria-label="Mois suivant"
                            className="w-11 h-11 md:w-8 md:h-8 rounded-lg border border-border grid place-items-center text-muted-foreground enabled:hover:border-primary enabled:hover:text-primary disabled:opacity-30 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1.5 mb-2">
                        {["Lu","Ma","Me","Je","Ve","Sa","Di"].map((d) => (
                          <span key={d} className="text-center text-[11px] font-semibold text-muted-foreground uppercase py-1">{d}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1.5">
                        {days.map((c) => c.empty ? <div key={c.key} /> : (
                          <button key={c.key} type="button" disabled={!c.free}
                            onClick={() => { setDate(c.key); setTime(""); }}
                            aria-label={c.free ? longDate(c.key) : `${longDate(c.key)}, indisponible`}
                            aria-pressed={c.key === date}
                            className={`py-3 rounded-lg text-sm grid place-items-center transition-all ${
                              c.key === date ? "bg-primary text-primary-foreground font-bold"
                              : c.free ? "bg-input border border-border text-foreground hover:border-primary hover:text-primary"
                              : "text-muted-foreground/40 pointer-events-none"}`}>
                            {c.day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* slots */}
                    <div>
                      <div className="font-semibold mb-3.5">{date ? `Horaires du ${longDate(date)}` : "Horaires disponibles"}</div>
                      {taken === null && (
                        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 mb-3.5">{rdvTextes.agendaIndisponible}</p>
                      )}
                      {date ? (
                        <div className={`grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2.5 transition-opacity ${slotsLoading ? "opacity-50" : ""}`} aria-busy={slotsLoading}>
                          {rdvHeures.map((h) => {
                            const label = heureLabel(h);
                            const pris = Boolean(taken?.has(slotKey(date, h)));
                            const dispo = !pris && isSlotInWindow(date, h);
                            return (
                              <button key={h} type="button" disabled={!dispo || slotsLoading} onClick={() => setTime(label)}
                                aria-pressed={label === time}
                                aria-label={pris ? `${label}, déjà réservé` : !dispo ? `${label}, indisponible` : label}
                                className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                                  label === time ? "bg-primary border-primary text-primary-foreground font-bold"
                                  : dispo ? "bg-input border-border hover:border-primary hover:text-primary"
                                  : "border-border/40 text-muted-foreground/40 line-through cursor-not-allowed"}`}>
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm py-6 text-center">Sélectionnez d'abord une date dans le calendrier.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-7">
                    <button type="button" onClick={() => goto(1)} className="btn-ghost"><ChevronLeft className="w-4 h-4" /> Retour</button>
                    <button type="button" disabled={!date || !time} onClick={() => goto(3)} className="btn-main">Continuer <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {/* ===================================== Étape 3 — Vos informations */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <h2 className="font-heading text-xl font-bold mb-1">Vos informations</h2>
                  <p className="text-muted-foreground text-sm mb-6">Vos coordonnées et les informations de votre véhicule.</p>

                  <h3 className="font-semibold text-sm mb-3.5">Vos coordonnées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative"><User className={iconWrap} /><input className={inputClass} placeholder="Prénom *" aria-label="Prénom (obligatoire)" value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" /></div>
                    <div className="relative"><User className={iconWrap} /><input className={inputClass} placeholder="Nom *" aria-label="Nom (obligatoire)" value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="family-name" /></div>
                    <div className="relative">
                      <Mail className={iconWrap} /><input type="email" className={inputClass} placeholder="E-mail *" aria-label="E-mail (obligatoire)" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                      {email && !emailValid && <p className="text-destructive text-xs mt-1">Adresse e-mail invalide</p>}
                    </div>
                    <div className="relative">
                      <Phone className={iconWrap} /><input type="tel" className={inputClass} placeholder="Téléphone *" aria-label="Téléphone (obligatoire)" value={telephone} onChange={(e) => setTelephone(e.target.value)} autoComplete="tel" />
                      {telephone && !phoneValid && <p className="text-destructive text-xs mt-1">Numéro invalide</p>}
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm mt-7 mb-3.5">Informations de votre véhicule</h3>
                  <div className="flex gap-3.5 items-start bg-primary/5 border border-primary/20 border-l-[3px] border-l-primary rounded-lg p-4 mb-4 text-sm">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-xs mt-0.5"><Info className="w-3.5 h-3.5" /></span>
                    <div className="leading-relaxed text-muted-foreground">Afin de préparer les pièces avant votre rendez-vous, merci de nous transmettre votre <b className="text-foreground">VIN</b> ou une <b className="text-foreground">photo de votre carte grise</b>.</div>
                  </div>

                  <div className="border border-border rounded-lg p-5">
                    {/* VIN */}
                    <div className="flex gap-4 items-start">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary grid place-items-center"><Car className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">Numéro de châssis (VIN)</div>
                        <div className="text-muted-foreground text-xs mt-0.5">Le VIN comporte généralement 17 caractères.</div>
                        <input value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} maxLength={20} placeholder="Ex. WBAAL71000CF63146" aria-label="Numéro de châssis (VIN)" autoComplete="off" spellCheck={false}
                          className="w-full bg-input border border-border rounded-lg px-4 py-3 mt-3 text-foreground placeholder:text-muted-foreground uppercase focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                        {vin && !vinValid && <p className="text-destructive text-xs mt-1.5">Le VIN doit comporter 15 à 20 caractères (sans I, O ni Q).</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground tracking-widest my-5">
                      <span className="flex-1 h-px bg-border" /> OU <span className="flex-1 h-px bg-border" />
                    </div>

                    {/* carte grise */}
                    <div className="flex gap-4 items-start">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary grid place-items-center"><FileText className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">Photo de la carte grise</div>
                        <div className="text-muted-foreground text-xs mt-0.5">JPG, PNG ou PDF (max. 5 Mo)</div>
                        {!file ? (
                          <label
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) takeFile(e.dataTransfer.files[0]); }}
                            className={`block mt-3 border border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}>
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground"><b className="text-foreground">Cliquez pour ajouter un fichier</b><br />ou glissez-déposez votre fichier ici</span>
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" hidden onChange={(e) => e.target.files?.[0] && takeFile(e.target.files[0])} />
                          </label>
                        ) : (
                          <div className="flex items-center gap-3 mt-3 bg-input border border-border rounded-lg px-4 py-3 text-sm">
                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <button type="button" onClick={() => setFile(null)} className="ml-auto text-muted-foreground hover:text-destructive text-lg leading-none">&times;</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start text-xs text-muted-foreground mt-5 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Vos données sont utilisées uniquement pour la gestion de votre rendez-vous et ne seront jamais partagées avec des tiers.</span>
                  </div>

                  <div className="flex justify-between mt-7">
                    <button type="button" onClick={() => goto(2)} className="btn-ghost"><ChevronLeft className="w-4 h-4" /> Retour</button>
                    <button type="button" disabled={!step3Valid} onClick={() => goto(4)} className="btn-main">Continuer <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {/* ======================================== Étape 4 — Confirmation */}
              {step === 4 && !sent && (
                <form onSubmit={handleSubmit} className="animate-fade-in">
                  <h2 className="font-heading text-xl font-bold mb-1">Confirmation</h2>
                  <p className="text-muted-foreground text-sm mb-6">Vérifiez les informations ci-dessous avant de valider votre rendez-vous.</p>

                  {recap()}

                  <div className="flex gap-3.5 items-start bg-primary/5 border border-primary/20 border-l-[3px] border-l-primary rounded-lg p-4 mb-5 text-sm">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center mt-0.5"><Info className="w-3.5 h-3.5" /></span>
                    <div className="leading-relaxed text-muted-foreground">
                      Aucun prélèvement n'est réalisé en ligne. Un <b className="text-foreground">devis écrit</b> vous est remis avant toute intervention.
                      {svc?.priceType === "from" && <><br />Ce tarif est un <b className="text-foreground">montant de départ</b> : le prix peut varier selon le modèle. Le prix définitif est confirmé après diagnostic.</>}
                      {svc?.priceType === "devis" && <><br />Cette intervention est chiffrée <b className="text-foreground">sur devis</b> : le montant dépend du modèle et des pièces. Il vous est communiqué après diagnostic.</>}
                    </div>
                  </div>

                  <label className="flex gap-3 items-start text-sm text-muted-foreground mb-6 cursor-pointer">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-[18px] h-[18px] mt-0.5 accent-neon-purple shrink-0" />
                    <span>J'accepte que B MATIC traite mes données pour la gestion de ce rendez-vous, conformément à la <Link to="/politique-de-confidentialite" className="text-neon-cyan underline underline-offset-2 hover:text-neon-blue">politique de confidentialité</Link>.</span>
                  </label>

                  <div className="flex justify-between">
                    <button type="button" onClick={() => goto(3)} className="btn-ghost"><ChevronLeft className="w-4 h-4" /> Retour</button>
                    <button type="submit" disabled={!consent || formState.status === "loading"} className="btn-main">
                      {formState.status === "loading" ? "Envoi en cours…" : <>Confirmer le rendez-vous <Check className="w-4 h-4" /></>}
                    </button>
                  </div>
                </form>
              )}

              {/* ---------------------------------------------- Écran de succès */}
              {step === 4 && sent && (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/15 text-green-400 grid place-items-center mx-auto mb-5"><Check className="w-8 h-8" /></div>
                  <div className="font-heading text-2xl font-bold mb-2">
                    {booked ? "Rendez-vous réservé" : "Demande bien reçue"}
                  </div>
                  <p className="text-muted-foreground max-w-md mx-auto mb-7 leading-relaxed">
                    {booked
                      ? <>Merci {prenom}. Votre créneau du {longDate(date)} à {time} est réservé pour vous. Nous vous contactons si un détail doit être précisé.</>
                      : <>Merci {prenom}. Votre demande est enregistrée. Nous vous recontactons rapidement pour confirmer le créneau.</>}
                  </p>
                  {mailWarning && (
                    <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 max-w-md mx-auto mb-6">
                      Votre carte grise n'a pas pu être transmise. Pensez à l'apporter le jour du rendez-vous.
                    </p>
                  )}
                  <div className="text-left max-w-xl mx-auto">{recap()}</div>
                </div>
              )}
            </GlowCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;
