import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { pareBriseCadeaux } from "@/data/parebrise";

// ============================================================================
//  GiftCarousel — les cadeaux au choix, en carrousel horizontal
// ----------------------------------------------------------------------------
//  Mobile d'abord : on glisse au doigt, la carte suivante dépasse pour inviter
//  à faire défiler. Défilement automatique toutes les 3,5 s, en boucle :
//  · en pause au survol / au focus clavier, arrêté dès que le visiteur
//    manipule le carrousel ou clique sur Pause ;
//  · jamais automatique si l'appareil demande moins d'animations.
//  Tuiles identiques : même zone d'image, photo centrée et contenue.
//  Données : src/data/parebrise.ts → pareBriseCadeaux (photos dans public/cadeaux/).
// ============================================================================

const INTERVALLE_MS = 3500;

const reduitAnimations = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const navButton =
  "w-11 h-11 rounded-full border border-primary/40 bg-background text-primary grid place-items-center transition-colors hover:bg-primary-soft hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const GiftCarousel = () => {
  const [viewport, api] = useEmblaCarousel({ loop: true, align: "start" });
  const [lecture, setLecture] = useState(() => !reduitAnimations());
  const [survol, setSurvol] = useState(false);

  // Défilement automatique.
  useEffect(() => {
    if (!api || !lecture || survol) return;
    const id = window.setInterval(() => api.scrollNext(), INTERVALLE_MS);
    return () => window.clearInterval(id);
  }, [api, lecture, survol]);

  // Le visiteur prend la main (glisser) : on n'avance plus tout seul.
  useEffect(() => {
    if (!api) return;
    const stop = () => setLecture(false);
    api.on("pointerDown", stop);
    return () => {
      api.off("pointerDown", stop);
    };
  }, [api]);

  const precedent = useCallback(() => {
    setLecture(false);
    api?.scrollPrev();
  }, [api]);
  const suivant = useCallback(() => {
    setLecture(false);
    api?.scrollNext();
  }, [api]);

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label="Cadeaux au choix"
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
      onFocusCapture={() => setSurvol(true)}
      onBlurCapture={() => setSurvol(false)}
    >
      <div ref={viewport} className="overflow-hidden">
        <ul className="flex -ml-3 md:-ml-4 touch-pan-y">
          {pareBriseCadeaux.map((c, i) => (
            <li
              key={c.nom}
              className="min-w-0 shrink-0 grow-0 basis-[72%] sm:basis-[42%] md:basis-[31%] lg:basis-1/4 pl-3 md:pl-4"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${pareBriseCadeaux.length} : ${c.nom}`}
            >
              <div className="h-full rounded-2xl bg-muted p-4 md:p-5 flex flex-col">
                {/* Zone d'image de taille fixe : l'objet est centré et contenu dedans. */}
                <div className="relative aspect-[4/3]">
                  <img
                    src={c.image.src}
                    alt=""
                    width={c.image.largeur}
                    height={c.image.hauteur}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 m-auto max-w-[88%] max-h-full w-auto h-auto object-contain select-none"
                  />
                </div>
                <span className="mt-3 text-center text-sm font-semibold leading-snug">{c.nom}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center gap-3 mt-5">
        <button type="button" onClick={precedent} className={navButton} aria-label="Cadeau précédent">
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setLecture((l) => !l)}
          className={navButton}
          aria-label={lecture ? "Mettre le défilement en pause" : "Lancer le défilement"}
        >
          {lecture ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
        </button>
        <button type="button" onClick={suivant} className={navButton} aria-label="Cadeau suivant">
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default GiftCarousel;
