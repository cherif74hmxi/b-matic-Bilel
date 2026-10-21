// Encodage WebP (WebAssembly) hors du fil principal : l'interface reste fluide
// pendant l'optimisation des photos (plusieurs centaines de ms par photo sur téléphone).
import { encode } from "@jsquash/webp";

interface Job {
  id: number;
  image: ImageData;
  quality: number;
}

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<Job>) => void) | null;
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
};

scope.onmessage = async (e) => {
  const { id, image, quality } = e.data;
  try {
    const buffer = await encode(image, { quality });
    scope.postMessage({ id, buffer }, [buffer]);
  } catch (error) {
    scope.postMessage({ id, error: String(error) });
  }
};
