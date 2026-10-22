/**
 * Fond du hero de l'accueil : photo de l'atelier + calques sombres pour la lisibilité.
 *
 * Images (public/) :
 *  - hero-garage-mobile.webp : 800 px, recadrée sur l'atelier et les voitures (téléphones)
 *  - hero-garage.webp        : 1920 px (tablettes et ordinateurs)
 *  - hero-garage.jpg         : 1920 px, secours pour les très vieux navigateurs
 */
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <picture>
      <source media="(max-width: 767px)" srcSet="/hero-garage-mobile.webp" type="image/webp" />
      <source srcSet="/hero-garage.webp" type="image/webp" />
      <img
        src="/hero-garage.jpg"
        alt=""
        width={1920}
        height={1072}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center md:object-[70%_center]"
      />
    </picture>

    {/* Assombrissement général (l'image est claire). */}
    <div className="absolute inset-0 bg-background/45" />
    {/* Plus dense à gauche, là où sont le titre et les boutons. */}
    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10 md:via-background/70" />
    {/* Plus dense en bas (raccord avec la section suivante). */}
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
    {/* Légère teinte néon B MATIC (violet / rose / bleu). */}
    <div className="absolute inset-0 opacity-20 mix-blend-color" style={{ background: "var(--gradient-neon)" }} />
  </div>
);

export default HeroBackground;
