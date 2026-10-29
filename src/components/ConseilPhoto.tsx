import { CONSEIL_IMAGE_LARGEURS, CONSEIL_IMAGE_TAILLE, type ConseilImage } from "@/data/conseils";

// ============================================================================
//  ConseilPhoto — photo d'article en WebP responsive (srcset), dimensions
//  fixes (pas de saut de mise en page), chargement différé par défaut.
// ============================================================================

const ConseilPhoto = ({
  image,
  sizes,
  className = "",
  eager = false,
  decorative = false,
}: {
  image: ConseilImage;
  /** Largeur affichée, pour que le navigateur choisisse le bon fichier. */
  sizes: string;
  className?: string;
  /** Image principale visible dès l'arrivée (page article). */
  eager?: boolean;
  /** Vignette accompagnant un titre déjà lu : alt vide. */
  decorative?: boolean;
}) => (
  <img
    src={`${image.src}-800.webp`}
    srcSet={CONSEIL_IMAGE_LARGEURS.map((w) => `${image.src}-${w}.webp ${w}w`).join(", ")}
    sizes={sizes}
    alt={decorative ? "" : image.alt}
    width={CONSEIL_IMAGE_TAILLE.largeur}
    height={CONSEIL_IMAGE_TAILLE.hauteur}
    loading={eager ? "eager" : "lazy"}
    fetchPriority={eager ? "high" : undefined}
    decoding="async"
    className={`object-cover ${className}`}
  />
);

export default ConseilPhoto;
