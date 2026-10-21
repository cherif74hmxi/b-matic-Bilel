import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { sendLead } from "@/lib/leads";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import carteGriseImg from "@/assets/carte-grise.webp";
import { vehiculesData, marques } from "@/data/vehicules";

const carburants = ["Essence", "Diesel", "Hybride", "Hybride Rechargeable", "Électrique", "Hydrogène", "GPL", "Gaz Naturel (GNV)", "Autre"];
const historiqueOptions = [
  "Carnet d'entretien à jour et factures disponibles",
  "Quelques factures, carnet pas à jour ou manquant",
  "Aucun historique",
];

const mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const Reprise = () => {
  const [step, setStep] = useState(1);

  // Step 1
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [autreMarqueModele, setAutreMarqueModele] = useState("");
  const [moisVal, setMoisVal] = useState("");
  const [annee, setAnnee] = useState("");
  const [puissanceFiscale, setPuissanceFiscale] = useState("");
  const [puissanceDin, setPuissanceDin] = useState("");
  const [carburant, setCarburant] = useState("");
  const [boite, setBoite] = useState("");

  // Step 2
  const [km, setKm] = useState("");
  const [motorisation, setMotorisation] = useState("");
  const [finition, setFinition] = useState("");
  const [historique, setHistorique] = useState("");
  const [descEntretiens, setDescEntretiens] = useState("");
  const [photosVehicule, setPhotosVehicule] = useState<File[]>([]);
  const [photosCarnet, setPhotosCarnet] = useState<File[]>([]);
  const [factures, setFactures] = useState<File[]>([]);

  // Step 3
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [consent, setConsent] = useState(false);

  const isAutre = marque === "Autre";
  const modelesDisponibles = marque && !isAutre ? vehiculesData[marque] || [] : [];
  const step1Valid = (isAutre ? autreMarqueModele.trim().length > 0 : marque && modele) && moisVal && annee && puissanceFiscale && puissanceDin && carburant && boite;
  const step2Valid = km.length > 0;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^\+\d{1,4}\s?\d+/.test(telephone);
  const step3Valid = nom && prenom && emailValid && phoneValid && consent;

  const [formState, setFormState] = useState<{ status: string; message: string }>({ status: "idle", message: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState({ status: "loading", message: "Envoi en cours..." });

    const formData = new FormData();
    formData.append('marque', isAutre ? 'Autre' : marque);
    formData.append('modele', isAutre ? autreMarqueModele : modele);
    formData.append('mois', moisVal);
    formData.append('annee', annee);
    formData.append('puissanceFiscale', puissanceFiscale);
    formData.append('puissanceDin', puissanceDin);
    formData.append('carburant', carburant);
    formData.append('boite', boite);
    formData.append('km', km);
    formData.append('motorisation', motorisation);
    formData.append('finition', finition);
    formData.append('historique', historique);
    formData.append('descEntretiens', descEntretiens);
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('email', email);
    formData.append('telephone', telephone);

    photosVehicule.forEach(f => formData.append('photos_vehicule', f));
    photosCarnet.forEach(f => formData.append('photos_carnet', f));
    factures.forEach(f => formData.append('factures', f));

    try {
      // Double envoi : e-mail avec pièces jointes (Formspree) + espace admin
      // (Supabase, sans les fichiers).
      const fileCount = photosVehicule.length + photosCarnet.length + factures.length;
      const vehicule = (isAutre ? autreMarqueModele : [marque, modele].filter(Boolean).join(" ")).trim();
      const ok = await sendLead(
        () =>
          fetch("https://formspree.io/f/mlgokojb", {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: formData,
          }),
        {
          type: "reprise",
          name: `${prenom} ${nom}`,
          email,
          phone: telephone,
          details: {
            "Véhicule": vehicule,
            "Mise en circulation": [moisVal, annee].filter(Boolean).join("/"),
            "Kilométrage": km,
            "Carburant": carburant,
            "Boîte": boite,
            "Puissance fiscale": puissanceFiscale,
            "Puissance DIN": puissanceDin,
            "Motorisation": motorisation,
            "Finition": finition,
            "Historique": historique,
            "Entretiens": descEntretiens,
            "Fichiers joints (par e-mail)": fileCount || undefined,
          },
        },
        { hasAttachments: fileCount > 0 },
      );

      if (ok) {
        setFormState({ status: "success", message: "Merci ! Votre demande de reprise a été envoyée avec succès. Nous vous recontacterons rapidement." });
        setTimeout(() => setFormState({ status: "idle", message: "" }), 6000);
      } else {
        throw new Error("Erreur serveur");
      }
    } catch {
      setFormState({ status: "error", message: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement." });
      setTimeout(() => setFormState({ status: "idle", message: "" }), 6000);
    }
  };

  const inputClass = "w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm";
  const selectClass = `${inputClass} appearance-none`;
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-10">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm font-bold transition-all ${s <= step ? "bg-gradient-neon text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {s}
          </div>
          {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-gradient-neon" : "bg-muted"}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedSection>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-gradient-neon">Reprise</span> <span className="text-foreground">de véhicule</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-8">
            Nous reprenons votre véhicule toutes marques à un bon prix. Remplissez ce formulaire pour recevoir une offre de rachat.
          </p>
        </AnimatedSection>

        {/* Carte grise info banner */}
        <AnimatedSection delay={100}>
          <div className="relative mb-8 max-w-[580px] mx-auto overflow-visible">
            <div className="relative flex items-center px-6 py-4 md:px-8 md:py-5 rounded-lg border border-purple-500/20 bg-purple-950/30 backdrop-blur-sm">
              <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-purple-500/60 to-cyan-400/40" />
              <div className="flex-1 pl-2 pr-4 -ml-3">
                <p className="text-white/90 text-[15px] md:text-base leading-relaxed font-heading">
                  <span className="font-bold italic text-white">Nous vous</span>{" "}
                  conseillons de vous munir de votre{" "}
                  <strong className="text-purple-300 font-semibold">carte grise</strong>{" "}
                  afin de remplir ce formulaire.
                </p>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed mt-1.5">
                  Cela vous évitera de chercher les informations à renseigner.
                </p>
              </div>
            </div>
            <img
              src={carteGriseImg}
              alt="Carte grise"
              className="hidden md:block absolute -top-10 -right-[100px] w-[250px] rotate-[6deg] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] pointer-events-none z-10"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <GlowCard>
            <StepIndicator />
            <form onSubmit={handleSubmit}>
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-heading text-xl font-semibold mb-4">
                    <span className="text-neon-purple">Étape 1 :</span> Identification du véhicule
                  </h2>
                  <div>
                    <label className={labelClass}>Marque</label>
                    <select className={selectClass} value={marque} onChange={(e) => { setMarque(e.target.value); setModele(""); setAutreMarqueModele(""); }} required>
                      <option value="">Sélectionner une marque</option>
                      {marques.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  {isAutre ? (
                    <div>
                      <label className={labelClass}>Précisez la marque et le modèle</label>
                      <textarea className={inputClass} rows={3} placeholder="Ex : Fiat 500, Seat Leon..." value={autreMarqueModele} onChange={(e) => setAutreMarqueModele(e.target.value)} required />
                    </div>
                  ) : (
                    <div>
                      <label className={labelClass}>Modèle</label>
                      <select className={selectClass} value={modele} onChange={(e) => setModele(e.target.value)} required disabled={!marque}>
                        <option value="">Sélectionner un modèle</option>
                        {modelesDisponibles.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Mois</label>
                      <select className={selectClass} value={moisVal} onChange={(e) => setMoisVal(e.target.value)} required>
                        <option value="">Mois</option>
                        {mois.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Année</label>
                      <input type="number" className={inputClass} placeholder="Année" value={annee} onChange={(e) => setAnnee(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Puissance fiscale</label>
                      <input type="number" className={inputClass} value={puissanceFiscale} onChange={(e) => setPuissanceFiscale(e.target.value)} required />
                    </div>
                    <div>
                      <label className={labelClass}>Puissance DIN</label>
                      <input type="number" className={inputClass} value={puissanceDin} onChange={(e) => setPuissanceDin(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Carburant</label>
                    <select className={selectClass} value={carburant} onChange={(e) => setCarburant(e.target.value)} required>
                      <option value="">Sélectionner</option>
                      {carburants.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Boîte de vitesse</label>
                    <div className="flex gap-6">
                      {["Manuelle", "Automatique"].map((b) => (
                        <label key={b} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="boite" value={b} checked={boite === b} onChange={() => setBoite(b)}
                            className="w-4 h-4 accent-neon-purple" />
                          <span className="text-sm text-foreground">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <NeonButton onClick={() => setStep(2)} disabled={!step1Valid} className="w-full">
                      Étape suivante
                    </NeonButton>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-heading text-xl font-semibold mb-4">
                    <span className="text-neon-purple">Étape 2 :</span> Détails et état du véhicule
                  </h2>
                  <div>
                    <label className={labelClass}>Kilométrage *</label>
                    <input type="number" className={inputClass} value={km} onChange={(e) => setKm(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Motorisation <span className="text-muted-foreground">(facultatif)</span></label>
                    <input type="text" className={inputClass} placeholder="Exemple : 1.5 dCi, 1.4 HDi, 1.2 PureTech..." value={motorisation} onChange={(e) => setMotorisation(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Finition <span className="text-muted-foreground">(facultatif)</span></label>
                    <input type="text" className={inputClass} placeholder="Exemple : Intens, Sport, Business..." value={finition} onChange={(e) => setFinition(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Photos du véhicule <span className="text-muted-foreground">(facultatif)</span></label>
                    <input type="file" multiple accept="image/*" className={inputClass} onChange={(e) => setPhotosVehicule(Array.from(e.target.files || []))} />
                    {photosVehicule.length > 0 && <p className="text-xs text-muted-foreground mt-1">{photosVehicule.length} fichier(s) sélectionné(s)</p>}
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <label className={labelClass}>Historique / Suivi</label>
                    <div className="space-y-2">
                      {historiqueOptions.map((h) => (
                        <label key={h} className="flex items-start gap-2 cursor-pointer">
                          <input type="radio" name="historique" value={h} checked={historique === h} onChange={() => setHistorique(h)}
                            className="w-4 h-4 accent-neon-purple mt-0.5" />
                          <span className="text-sm text-foreground">{h}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {historique === historiqueOptions[0] && (
                    <div className="animate-fade-in">
                      <label className={labelClass}>Photos du carnet d'entretien et factures <span className="text-muted-foreground">(facultatif)</span></label>
                      <input type="file" multiple accept="image/*,.pdf" className={inputClass} onChange={(e) => setPhotosCarnet(Array.from(e.target.files || []))} />
                    </div>
                  )}

                  {historique === historiqueOptions[1] && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className={labelClass}>Décrivez les entretiens réalisés</label>
                        <textarea rows={3} className={inputClass} value={descEntretiens} onChange={(e) => setDescEntretiens(e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Factures disponibles <span className="text-muted-foreground">(facultatif)</span></label>
                        <input type="file" multiple accept="image/*,.pdf" className={inputClass} onChange={(e) => setFactures(Array.from(e.target.files || []))} />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 border border-border text-foreground rounded-full py-3 text-sm font-heading uppercase tracking-wider hover:bg-muted transition-colors">
                      Retour
                    </button>
                    <NeonButton onClick={() => setStep(3)} disabled={!step2Valid} className="flex-1">
                      Étape suivante
                    </NeonButton>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-heading text-xl font-semibold mb-4">
                    <span className="text-neon-purple">Étape 3 :</span> Coordonnées du propriétaire
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Nom *</label>
                      <input type="text" className={inputClass} value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div>
                      <label className={labelClass}>Prénom *</label>
                      <input type="text" className={inputClass} value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Adresse e-mail *</label>
                    <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {email && !emailValid && <p className="text-destructive text-xs mt-1">Format d'e-mail invalide</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Téléphone * <span className="text-muted-foreground text-xs">(ex: +33 6 12 34 56 78)</span></label>
                    <input type="tel" className={inputClass} placeholder="+33" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
                    {telephone && !phoneValid && <p className="text-destructive text-xs mt-1">Le numéro doit commencer par + suivi de l'indicatif pays</p>}
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer pt-2">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-4 h-4 accent-neon-purple mt-0.5" required />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      J'accepte que mes données soient traitées pour le traitement de ma demande de reprise, conformément à la <Link to="/politique-de-confidentialite" className="text-neon-cyan underline underline-offset-2 hover:text-neon-blue">politique de confidentialité</Link>.
                    </span>
                  </label>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 border border-border text-foreground rounded-full py-3 text-sm font-heading uppercase tracking-wider hover:bg-muted transition-colors">
                      Retour
                    </button>
                    <NeonButton type="submit" disabled={!step3Valid || formState.status === "loading"} className="flex-1">
                      {formState.status === "loading" ? "Envoi en cours..." : "Envoyer ma demande"}
                    </NeonButton>
                  </div>
                  {formState.message && (
                    <div className={`mt-4 p-4 rounded-lg text-sm text-center font-medium ${formState.status === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : formState.status === "error" ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-muted text-muted-foreground"}`}>
                      {formState.message}
                    </div>
                  )}
                </div>
              )}
            </form>
          </GlowCard>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Reprise;
