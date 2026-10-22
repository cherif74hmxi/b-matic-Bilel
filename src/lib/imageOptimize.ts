// ============================================================================
//  Optimisation des photos AVANT envoi (dans le navigateur)
// ----------------------------------------------------------------------------
//  1. Décodage en appliquant l'orientation EXIF (photo de téléphone tournée).
//  2. Redimensionnement : 1920 px max sur le grand côté (photo d'annonce) et
//     480 px pour la miniature, par réductions successives de moitié pour
//     garder une image nette.
//  3. Encodage WebP qualité 85 (miniature 75) via WebAssembly (@jsquash/webp),
//     dans un Web Worker pour ne pas figer l'interface : même résultat sur tous
//     les navigateurs, y compris Safari iOS qui ne sait pas produire de WebP
//     avec canvas.toBlob(). L'encodeur n'est chargé qu'au premier envoi.
//  Les métadonnées EXIF (dont la position GPS) ne sont PAS conservées.
// ============================================================================

export const MAX_EDGE = 1920;
export const THUMB_EDGE = 480;
export const QUALITY = 85;
export const THUMB_QUALITY = 75;

export class UnsupportedImageError extends Error {}

/** Dimensions réduites pour tenir dans `max` px sur le grand côté (jamais agrandies). */
export function fitWithin(width: number, height: number, max: number) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

type Decoded = { source: CanvasImageSource; width: number; height: number; release: () => void };

