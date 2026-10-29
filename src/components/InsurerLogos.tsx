import { assureurs, type Assureur } from "@/data/assurances";

// ============================================================================
//  InsurerLogos — bandeau défilant des assureurs, tuiles strictement identiques
// ----------------------------------------------------------------------------
//  Défilement continu (animation CSS « marquee », en pause au survol). La piste
//  contient deux fois la liste pour boucler sans saut ; la copie est masquée
//  aux lecteurs d'écran. Si l'appareil demande moins d'animations : pas de
//  défilement, les logos s'affichent en grille centrée.
//  Toutes les tuiles ont la même taille et le même fond blanc. Équilibrage
//  optique : la largeur suit la racine du ratio du logo, pour qu'un logo carré
//  (AXA) et un logo très large (Baloise) paraissent de même taille.
//  Données : src/data/assurances.ts (logos dans public/assureurs/).
// ============================================================================

/** Largeur du logo dans la tuile (%), selon son ratio largeur / hauteur. */
const largeurOptique = ({ largeur, hauteur }: NonNullable<Assureur["logo"]>) =>
  Math.min(82, 32 * Math.sqrt(largeur / hauteur));

const Tuiles = ({ copie = false }: { copie?: boolean }) => (
  <ul
    className={`flex shrink-0 gap-3 pr-3 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0 ${copie ? "motion-reduce:hidden" : ""}`}
    aria-hidden={copie || undefined}
    aria-label={copie ? undefined : "Assureurs partenaires"}
  >
    {assureurs.map((a) => (
      <li
        key={a.nom}
        className="relative shrink-0 w-36 h-24 md:w-44 md:h-28 rounded-xl border border-border bg-white grid place-items-center"
      >
        {a.logo ? (
          <img
            src={a.logo.src}
            alt={copie ? "" : a.nom}
            width={a.logo.largeur}
            height={a.logo.hauteur}
            // Pas de chargement différé : dans le bandeau masqué, le navigateur
            // n'anticipe pas les tuiles hors champ (tuile vide au défilement).
            // Les 9 logos pèsent ~90 Ko, téléchargés en priorité basse.
            fetchPriority="low"
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

const InsurerLogos = () => (
  <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] motion-reduce:[mask-image:none]">
    <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:block motion-reduce:w-auto motion-reduce:animate-none">
      <Tuiles />
      <Tuiles copie />
    </div>
  </div>
);

export default InsurerLogos;
