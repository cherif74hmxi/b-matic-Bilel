import { assureurs, type Assureur } from "@/data/assurances";

// ============================================================================
//  InsurerMarquee — carrousel défilant des assureurs partenaires
// ----------------------------------------------------------------------------
//  La liste est dupliquée côte à côte : le défilement de -50 % (voir .insurer-
//  marquee__track dans src/index.css) donne une boucle sans couture. Un badge
//  texte est affiché par défaut ; si un `logo` est renseigné dans
//  src/data/assurances.ts, l'image le remplace automatiquement.
//  Sous prefers-reduced-motion : repli sur une liste statique centrée.
// ============================================================================

const AssureurBadge = ({ nom, logo }: Assureur) =>
  logo ? (
    <img
      src={logo}
      alt={nom}
      loading="lazy"
      className="h-8 w-auto object-contain shrink-0"
    />
  ) : (
    <span className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-input text-foreground whitespace-nowrap shrink-0">
      {nom}
    </span>
  );

/** Un groupe = une copie complète de la liste (avec espacement de fin). */
const AssureursGroup = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
  <div
    className={`flex items-center gap-2.5 pr-2.5${ariaHidden ? " insurer-marquee__dup" : ""}`}
    aria-hidden={ariaHidden || undefined}
  >
    {assureurs.map((a) => (
      <AssureurBadge key={a.nom} {...a} />
    ))}
  </div>
);

const InsurerMarquee = () => (
  <div className="insurer-marquee" role="list" aria-label="Assureurs partenaires">
    <div className="insurer-marquee__track">
      <AssureursGroup />
      <AssureursGroup ariaHidden />
    </div>
  </div>
);

export default InsurerMarquee;
