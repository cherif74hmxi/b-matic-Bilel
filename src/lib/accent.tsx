import type { ReactNode } from "react";

/**
 * Affiche en couleur de marque (violet B MATIC) la partie d'un titre écrite
 * entre crochets dans les fichiers src/data/*.
 * Ex. : "Un [cadeau au choix] pour votre pare-brise".
 */
export const accentuer = (texte: string): ReactNode =>
  texte.split(/\[([^\]]+)\]/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="text-primary">
        {part}
      </span>
    ) : (
      part
    ),
  );
