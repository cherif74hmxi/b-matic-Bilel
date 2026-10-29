import { assureurs, type Assureur } from "@/data/assurances";

// ============================================================================
//  InsurerLogos — grille des assureurs, tuiles strictement identiques
// ----------------------------------------------------------------------------
//  Fond blanc uniforme (les logos sont prévus pour un fond clair), même cadre
//  pour tous. Équilibrage optique : la largeur suit la racine du ratio du logo,
//  pour qu'un logo carré (AXA) et un logo très large (Baloise) paraissent de
//  même taille. Sans logo : le nom s'affiche en texte dans la même tuile.
//  Données : src/data/assurances.ts.
// ============================================================================

/** Largeur du logo dans la tuile (%), selon son ratio largeur / hauteur. */
const largeurOptique = ({ largeur, hauteur }: NonNullable<Assureur["logo"]>) =>
  Math.min(82, 32 * Math.sqrt(largeur / hauteur));

const InsurerLogos = () => (
  <ul className="flex flex-wrap justify-center gap-3" aria-label="Assureurs partenaires">
    {assureurs.map((a) => (
      <li
        key={a.nom}
        className="basis-[calc((100%-1.5rem)/3)] sm:basis-[calc((100%-3rem)/5)] relative aspect-[3/2] rounded-xl border border-border bg-white grid place-items-center"
      >
        {a.logo ? (
          <img
            src={a.logo.src}
            alt={a.nom}
            width={a.logo.largeur}
            height={a.logo.hauteur}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 m-auto h-auto max-h-[60%] object-contain"
            style={{ width: `${largeurOptique(a.logo)}%` }}
          />
        ) : (
          <span className="text-sm font-semibold text-neutral-800 text-center px-2">{a.nom}</span>
        )}
      </li>
    ))}
  </ul>
);

export default InsurerLogos;
