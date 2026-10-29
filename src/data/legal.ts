// ============================================================================
//  B MATIC — Informations légales centralisées (RGPD / mentions légales)
// ----------------------------------------------------------------------------
//  Tout est regroupé ici : il suffit de modifier ce fichier, les pages se
//  mettent à jour automatiquement. Les champs entre crochets « [ ... ] »
//  restent à compléter (hébergeur au déploiement, région Supabase).
// ============================================================================

export const legalInfo = {
  // --- Identité de l'entreprise ------------------------------------------
  siteName: "B MATIC",
  // Dénomination sociale complète
  companyName: "BM Matic SRL",
  // Forme juridique
  legalForm: "SRL (société à responsabilité limitée)",
  // Capital social, si société (sinon laisser vide "")
  capital: "",
  // Adresse de l'ATELIER / contact (affichée partout : contact, pied de page, SEO local)
  address: "Avenue de l'Énergie 25 HALL D4, 4432 Ans, Belgique",
  // Adresse découpée pour les données structurées (SEO local)
  addressParts: {
    street: "Avenue de l'Énergie 25 HALL D4",
    postalCode: "4432",
    city: "Ans",
    region: "Liège",
    country: "BE",
  },
  // Adresse cherchée sur Google Maps (carte + bouton « Itinéraire »).
  mapsQuery: "Avenue de l'Énergie 25, 4432 Ans, Belgique",
  // SIÈGE SOCIAL (mentions légales uniquement)
  registeredOffice: "Valerius De Saedeleerstraat 93, 9300 Aalst, Belgique",
  // Numéro d'entreprise (BCE)
  registration: "0649.498.637",
  // Numéro de TVA
  vat: "BE 0649.498.637",
  // Responsable de la publication du site
  publicationDirector: "Jamal et Rachid Cherfaoui (gérants)",

  // --- Contact -----------------------------------------------------------
  email: "bmatic63s@gmail.com",
  phone: "+32 470 85 35 51",
  phoneHref: "tel:+32470853551",
  // --- WhatsApp (numéro belge confirmé) ----------------------------------
  //  Source unique pour tout le site (page Contact, barre d'action mobile…).
  //  `whatsapp`        : chiffres au format international, sans « + » ni espaces
  //                      (utilisé pour construire le lien wa.me).
  //  `whatsappDisplay` : affichage lisible pour l'humain.
  //  `whatsappHref`    : lien wa.me prêt à l'emploi.
  whatsapp: "32470853551",
  whatsappDisplay: "+32 470 85 35 51",
  whatsappHref: "https://wa.me/32470853551",
  whatsappConfirmed: true,

  // --- Pays principal d'exploitation -------------------------------------
  // "BE" → autorité : APD / GBA  |  "FR" → autorité : CNIL
  country: "BE" as "BE" | "FR",

  // --- Hébergeur du site -------------------------------------------------
  host: {
    name: "Vercel",
    company: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },

  // --- Base de données (Supabase) ----------------------------------------
  // Région : Supabase > Project Settings > General > « Region »
  // (ex. « Union européenne (Francfort, Allemagne) »).
  database: {
    name: "Supabase",
    company: "Supabase, Inc.",
    region: "[région du projet Supabase]",
    privacyUrl: "https://supabase.com/privacy",
  },

  // Assistant IA (Edge Function « generate-copy ») : aide à la rédaction des
  // actualités dans l'admin, et lecture facultative de la carte grise dans le
  // formulaire de rendez-vous (photo non conservée).
  aiAssistant: {
    name: "Gemini",
    company: "Google LLC",
    termsUrl: "https://ai.google.dev/gemini-api/terms",
  },

  // Durée de conservation des demandes reçues via les formulaires (en années).
  // Une tâche planifiée les supprime automatiquement passé ce délai
  // (supabase/migrations/20261021000002_purge_leads.sql).
  leadsRetentionYears: 3,

  // Documents ajoutés APRÈS une réservation (carte grise, attestation
  // d'assurance), facultatifs : supprimés automatiquement passé ce délai
  // (supabase/functions/purge-documents, appelée chaque nuit).
  documentsRetentionDays: 90,

  // --- Délégué / contact RGPD -------------------------------------------
  // Adresse e-mail dédiée à l'exercice des droits (peut être l'e-mail général)
  dpoEmail: "bmatic63s@gmail.com",

  // --- Date de dernière mise à jour des textes légaux --------------------
  lastUpdated: "octobre 2026",
};

// Autorité de contrôle compétente selon le pays, pour la réclamation RGPD.
export const supervisoryAuthority =
  legalInfo.country === "FR"
    ? {
        name: "la CNIL (Commission Nationale de l'Informatique et des Libertés)",
        website: "https://www.cnil.fr",
      }
    : {
        name: "l'Autorité de protection des données (APD / GBA)",
        website: "https://www.autoriteprotectiondonnees.be",
      };
