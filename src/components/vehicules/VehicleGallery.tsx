import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Car, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { photoSrcSet, photoUrl, thumbPath, type PublicPhoto } from "@/lib/publicContent";

// ============================================================================
//  Galerie photo d'une annonce (façon autohero)
//  · balayage au doigt (scroll-snap natif, aucun script de glisser) ;
//  · flèches + compteur, vignettes cliquables ;
//  · plein écran (photo entière, fond noir), Échap pour fermer.
// ============================================================================

const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Bande de photos défilante ; `index` suit la photo visible. */
const Track = ({
  photos,
  title,
  index,
  onIndex,
  fit,
  trackRef,
}: {
  photos: PublicPhoto[];
  title: string;
  index: number;
  onIndex: (i: number) => void;
  fit: "cover" | "contain";
  trackRef: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={trackRef}
    onScroll={(e) => {
      const el = e.currentTarget;
      const i = Math.round(el.scrollLeft / el.clientWidth);
      if (i !== index) onIndex(i);
    }}
    className={`flex h-full overflow-x-auto snap-x snap-mandatory overscroll-x-contain ${hideScrollbar}`}
  >
    {photos.map((p, i) => (
      <div key={p.storage_path} className="snap-center shrink-0 w-full h-full">
        <img
          src={photoUrl(p.storage_path)}
          srcSet={fit === "cover" ? photoSrcSet(p.storage_path) : undefined}
          sizes={fit === "cover" ? "(min-width: 1024px) 60vw, 100vw" : undefined}
          alt={p.alt ?? `${title} — photo ${i + 1}`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        />
      </div>
    ))}
  </div>
);

const NavButton = ({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === "prev" ? "Photo précédente" : "Photo suivante"}
    className={`absolute top-1/2 -translate-y-1/2 ${dir === "prev" ? "left-2" : "right-2"} w-11 h-11 rounded-full bg-background/75 backdrop-blur grid place-items-center disabled:opacity-0 transition-opacity`}
  >
    {dir === "prev" ? <ChevronLeft className="w-5 h-5" aria-hidden="true" /> : <ChevronRight className="w-5 h-5" aria-hidden="true" />}
  </button>
);

const VehicleGallery = ({ photos, title, sold }: { photos: PublicPhoto[]; title: string; sold?: boolean }) => {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const fullTrack = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number, el: HTMLDivElement | null, smooth = true) => {
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Plein écran : s'ouvre sur la photo en cours ; à la fermeture, la galerie suit.
  useEffect(() => {
    if (full) requestAnimationFrame(() => goTo(index, fullTrack.current, false));
    else goTo(index, track.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seulement à l'ouverture / fermeture
  }, [full]);

  if (photos.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-muted grid place-items-center">
        <Car className="w-16 h-16 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  const last = photos.length - 1;
  const counter = (
    <span className="rounded-full bg-background/75 backdrop-blur px-2.5 py-1 text-xs font-medium tabular-nums" aria-live="polite">
      {index + 1} / {photos.length}
    </span>
  );

  return (
    <div className="min-w-0">
      <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted ${sold ? "grayscale-[50%]" : ""}`}>
        <Track photos={photos} title={title} index={index} onIndex={setIndex} fit="cover" trackRef={track} />
        {photos.length > 1 && (
          <>
            <NavButton dir="prev" onClick={() => goTo(index - 1, track.current)} disabled={index === 0} />
            <NavButton dir="next" onClick={() => goTo(index + 1, track.current)} disabled={index === last} />
          </>
        )}
        <div className="absolute bottom-2 left-2">{counter}</div>
        <button
          type="button"
          onClick={() => setFull(true)}
          aria-label="Voir les photos en plein écran"
          className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-background/75 backdrop-blur grid place-items-center"
        >
          <Expand className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {photos.length > 1 && (
        <div className={`flex gap-2 mt-2 overflow-x-auto pb-1 ${hideScrollbar}`}>
          {photos.map((p, i) => (
            <button
              key={p.storage_path}
              type="button"
              onClick={() => goTo(i, track.current)}
              aria-label={`Photo ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === index ? "border-neon-cyan" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={photoUrl(thumbPath(p.storage_path))} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <DialogPrimitive.Root open={full} onOpenChange={setFull}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[110] bg-black" />
          <DialogPrimitive.Content className="fixed inset-0 z-[110] flex flex-col bg-black text-white focus:outline-none" aria-describedby={undefined}>
            <DialogPrimitive.Title className="sr-only">{title} — photos</DialogPrimitive.Title>
            <div className="flex items-center justify-between p-2">
              {counter}
              <DialogPrimitive.Close className="w-11 h-11 rounded-full bg-white/10 grid place-items-center" aria-label="Fermer">
                <X className="w-5 h-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
            <div className="relative flex-1 min-h-0">
              <Track photos={photos} title={title} index={index} onIndex={setIndex} fit="contain" trackRef={fullTrack} />
              {photos.length > 1 && (
                <>
                  <NavButton dir="prev" onClick={() => goTo(index - 1, fullTrack.current)} disabled={index === 0} />
                  <NavButton dir="next" onClick={() => goTo(index + 1, fullTrack.current)} disabled={index === last} />
                </>
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
};

export default VehicleGallery;
