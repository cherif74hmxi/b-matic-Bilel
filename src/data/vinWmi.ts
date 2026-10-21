// ============================================================================
//  Préfixes constructeur des VIN (WMI = 3 premiers caractères) → marque
// ----------------------------------------------------------------------------
//  Sert à pré-remplir la marque dans l'admin quand la base NHTSA ne la connaît
//  pas ou ne répond pas. Liste limitée aux marques courantes en Belgique.
//  Pour en ajouter une : « PRÉFIXE: "Marque" » (orthographe de src/data/vehicules.ts
//  si la marque y figure). En cas de doute sur un préfixe, ne pas l'ajouter :
//  une marque fausse est pire qu'un champ vide.
// ============================================================================

export const WMI_MAKES: Record<string, string> = {
  // Groupe Volkswagen
  WVW: "Volkswagen", WV1: "Volkswagen", WV2: "Volkswagen", WVG: "Volkswagen",
  WAU: "Audi", WUA: "Audi", TRU: "Audi",
  TMB: "Skoda", VSS: "Seat", WP0: "Porsche", WP1: "Porsche",
  // Allemandes
  WBA: "BMW", WBS: "BMW", WBY: "BMW", WMW: "MINI",
  WDB: "Mercedes-Benz", WDD: "Mercedes-Benz", WDC: "Mercedes-Benz", W1K: "Mercedes-Benz", W1N: "Mercedes-Benz", W1V: "Mercedes-Benz",
  W0L: "Opel", W0V: "Opel", WF0: "Ford",
  // Françaises
  VF1: "Renault", UU1: "Dacia", VF3: "Peugeot", VR3: "Peugeot", VF7: "Citroën", VR7: "Citroën",
  // Autres européennes
  YV1: "Volvo", SAL: "Land Rover", SAJ: "Jaguar", ZFA: "Fiat", ZAR: "Alfa Romeo",
  // Asiatiques (dont usines européennes)
  VNK: "Toyota", SB1: "Toyota", JTD: "Toyota", JTN: "Toyota", JTM: "Toyota",
  SJN: "Nissan", VSK: "Nissan", JN1: "Nissan",
  KNA: "Kia", KNE: "Kia", U5Y: "Kia", KMH: "Hyundai", TMA: "Hyundai", NLH: "Hyundai",
  LSJ: "MG",
  // Tesla (États-Unis, Chine, Allemagne)
  "5YJ": "Tesla", "7SA": "Tesla", LRW: "Tesla", XP7: "Tesla",
};
