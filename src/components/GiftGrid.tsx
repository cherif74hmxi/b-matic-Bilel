import { pareBriseCadeaux } from "@/data/parebrise";

// ============================================================================
//  GiftGrid — les cadeaux au choix, en tuiles identiques
// ----------------------------------------------------------------------------
//  Photos détourées (public/cadeaux/, fond transparent) posées sur un fond
//  uniforme, même zone d'image pour toutes : l'objet est centré et contenu.
//  Données : src/data/parebrise.ts → pareBriseCadeaux.
// ============================================================================

const GiftGrid = () => (
  <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" aria-label="Cadeaux au choix">
    {pareBriseCadeaux.map((c) => (
      <li key={c.nom} className="rounded-2xl bg-muted p-4 md:p-5 flex flex-col">
        {/* Zone d'image de taille fixe : l'objet est centré et contenu dedans. */}
        <div className="relative aspect-[4/3]">
          <img
            src={c.image.src}
            alt=""
            width={c.image.largeur}
            height={c.image.hauteur}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 m-auto max-w-[88%] max-h-full w-auto h-auto object-contain"
          />
        </div>
        <span className="mt-3 text-center text-sm font-semibold leading-snug">{c.nom}</span>
      </li>
    ))}
  </ul>
);

export default GiftGrid;
