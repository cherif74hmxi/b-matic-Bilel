// ============================================================================
//  B MATIC — Textes du bandeau cookies (composant CookieConsent)
// ----------------------------------------------------------------------------
//  Seuls les outils Google (Analytics, Ads) dépendent de ce choix. Rester
//  court : le bandeau est lu sur téléphone. « Refuser » doit rester aussi
//  simple que « Accepter ».
//
//  ⚠️  Les `id` sont utilisés par le code : ne pas les changer.
// ============================================================================

export const consentBandeau = {
  texte:
    "Avec votre accord, nous utilisons Google Analytics et Google Ads pour mesurer l'audience du site et l'efficacité de nos annonces.",
  enSavoirPlus: "En savoir plus",
  accepter: "Accepter",
  refuser: "Refuser",
  personnaliser: "Personnaliser",
  enregistrer: "Enregistrer mes choix",
  // Rappel affiché dans le détail : la mesure interne ne dépend pas du bandeau.
  interne: "Notre mesure d'audience interne, anonyme et sans cookie, reste active.",
};

export const consentCategories = [
  { id: "analytics", label: "Statistiques", detail: "Google Analytics : pages vues et parcours, pour améliorer le site." },
  { id: "marketing", label: "Marketing", detail: "Google Ads : mesurer les demandes venues de nos annonces." },
] as const;
