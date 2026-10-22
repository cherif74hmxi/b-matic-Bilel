import { useEffect, useRef, useState } from "react";
import { Camera, ImageUp, Loader2, MoveDiagonal, ShieldCheck, AlertTriangle } from "lucide-react";
import { scanRegistration, ScanError, type RegistrationScan } from "@/lib/registrationScan";
import { repriseScan } from "@/data/reprise";

// ============================================================================
//  RegistrationScanner — photo de la carte grise → champs pré-remplis
// ----------------------------------------------------------------------------
//  Réutilisé par le formulaire de reprise (public) et l'admin (ajout véhicule).
//  Cadre « scanner » avec 4 coins qui respirent + indice « reculez » : simple
//  guide visuel en CSS (transform uniquement, figé sous reduced-motion).
//  La photo n'est affichée qu'en local pendant la lecture, puis oubliée.
// ============================================================================

/** Esquisse d'un document (affichée tant qu'aucune photo n'est choisie). */
const DocSketch = () => (
  <svg viewBox="0 0 150 100" className="absolute inset-0 m-auto w-3/5 h-3/5 text-muted-foreground/50" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="142" height="92" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M16 20h50M16 32h80M16 44h66M16 56h74M16 68h40M16 80h58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <rect x="104" y="18" width="30" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Corner = ({ className }: { className: string }) => (
  <span className={`absolute w-7 h-7 border-neon-cyan drop-shadow-[0_0_6px_hsl(var(--neon-cyan))] ${className}`} aria-hidden="true" />
);

const RegistrationScanner = ({
  onResult,
  onError,
}: {
  onResult: (scan: RegistrationScan) => void;
  /** Lecture impossible : le parent bascule en saisie manuelle (ne jamais bloquer). */
  onError?: (message: string) => void;
}) => {
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reading = preview !== null;
  // Scanner fermé pendant la lecture (« Remplir à la main », panneau refermé) :
  // la réponse arrivée ensuite est ignorée, elle n'écrase pas la saisie.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handle = async (input: HTMLInputElement) => {
    const file = input.files?.[0];
    input.value = ""; // la même photo peut être choisie à nouveau
    if (!file || reading) return;
    const url = URL.createObjectURL(file);
    setError(null);
    setPreview(url);
    try {
      const scan = await scanRegistration(file);
      if (mounted.current) onResult(scan);
    } catch (e) {
      if (!mounted.current) return;
      const message = e instanceof ScanError ? e.message : "Lecture de la carte grise impossible. Remplissez à la main.";
      setError(message);
      onError?.(message);
    } finally {
      URL.revokeObjectURL(url);
      if (mounted.current) setPreview(null);
    }
  };

  return (
    <div>
      <p className="font-semibold text-sm text-center mb-3">{repriseScan.consigne}</p>

      <div className="relative aspect-[3/2] w-full max-w-md mx-auto rounded-2xl bg-background/60 border border-border overflow-hidden">
        {preview ? <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <DocSketch />}
        <div className="scan-corners absolute inset-3">
          <Corner className="top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-lg" />
          <Corner className="top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-lg" />
          <Corner className="bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-lg" />
          <Corner className="bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-lg" />
        </div>
        {reading && (
          <>
            <div className="scan-line" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-3 flex justify-center" role="status">
              <span className="inline-flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" aria-hidden="true" /> {repriseScan.lecture}
              </span>
            </div>
          </>
        )}
      </div>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
        <MoveDiagonal className="scan-hint w-3.5 h-3.5 text-neon-cyan shrink-0" aria-hidden="true" /> {repriseScan.indice}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-w-md mx-auto">
        <button type="button" onClick={() => camera.current?.click()} disabled={reading} className="btn-main min-h-[48px]">
          <Camera className="w-4 h-4" aria-hidden="true" /> {repriseScan.boutonPhoto}
        </button>
        <button type="button" onClick={() => gallery.current?.click()} disabled={reading} className="btn-ghost min-h-[48px] disabled:opacity-45">
          <ImageUp className="w-4 h-4" aria-hidden="true" /> {repriseScan.boutonGalerie}
        </button>
      </div>
      {/* capture : ouvre directement l'appareil photo arrière sur téléphone. */}
      <input ref={camera} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => void handle(e.currentTarget)} />
      <input ref={gallery} type="file" accept="image/*" className="hidden" onChange={(e) => void handle(e.currentTarget)} />

      {error && (
        <p role="alert" className="flex gap-2 items-start text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-4 max-w-md mx-auto">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" /> {error}
        </p>
      )}
      <p className="flex gap-2 items-start text-xs text-muted-foreground mt-4 max-w-md mx-auto">
        <ShieldCheck className="w-4 h-4 shrink-0 text-neon-cyan" aria-hidden="true" /> {repriseScan.confidentialite}
      </p>
    </div>
  );
};

export default RegistrationScanner;