async function decode(file: Blob): Promise<Decoded> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
  } catch {
    // Repli : <img> applique aussi l'orientation EXIF dans les navigateurs actuels.
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => undefined };
  } catch {
    throw new UnsupportedImageError("Format d'image non pris en charge.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** L'image peut-elle être lue par ce navigateur ? (HEIC sur Chrome/Android : non) */
export async function canDecodeImage(file: Blob): Promise<boolean> {
  if (file.type && !file.type.startsWith("image/")) return false;
  try {
    (await decode(file)).release();
    return true;
  } catch {
    return false;
  }
}

function canvasOf(width: number, height: number, readBack = false) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  // willReadFrequently seulement pour le canvas final (lu par getImageData) :
  // les étapes intermédiaires restent accélérées par le GPU.
  const ctx = canvas.getContext("2d", readBack ? { willReadFrequently: true } : undefined);
  if (!ctx) throw new Error("Canvas indisponible.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

/** Réduit par moitiés successives jusqu'à la taille cible ; renvoie le canvas final. */
function resize(source: CanvasImageSource, srcW: number, srcH: number, width: number, height: number) {
  let current = source;
  let w = srcW;
  let h = srcH;
  while (w / 2 >= width && h / 2 >= height) {
    w = Math.round(w / 2);
    h = Math.round(h / 2);
    const step = canvasOf(w, h);
    step.ctx.drawImage(current, 0, 0, w, h);
    current = step.canvas;
  }
  const out = canvasOf(width, height, true);
  out.ctx.drawImage(current, 0, 0, width, height);
  return out;
}

// ---------------------------------------------------------------------------
//  Encodage WebP dans un Web Worker (repli sur le fil principal si indisponible)
// ---------------------------------------------------------------------------

/** Le worker a échoué en cours d'encodage (les pixels lui avaient été transférés). */
class WorkerUnavailableError extends Error {}

let worker: Worker | null | undefined;
let nextJob = 0;
const jobs = new Map<number, { resolve: (b: ArrayBuffer) => void; reject: (e: Error) => void }>();

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  try {
    worker = new Worker(new URL("./webpEncode.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<{ id: number; buffer?: ArrayBuffer; error?: string }>) => {
      const job = jobs.get(e.data.id);
      jobs.delete(e.data.id);
      if (!job) return;
      if (e.data.buffer) job.resolve(e.data.buffer);
      else job.reject(new Error(e.data.error ?? "Encodage impossible."));
    };
    worker.onerror = () => {
      // Worker inutilisable : on bascule sur le fil principal pour la suite.
      jobs.forEach((job) => job.reject(new Error("worker")));
      jobs.clear();
      worker?.terminate();
      worker = null;
    };
  } catch {
    worker = null;
  }
  return worker;
}

async function encodeWebp(image: ImageData, quality: number): Promise<ArrayBuffer> {
  const w = getWorker();
  if (w) {
    try {
      return await new Promise<ArrayBuffer>((resolve, reject) => {
        const id = nextJob++;
        jobs.set(id, { resolve, reject });
        w.postMessage({ id, image, quality }, [image.data.buffer]);
      });
    } catch (error) {
      if ((error as Error).message !== "worker") throw error;
      // pixels transférés au worker en échec : l'appelant recommence sur le fil principal
      throw new WorkerUnavailableError();
    }
  }
  const { encode } = await import("@jsquash/webp");
  return encode(image, { quality });
}


export interface OptimizedImage {
  main: Blob;
  thumb: Blob;
  width: number;
  height: number;
}

async function optimizeOnce(file: Blob): Promise<OptimizedImage> {
  const decoded = await decode(file);
  try {
    const mainSize = fitWithin(decoded.width, decoded.height, MAX_EDGE);
    const thumbSize = fitWithin(decoded.width, decoded.height, THUMB_EDGE);
    const main = resize(decoded.source, decoded.width, decoded.height, mainSize.width, mainSize.height);
    // Miniature tirée de l'image déjà réduite (pas de l'original de plusieurs dizaines de Mpx).
    const thumb = resize(main.canvas, mainSize.width, mainSize.height, thumbSize.width, thumbSize.height);
    const mainPixels = main.ctx.getImageData(0, 0, mainSize.width, mainSize.height);
    const thumbPixels = thumb.ctx.getImageData(0, 0, thumbSize.width, thumbSize.height);
    // L'une après l'autre : un seul encodeur, mémoire maîtrisée sur téléphone.
    const mainBuffer = await encodeWebp(mainPixels, QUALITY);
    const thumbBuffer = await encodeWebp(thumbPixels, THUMB_QUALITY);
    return {
      main: new Blob([mainBuffer], { type: "image/webp" }),
      thumb: new Blob([thumbBuffer], { type: "image/webp" }),
      ...mainSize,
    };
  } finally {
    decoded.release();
  }
}

export async function optimizeImage(file: Blob): Promise<OptimizedImage> {
  if (file.type && !file.type.startsWith("image/")) throw new UnsupportedImageError("Ce fichier n'est pas une image.");
  try {
    return await optimizeOnce(file);
  } catch (error) {
    // Le worker a planté en cours de route : on recommence entièrement sur le fil principal.
    if (error instanceof WorkerUnavailableError) return optimizeOnce(file);
    throw error;
  }
}

// ---------------------------------------------------------------------------
//  Réduction en JPEG (scan de carte grise, photos jointes aux e-mails)
// ---------------------------------------------------------------------------

/**
 * Réduit une photo (grand côté ≤ `maxEdge`) et la réencode en JPEG : format lu
 * partout (Gemini, messageries) et bien plus léger qu'une photo de téléphone.
 * Lève UnsupportedImageError si le navigateur ne sait pas lire le fichier (HEIC…).
 */
export async function toJpeg(file: Blob, maxEdge: number, quality = 0.85): Promise<Blob> {
  const decoded = await decode(file);
  try {
    const size = fitWithin(decoded.width, decoded.height, maxEdge);
    const { canvas, ctx } = canvasOf(size.width, size.height);
    // Fond blanc : les PNG transparents ne deviennent pas noirs en JPEG.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size.width, size.height);
    const reduced = resize(decoded.source, decoded.width, decoded.height, size.width, size.height);
    ctx.drawImage(reduced.canvas, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) throw new UnsupportedImageError("Conversion de l'image impossible.");
    return blob;
  } finally {
    decoded.release();
  }
}
