// ============================================================================
//  B MATIC — Informations légales centralisées (RGPD / mentions légales)
// ----------------------------------------------------------------------------
//  ⚠️  À COMPLÉTER PAR L'EXPLOITANT
//  Les champs entre crochets « [ ... ] » doivent être renseignés avec les
//  informations réelles de l'entreprise. Ils sont obligatoires pour que les
//  mentions légales et la politique de confidentialité soient valables.
//  Tout est regroupé ici : il suffit de modifier ce fichier, les pages se
//  mettent à jour automatiquement.
// ============================================================================

export const legalInfo = {
  // --- Identité de l'entreprise ------------------------------------------
  siteName: "B MATIC",
  // Dénomination sociale complète (ex. « B MATIC SRL »)
  companyName: "B MATIC",
  // Forme juridique (ex. SRL, SASU, entreprise individuelle, indépendant…)
  legalForm: "[forme juridique — ex. SRL / SASU / indépendant]",
  // Capital social, si société (sinon laisser vide "")
  capital: "",
  // Adresse complète du siège / de l'atelier
  address: "[adresse complète — n°, rue, code postal, ville, pays]",
  // Numéro d'entreprise : BCE (Belgique) ou SIREN/SIRET (France)
  registration: "[n° d'entreprise BCE / SIREN / SIRET]",
  // Numéro de TVA intracommunautaire (ex. BE0123.456.789 / FR12345678901)
  vat: "[n° de TVA intracommunautaire]",
  // Responsable de la publication du site (nom du gérant / dirigeant)
  publicationDirector: "[nom du responsable de la publication]",

  // --- Contact -----------------------------------------------------------
  email: "bmatic63s@gmail.com",
  phone: "+32 4 70 85 35 51",
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
    name: "[nom de l'hébergeur]",
    company: "[société de l'hébergeur]",
    address: "[adresse de l'hébergeur]",
    website: "[site web de l'hébergeur]",
  },

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
