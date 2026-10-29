// ============================================================================
//  B MATIC — Textes de la page d'accueil (centre pare-brise)
// ----------------------------------------------------------------------------
//  Modifier ici les textes de l'accueil : la page ne fait que les afficher.
//  · L'offre (accroche, cadeaux, FAQ, mention légale) vient de
//    src/data/parebrise.ts : une seule source pour l'accueil et /pare-brise.
//  · Les horaires viennent de src/data/horaires.ts.
//  Les icônes sont des noms d'icônes lucide-react (voir ICONS dans Index.tsx).
// ============================================================================
import { horaires } from "@/data/horaires";
import { RDV_PATH } from "@/data/rdv";

export const accueilHero = {
  surtitre: "Pare-brise · Liège et 70 km autour",
  ctaPrincipal: { label: "Demander un devis / Prendre RDV", to: RDV_PATH },
  /** Petite ligne de réassurance sous les boutons. */
  reassurance: "Devis gratuit · Réponse rapide · Sans engagement",
};

/** Les 4 arguments clés, juste sous le hero. */
export const accueilArguments = [
  { icon: "HandCoins", titre: "0 € à avancer", texte: "Réglé directement avec votre assurance, franchise offerte." },
  { icon: "ShieldCheck", titre: "Toutes assurances", texte: "On s'occupe des démarches avec votre assureur." },
  { icon: "Clock", titre: "Ouvert 7j/7", texte: `${horaires.centre.detail}.` },
  { icon: "Home", titre: "À domicile", texte: "Au centre d'Ans, chez vous ou au travail." },
] as const;

export const accueilCadeaux = {
  titre: "Un cadeau au choix pour votre pare-brise",
  texte: "Franchise offerte, et en plus jusqu'à 300 € ou l'un de ces cadeaux pour tout pare-brise remplacé.",
};

export const accueilAssureurs = {
  titre: "Votre assureur, c'est nous qui l'appelons",
  texte: "Bris de vitre ou omnium : on vérifie votre couverture et on gère le dossier. Vous n'avez aucun document à envoyer.",
};

export const accueilFaq = {
  titre: "Questions fréquentes",
  lien: "Tout savoir sur l'offre pare-brise",
};

export const accueilCtaFinal = {
  titre: "Un impact, une fissure, une vitre cassée ?",
  texte: "Demandez votre devis en 2 minutes : on s'occupe de l'assurance, vous choisissez votre cadeau.",
};
